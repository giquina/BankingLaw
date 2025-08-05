#!/usr/bin/env node

/**
 * JuriBank Performance Test Suite
 * Tests website performance against banking industry standards
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Performance targets for JuriBank
const PERFORMANCE_TARGETS = {
    // Core Web Vitals
    LCP: 2500, // Largest Contentful Paint < 2.5s
    FID: 100,  // First Input Delay < 100ms
    CLS: 0.1,  // Cumulative Layout Shift < 0.1
    
    // Additional metrics
    FCP: 2000, // First Contentful Paint < 2s
    TTI: 3500, // Time to Interactive < 3.5s
    TBT: 300,  // Total Blocking Time < 300ms
    
    // Resource budgets
    totalSize: 2000000, // 2MB total
    jsSize: 500000,     // 500KB JS
    cssSize: 200000,    // 200KB CSS
    imageSize: 1000000, // 1MB images
    
    // Lighthouse scores
    performance: 90,
    accessibility: 95,
    bestPractices: 90,
    seo: 90
};

async function runPerformanceTest(url = 'http://localhost:8000') {
    console.log('🚀 Starting JuriBank Performance Test Suite...\n');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--allow-running-insecure-content'
        ]
    });
    
    try {
        const page = await browser.newPage();
        
        // Set viewport to simulate mobile-first
        await page.setViewport({ width: 375, height: 667 });
        
        // Track network requests
        const requests = [];
        page.on('request', request => {
            requests.push({
                url: request.url(),
                method: request.method(),
                resourceType: request.resourceType()
            });
        });
        
        // Track responses for size analysis
        const responses = [];
        page.on('response', response => {
            responses.push({
                url: response.url(),
                status: response.status(),
                headers: response.headers(),
                size: parseInt(response.headers()['content-length'] || 0)
            });
        });
        
        console.log('📱 Testing mobile performance...');
        
        // Navigate to page with performance metrics
        const navigationStart = Date.now();
        await page.goto(url, { waitUntil: 'networkidle2' });
        const navigationEnd = Date.now();
        
        // Get Core Web Vitals
        const metrics = await page.evaluate(() => {
            return new Promise((resolve) => {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const webVitals = {};
                    
                    entries.forEach((entry) => {
                        if (entry.entryType === 'largest-contentful-paint') {
                            webVitals.LCP = entry.startTime;
                        }
                        if (entry.entryType === 'first-input') {
                            webVitals.FID = entry.processingStart - entry.startTime;
                        }
                        if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
                            webVitals.CLS = (webVitals.CLS || 0) + entry.value;
                        }
                    });
                    
                    // Get FCP
                    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
                    if (fcpEntry) webVitals.FCP = fcpEntry.startTime;
                    
                    resolve(webVitals);
                });
                
                observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint'] });
                
                // Fallback timeout
                setTimeout(() => resolve({}), 5000);
            });
        });
        
        // Resource analysis
        const resourceSizes = {
            total: 0,
            js: 0,
            css: 0,
            images: 0,
            fonts: 0
        };
        
        responses.forEach(response => {
            const size = response.size;
            resourceSizes.total += size;
            
            if (response.url.includes('.js')) resourceSizes.js += size;
            else if (response.url.includes('.css')) resourceSizes.css += size;
            else if (response.url.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) resourceSizes.images += size;
            else if (response.url.match(/\.(woff|woff2|ttf|eot)$/i)) resourceSizes.fonts += size;
        });
        
        // Test desktop performance
        console.log('💻 Testing desktop performance...');
        await page.setViewport({ width: 1920, height: 1080 });
        await page.reload({ waitUntil: 'networkidle2' });
        
        const desktopMetrics = await page.evaluate(() => {
            const paintEntries = performance.getEntriesByType('paint');
            const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
            const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
            const lcp = lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : 0;
            
            return {
                FCP: fcpEntry ? fcpEntry.startTime : 0,
                LCP: lcp,
                loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
            };
        });
        
        // Generate report
        const report = {
            timestamp: new Date().toISOString(),
            url: url,
            mobile: {
                metrics: metrics,
                loadTime: navigationEnd - navigationStart
            },
            desktop: {
                metrics: desktopMetrics
            },
            resources: {
                total: requests.length,
                sizes: resourceSizes
            },
            analysis: {
                passedTests: 0,
                totalTests: 0,
                issues: []
            }
        };
        
        // Performance analysis
        console.log('\n📊 Performance Analysis:');
        console.log('========================');
        
        // Core Web Vitals analysis
        if (metrics.LCP) {
            report.analysis.totalTests++;
            if (metrics.LCP <= PERFORMANCE_TARGETS.LCP) {
                console.log(`✅ LCP: ${Math.round(metrics.LCP)}ms (target: ${PERFORMANCE_TARGETS.LCP}ms)`);
                report.analysis.passedTests++;
            } else {
                console.log(`❌ LCP: ${Math.round(metrics.LCP)}ms (target: ${PERFORMANCE_TARGETS.LCP}ms)`);
                report.analysis.issues.push(`LCP too slow: ${Math.round(metrics.LCP)}ms`);
            }
        }
        
        if (metrics.FCP) {
            report.analysis.totalTests++;
            if (metrics.FCP <= PERFORMANCE_TARGETS.FCP) {
                console.log(`✅ FCP: ${Math.round(metrics.FCP)}ms (target: ${PERFORMANCE_TARGETS.FCP}ms)`);
                report.analysis.passedTests++;
            } else {
                console.log(`❌ FCP: ${Math.round(metrics.FCP)}ms (target: ${PERFORMANCE_TARGETS.FCP}ms)`);
                report.analysis.issues.push(`FCP too slow: ${Math.round(metrics.FCP)}ms`);
            }
        }
        
        if (metrics.CLS !== undefined) {
            report.analysis.totalTests++;
            if (metrics.CLS <= PERFORMANCE_TARGETS.CLS) {
                console.log(`✅ CLS: ${metrics.CLS.toFixed(3)} (target: ${PERFORMANCE_TARGETS.CLS})`);
                report.analysis.passedTests++;
            } else {
                console.log(`❌ CLS: ${metrics.CLS.toFixed(3)} (target: ${PERFORMANCE_TARGETS.CLS})`);
                report.analysis.issues.push(`CLS too high: ${metrics.CLS.toFixed(3)}`);
            }
        }
        
        // Resource budget analysis
        console.log('\n📦 Resource Analysis:');
        console.log('=====================');
        
        report.analysis.totalTests++;
        if (resourceSizes.total <= PERFORMANCE_TARGETS.totalSize) {
            console.log(`✅ Total size: ${(resourceSizes.total / 1024 / 1024).toFixed(2)}MB (budget: ${(PERFORMANCE_TARGETS.totalSize / 1024 / 1024).toFixed(2)}MB)`);
            report.analysis.passedTests++;
        } else {
            console.log(`❌ Total size: ${(resourceSizes.total / 1024 / 1024).toFixed(2)}MB (budget: ${(PERFORMANCE_TARGETS.totalSize / 1024 / 1024).toFixed(2)}MB)`);
            report.analysis.issues.push(`Total size exceeds budget: ${(resourceSizes.total / 1024 / 1024).toFixed(2)}MB`);
        }
        
        report.analysis.totalTests++;
        if (resourceSizes.js <= PERFORMANCE_TARGETS.jsSize) {
            console.log(`✅ JavaScript: ${(resourceSizes.js / 1024).toFixed(1)}KB (budget: ${(PERFORMANCE_TARGETS.jsSize / 1024).toFixed(1)}KB)`);
            report.analysis.passedTests++;
        } else {
            console.log(`❌ JavaScript: ${(resourceSizes.js / 1024).toFixed(1)}KB (budget: ${(PERFORMANCE_TARGETS.jsSize / 1024).toFixed(1)}KB)`);
            report.analysis.issues.push(`JavaScript size exceeds budget: ${(resourceSizes.js / 1024).toFixed(1)}KB`);
        }
        
        report.analysis.totalTests++;
        if (resourceSizes.css <= PERFORMANCE_TARGETS.cssSize) {
            console.log(`✅ CSS: ${(resourceSizes.css / 1024).toFixed(1)}KB (budget: ${(PERFORMANCE_TARGETS.cssSize / 1024).toFixed(1)}KB)`);
            report.analysis.passedTests++;
        } else {
            console.log(`❌ CSS: ${(resourceSizes.css / 1024).toFixed(1)}KB (budget: ${(PERFORMANCE_TARGETS.cssSize / 1024).toFixed(1)}KB)`);
            report.analysis.issues.push(`CSS size exceeds budget: ${(resourceSizes.css / 1024).toFixed(1)}KB`);
        }
        
        // Optimization recommendations
        console.log('\n🔧 Optimization Recommendations:');
        console.log('=================================');
        
        if (report.analysis.issues.length === 0) {
            console.log('🎉 All performance targets met! Great job!');
        } else {
            report.analysis.issues.forEach(issue => {
                console.log(`💡 ${issue}`);
            });
        }
        
        // Check for common optimizations
        const hasMinifiedCSS = responses.some(r => r.url.includes('styles.css') && r.headers['content-encoding']);
        const hasWebP = responses.some(r => r.url.includes('.webp'));
        const hasFontDisplay = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('link[href*="fonts"]'));
            return links.some(link => link.href.includes('display=swap'));
        });
        
        console.log('\n✨ Optimization Status:');
        console.log('=======================');
        console.log(`${hasMinifiedCSS ? '✅' : '❌'} CSS Minification`);
        console.log(`${hasWebP ? '✅' : '❌'} WebP Images`);
        console.log(`${hasFontDisplay ? '✅' : '❌'} Font Display Optimization`);
        
        // Overall score
        const score = Math.round((report.analysis.passedTests / report.analysis.totalTests) * 100);
        console.log(`\n🏆 Overall Performance Score: ${score}%`);
        
        if (score >= 90) {
            console.log('🚀 Excellent performance! Ready for production.');
        } else if (score >= 75) {
            console.log('👍 Good performance with room for improvement.');
        } else {
            console.log('⚠️  Performance needs improvement before production.');
        }
        
        // Save detailed report
        const reportPath = path.join(__dirname, '..', 'tests', 'reports', 'performance-report.json');
        await fs.promises.mkdir(path.dirname(reportPath), { recursive: true });
        await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`\n📄 Detailed report saved to: ${reportPath}`);
        
        return report;
        
    } catch (error) {
        console.error('❌ Performance test failed:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Run the test if called directly
if (require.main === module) {
    const url = process.argv[2] || 'http://localhost:8000';
    runPerformanceTest(url)
        .then(report => {
            const score = Math.round((report.analysis.passedTests / report.analysis.totalTests) * 100);
            process.exit(score >= 90 ? 0 : 1);
        })
        .catch(error => {
            console.error('Test suite failed:', error);
            process.exit(1);
        });
}

module.exports = { runPerformanceTest, PERFORMANCE_TARGETS };
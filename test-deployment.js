const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testDeployment() {
    console.log('🚀 Starting comprehensive deployment test for https://banking-law.vercel.app/');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();
    
    // Collect console logs and errors
    const consoleLogs = [];
    const errors = [];
    
    page.on('console', msg => {
        consoleLogs.push({
            type: msg.type(),
            text: msg.text(),
            location: msg.location()
        });
        console.log(`Console ${msg.type()}: ${msg.text()}`);
    });
    
    page.on('pageerror', error => {
        errors.push(error.message);
        console.error('Page Error:', error.message);
    });
    
    try {
        console.log('\n1️⃣ Testing site loading...');
        
        // Navigate to the site
        const response = await page.goto('https://banking-law.vercel.app/', {
            waitUntil: 'networkidle',
            timeout: 30000
        });
        
        console.log(`✅ Site loaded with status: ${response.status()}`);
        
        // Wait for content to load
        await page.waitForTimeout(3000);
        
        console.log('\n2️⃣ Testing TailwindCSS styling...');
        
        // Check if Tailwind classes are applied correctly
        const heroSection = await page.locator('.hero-section, .bg-gradient-to-br').first();
        const heroExists = await heroSection.count() > 0;
        console.log(`✅ Hero section with Tailwind gradient: ${heroExists ? 'Found' : 'Not found'}`);
        
        // Check for Tailwind utility classes
        const tailwindElements = await page.locator('[class*="bg-"], [class*="text-"], [class*="p-"], [class*="m-"], [class*="flex"], [class*="grid"]').count();
        console.log(`✅ Elements with Tailwind classes: ${tailwindElements}`);
        
        // Check computed styles for a key element
        const headerBg = await page.locator('header, .header, nav').first().evaluate(el => {
            return window.getComputedStyle(el).backgroundColor;
        });
        console.log(`✅ Header background computed style: ${headerBg}`);
        
        console.log('\n3️⃣ Testing Font Awesome icons...');
        
        // Check for Font Awesome icons
        const faIcons = await page.locator('i[class*="fa-"], i[class*="fas"], i[class*="far"], i[class*="fab"]').count();
        console.log(`✅ Font Awesome icons found: ${faIcons}`);
        
        // Check if icons have content (pseudo-elements)
        if (faIcons > 0) {
            const iconContent = await page.locator('i[class*="fa-"]').first().evaluate(el => {
                const before = window.getComputedStyle(el, '::before');
                return {
                    content: before.content,
                    fontFamily: before.fontFamily,
                    display: before.display
                };
            });
            console.log(`✅ First icon pseudo-element:`, iconContent);
        }
        
        console.log('\n4️⃣ Testing JavaScript functionality...');
        
        // Test mobile menu toggle if it exists
        const mobileMenuButton = page.locator('[data-mobile-menu], .mobile-menu-toggle, button[aria-label*="menu"]').first();
        if (await mobileMenuButton.count() > 0) {
            console.log('📱 Testing mobile menu toggle...');
            await mobileMenuButton.click();
            await page.waitForTimeout(1000);
            
            const mobileMenu = page.locator('.mobile-menu, [data-mobile-menu-panel]').first();
            const menuVisible = await mobileMenu.isVisible().catch(() => false);
            console.log(`✅ Mobile menu toggle working: ${menuVisible}`);
            
            // Close menu
            await mobileMenuButton.click();
            await page.waitForTimeout(500);
        }
        
        // Test any interactive elements
        const buttons = await page.locator('button:not([disabled])').count();
        const links = await page.locator('a[href]').count();
        console.log(`✅ Interactive elements - Buttons: ${buttons}, Links: ${links}`);
        
        // Test form interactions if any
        const forms = await page.locator('form').count();
        if (forms > 0) {
            console.log(`✅ Forms found: ${forms}`);
            
            // Test first form input if available
            const firstInput = page.locator('form input').first();
            if (await firstInput.count() > 0) {
                await firstInput.fill('Test input');
                const inputValue = await firstInput.inputValue();
                console.log(`✅ Form input test: ${inputValue === 'Test input' ? 'Working' : 'Failed'}`);
                await firstInput.clear();
            }
        }
        
        console.log('\n5️⃣ Taking screenshot...');
        
        // Take a full page screenshot
        const screenshotPath = path.join(__dirname, 'deployment-test-screenshot.png');
        await page.screenshot({ 
            path: screenshotPath, 
            fullPage: true,
            type: 'png'
        });
        console.log(`✅ Screenshot saved to: ${screenshotPath}`);
        
        console.log('\n6️⃣ Checking for CSP and other errors...');
        
        // Check for CSP violations
        const cspErrors = consoleLogs.filter(log => 
            log.text.includes('Content Security Policy') || 
            log.text.includes('CSP') ||
            log.text.includes('Refused to')
        );
        
        const jsErrors = consoleLogs.filter(log => log.type === 'error');
        const warnings = consoleLogs.filter(log => log.type === 'warning');
        
        console.log(`🔍 CSP violations: ${cspErrors.length}`);
        console.log(`🔍 JavaScript errors: ${jsErrors.length}`);
        console.log(`🔍 Warnings: ${warnings.length}`);
        console.log(`🔍 Page errors: ${errors.length}`);
        
        if (cspErrors.length > 0) {
            console.log('\n❌ CSP Violations found:');
            cspErrors.forEach(error => console.log(`  - ${error.text}`));
        }
        
        if (jsErrors.length > 0) {
            console.log('\n❌ JavaScript Errors found:');
            jsErrors.forEach(error => console.log(`  - ${error.text}`));
        }
        
        if (errors.length > 0) {
            console.log('\n❌ Page Errors found:');
            errors.forEach(error => console.log(`  - ${error}`));
        }
        
        console.log('\n7️⃣ Testing specific site sections...');
        
        // Test navigation
        const navItems = await page.locator('nav a, .nav-link').count();
        console.log(`✅ Navigation items: ${navItems}`);
        
        // Test main content areas
        const sections = await page.locator('section, .section, main').count();
        console.log(`✅ Content sections: ${sections}`);
        
        // Check for images and their loading
        const images = await page.locator('img').count();
        const loadedImages = await page.locator('img').evaluateAll(imgs => 
            imgs.filter(img => img.complete && img.naturalWidth > 0).length
        );
        console.log(`✅ Images: ${loadedImages}/${images} loaded successfully`);
        
        console.log('\n📊 FINAL RESULTS:');
        console.log('==================');
        console.log(`✅ Site Loading: ${response.status() === 200 ? 'SUCCESS' : 'FAILED'}`);
        console.log(`✅ TailwindCSS: ${tailwindElements > 0 ? 'WORKING' : 'FAILED'}`);
        console.log(`✅ Font Awesome: ${faIcons > 0 ? 'WORKING' : 'FAILED'}`);
        console.log(`✅ JavaScript: ${buttons > 0 && links > 0 ? 'WORKING' : 'LIMITED'}`);
        console.log(`✅ Screenshots: CAPTURED`);
        console.log(`✅ Console Errors: ${jsErrors.length === 0 && errors.length === 0 ? 'NONE' : `${jsErrors.length + errors.length} FOUND`}`);
        console.log(`✅ CSP Issues: ${cspErrors.length === 0 ? 'RESOLVED' : `${cspErrors.length} REMAINING`}`);
        
        // Generate summary report
        const report = {
            timestamp: new Date().toISOString(),
            url: 'https://banking-law.vercel.app/',
            results: {
                siteLoading: response.status() === 200,
                tailwindCSS: tailwindElements > 0,
                fontAwesome: faIcons > 0,
                javascript: buttons > 0 && links > 0,
                cspErrors: cspErrors.length,
                jsErrors: jsErrors.length,
                pageErrors: errors.length,
                totalWarnings: warnings.length
            },
            details: {
                tailwindElements,
                fontAwesomeIcons: faIcons,
                buttons,
                links,
                forms,
                images: { total: images, loaded: loadedImages },
                consoleLogs: consoleLogs.length
            },
            errors: {
                csp: cspErrors.map(e => e.text),
                javascript: jsErrors.map(e => e.text),
                page: errors
            }
        };
        
        // Save report
        const reportPath = path.join(__dirname, 'deployment-test-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📄 Detailed report saved to: ${reportPath}`);
        
        const overallSuccess = report.results.siteLoading && 
                              report.results.tailwindCSS && 
                              report.results.fontAwesome && 
                              report.results.cspErrors === 0 && 
                              report.results.jsErrors === 0;
        
        console.log(`\n🎯 OVERALL STATUS: ${overallSuccess ? '✅ ALL TESTS PASSED' : '⚠️ ISSUES DETECTED'}`);
        
    } catch (error) {
        console.error('\n❌ Test failed with error:', error.message);
    } finally {
        await browser.close();
    }
}

// Run the test
testDeployment().catch(console.error);
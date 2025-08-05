/**
 * JuriBank Platform - Performance Optimization System
 * Bundle optimization, image lazy loading, and performance monitoring
 */

class JuriBankPerformanceOptimizer {
    constructor() {
        this.performanceMetrics = {
            loadTimes: [],
            bundleSizes: {},
            imageMetrics: {},
            userMetrics: new Map()
        };
        
        this.config = {
            maxBundleSize: 200 * 1024, // 200KB max initial bundle
            imageQuality: 0.85,
            lazyLoadThreshold: 200, // pixels
            performanceBudget: {
                fcp: 1500, // First Contentful Paint
                lcp: 2500, // Largest Contentful Paint
                fid: 100, // First Input Delay
                cls: 0.1 // Cumulative Layout Shift
            }
        };
        
        this.initializePerformanceOptimizer();
    }

    /**
     * Bundle Size Analysis and Optimization
     */
    async analyzeBundleSize() {
        const bundles = await this.getBundleInformation();
        const analysis = {
            total: 0,
            breakdown: {},
            recommendations: []
        };

        for (const [name, size] of Object.entries(bundles)) {
            analysis.total += size;
            analysis.breakdown[name] = {
                size,
                percentage: 0, // Will calculate after total
                optimized: size < this.config.maxBundleSize
            };

            // Add recommendations for large bundles
            if (size > this.config.maxBundleSize) {
                analysis.recommendations.push({
                    type: 'bundle_too_large',
                    bundle: name,
                    currentSize: size,
                    targetSize: this.config.maxBundleSize,
                    savings: size - this.config.maxBundleSize
                });
            }
        }

        // Calculate percentages
        for (const bundle of Object.values(analysis.breakdown)) {
            bundle.percentage = ((bundle.size / analysis.total) * 100).toFixed(1);
        }

        return analysis;
    }

    /**
     * Get bundle information from the build
     */
    async getBundleInformation() {
        const bundles = {};
        
        try {
            // Simulate bundle analysis - in production, integrate with webpack-bundle-analyzer
            bundles.main = await this.getFileSize('./assets/styles.css') || 85000;
            bundles.vendor = 45000; // Estimated vendor bundle size
            bundles.app = await this.getScriptBundleSize() || 120000;
            
        } catch (error) {
            console.warn('Bundle analysis failed:', error.message);
            // Fallback estimates
            bundles.main = 85000;
            bundles.vendor = 45000;
            bundles.app = 120000;
        }
        
        return bundles;
    }

    /**
     * Get file size utility
     */
    async getFileSize(filePath) {
        try {
            if (typeof fetch !== 'undefined') {
                const response = await fetch(filePath, { method: 'HEAD' });
                return parseInt(response.headers.get('content-length')) || 0;
            }
        } catch (error) {
            return 0;
        }
    }

    /**
     * Estimate script bundle size
     */
    async getScriptBundleSize() {
        let totalSize = 0;
        const scripts = ['src/juribank-core.js', 'src/intake-form.js', 'src/claim-tracker.js'];
        
        for (const script of scripts) {
            totalSize += await this.getFileSize(script) || 25000;
        }
        
        return totalSize;
    }

    /**
     * Image Optimization and Lazy Loading System
     */
    initializeImageOptimization() {
        if (typeof window === 'undefined') {return;}

        // Intersection Observer for lazy loading
        const imageObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            },
            {
                rootMargin: `${this.config.lazyLoadThreshold}px`
            }
        );

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });

        // Convert existing images to lazy loading
        this.convertImagesToLazyLoading();
    }

    /**
     * Load image with optimization
     */
    async loadImage(img) {
        const src = img.dataset.src;
        if (!src) {return;}

        const startTime = performance.now();
        
        try {
            // Check if WebP is supported
            const supportsWebP = await this.checkWebPSupport();
            
            // Convert image format if supported
            let optimizedSrc = src;
            if (supportsWebP && !src.includes('.svg')) {
                optimizedSrc = this.getWebPVersion(src);
            }

            // Create new image to preload
            const newImg = new Image();
            newImg.onload = () => {
                img.src = optimizedSrc;
                img.classList.add('loaded');
                
                // Track performance
                const loadTime = performance.now() - startTime;
                this.trackImagePerformance(src, loadTime);
            };
            
            newImg.onerror = () => {
                // Fallback to original image
                img.src = src;
                img.classList.add('loaded');
            };
            
            newImg.src = optimizedSrc;
            
        } catch (error) {
            console.warn('Image optimization failed:', error);
            img.src = src;
            img.classList.add('loaded');
        }
    }

    /**
     * Check WebP support
     */
    async checkWebPSupport() {
        if (this.webpSupported !== undefined) {
            return this.webpSupported;
        }

        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                this.webpSupported = webP.height === 2;
                resolve(this.webpSupported);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==';
        });
    }

    /**
     * Get WebP version of image URL
     */
    getWebPVersion(src) {
        // Simple URL transformation - in production, use a CDN service
        const extension = src.split('.').pop();
        if (['jpg', 'jpeg', 'png'].includes(extension.toLowerCase())) {
            return src.replace(new RegExp(`\\.${extension}$`, 'i'), '.webp');
        }
        return src;
    }

    /**
     * Convert existing images to lazy loading
     */
    convertImagesToLazyLoading() {
        const images = document.querySelectorAll('img:not([data-src])');
        
        images.forEach((img, index) => {
            // Skip if already processed or is above the fold
            if (img.hasAttribute('data-lazy-processed') || index < 3) {
                return;
            }

            const src = img.src;
            if (src && !src.startsWith('data:')) {
                img.dataset.src = src;
                img.src = this.generatePlaceholder(img.width || 300, img.height || 200);
                img.classList.add('lazy-image');
                img.setAttribute('data-lazy-processed', 'true');
            }
        });
    }

    /**
     * Generate placeholder image
     */
    generatePlaceholder(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, width, height);
        
        // Add loading text
        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Loading...', width / 2, height / 2);
        
        return canvas.toDataURL();
    }

    /**
     * Code Splitting Implementation
     */
    async loadModuleDynamically(moduleName) {
        const moduleMap = {
            'claim-tracker': () => import('./src/claim-tracker.js'),
            'intake-form': () => import('./src/intake-form.js'),
            'legal-citation': () => import('./src/legal-citation-engine.js'),
            'compliance-calendar': () => import('./src/compliance-calendar.js')
        };

        try {
            const startTime = performance.now();
            const module = await moduleMap[moduleName]();
            const loadTime = performance.now() - startTime;
            
            this.trackModulePerformance(moduleName, loadTime);
            return module;
            
        } catch (error) {
            console.error(`Failed to load module ${moduleName}:`, error);
            throw error;
        }
    }

    /**
     * Preload critical modules
     */
    preloadCriticalModules() {
        const criticalModules = ['intake-form', 'claim-tracker'];
        
        criticalModules.forEach(moduleName => {
            // Use link preload for critical modules
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'script';
            link.href = `./src/${moduleName}.js`;
            document.head.appendChild(link);
        });
    }

    /**
     * Performance Monitoring
     */
    initializePerformanceMonitoring() {
        if (typeof window === 'undefined') {return;}

        // Web Vitals monitoring
        this.observeWebVitals();
        
        // Resource timing
        this.monitorResourceTiming();
        
        // User timing
        this.setupUserTimingMarks();
        
        // Long task monitoring
        this.monitorLongTasks();
    }

    /**
     * Observe Web Vitals
     */
    observeWebVitals() {
        // FCP - First Contentful Paint
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name === 'first-contentful-paint') {
                        this.recordMetric('FCP', entry.startTime);
                    }
                }
            }).observe({ entryTypes: ['paint'] });

            // LCP - Largest Contentful Paint
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.recordMetric('LCP', entry.startTime);
                }
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // FID - First Input Delay
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.recordMetric('FID', entry.processingStart - entry.startTime);
                }
            }).observe({ entryTypes: ['first-input'] });

            // CLS - Cumulative Layout Shift
            new PerformanceObserver((list) => {
                let clsValue = 0;
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.recordMetric('CLS', clsValue);
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }

    /**
     * Monitor resource timing
     */
    monitorResourceTiming() {
        if (typeof window === 'undefined') {return;}

        window.addEventListener('load', () => {
            const resources = performance.getEntriesByType('resource');
            
            resources.forEach(resource => {
                this.analyzeResourcePerformance(resource);
            });
        });
    }

    /**
     * Analyze resource performance
     */
    analyzeResourcePerformance(resource) {
        const analysis = {
            name: resource.name,
            duration: resource.duration,
            size: resource.transferSize,
            cached: resource.transferSize === 0,
            type: this.getResourceType(resource.name)
        };

        // Flag slow resources
        if (analysis.duration > 1000) {
            console.warn('Slow resource detected:', analysis);
        }

        // Track in metrics
        if (!this.performanceMetrics.resourceTiming) {
            this.performanceMetrics.resourceTiming = [];
        }
        this.performanceMetrics.resourceTiming.push(analysis);
    }

    /**
     * Get resource type from URL
     */
    getResourceType(url) {
        if (url.includes('.css')) {return 'stylesheet';}
        if (url.includes('.js')) {return 'script';}
        if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {return 'image';}
        if (url.match(/\.(woff|woff2|ttf|eot)$/)) {return 'font';}
        return 'other';
    }

    /**
     * Setup user timing marks
     */
    setupUserTimingMarks() {
        if (typeof performance === 'undefined') {return;}

        // Mark important application events
        const markEvent = (name) => {
            performance.mark(`juribank-${name}`);
        };

        // Export for use in other modules
        window.JuriBankPerfMark = markEvent;

        // Auto-mark common events
        document.addEventListener('DOMContentLoaded', () => markEvent('dom-ready'));
        window.addEventListener('load', () => markEvent('page-loaded'));
    }

    /**
     * Monitor long tasks
     */
    monitorLongTasks() {
        if ('PerformanceObserver' in window && 'PerformanceLongTaskTiming' in window) {
            new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    console.warn('Long task detected:', {
                        duration: entry.duration,
                        startTime: entry.startTime,
                        name: entry.name
                    });
                }
            }).observe({ entryTypes: ['longtask'] });
        }
    }

    /**
     * Record performance metric
     */
    recordMetric(name, value) {
        const metric = {
            name,
            value,
            timestamp: Date.now(),
            url: window.location.pathname
        };

        if (!this.performanceMetrics.webVitals) {
            this.performanceMetrics.webVitals = [];
        }

        this.performanceMetrics.webVitals.push(metric);

        // Check against performance budget
        const budget = this.config.performanceBudget[name.toLowerCase()];
        if (budget && value > budget) {
            console.warn(`Performance budget exceeded for ${name}:`, {
                actual: value,
                budget: budget,
                excess: value - budget
            });
        }

        // Send to analytics (in production)
        this.sendPerformanceMetric(metric);
    }

    /**
     * Track image performance
     */
    trackImagePerformance(src, loadTime) {
        this.performanceMetrics.imageMetrics[src] = {
            loadTime,
            timestamp: Date.now()
        };
    }

    /**
     * Track module performance
     */
    trackModulePerformance(moduleName, loadTime) {
        if (!this.performanceMetrics.moduleLoading) {
            this.performanceMetrics.moduleLoading = {};
        }
        
        this.performanceMetrics.moduleLoading[moduleName] = {
            loadTime,
            timestamp: Date.now()
        };
    }

    /**
     * Send performance metric to analytics
     */
    sendPerformanceMetric(metric) {
        // In production, send to analytics service
        if (process.env.NODE_ENV === 'production' && typeof fetch !== 'undefined') {
            fetch('/api/analytics/performance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(metric)
            }).catch(() => {
                // Silently fail analytics
            });
        }
    }

    /**
     * Get performance report
     */
    getPerformanceReport() {
        return {
            summary: {
                totalMetrics: Object.keys(this.performanceMetrics).length,
                webVitals: this.performanceMetrics.webVitals?.length || 0,
                imageMetrics: Object.keys(this.performanceMetrics.imageMetrics || {}).length,
                moduleMetrics: Object.keys(this.performanceMetrics.moduleLoading || {}).length
            },
            details: this.performanceMetrics,
            recommendations: this.generateRecommendations()
        };
    }

    /**
     * Generate performance recommendations
     */
    generateRecommendations() {
        const recommendations = [];

        // Bundle size recommendations
        if (this.performanceMetrics.bundleSizes) {
            Object.entries(this.performanceMetrics.bundleSizes).forEach(([name, size]) => {
                if (size > this.config.maxBundleSize) {
                    recommendations.push({
                        type: 'bundle_optimization',
                        message: `Bundle '${name}' (${(size/1024).toFixed(1)}KB) exceeds recommended size`,
                        priority: 'high'
                    });
                }
            });
        }

        // Web Vitals recommendations
        if (this.performanceMetrics.webVitals) {
            this.performanceMetrics.webVitals.forEach(metric => {
                const budget = this.config.performanceBudget[metric.name.toLowerCase()];
                if (budget && metric.value > budget) {
                    recommendations.push({
                        type: 'web_vitals',
                        message: `${metric.name} (${metric.value.toFixed(1)}) exceeds budget (${budget})`,
                        priority: 'medium'
                    });
                }
            });
        }

        return recommendations;
    }

    /**
     * Initialize performance optimizer
     */
    initializePerformanceOptimizer() {
        console.log('⚡ JuriBank Performance Optimizer initialized');
        
        if (typeof window !== 'undefined') {
            // Client-side initialization
            this.initializeImageOptimization();
            this.initializePerformanceMonitoring();
            this.preloadCriticalModules();
            
            // Expose methods globally
            window.JuriBankPerf = {
                loadModule: this.loadModuleDynamically.bind(this),
                getReport: this.getPerformanceReport.bind(this)
            };
        }
    }
}

// Initialize global performance optimizer
const performanceOptimizer = new JuriBankPerformanceOptimizer();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JuriBankPerformanceOptimizer;
}
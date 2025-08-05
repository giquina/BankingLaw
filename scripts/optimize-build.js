#!/usr/bin/env node

/**
 * JuriBank Build Optimization Script
 * Automates performance optimizations for production deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting JuriBank Build Optimization...\n');

async function optimizeBuild() {
    try {
        // 1. Build optimized CSS
        console.log('📝 Building optimized CSS...');
        execSync('npm run build:css-prod', { stdio: 'inherit' });
        console.log('✅ CSS optimized and minified\n');
        
        // 2. Analyze bundle sizes
        console.log('📊 Analyzing bundle sizes...');
        const cssPath = path.join(__dirname, '..', 'assets', 'styles.css');
        const cssStats = fs.statSync(cssPath);
        const cssSize = (cssStats.size / 1024).toFixed(1);
        console.log(`   CSS bundle: ${cssSize}KB`);
        
        // 3. Check for optimization opportunities
        console.log('\n🔍 Checking optimization status...');
        
        const indexPath = path.join(__dirname, '..', 'index.html');
        const indexContent = fs.readFileSync(indexPath, 'utf8');
        
        // Check optimizations
        const optimizations = {
            'Local CSS (no CDN)': !indexContent.includes('cdn.tailwindcss.com'),
            'Font preloading': indexContent.includes('rel="preload"'),
            'Lazy loading': indexContent.includes('IntersectionObserver'),
            'Minified CSS': cssSize < 150, // Target under 150KB
            'Optimized images': indexContent.includes('data:image/svg+xml'),
            'Debounced events': indexContent.includes('debounce')
        };
        
        let passedOptimizations = 0;
        Object.entries(optimizations).forEach(([name, passed]) => {
            console.log(`   ${passed ? '✅' : '❌'} ${name}`);
            if (passed) {passedOptimizations++;}
        });
        
        const optimizationScore = Math.round((passedOptimizations / Object.keys(optimizations).length) * 100);
        console.log(`\n🏆 Optimization Score: ${optimizationScore}%`);
        
        // 4. Generate optimization report
        const report = {
            timestamp: new Date().toISOString(),
            bundleSizes: {
                css: `${cssSize}KB`
            },
            optimizations: optimizations,
            score: optimizationScore,
            recommendations: []
        };
        
        // Add recommendations
        if (!optimizations['Local CSS (no CDN)']) {
            report.recommendations.push('Replace Tailwind CDN with local build');
        }
        if (!optimizations['Font preloading']) {
            report.recommendations.push('Add font preloading for better performance');
        }
        if (!optimizations['Lazy loading']) {
            report.recommendations.push('Implement lazy loading for images and content');
        }
        if (!optimizations['Minified CSS']) {
            report.recommendations.push('Further optimize CSS bundle size');
        }
        
        // 5. Save report
        const reportsDir = path.join(__dirname, '..', 'tests', 'reports');
        await fs.promises.mkdir(reportsDir, { recursive: true });
        
        const reportPath = path.join(reportsDir, 'build-optimization.json');
        await fs.promises.writeFile(reportPath, JSON.stringify(report, null, 2));
        
        console.log(`\n📄 Optimization report saved to: ${reportPath}`);
        
        // 6. Performance recommendations
        console.log('\n💡 Performance Recommendations:');
        console.log('===============================');
        
        if (report.recommendations.length === 0) {
            console.log('🎉 All optimizations implemented! Ready for production.');
        } else {
            report.recommendations.forEach(rec => {
                console.log(`   • ${rec}`);
            });
        }
        
        // 7. Next steps
        console.log('\n🚀 Next Steps:');
        console.log('===============');
        console.log('1. Run performance tests: npm run test:performance');
        console.log('2. Deploy to staging: npm run deploy');
        console.log('3. Monitor Core Web Vitals in production');
        console.log('4. Set up performance budgets in CI/CD');
        
        return report;
        
    } catch (error) {
        console.error('❌ Build optimization failed:', error);
        throw error;
    }
}

// Enhanced file size checker
function getFileSizes() {
    const sizes = {};
    const assetsDir = path.join(__dirname, '..', 'assets');
    
    try {
        // CSS files
        const cssPath = path.join(assetsDir, 'styles.css');
        if (fs.existsSync(cssPath)) {
            sizes.css = fs.statSync(cssPath).size;
        }
        
        // Count images
        const imagesDir = path.join(assetsDir, 'images');
        if (fs.existsSync(imagesDir)) {
            const imageFiles = fs.readdirSync(imagesDir, { recursive: true })
                .filter(file => /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(file));
            sizes.imageCount = imageFiles.length;
        }
        
    } catch (error) {
        console.warn('Could not analyze file sizes:', error.message);
    }
    
    return sizes;
}

// Run optimization if called directly
if (require.main === module) {
    optimizeBuild()
        .then(report => {
            console.log('\n✨ Build optimization completed successfully!');
            process.exit(report.score >= 80 ? 0 : 1);
        })
        .catch(error => {
            console.error('Build optimization failed:', error);
            process.exit(1);
        });
}

module.exports = { optimizeBuild };
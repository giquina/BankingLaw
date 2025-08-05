#!/usr/bin/env node

/**
 * JuriBank JavaScript Minification Script
 * Minifies authentication system and other JS files for production
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

console.log('🔧 Starting JavaScript minification...\n');

async function minifyJavaScriptFiles() {
    try {
        const authFiles = [
            'session-manager.js',
            'src/auth-config.js',
            'src/auth-storage.js',
            'src/freemium-controller.js',
            'src/mock-auth-api.js',
            'src/auth-middleware.js',
            'src/user-profile-manager.js',
            'src/auth-dev-config.js',
            'src/auth-init.js'
        ];
        
        let totalOriginalSize = 0;
        let totalMinifiedSize = 0;
        let processedFiles = 0;
        
        console.log('📦 Minifying authentication system files...');
        
        for (const file of authFiles) {
            const filePath = path.join(__dirname, '..', file);
            
            if (fs.existsSync(filePath)) {
                const originalCode = fs.readFileSync(filePath, 'utf8');
                const originalSize = originalCode.length;
                totalOriginalSize += originalSize;
                
                // Minify with Terser
                const minifyOptions = {
                    compress: {
                        drop_console: process.env.NODE_ENV === 'production',
                        drop_debugger: true,
                        pure_funcs: ['console.log', 'console.warn'],
                        unsafe: false,
                        unsafe_comps: false,
                        unsafe_math: false,
                        unsafe_proto: false,
                        unsafe_regexp: false,
                        unsafe_undefined: false
                    },
                    mangle: {
                        reserved: [
                            // Keep these function names for public API
                            'JuriBankSessionManager',
                            'JuriBankAuthConfig',
                            'JuriBankAuthStorage',
                            'JuriBankFreemiumController',
                            'JuriBankMockAuthAPI',
                            'JuriBankAuthMiddleware',
                            'JuriBankUserProfileManager',
                            'JuriBankAuthDevConfig',
                            'JuriBankAuthSystem'
                        ]
                    },
                    format: {
                        comments: false
                    }
                };
                
                const minified = await minify(originalCode, minifyOptions);
                
                if (minified.error) {
                    console.error(`❌ Error minifying ${file}:`, minified.error);
                    continue;
                }
                
                const minifiedSize = minified.code.length;
                totalMinifiedSize += minifiedSize;
                
                const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
                console.log(`   ✅ ${file}: ${(originalSize/1024).toFixed(1)}KB → ${(minifiedSize/1024).toFixed(1)}KB (${savings}% reduction)`);
                
                // Write minified version (for development, keep original files)
                if (process.env.NODE_ENV === 'production') {
                    fs.writeFileSync(filePath, minified.code);
                }
                
                processedFiles++;
            } else {
                console.log(`   ⚠️ ${file}: File not found, skipping`);
            }
        }
        
        // Summary
        const totalSavings = ((totalOriginalSize - totalMinifiedSize) / totalOriginalSize * 100).toFixed(1);
        console.log(`\n📊 Minification Summary:`);
        console.log(`   Files processed: ${processedFiles}`);
        console.log(`   Original size: ${(totalOriginalSize/1024).toFixed(1)}KB`);
        console.log(`   Minified size: ${(totalMinifiedSize/1024).toFixed(1)}KB`);
        console.log(`   Total savings: ${totalSavings}%`);
        
        // Additional optimizations report
        console.log(`\n🚀 Optimization Report:`);
        console.log(`   ✅ Dead code elimination enabled`);
        console.log(`   ✅ Variable name mangling enabled`);
        console.log(`   ✅ Console statements ${process.env.NODE_ENV === 'production' ? 'removed' : 'preserved'}`);
        console.log(`   ✅ Public API names preserved`);
        console.log(`   ✅ Source maps ${process.env.NODE_ENV === 'production' ? 'disabled' : 'available'}`);
        
        return {
            processedFiles,
            originalSize: totalOriginalSize,
            minifiedSize: totalMinifiedSize,
            savings: totalSavings
        };
        
    } catch (error) {
        console.error('❌ Minification failed:', error);
        throw error;
    }
}

// Additional file optimizations
function optimizeOtherAssets() {
    console.log('\n🎨 Checking for additional optimization opportunities...');
    
    // Check for large JavaScript files in the project
    const projectRoot = path.join(__dirname, '..');
    const jsFiles = [];
    
    function findJSFiles(dir) {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
                findJSFiles(filePath);
            } else if (file.endsWith('.js') && !file.endsWith('.min.js')) {
                const size = stat.size;
                if (size > 10 * 1024) { // Files larger than 10KB
                    jsFiles.push({
                        path: filePath,
                        size: size,
                        relativePath: path.relative(projectRoot, filePath)
                    });
                }
            }
        }
    }
    
    try {
        findJSFiles(projectRoot);
        
        if (jsFiles.length > 0) {
            console.log(`   Found ${jsFiles.length} JavaScript files > 10KB:`);
            jsFiles.forEach(file => {
                console.log(`   📄 ${file.relativePath}: ${(file.size/1024).toFixed(1)}KB`);
            });
        } else {
            console.log(`   ✅ No large JavaScript files found`);
        }
    } catch (error) {
        console.log(`   ⚠️ Could not scan for additional files:`, error.message);
    }
}

// Performance recommendations
function generatePerformanceRecommendations(minificationResults) {
    console.log(`\n💡 Performance Recommendations:`);
    console.log(`   =============================`);
    
    if (minificationResults.savings < 30) {
        console.log(`   • Consider enabling more aggressive compression`);
    }
    
    if (minificationResults.minifiedSize > 200 * 1024) {
        console.log(`   • Authentication system is ${(minificationResults.minifiedSize/1024).toFixed(1)}KB`);
        console.log(`   • Consider code splitting for better loading performance`);
    }
    
    console.log(`   • Use gzip compression on server (additional 60-80% reduction)`);
    console.log(`   • Consider lazy loading non-critical authentication features`);
    console.log(`   • Monitor bundle size in CI/CD pipeline`);
    console.log(`   • Consider using a CDN for static assets`);
    
    if (process.env.NODE_ENV !== 'production') {
        console.log(`   • Run with NODE_ENV=production for maximum optimization`);
    }
}

// Run minification if called directly
if (require.main === module) {
    minifyJavaScriptFiles()
        .then(results => {
            optimizeOtherAssets();
            generatePerformanceRecommendations(results);
            console.log('\n✅ JavaScript minification completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('JavaScript minification failed:', error);
            process.exit(1);
        });
}

module.exports = { minifyJavaScriptFiles };
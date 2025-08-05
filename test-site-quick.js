const https = require('https');
const http = require('http');
const { URL } = require('url');

// Simple HTTP client to test the deployed site
function testSite() {
    console.log('🚀 Testing https://banking-law.vercel.app/');
    
    const url = new URL('https://banking-law.vercel.app/');
    
    const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'GET',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    };
    
    const req = https.request(options, (res) => {
        console.log(`✅ Status Code: ${res.statusCode}`);
        console.log(`✅ Status Message: ${res.statusMessage}`);
        console.log('\n📋 Response Headers:');
        Object.keys(res.headers).forEach(key => {
            console.log(`  ${key}: ${res.headers[key]}`);
        });
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log(`\n📊 Response Size: ${data.length} bytes`);
            
            // Check for key elements
            const checks = {
                'HTML Structure': data.includes('<!DOCTYPE html>'),
                'Title Present': data.includes('<title>'),
                'TailwindCSS CDN': data.includes('cdn.tailwindcss.com'),
                'Font Awesome': data.includes('font-awesome'),
                'Google Fonts': data.includes('fonts.googleapis.com'),
                'JuriBank Logo': data.includes('juribank-logo.svg'),
                'Navigation': data.includes('<nav'),
                'Hero Section': data.includes('gradient-bg'),
                'JavaScript': data.includes('<script>'),
                'Mobile Menu': data.includes('mobile-menu')
            };
            
            console.log('\n🔍 Content Analysis:');
            Object.keys(checks).forEach(check => {
                const status = checks[check] ? '✅' : '❌';
                console.log(`  ${status} ${check}: ${checks[check]}`);
            });
            
            // Check for potential errors
            const errorChecks = {
                'CSP Violations': data.toLowerCase().includes('content security policy'),
                'Script Errors': data.includes('Uncaught'),
                'Failed Resources': data.includes('Failed to load'),
                'Blocked Resources': data.includes('blocked'),
                'Font Loading Issues': data.includes('font') && data.includes('error')
            };
            
            console.log('\n🚨 Error Detection:');
            Object.keys(errorChecks).forEach(check => {
                const status = errorChecks[check] ? '⚠️ DETECTED' : '✅ CLEAR';
                console.log(`  ${status} ${check}`);
            });
            
            // Basic performance metrics
            console.log('\n⚡ Basic Metrics:');
            console.log(`  Content Size: ${(data.length / 1024).toFixed(2)} KB`);
            console.log(`  Estimated Elements: ~${(data.match(/<[^>]+>/g) || []).length}`);
            console.log(`  External Resources: ~${(data.match(/https?:\/\/[^"'\s]+/g) || []).length}`);
            
            // Sample some content
            console.log('\n📄 Content Sample (first 500 chars):');
            console.log(data.substring(0, 500) + '...');
            
            if (res.statusCode === 200 && checks['HTML Structure'] && checks['TailwindCSS CDN']) {
                console.log('\n🎉 SITE APPEARS TO BE WORKING CORRECTLY!');
            } else {
                console.log('\n⚠️ SITE MAY HAVE ISSUES - CHECK ERRORS ABOVE');
            }
        });
    });
    
    req.on('error', (error) => {
        console.error('❌ Request failed:', error.message);
    });
    
    req.setTimeout(10000, () => {
        console.error('❌ Request timed out');
        req.destroy();
    });
    
    req.end();
}

// Run the test
testSite();
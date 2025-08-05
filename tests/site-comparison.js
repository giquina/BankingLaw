const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const url1 = 'https://banking-k1bgccuxi-giquinas-projects.vercel.app';
const url2 = 'https://banking-law.vercel.app/';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    };

    const req = protocol.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        resolve({
          url: url,
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
          loadTime: endTime - startTime,
          size: Buffer.byteLength(data, 'utf8')
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

function analyzeContent(content) {
  // Basic content analysis
  const analysis = {
    title: '',
    hasJavaScript: content.includes('<script'),
    hasCSS: content.includes('<style') || content.includes('stylesheet'),
    hasImages: content.includes('<img'),
    hasLinks: content.includes('<a'),
    formCount: (content.match(/<form/g) || []).length,
    scriptCount: (content.match(/<script/g) || []).length,
    linkCount: (content.match(/<a/g) || []).length,
    imageCount: (content.match(/<img/g) || []).length,
    isAuth: content.includes('Authentication') || content.includes('auth'),
    isMainSite: content.includes('JuriBank') && !content.includes('Authentication'),
    contentLength: content.length
  };

  // Extract title
  const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    analysis.title = titleMatch[1].trim();
  }

  return analysis;
}

async function compareWebsites() {
  console.log('🔍 Starting Website Comparison Analysis\n');
  console.log('=' .repeat(60));
  
  try {
    console.log('📥 Fetching URL 1:', url1);
    const result1 = await makeRequest(url1);
    
    console.log('📥 Fetching URL 2:', url2);
    const result2 = await makeRequest(url2);

    console.log('\n📊 COMPARISON RESULTS');
    console.log('=' .repeat(60));

    // Basic metrics comparison
    console.log('\n🚀 PERFORMANCE METRICS:');
    console.log(`URL 1 Load Time: ${result1.loadTime}ms`);
    console.log(`URL 2 Load Time: ${result2.loadTime}ms`);
    console.log(`URL 1 Content Size: ${result1.size} bytes`);
    console.log(`URL 2 Content Size: ${result2.size} bytes`);

    console.log('\n📡 HTTP STATUS:');
    console.log(`URL 1 Status: ${result1.statusCode}`);
    console.log(`URL 2 Status: ${result2.statusCode}`);

    // Content analysis
    console.log('\n🔍 CONTENT ANALYSIS:');
    const analysis1 = analyzeContent(result1.data);
    const analysis2 = analyzeContent(result2.data);

    console.log(`URL 1 Title: "${analysis1.title}"`);
    console.log(`URL 2 Title: "${analysis2.title}"`);

    console.log('\n🎯 SITE TYPE DETECTION:');
    console.log(`URL 1 is Authentication Page: ${analysis1.isAuth}`);
    console.log(`URL 1 is Main Site: ${analysis1.isMainSite}`);
    console.log(`URL 2 is Authentication Page: ${analysis2.isAuth}`);
    console.log(`URL 2 is Main Site: ${analysis2.isMainSite}`);

    console.log('\n🧩 ELEMENT COUNTS:');
    console.log(`URL 1 - Forms: ${analysis1.formCount}, Scripts: ${analysis1.scriptCount}, Links: ${analysis1.linkCount}, Images: ${analysis1.imageCount}`);
    console.log(`URL 2 - Forms: ${analysis2.formCount}, Scripts: ${analysis2.scriptCount}, Links: ${analysis2.linkCount}, Images: ${analysis2.imageCount}`);

    // Headers comparison
    console.log('\n📋 KEY HEADERS COMPARISON:');
    console.log(`URL 1 Server: ${result1.headers.server || 'Not specified'}`);
    console.log(`URL 2 Server: ${result2.headers.server || 'Not specified'}`);
    console.log(`URL 1 Content-Type: ${result1.headers['content-type'] || 'Not specified'}`);
    console.log(`URL 2 Content-Type: ${result2.headers['content-type'] || 'Not specified'}`);

    // Save detailed reports
    const reportsDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Save full analysis
    const fullReport = {
      timestamp: new Date().toISOString(),
      url1: {
        url: url1,
        ...result1,
        analysis: analysis1
      },
      url2: {
        url: url2,
        ...result2,
        analysis: analysis2
      },
      comparison: {
        statusCodesDifferent: result1.statusCode !== result2.statusCode,
        loadTimeDifference: Math.abs(result1.loadTime - result2.loadTime),
        sizeDifference: Math.abs(result1.size - result2.size),
        bothWorking: result1.statusCode === 200 && result2.statusCode === 200,
        siteTypesDifferent: analysis1.isAuth !== analysis2.isAuth
      }
    };

    fs.writeFileSync(
      path.join(reportsDir, 'comparison-report.json'),
      JSON.stringify(fullReport, null, 2)
    );

    // Key findings
    console.log('\n🎯 KEY FINDINGS:');
    console.log('=' .repeat(40));
    
    if (result1.statusCode === 401) {
      console.log('⚠️  URL 1 requires authentication - showing Vercel auth page');
    }
    
    if (result2.statusCode === 200) {
      console.log('✅ URL 2 loads successfully - showing main JuriBank site');
    }
    
    if (fullReport.comparison.statusCodesDifferent) {
      console.log('❌ Sites have different HTTP status codes');
    }
    
    if (fullReport.comparison.siteTypesDifferent) {
      console.log('❌ Sites show different content types (auth vs main site)');
    }

    console.log('\n📁 Detailed report saved to: tests/reports/comparison-report.json');

  } catch (error) {
    console.error('❌ Error during comparison:', error.message);
  }
}

// Run the comparison
compareWebsites();
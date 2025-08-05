const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// URLs to compare
const URL_1 = 'https://banking-k1bgccuxi-giquinas-projects.vercel.app';
const URL_2 = 'https://banking-law.vercel.app/';

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

test.describe('Deployment Comparison Tests', () => {
  test('Compare both deployments - Desktop', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    // Test URL 1
    const page1 = await context.newPage();
    console.log('Testing:', URL_1);
    
    const startTime1 = Date.now();
    try {
      await page1.goto(URL_1, { waitUntil: 'networkidle', timeout: 30000 });
      const loadTime1 = Date.now() - startTime1;
      
      // Take screenshot
      await page1.screenshot({ 
        path: path.join(screenshotsDir, 'url1-desktop.png'),
        fullPage: true 
      });

      // Get page title and basic metrics
      const title1 = await page1.title();
      const url1Loaded = true;
      
      console.log(`URL 1 - Title: ${title1}, Load Time: ${loadTime1}ms`);
      
    } catch (error) {
      console.error('Error loading URL 1:', error.message);
      await page1.screenshot({ 
        path: path.join(screenshotsDir, 'url1-desktop-error.png') 
      });
    }

    // Test URL 2
    const page2 = await context.newPage();
    console.log('Testing:', URL_2);
    
    const startTime2 = Date.now();
    try {
      await page2.goto(URL_2, { waitUntil: 'networkidle', timeout: 30000 });
      const loadTime2 = Date.now() - startTime2;
      
      // Take screenshot
      await page2.screenshot({ 
        path: path.join(screenshotsDir, 'url2-desktop.png'),
        fullPage: true 
      });

      // Get page title and basic metrics
      const title2 = await page2.title();
      const url2Loaded = true;
      
      console.log(`URL 2 - Title: ${title2}, Load Time: ${loadTime2}ms`);
      
    } catch (error) {
      console.error('Error loading URL 2:', error.message);
      await page2.screenshot({ 
        path: path.join(screenshotsDir, 'url2-desktop-error.png') 
      });
    }

    await context.close();
  });

  test('Compare both deployments - Mobile', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 } // iPhone SE size
    });

    // Test URL 1 Mobile
    const page1 = await context.newPage();
    console.log('Testing Mobile:', URL_1);
    
    try {
      await page1.goto(URL_1, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Take mobile screenshot
      await page1.screenshot({ 
        path: path.join(screenshotsDir, 'url1-mobile.png'),
        fullPage: true 
      });
      
    } catch (error) {
      console.error('Error loading URL 1 mobile:', error.message);
      await page1.screenshot({ 
        path: path.join(screenshotsDir, 'url1-mobile-error.png') 
      });
    }

    // Test URL 2 Mobile
    const page2 = await context.newPage();
    console.log('Testing Mobile:', URL_2);
    
    try {
      await page2.goto(URL_2, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Take mobile screenshot
      await page2.screenshot({ 
        path: path.join(screenshotsDir, 'url2-mobile.png'),
        fullPage: true 
      });
      
    } catch (error) {
      console.error('Error loading URL 2 mobile:', error.message);
      await page2.screenshot({ 
        path: path.join(screenshotsDir, 'url2-mobile-error.png') 
      });
    }

    await context.close();
  });

  test('Content and Functionality Comparison', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });

    const page1 = await context.newPage();
    const page2 = await context.newPage();

    try {
      // Load both pages
      await Promise.all([
        page1.goto(URL_1, { waitUntil: 'networkidle', timeout: 30000 }),
        page2.goto(URL_2, { waitUntil: 'networkidle', timeout: 30000 })
      ]);

      // Compare page titles
      const title1 = await page1.title();
      const title2 = await page2.title();
      console.log(`Title comparison: "${title1}" vs "${title2}"`);

      // Check for key elements
      const elements = [
        'header',
        'nav',
        'main',
        'footer',
        '.hero-section',
        '.service-cards',
        '.client-portal',
        '.ai-assistant'
      ];

      for (const element of elements) {
        try {
          const exists1 = await page1.locator(element).count() > 0;
          const exists2 = await page2.locator(element).count() > 0;
          console.log(`Element ${element}: URL1=${exists1}, URL2=${exists2}`);
        } catch (e) {
          console.log(`Element ${element}: Could not check - ${e.message}`);
        }
      }

      // Check for key text content
      const keyTexts = [
        'JuriBank',
        'Legal Services',
        'Banking Law',
        'Contact',
        'About'
      ];

      for (const text of keyTexts) {
        try {
          const content1 = await page1.content();
          const content2 = await page2.content();
          const found1 = content1.includes(text);
          const found2 = content2.includes(text);
          console.log(`Text "${text}": URL1=${found1}, URL2=${found2}`);
        } catch (e) {
          console.log(`Text "${text}": Could not check - ${e.message}`);
        }
      }

    } catch (error) {
      console.error('Error in content comparison:', error.message);
    }

    await context.close();
  });
});
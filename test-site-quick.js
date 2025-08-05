const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });
  
  // Listen for failed network requests
  page.on('requestfailed', request => {
    console.log('FAILED REQUEST:', request.url(), request.failure().errorText);
  });
  
  try {
    await page.goto('https://banking-law.vercel.app/', { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Check if TailwindCSS is working
    const bgColor = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      return window.getComputedStyle(nav).backgroundColor;
    });
    
    console.log('Navigation background color:', bgColor);
    
    // Check if Font Awesome is working
    const iconExists = await page.$('.fas.fa-graduation-cap');
    console.log('Font Awesome icon exists:', iconExists !== null);
    
    // Check if custom colors are working
    const customColorElement = await page.$('.bg-student-blue');
    if (customColorElement) {
      const customColor = await page.evaluate(el => window.getComputedStyle(el).backgroundColor, customColorElement);
      console.log('Custom student-blue color:', customColor);
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'site-screenshot.png', fullPage: true });
    console.log('Screenshot saved as site-screenshot.png');
    
  } catch (error) {
    console.error('Error loading page:', error.message);
  } finally {
    await browser.close();
  }
})();
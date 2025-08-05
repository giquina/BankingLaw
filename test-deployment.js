const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ CONSOLE ERROR:', msg.text());
    }
  });
  
  // Listen for failed network requests
  page.on('requestfailed', request => {
    console.log('❌ FAILED REQUEST:', request.url(), request.failure());
  });
  
  try {
    console.log('🌐 Testing https://banking-law.vercel.app/...');
    await page.goto('https://banking-law.vercel.app/', { waitUntil: 'networkidle' });
    
    // Check page title
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    // Check if TailwindCSS is working by checking computed styles
    const navBgColor = await page.evaluate(() => {
      const nav = document.querySelector('nav');
      return nav ? window.getComputedStyle(nav).backgroundColor : 'not found';
    });
    console.log('🎨 Navigation background color:', navBgColor);
    
    // Check if custom Tailwind colors are working
    const studentBlueElement = await page.$('.bg-student-blue');
    if (studentBlueElement) {
      const customColor = await page.evaluate(el => window.getComputedStyle(el).backgroundColor, studentBlueElement);
      console.log('💙 Student-blue color:', customColor);
    } else {
      console.log('❌ No element with .bg-student-blue found');
    }
    
    // Check if Font Awesome icons are working
    const iconCount = await page.$$eval('.fas', icons => icons.length);
    console.log('🎯 Font Awesome icons found:', iconCount);
    
    // Check if an icon has content (means Font Awesome CSS loaded)
    const iconContent = await page.evaluate(() => {
      const icon = document.querySelector('.fas.fa-graduation-cap');
      return icon ? window.getComputedStyle(icon, ':before').content : 'not found';
    });
    console.log('📝 Icon content:', iconContent);
    
    // Check if TailwindCSS script loaded
    const tailwindLoaded = await page.evaluate(() => {
      return typeof window.tailwind !== 'undefined';
    });
    console.log('🏗️ TailwindCSS loaded:', tailwindLoaded);
    
    // Take a screenshot
    await page.screenshot({ path: 'deployment-test.png', fullPage: true });
    console.log('📸 Screenshot saved as deployment-test.png');
    
    console.log('✅ Test completed successfully');
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
  } finally {
    await browser.close();
  }
})();
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const testViewports = [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPhone 12', width: 390, height: 844 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'Samsung Galaxy S21', width: 360, height: 800 },
    { name: 'Desktop', width: 1200, height: 800 }
  ];
  
  for (const viewport of testViewports) {
    console.log(`\n📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
    
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('https://banking-law.vercel.app/', { waitUntil: 'networkidle' });
    
    // Test navigation menu visibility
    const mobileMenuToggle = await page.$('#mobile-menu-toggle');
    const desktopMenu = await page.$('.hidden.md\\:flex');
    
    if (viewport.width < 768) {
      console.log('  📋 Mobile menu toggle:', mobileMenuToggle ? '✅ Visible' : '❌ Missing');
      
      // Test mobile menu functionality
      if (mobileMenuToggle) {
        await mobileMenuToggle.click();
        await page.waitForTimeout(500);
        const mobileMenu = await page.$('#mobile-menu');
        const isVisible = await mobileMenu?.isVisible();
        console.log('  📱 Mobile menu opens:', isVisible ? '✅ Yes' : '❌ No');
      }
    } else {
      console.log('  💻 Desktop menu:', desktopMenu ? '✅ Visible' : '❌ Missing');
    }
    
    // Test hero section layout
    const heroText = await page.$('h1');
    if (heroText) {
      const fontSize = await page.evaluate(el => window.getComputedStyle(el).fontSize, heroText);
      console.log('  📰 Hero title font size:', fontSize);
    }
    
    // Test grid layouts
    const gridElements = await page.$$('.grid');
    console.log('  🔳 Grid elements found:', gridElements.length);
    
    // Test button visibility and size
    const ctaButtons = await page.$$('button, .bg-white.text-student-blue');
    console.log('  🔘 CTA buttons found:', ctaButtons.length);
    
    // Check for horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log('  ↔️ Horizontal scroll:', hasHorizontalScroll ? '❌ Yes (problematic)' : '✅ No');
    
    // Take screenshot
    await page.screenshot({ 
      path: `mobile-test-${viewport.name.toLowerCase().replace(/\s+/g, '-')}.png`,
      fullPage: true 
    });
    console.log(`  📸 Screenshot saved as mobile-test-${viewport.name.toLowerCase().replace(/\s+/g, '-')}.png`);
  }
  
  await browser.close();
  console.log('\n✅ Mobile responsiveness test completed');
})();
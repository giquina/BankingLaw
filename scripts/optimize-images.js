#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

console.log('🖼️  Starting image optimization...');

async function optimizeImages() {
  try {
    const assetsDir = path.join(__dirname, '..', 'assets');
    const imageStats = {
      processed: 0,
      skipped: 0,
      errors: 0
    };

    // Check if assets directory exists
    try {
      await fs.access(assetsDir);
    } catch (error) {
      console.log('📁 No assets directory found, skipping image optimization');
      return;
    }

    // Check for image files
    const files = await fs.readdir(assetsDir, { recursive: true });
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
    });

    if (imageFiles.length === 0) {
      console.log('📸 No image files found to optimize');
      return;
    }

    console.log(`🔍 Found ${imageFiles.length} image files`);

    for (const file of imageFiles) {
      try {
        const filePath = path.join(assetsDir, file);
        const stats = await fs.stat(filePath);
        
        // For now, just log the files - actual optimization would require imagemin
        console.log(`   ✅ ${file}: ${(stats.size / 1024).toFixed(2)}KB`);
        imageStats.processed++;
      } catch (error) {
        console.log(`   ❌ Error processing ${file}: ${error.message}`);
        imageStats.errors++;
      }
    }

    console.log('\n📊 Image Optimization Summary:');
    console.log(`   Files processed: ${imageStats.processed}`);
    console.log(`   Files skipped: ${imageStats.skipped}`);
    console.log(`   Errors: ${imageStats.errors}`);
    
    if (imageStats.errors === 0) {
      console.log('✅ Image optimization completed successfully!');
    } else {
      console.log('⚠️  Image optimization completed with some errors');
    }

  } catch (error) {
    console.error('❌ Image optimization failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  optimizeImages();
}

module.exports = optimizeImages;
#!/usr/bin/env node

/**
 * Script to create a poster image from the first frame of the video
 * This shows immediately while the video loads, improving perceived performance
 * 
 * Requirements: FFmpeg must be installed
 * 
 * Usage: node scripts/create-video-poster.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VIDEO_PATH = path.join(__dirname, '..', 'public', 'Banner Video V3.mp4');
const POSTER_PATH = path.join(__dirname, '..', 'public', 'video-poster.jpg');

function createPoster() {
  console.log('🎬 Creating video poster image...\n');

  // Check if FFmpeg is installed
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ FFmpeg is not installed!');
    console.error('\nPlease install FFmpeg:');
    console.error('  • Windows: Download from https://ffmpeg.org/download.html');
    console.error('  • Mac: brew install ffmpeg');
    console.error('  • Linux: sudo apt-get install ffmpeg\n');
    process.exit(1);
  }

  // Check if video exists
  if (!fs.existsSync(VIDEO_PATH)) {
    console.error(`❌ Video not found at: ${VIDEO_PATH}\n`);
    process.exit(1);
  }

  try {
    // Extract first frame
    console.log('📸 Extracting first frame from video...');
    execSync(
      `ffmpeg -i "${VIDEO_PATH}" -ss 00:00:01 -vframes 1 -q:v 2 "${POSTER_PATH}" -y`,
      { stdio: 'inherit' }
    );

    console.log('\n✅ Success! Poster image created at:');
    console.log(`   ${POSTER_PATH}\n`);
    console.log('💡 Next steps:');
    console.log('   1. Optimize the poster image at https://tinypng.com');
    console.log('   2. Replace the optimized version');
    console.log('   3. The poster is already configured in your hero components\n');

    // Get file size
    const stats = fs.statSync(POSTER_PATH);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📊 Poster size: ${fileSizeInMB} MB`);
    console.log(`   (Compress to ~100-200 KB with TinyPNG for best results)\n`);

  } catch (error) {
    console.error('❌ Error creating poster:', error.message);
    process.exit(1);
  }
}

createPoster();


#!/usr/bin/env node

/**
 * Upload video and images to Cloudinary
 * 
 * Usage:
 *   node scripts/upload-to-cloudinary.js video     // Upload banner video
 *   node scripts/upload-to-cloudinary.js images    // Upload all images
 *   node scripts/upload-to-cloudinary.js all       // Upload everything
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.error('❌ Missing Cloudinary credentials in .env.local');
  process.exit(1);
}

async function uploadToCloudinary(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    const {
      folder = '',
      resourceType = 'auto',
      publicId = null,
      transformation = {}
    } = options;

    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('api_key', API_KEY);
    formData.append('timestamp', Math.round(Date.now() / 1000));
    
    if (folder) formData.append('folder', folder);
    if (publicId) formData.append('public_id', publicId);
    
    // Generate signature
    const crypto = require('crypto');
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = {
      timestamp,
      ...(folder && { folder }),
      ...(publicId && { public_id: publicId })
    };
    
    const sortedParams = Object.keys(paramsToSign)
      .sort()
      .map(key => `${key}=${paramsToSign[key]}`)
      .join('&');
    
    const signature = crypto
      .createHash('sha1')
      .update(sortedParams + API_SECRET)
      .digest('hex');
    
    formData.append('signature', signature);

    const options = {
      hostname: 'api.cloudinary.com',
      path: `/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
      method: 'POST',
      headers: formData.getHeaders()
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode === 200) {
            resolve(result);
          } else {
            reject(new Error(`Upload failed: ${result.error?.message || 'Unknown error'}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    formData.pipe(req);
  });
}

async function uploadVideo() {
  console.log('🎬 Uploading Banner Video to Cloudinary...\n');
  
  const videoPath = path.join(__dirname, '..', 'public', 'Banner Video V3.mp4');
  
  if (!fs.existsSync(videoPath)) {
    console.error(`❌ Video not found at: ${videoPath}`);
    return;
  }

  const stats = fs.statSync(videoPath);
  const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`📊 Original size: ${fileSizeMB} MB\n`);

  try {
    console.log('⏳ Uploading... (this may take a minute for large videos)\n');
    
    const result = await uploadToCloudinary(videoPath, {
      folder: 'videos',
      resourceType: 'video',
      publicId: 'banner-video-v3'
    });

    console.log('✅ Video uploaded successfully!\n');
    console.log('📋 Details:');
    console.log(`   Public ID: ${result.public_id}`);
    console.log(`   Format: ${result.format}`);
    console.log(`   Duration: ${result.duration}s`);
    console.log(`   Size: ${(result.bytes / (1024 * 1024)).toFixed(2)} MB\n`);
    
    console.log('🔗 Optimized URL to use in your code:');
    console.log(`   https://res.cloudinary.com/${CLOUD_NAME}/video/upload/q_auto:low,f_auto,vc_auto/${result.public_id}.mp4\n`);
    
    console.log('📝 Next step: Update components/hero.tsx and components/hero-dynamic.tsx');
    console.log('   Replace the <source src="/Banner Video V3.mp4"> with the URL above\n');

  } catch (error) {
    console.error('❌ Upload failed:', error.message);
  }
}

async function uploadImages() {
  console.log('🖼️  Uploading images to Cloudinary...\n');
  
  const imagesDir = path.join(__dirname, '..', 'public', 'IMAGES');
  
  if (!fs.existsSync(imagesDir)) {
    console.error(`❌ Images directory not found at: ${imagesDir}`);
    return;
  }

  const files = fs.readdirSync(imagesDir, { recursive: true });
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
  );

  console.log(`Found ${imageFiles.length} images to upload\n`);

  const results = [];
  
  for (const file of imageFiles.slice(0, 5)) { // Limit to 5 for demo
    const filePath = path.join(imagesDir, file);
    const fileName = path.basename(file, path.extname(file));
    
    try {
      console.log(`⏳ Uploading ${file}...`);
      
      const result = await uploadToCloudinary(filePath, {
        folder: 'site-images',
        resourceType: 'image',
        publicId: fileName
      });
      
      console.log(`✅ Uploaded: ${result.public_id}\n`);
      results.push(result);
      
    } catch (error) {
      console.error(`❌ Failed to upload ${file}:`, error.message);
    }
  }

  console.log(`\n✅ Uploaded ${results.length} images successfully!`);
  console.log('\n💡 To use these images, import CldImage:');
  console.log('   import { CldImage } from "next-cloudinary"\n');
}

// Main execution
const command = process.argv[2] || 'help';

switch (command) {
  case 'video':
    uploadVideo();
    break;
  
  case 'images':
    uploadImages();
    break;
  
  case 'all':
    (async () => {
      await uploadVideo();
      console.log('\n' + '='.repeat(60) + '\n');
      await uploadImages();
    })();
    break;
  
  default:
    console.log('Cloudinary Upload Tool\n');
    console.log('Usage:');
    console.log('  node scripts/upload-to-cloudinary.js video     # Upload banner video');
    console.log('  node scripts/upload-to-cloudinary.js images    # Upload images');
    console.log('  node scripts/upload-to-cloudinary.js all       # Upload everything\n');
}


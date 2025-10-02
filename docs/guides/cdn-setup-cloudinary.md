# Cloudinary Setup Guide (FREE Tier)

## Why Cloudinary for Media?
- ✅ Free tier: 25GB storage, 25GB bandwidth/month
- ✅ Automatic video optimization and compression
- ✅ Adaptive bitrate streaming
- ✅ Responsive images with automatic format conversion
- ✅ On-the-fly transformations

## Free Tier Limits
- Storage: 25GB
- Bandwidth: 25GB/month
- Transformations: 25,000/month
- **Perfect for your needs!**

## Step-by-Step Setup

### 1. Sign Up
1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Create a free account
3. Note your **Cloud Name**, **API Key**, and **API Secret**

### 2. Upload Your Video
1. Go to Cloudinary Dashboard
2. Click **Media Library** → **Upload**
3. Upload `Banner Video V3.mp4`
4. Cloudinary will automatically optimize it

### 3. Install Cloudinary Package

```bash
npm install next-cloudinary
```

### 4. Update Environment Variables

Create/update `.env.local`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 5. Update Hero Component

Replace the video source in `components/hero.tsx`:

```tsx
// OLD:
<source src="/Banner Video V3.mp4" type="video/mp4" />

// NEW:
<source 
  src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/q_auto,f_auto/banner-video-v3.mp4`} 
  type="video/mp4" 
/>
```

### 6. For Images - Use CldImage Component

```tsx
import { CldImage } from 'next-cloudinary';

// Replace this:
<Image src="/IMAGES/photo.jpg" alt="..." width={800} height={600} />

// With this:
<CldImage 
  src="photo" 
  alt="..." 
  width={800} 
  height={600}
  crop="fill"
  gravity="auto"
  quality="auto"
  format="auto"
/>
```

## Video Optimization Parameters

Cloudinary automatically applies these optimizations:

- `q_auto` - Automatic quality adjustment
- `f_auto` - Automatic format selection (WebM for Chrome, MP4 for Safari)
- `vc_auto` - Automatic video codec selection

### Advanced Video Optimization

For even better performance:

```html
<source 
  src={`https://res.cloudinary.com/${cloudName}/video/upload/q_auto:low,f_auto,vc_auto/banner-video-v3.mp4`}
  type="video/mp4" 
/>
```

Parameters explained:
- `q_auto:low` - Lower quality, faster loading (still looks great!)
- `f_auto` - Automatic format
- `vc_auto` - Automatic codec

## Expected File Size Reduction
- Original: 18 MB
- With Cloudinary: 3-6 MB (70-80% reduction!)
- Load time: Reduced by 60-80%

## Monitoring Usage
1. Go to Cloudinary Dashboard
2. Check **Account** → **Usage**
3. Monitor your monthly bandwidth

## Pro Tips
1. **Lazy load images** below the fold
2. Use **responsive breakpoints** for different devices
3. Enable **automatic format** conversion (WebP, AVIF)
4. Use **progressive loading** for images


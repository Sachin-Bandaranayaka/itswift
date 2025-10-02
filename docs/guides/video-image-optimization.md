# Complete Video & Image Optimization Guide

## Current Issues
- Video: 18 MB (too large for web)
- Images: Not optimized for different screen sizes
- No CDN = Slow global delivery

## Immediate Optimizations (No CDN Required)

### 1. Video Compression

#### Option A: FFmpeg (Best Quality/Size Ratio)

Install FFmpeg, then run:

```bash
# High quality, smaller file (recommended)
ffmpeg -i "Banner Video V3.mp4" -c:v libx264 -crf 28 -preset slow -c:a aac -b:a 128k -movflags +faststart "Banner-Video-Optimized.mp4"

# Even smaller file (acceptable quality)
ffmpeg -i "Banner Video V3.mp4" -c:v libx264 -crf 32 -preset slow -c:a aac -b:a 96k -movflags +faststart "Banner-Video-Small.mp4"
```

Parameters explained:
- `-crf 28` - Quality (18=best, 32=smaller file)
- `-preset slow` - Better compression
- `-movflags +faststart` - Fast streaming start
- Target size: 3-6 MB

#### Option B: Online Tools (Easiest)

1. **CloudConvert.com** (FREE)
   - Upload your video
   - Select "MP4" output
   - Set quality to 70-80%
   - Enable "Web optimized"

2. **FreeConvert.com** (FREE)
   - Similar process
   - Can compress up to 1GB files

### 2. Create Video Poster Image

Create a poster image (first frame of video) to show while loading:

```bash
ffmpeg -i "Banner Video V3.mp4" -ss 00:00:00 -vframes 1 -q:v 2 "public/video-poster.jpg"
```

Then optimize with:
- **TinyPNG.com** (reduces by 70%)
- **Squoosh.app** (Google's tool)

### 3. Image Optimization Strategy

#### For All Images in Your Site:

**Before uploading:**
1. Compress with [TinyPNG.com](https://tinypng.com/)
2. Convert to WebP format with [Squoosh.app](https://squoosh.app/)
3. Create multiple sizes for responsive loading

**In Next.js Code:**

```tsx
import Image from 'next/image';

// ✅ GOOD - Optimized
<Image 
  src="/IMAGES/photo.jpg"
  alt="Description"
  width={1200}
  height={800}
  quality={80}
  priority={true} // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..." // Low quality placeholder
  loading="lazy" // For below-the-fold images
/>

// ❌ BAD - Not optimized
<img src="/IMAGES/photo.jpg" alt="Description" />
```

### 4. Implement Progressive Loading

Update your image components:

```tsx
// components/optimized-image.tsx
import Image from 'next/image';

export function OptimizedImage({ src, alt, ...props }) {
  const [isLoading, setLoading] = useState(true);
  
  return (
    <div className="relative overflow-hidden">
      <Image
        src={src}
        alt={alt}
        onLoadingComplete={() => setLoading(false)}
        className={`
          duration-700 ease-in-out
          ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
        `}
        {...props}
      />
    </div>
  );
}
```

## Performance Checklist

### Video Optimization
- [ ] Compress video to under 5 MB
- [ ] Add poster image
- [ ] Use `preload="auto"` for hero video
- [ ] Add proper caching headers
- [ ] Consider using Cloudflare/Cloudinary

### Image Optimization
- [ ] Use Next.js Image component
- [ ] Add `priority` to above-the-fold images
- [ ] Use `loading="lazy"` for below-the-fold images
- [ ] Compress all images with TinyPNG
- [ ] Enable WebP format in next.config.mjs
- [ ] Add blur placeholders for smooth loading

### CDN Setup
- [ ] Set up Cloudflare (FREE, unlimited)
- [ ] OR set up Cloudinary (FREE, 25GB/month)
- [ ] Configure caching rules
- [ ] Enable compression

## Expected Results

| Asset Type | Before | After | Improvement |
|------------|--------|-------|-------------|
| Hero Video | 18 MB  | 3-6 MB | 70-80% smaller |
| Images     | Various | 50-70% smaller | WebP + compression |
| Load Time  | 5-8s   | <2s   | 75% faster |

## Testing Your Optimizations

1. **Google PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Test your homepage
   - Target: 90+ score

2. **WebPageTest**
   - URL: https://www.webpagetest.org/
   - Test from multiple locations
   - Check video load time

3. **Browser DevTools**
   - Open Network tab
   - Reload page
   - Check video/image sizes and load times

## Monitoring

Add performance monitoring:

```tsx
// Track video load time
const videoStartTime = performance.now();

video.addEventListener('loadeddata', () => {
  const loadTime = performance.now() - videoStartTime;
  console.log(`Video loaded in ${loadTime}ms`);
  
  // Send to analytics
  if (window.gtag) {
    gtag('event', 'video_load_time', {
      value: loadTime,
      event_category: 'Performance'
    });
  }
});
```


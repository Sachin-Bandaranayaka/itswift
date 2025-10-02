# URL Mapping & Redirect Configuration

## Site Migration: www.itswift.com → itswift-eta.vercel.app

### Public Pages URL Mapping

| Old URL (www.itswift.com) | New URL (itswift-eta.vercel.app) | Priority |
|---------------------------|-----------------------------------|----------|
| `/` | `/` | 1.0 |
| `/about-us/` | `/about-us/` | 0.9 |
| `/contact/` | `/contact/` | 0.9 |
| `/quote/` | `/quote/` | 0.9 |
| `/awards/` | `/awards/` | 0.8 |
| `/case-studies/` | `/case-studies/` | 0.8 |
| `/blog/` | `/blog/` | 0.9 |
| `/blog/[slug]/` | `/blog/[slug]/` | 0.8 |
| `/privacy-policy/` | `/privacy-policy/` | 0.7 |
| `/unsubscribe/` | `/unsubscribe/` | 0.5 |

### E-Learning Services Pages

| Old URL | New URL | Priority |
|---------|---------|----------|
| `/elearning-services/` | `/elearning-services/` | 0.9 |
| `/elearning-services/custom-elearning/` | `/elearning-services/custom-elearning/` | 0.9 |
| `/elearning-services/rapid-elearning/` | `/elearning-services/rapid-elearning/` | 0.8 |
| `/elearning-services/micro-learning/` | `/elearning-services/micro-learning/` | 0.8 |
| `/elearning-services/game-based-elearning/` | `/elearning-services/game-based-elearning/` | 0.8 |
| `/elearning-services/video-based-training/` | `/elearning-services/video-based-training/` | 0.8 |
| `/elearning-services/ilt-to-elearning/` | `/elearning-services/ilt-to-elearning/` | 0.8 |
| `/elearning-services/webinar-to-elearning/` | `/elearning-services/webinar-to-elearning/` | 0.8 |
| `/elearning-services/convert-flash-to-html/` | `/elearning-services/convert-flash-to-html/` | 0.7 |
| `/elearning-services/translation-localization/` | `/elearning-services/translation-localization/` | 0.7 |
| `/elearning-services/elearning-translation-localization/` | `/elearning-services/elearning-translation-localization/` | 0.7 |
| `/elearning-services/on-boarding/` | `/elearning-services/on-boarding/` | 0.8 |
| `/elearning-services/ai-powered-solutions/` | `/elearning-services/ai-powered-solutions/` | 0.8 |

### E-Learning Solutions Pages

| Old URL | New URL | Priority |
|---------|---------|----------|
| `/elearning-solutions/` | `/elearning-solutions/` | 0.8 |
| `/elearning-solutions/compliance/` | `/elearning-solutions/compliance/` | 0.8 |
| `/elearning-solutions/on-boarding/` | `/elearning-solutions/on-boarding/` | 0.8 |
| `/elearning-solutions/sales-enablement/` | `/elearning-solutions/sales-enablement/` | 0.8 |

### E-Learning Consultancy Pages

| Old URL | New URL | Priority |
|---------|---------|----------|
| `/elearning-consultancy/` | `/elearning-consultancy/` | 0.8 |
| `/elearning-consultancy/instructional-design/` | `/elearning-consultancy/instructional-design/` | 0.8 |
| `/elearning-consultancy/lms-implementation/` | `/elearning-consultancy/lms-implementation/` | 0.8 |

### Admin Pages (Protected - No Public Redirects)

| Old URL | New URL | Notes |
|---------|---------|-------|
| `/admin/` | `/admin/` | Protected area |
| `/admin/login/` | `/admin/login/` | Auth page |
| `/admin/blog/` | `/admin/blog/` | Admin only |
| `/admin/analytics/` | `/admin/analytics/` | Admin only |
| `/admin/social/` | `/admin/social/` | Admin only |
| `/admin/newsletter/` | `/admin/newsletter/` | Admin only |

## Next.js Redirect Configuration

Create or update `next.config.mjs` with the following redirects:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Legacy URL redirects (if any old URLs need mapping)
      {
        source: '/services/:path*',
        destination: '/elearning-services/:path*',
        permanent: true, // 301 redirect
      },
      {
        source: '/solutions/:path*',
        destination: '/elearning-solutions/:path*',
        permanent: true,
      },
      {
        source: '/consultancy/:path*',
        destination: '/elearning-consultancy/:path*',
        permanent: true,
      },
      // Add more specific redirects as needed
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

## Vercel Redirects (Alternative Method)

Create `vercel.json` in project root:

```json
{
  "redirects": [
    {
      "source": "/services/(.*)",
      "destination": "/elearning-services/$1",
      "permanent": true
    },
    {
      "source": "/solutions/(.*)",
      "destination": "/elearning-solutions/$1",
      "permanent": true
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=600"
        }
      ]
    }
  ]
}
```

## Testing Redirects

1. **Staging Testing Commands:**
   ```bash
   curl -I https://itswift-eta.vercel.app/services/custom-elearning
   # Should return 301 redirect to /elearning-services/custom-elearning
   
   curl -I https://itswift-eta.vercel.app/elearning-services/custom-elearning
   # Should return 200 OK
   ```

2. **Browser Testing:**
   - Test each redirect manually
   - Verify final destination loads correctly
   - Check that redirect is 301 (permanent)

## Notes

- All redirects should be 301 (permanent) for SEO value transfer
- Admin routes are protected and don't need public redirects
- API routes are not included in public sitemap
- Studio routes are for Sanity CMS admin
- Blog dynamic routes `[slug]` will be handled by Next.js routing
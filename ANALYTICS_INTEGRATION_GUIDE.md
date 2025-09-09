# Analytics Integration Guide for itswift.com

## Overview
This guide covers the integration of Google Analytics 4 (GA4), Google Tag Manager (GTM), and Microsoft Clarity for comprehensive tracking and analytics.

## 1. Google Analytics 4 (GA4) Setup

### Environment Variables
Add these to your Vercel environment variables:

```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Your GA4 Measurement ID
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX  # Your GTM Container ID
NEXT_PUBLIC_CLARITY_ID=XXXXXXXX # Your Microsoft Clarity Project ID
```

### Implementation in Next.js

#### 1. Create Analytics Component
Create `components/analytics/GoogleAnalytics.tsx`:

```tsx
'use client'

import Script from 'next/script'

interface GoogleAnalyticsProps {
  gaId: string
}

export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  )
}
```

#### 2. Create GTM Component
Create `components/analytics/GoogleTagManager.tsx`:

```tsx
'use client'

import Script from 'next/script'

interface GoogleTagManagerProps {
  gtmId: string
}

export default function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  return (
    <>
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  )
}
```

#### 3. Create Microsoft Clarity Component
Create `components/analytics/MicrosoftClarity.tsx`:

```tsx
'use client'

import Script from 'next/script'

interface MicrosoftClarityProps {
  clarityId: string
}

export default function MicrosoftClarity({ clarityId }: MicrosoftClarityProps) {
  return (
    <Script
      id="microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarityId}");
        `,
      }}
    />
  )
}
```

#### 4. Update Root Layout
Update `app/layout.tsx`:

```tsx
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import GoogleTagManager from '@/components/analytics/GoogleTagManager'
import MicrosoftClarity from '@/components/analytics/MicrosoftClarity'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID

  return (
    <html lang="en">
      <head>
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
      </head>
      <body>
        {children}
        {gaId && <GoogleAnalytics gaId={gaId} />}
        {clarityId && <MicrosoftClarity clarityId={clarityId} />}
      </body>
    </html>
  )
}
```

## 2. Event Tracking Setup

### Create Analytics Utility
Create `lib/analytics.ts`:

```typescript
// Google Analytics 4 Event Tracking
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}

// Common event tracking functions
export const trackPageView = (url: string) => {
  trackEvent('page_view', {
    page_location: url,
    page_title: document.title,
  })
}

export const trackContactForm = (formType: string) => {
  trackEvent('contact_form_submit', {
    form_type: formType,
    event_category: 'engagement',
  })
}

export const trackQuoteRequest = () => {
  trackEvent('quote_request', {
    event_category: 'conversion',
    value: 1,
  })
}

export const trackServiceView = (serviceName: string) => {
  trackEvent('service_view', {
    service_name: serviceName,
    event_category: 'engagement',
  })
}

export const trackDownload = (fileName: string) => {
  trackEvent('file_download', {
    file_name: fileName,
    event_category: 'engagement',
  })
}

export const trackNewsletterSignup = () => {
  trackEvent('newsletter_signup', {
    event_category: 'conversion',
    value: 1,
  })
}

// Microsoft Clarity custom events
export const trackClarityEvent = (eventName: string, data?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('event', eventName, data)
  }
}
```

### Add Type Definitions
Create or update `types/analytics.d.ts`:

```typescript
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
    dataLayer: Record<string, any>[]
    clarity: (command: string, ...args: any[]) => void
  }
}

export {}
```

## 3. Conversion Tracking

### Contact Form Tracking
Add to your contact form component:

```tsx
import { trackContactForm, trackClarityEvent } from '@/lib/analytics'

const handleSubmit = async (formData: FormData) => {
  try {
    // Submit form logic here
    
    // Track successful submission
    trackContactForm('main_contact')
    trackClarityEvent('contact_form_success', {
      form_location: 'contact_page'
    })
  } catch (error) {
    // Track form errors
    trackClarityEvent('contact_form_error', {
      error_type: 'submission_failed'
    })
  }
}
```

### Quote Request Tracking
Add to your quote form:

```tsx
import { trackQuoteRequest } from '@/lib/analytics'

const handleQuoteSubmit = async () => {
  // Submit quote logic
  trackQuoteRequest()
}
```

## 4. Enhanced E-commerce Tracking

### Service Page Views
Add to service pages:

```tsx
import { trackServiceView } from '@/lib/analytics'
import { useEffect } from 'react'

export default function ServicePage({ serviceName }: { serviceName: string }) {
  useEffect(() => {
    trackServiceView(serviceName)
  }, [serviceName])
  
  return (
    // Your service page content
  )
}
```

## 5. Privacy and Compliance

### Cookie Consent (Optional)
Create `components/CookieConsent.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowConsent(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowConsent(false)
    
    // Enable analytics after consent
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      })
    }
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <p className="text-sm">
          We use cookies to improve your experience and analyze site usage.
        </p>
        <button
          onClick={acceptCookies}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
```

## 6. Testing and Verification

### Development Testing
1. **GA4 Real-time Reports**: Check Google Analytics real-time reports
2. **GTM Preview Mode**: Use GTM's preview and debug mode
3. **Clarity Session Recordings**: Verify recordings are capturing
4. **Browser DevTools**: Check for analytics script loading

### Production Verification
1. **Google Tag Assistant**: Browser extension for verification
2. **GA4 DebugView**: Real-time event debugging
3. **Search Console**: Verify tracking is working

## 7. Deployment Steps

1. **Set Environment Variables in Vercel**:
   ```bash
   vercel env add NEXT_PUBLIC_GA_ID
   vercel env add NEXT_PUBLIC_GTM_ID
   vercel env add NEXT_PUBLIC_CLARITY_ID
   ```

2. **Deploy and Test**:
   ```bash
   npm run build
   vercel --prod
   ```

3. **Verify Analytics**:
   - Check GA4 real-time reports
   - Test event tracking
   - Verify Clarity recordings

## 8. Additional Tracking Pixels

### LinkedIn Insight Tag
```tsx
<Script
  id="linkedin-insight"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      _linkedin_partner_id = "YOUR_PARTNER_ID";
      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
      window._linkedin_data_partner_ids.push(_linkedin_partner_id);
    `,
  }}
/>
<Script
  strategy="afterInteractive"
  src="https://snap.licdn.com/li.lms-analytics/insight.min.js"
/>
```

### Meta Pixel
```tsx
<Script
  id="meta-pixel"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{
    __html: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', 'YOUR_PIXEL_ID');
      fbq('track', 'PageView');
    `,
  }}
/>
```

## Notes

- Always test analytics in staging before production
- Use environment variables for all tracking IDs
- Implement proper error handling for analytics failures
- Consider GDPR/CCPA compliance requirements
- Monitor Core Web Vitals impact of analytics scripts
- Use Next.js Script component for optimal loading
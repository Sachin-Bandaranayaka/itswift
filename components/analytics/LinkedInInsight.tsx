'use client'

import Script from 'next/script'
import { useEffect } from 'react'

interface LinkedInInsightProps {
  partnerId: string
}

export default function LinkedInInsight({ partnerId }: LinkedInInsightProps) {
  useEffect(() => {
    // Initialize LinkedIn tracking after component mounts
    if (typeof window !== 'undefined') {
      window._linkedin_partner_id = partnerId;
      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
      window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
      
      // Trigger the tracking pixel immediately after initialization
      if (window.lintrk) {
        window.lintrk('track', { conversion_id: partnerId });
      }
    }
  }, [partnerId]);

  return (
    <>
      <Script
        id="linkedin-insight-script"
        strategy="lazyOnload"
        src="https://snap.licdn.com/li.lms-analytics/insight.min.js"
        onLoad={() => {
          // Ensure tracking fires immediately when script loads
          if (window.lintrk && partnerId) {
            window.lintrk('track', { conversion_id: partnerId });
          }
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://px.ads.linkedin.com/collect/?pid=${partnerId}&fmt=gif`}
        />
      </noscript>
    </>
  )
}
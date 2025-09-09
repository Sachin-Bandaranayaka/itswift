// Analytics utility functions for event tracking

// Google Analytics event tracking
export const trackGAEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// LinkedIn conversion tracking
export const trackLinkedInConversion = (conversionId: string) => {
  if (typeof window !== 'undefined' && window.lintrk) {
    window.lintrk('track', { conversion_id: conversionId })
  }
}

// Microsoft Clarity custom events
export const trackClarityEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.clarity) {
    window.clarity('event', eventName, properties)
  }
}

// Common tracking events
export const analytics = {
  // Page view tracking
  pageView: (url: string) => {
    trackGAEvent('page_view', 'engagement', url)
  },

  // Form submissions
  formSubmit: (formName: string) => {
    trackGAEvent('form_submit', 'engagement', formName)
    trackClarityEvent('form_submit', { form_name: formName })
  },

  // Button clicks
  buttonClick: (buttonName: string, location?: string) => {
    trackGAEvent('click', 'engagement', buttonName)
    trackClarityEvent('button_click', { button_name: buttonName, location })
  },

  // Download tracking
  downloadFile: (fileName: string, fileType: string) => {
    trackGAEvent('file_download', 'engagement', fileName)
    trackClarityEvent('file_download', { file_name: fileName, file_type: fileType })
  },

  // Contact form submissions
  contactFormSubmit: (formType: string) => {
    trackGAEvent('contact_form_submit', 'lead_generation', formType)
    trackLinkedInConversion('contact_form')
    trackClarityEvent('contact_form_submit', { form_type: formType })
  },

  // Demo requests
  demoRequest: () => {
    trackGAEvent('demo_request', 'lead_generation', 'demo_form')
    trackLinkedInConversion('demo_request')
    trackClarityEvent('demo_request')
  },

  // Newsletter signup
  newsletterSignup: () => {
    trackGAEvent('newsletter_signup', 'engagement', 'newsletter_form')
    trackClarityEvent('newsletter_signup')
  },

  // Case study views
  caseStudyView: (caseStudyTitle: string) => {
    trackGAEvent('case_study_view', 'content', caseStudyTitle)
    trackClarityEvent('case_study_view', { title: caseStudyTitle })
  },

  // Blog post views
  blogPostView: (postTitle: string) => {
    trackGAEvent('blog_post_view', 'content', postTitle)
    trackClarityEvent('blog_post_view', { title: postTitle })
  },

  // Service page views
  servicePageView: (serviceName: string) => {
    trackGAEvent('service_page_view', 'content', serviceName)
    trackClarityEvent('service_page_view', { service: serviceName })
  },
}
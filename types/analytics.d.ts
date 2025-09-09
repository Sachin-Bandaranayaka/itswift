// TypeScript definitions for analytics globals

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: {
        page_title?: string
        page_location?: string
        event_category?: string
        event_label?: string
        value?: number
        [key: string]: any
      }
    ) => void
    
    lintrk: (
      command: 'track',
      config?: {
        conversion_id?: string
        [key: string]: any
      }
    ) => void & {
      q: any[]
    }
    
    clarity: (
      command: 'event',
      eventName: string,
      properties?: Record<string, any>
    ) => void
    
    dataLayer: any[]
    _linkedin_partner_id: string
    _linkedin_data_partner_ids: string[]
  }
}

export {}
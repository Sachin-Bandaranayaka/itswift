// Database types and interfaces for the admin content automation system

export interface SocialPost {
  id: string
  platform: 'linkedin' | 'twitter'
  content: string
  media_urls?: string[]
  scheduled_at?: string
  published_at?: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  engagement_metrics?: EngagementMetrics
  created_at: string
  updated_at: string
}

export interface SocialPostInput {
  platform: 'linkedin' | 'twitter'
  content: string
  media_urls?: string[]
  scheduled_at?: string
  status?: 'draft' | 'scheduled' | 'published' | 'failed'
  engagement_metrics?: EngagementMetrics
}

export interface SocialPostUpdate {
  platform?: 'linkedin' | 'twitter'
  content?: string
  media_urls?: string[]
  scheduled_at?: string
  published_at?: string
  status?: 'draft' | 'scheduled' | 'published' | 'failed'
  engagement_metrics?: EngagementMetrics
}

export interface EngagementMetrics {
  views?: number
  likes?: number
  shares?: number
  comments?: number
  clicks?: number
}

export interface NewsletterSubscriber {
  id: string
  email: string
  first_name?: string
  last_name?: string
  status: 'active' | 'unsubscribed' | 'bounced'
  subscribed_at: string
  unsubscribed_at?: string
  tags?: string[]
}

export interface NewsletterSubscriberInput {
  email: string
  first_name?: string
  last_name?: string
  status?: 'active' | 'unsubscribed' | 'bounced'
  tags?: string[]
}

export interface NewsletterSubscriberUpdate {
  email?: string
  first_name?: string
  last_name?: string
  status?: 'active' | 'unsubscribed' | 'bounced'
  unsubscribed_at?: string
  tags?: string[]
}

export interface NewsletterCampaign {
  id: string
  subject: string
  content: string
  template_id?: string
  scheduled_at?: string
  sent_at?: string
  status: 'draft' | 'scheduled' | 'sent' | 'failed'
  recipient_count: number
  open_rate?: number
  click_rate?: number
  created_at: string
}

export interface NewsletterCampaignInput {
  subject: string
  content: string
  template_id?: string
  scheduled_at?: string
  status?: 'draft' | 'scheduled' | 'sent' | 'failed'
  recipient_count?: number
}

export interface NewsletterCampaignUpdate {
  subject?: string
  content?: string
  template_id?: string
  scheduled_at?: string
  sent_at?: string
  status?: 'draft' | 'scheduled' | 'sent' | 'failed'
  recipient_count?: number
  open_rate?: number
  click_rate?: number
}

export interface ContentAnalytics {
  id: string
  content_type: 'blog' | 'social' | 'newsletter'
  content_id: string
  platform?: string
  views: number
  likes: number
  shares: number
  comments: number
  clicks: number
  recorded_at: string
}

export interface ContentAnalyticsInput {
  content_type: 'blog' | 'social' | 'newsletter'
  content_id: string
  platform?: string
  views?: number
  likes?: number
  shares?: number
  comments?: number
  clicks?: number
}

export interface ContentAnalyticsUpdate {
  content_type?: 'blog' | 'social' | 'newsletter'
  content_id?: string
  platform?: string
  views?: number
  likes?: number
  shares?: number
  comments?: number
  clicks?: number
}

export interface AIContentLog {
  id: string
  prompt: string
  generated_content: string
  content_type: string
  tokens_used?: number
  created_at: string
}

export interface AIContentLogInput {
  prompt: string
  generated_content: string
  content_type: string
  tokens_used?: number
}

// Validation schemas
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Query options
export interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
}

export interface FilterOptions {
  status?: string
  platform?: string
  content_type?: string
  date_from?: string
  date_to?: string
}
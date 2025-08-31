import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
}

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations')
}

// Client for browser/client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations with elevated privileges
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      social_posts: {
        Row: {
          id: string
          platform: 'linkedin' | 'twitter'
          content: string
          media_urls: string[] | null
          scheduled_at: string | null
          published_at: string | null
          status: 'draft' | 'scheduled' | 'published' | 'failed'
          engagement_metrics: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          platform: 'linkedin' | 'twitter'
          content: string
          media_urls?: string[] | null
          scheduled_at?: string | null
          published_at?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'failed'
          engagement_metrics?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          platform?: 'linkedin' | 'twitter'
          content?: string
          media_urls?: string[] | null
          scheduled_at?: string | null
          published_at?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'failed'
          engagement_metrics?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          status: 'active' | 'unsubscribed' | 'bounced'
          subscribed_at: string
          unsubscribed_at: string | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          status?: 'active' | 'unsubscribed' | 'bounced'
          subscribed_at?: string
          unsubscribed_at?: string | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          status?: 'active' | 'unsubscribed' | 'bounced'
          subscribed_at?: string
          unsubscribed_at?: string | null
          tags?: string[] | null
        }
      }
      newsletter_campaigns: {
        Row: {
          id: string
          subject: string
          content: string
          template_id: string | null
          scheduled_at: string | null
          sent_at: string | null
          status: 'draft' | 'scheduled' | 'sent' | 'failed'
          recipient_count: number
          open_rate: number | null
          click_rate: number | null
          created_at: string
        }
        Insert: {
          id?: string
          subject: string
          content: string
          template_id?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: 'draft' | 'scheduled' | 'sent' | 'failed'
          recipient_count?: number
          open_rate?: number | null
          click_rate?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          subject?: string
          content?: string
          template_id?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: 'draft' | 'scheduled' | 'sent' | 'failed'
          recipient_count?: number
          open_rate?: number | null
          click_rate?: number | null
          created_at?: string
        }
      }
      content_analytics: {
        Row: {
          id: string
          content_type: 'blog' | 'social' | 'newsletter'
          content_id: string
          platform: string | null
          views: number
          likes: number
          shares: number
          comments: number
          clicks: number
          recorded_at: string
        }
        Insert: {
          id?: string
          content_type: 'blog' | 'social' | 'newsletter'
          content_id: string
          platform?: string | null
          views?: number
          likes?: number
          shares?: number
          comments?: number
          clicks?: number
          recorded_at?: string
        }
        Update: {
          id?: string
          content_type?: 'blog' | 'social' | 'newsletter'
          content_id?: string
          platform?: string | null
          views?: number
          likes?: number
          shares?: number
          comments?: number
          clicks?: number
          recorded_at?: string
        }
      }
      ai_content_log: {
        Row: {
          id: string
          prompt: string
          generated_content: string
          content_type: string
          tokens_used: number | null
          created_at: string
        }
        Insert: {
          id?: string
          prompt: string
          generated_content: string
          content_type: string
          tokens_used?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          prompt?: string
          generated_content?: string
          content_type?: string
          tokens_used?: number | null
          created_at?: string
        }
      }
    }
  }
}
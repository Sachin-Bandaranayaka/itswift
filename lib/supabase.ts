import { createClient } from '@supabase/supabase-js'

// Lazy initialization to prevent build-time errors
let supabaseClient: ReturnType<typeof createClient> | null = null
let supabaseAdminClient: ReturnType<typeof createClient> | null = null

function getPublicSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
  }

  if (!supabaseAnonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
  }

  return { supabaseUrl, supabaseAnonKey }
}

function getServiceSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
  }

  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin operations')
  }

  return { supabaseUrl, supabaseServiceKey }
}

// Client for browser/client-side operations
export function getSupabase() {
  if (!supabaseClient) {
    const { supabaseUrl, supabaseAnonKey } = getPublicSupabaseConfig()
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}

// Admin client for server-side operations with elevated privileges
export function getSupabaseAdmin() {
  if (!supabaseAdminClient) {
    const { supabaseUrl, supabaseServiceKey } = getServiceSupabaseConfig()
    supabaseAdminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return supabaseAdminClient
}

// Legacy exports for backward compatibility - use getter functions instead
// These are commented out to prevent build-time initialization
// Use getSupabase() and getSupabaseAdmin() instead

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          id: string
          first_name: string
          last_name: string | null
          email: string
          phone: string | null
          company: string | null
          message: string
          status: 'new' | 'in_progress' | 'resolved' | 'closed'
          submitted_at: string
          responded_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name?: string | null
          email: string
          phone?: string | null
          company?: string | null
          message: string
          status?: 'new' | 'in_progress' | 'resolved' | 'closed'
          submitted_at?: string
          responded_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string | null
          email?: string
          phone?: string | null
          company?: string | null
          message?: string
          status?: 'new' | 'in_progress' | 'resolved' | 'closed'
          submitted_at?: string
          responded_at?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
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
          source: 'homepage' | 'admin' | 'import' | 'api'
          unsubscribe_token: string | null
          brevo_contact_id: string | null
          last_synced_at: string | null
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
          source?: 'homepage' | 'admin' | 'import' | 'api'
          unsubscribe_token?: string | null
          brevo_contact_id?: string | null
          last_synced_at?: string | null
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
          source?: 'homepage' | 'admin' | 'import' | 'api'
          unsubscribe_token?: string | null
          brevo_contact_id?: string | null
          last_synced_at?: string | null
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
      pages: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      page_content_sections: {
        Row: {
          id: string
          page_id: string | null
          section_key: string
          section_type: string | null
          content: string
          content_html: string | null
          display_order: number | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          page_id?: string | null
          section_key: string
          section_type?: string | null
          content: string
          content_html?: string | null
          display_order?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          page_id?: string | null
          section_key?: string
          section_type?: string | null
          content?: string
          content_html?: string | null
          display_order?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      page_content_versions: {
        Row: {
          id: string
          section_id: string | null
          content: string
          content_html: string | null
          version_number: number
          status: string | null
          created_by: string | null
          created_at: string | null
          published_at: string | null
        }
        Insert: {
          id?: string
          section_id?: string | null
          content: string
          content_html?: string | null
          version_number: number
          status?: string | null
          created_by?: string | null
          created_at?: string | null
          published_at?: string | null
        }
        Update: {
          id?: string
          section_id?: string | null
          content?: string
          content_html?: string | null
          version_number?: number
          status?: string | null
          created_by?: string | null
          created_at?: string | null
          published_at?: string | null
        }
      }
      blog_authors: {
        Row: {
          id: string
          name: string
          slug: string
          bio: string | null
          avatar_url: string | null
          email: string | null
          social_links: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          bio?: string | null
          avatar_url?: string | null
          email?: string | null
          social_links?: any | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          bio?: string | null
          avatar_url?: string | null
          email?: string | null
          social_links?: any | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          color?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          featured_image_url: string | null
          author_id: string
          category_id: string | null
          status: 'draft' | 'published' | 'archived'
          is_featured: boolean
          view_count: number
          published_at: string | null
          meta_title: string | null
          meta_description: string | null
          meta_keywords: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          featured_image_url?: string | null
          author_id: string
          category_id?: string | null
          status?: 'draft' | 'published' | 'archived'
          is_featured?: boolean
          view_count?: number
          published_at?: string | null
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          featured_image_url?: string | null
          author_id?: string
          category_id?: string | null
          status?: 'draft' | 'published' | 'archived'
          is_featured?: boolean
          view_count?: number
          published_at?: string | null
          meta_title?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
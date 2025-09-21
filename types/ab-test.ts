// TypeScript interfaces for A/B testing

export interface ABTestVariant {
  id: string
  content: string
  performance_metrics?: {
    views: number
    clicks: number
    conversions: number
    engagement_rate: number
  }
}

export interface ABTest {
  id: string
  name: string
  description: string
  content_type: 'blog' | 'social' | 'newsletter'
  platform?: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'email'
  test_type: 'title' | 'description' | 'cta' | 'full_content'
  status: 'draft' | 'running' | 'paused' | 'completed' | 'archived'
  variants: ABTestVariant[]
  results: ABTestResult[]
  confidence_level: number
  winner?: string
  created_at: string
  started_at?: string
  ended_at?: string
  analyzed_at?: string
  updated_at?: string
}

export interface ABTestFilters {
  status?: 'draft' | 'running' | 'paused' | 'completed' | 'archived'
  content_type?: 'blog' | 'social' | 'newsletter'
  platform?: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'email'
}

export interface ABTestResult {
  variant_id: string
  timestamp: string
  event_type: 'view' | 'click' | 'conversion'
  user_id?: string
  metadata?: Record<string, any>
}

export interface CreateABTestRequest {
  name: string
  description: string
  content_type: ABTest['content_type']
  platform?: ABTest['platform']
  test_type: ABTest['test_type']
  original_content: string
  variant_count?: number
}

export interface ABTestFilters {
  status?: ABTest['status']
  content_type?: ABTest['content_type']
  platform?: ABTest['platform']
}

export interface ABTestAnalysis {
  winner: string
  confidence: number
  insights: string[]
  recommendations: string[]
}
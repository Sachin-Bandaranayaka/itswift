// TypeScript types for automation rules and content templates

export interface ContentTemplate {
  id: string
  name: string
  description?: string
  template_type: 'blog' | 'social' | 'newsletter'
  platform?: 'linkedin' | 'twitter' | 'all'
  content_template: string
  variables: string[] // Variable names that can be replaced in template
  metadata: Record<string, any>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ContentTemplateInput {
  name: string
  description?: string
  template_type: 'blog' | 'social' | 'newsletter'
  platform?: 'linkedin' | 'twitter' | 'all'
  content_template: string
  variables?: string[]
  metadata?: Record<string, any>
  is_active?: boolean
}

export interface ContentTemplateUpdate {
  name?: string
  description?: string
  template_type?: 'blog' | 'social' | 'newsletter'
  platform?: 'linkedin' | 'twitter' | 'all'
  content_template?: string
  variables?: string[]
  metadata?: Record<string, any>
  is_active?: boolean
}

export interface AutomationRule {
  id: string
  name: string
  description?: string
  rule_type: 'content_generation' | 'scheduling' | 'cross_promotion' | 'optimization'
  trigger_type: 'blog_published' | 'time_based' | 'engagement_threshold' | 'manual'
  trigger_conditions: Record<string, any>
  actions: AutomationAction[]
  template_id?: string
  is_active: boolean
  priority: number
  last_executed?: string
  execution_count: number
  created_at: string
  updated_at: string
}

export interface AutomationRuleInput {
  name: string
  description?: string
  rule_type: 'content_generation' | 'scheduling' | 'cross_promotion' | 'optimization'
  trigger_type: 'blog_published' | 'time_based' | 'engagement_threshold' | 'manual'
  trigger_conditions: Record<string, any>
  actions: AutomationAction[]
  template_id?: string
  is_active?: boolean
  priority?: number
}

export interface AutomationRuleUpdate {
  name?: string
  description?: string
  rule_type?: 'content_generation' | 'scheduling' | 'cross_promotion' | 'optimization'
  trigger_type?: 'blog_published' | 'time_based' | 'engagement_threshold' | 'manual'
  trigger_conditions?: Record<string, any>
  actions?: AutomationAction[]
  template_id?: string
  is_active?: boolean
  priority?: number
  last_executed?: string
  execution_count?: number
}

export interface AutomationAction {
  type: 'generate_social_post' | 'generate_newsletter' | 'optimize_posting_time' | 'send_notification' | 'update_analytics'
  platform?: 'linkedin' | 'twitter' | 'all'
  template_id?: string
  schedule_delay_hours?: number
  auto_publish?: boolean
  auto_send?: boolean
  look_ahead_days?: number
  min_engagement_score?: number
  include_blog_posts?: boolean
  include_social_highlights?: boolean
  notification_type?: string
  recipients?: string[]
  [key: string]: any // Allow additional action-specific properties
}

export interface AutomationExecution {
  id: string
  rule_id: string
  trigger_data?: Record<string, any>
  execution_status: 'pending' | 'running' | 'completed' | 'failed'
  result_data?: Record<string, any>
  error_message?: string
  execution_time_ms?: number
  created_content_ids: string[]
  executed_at: string
}

export interface AutomationExecutionInput {
  rule_id: string
  trigger_data?: Record<string, any>
  execution_status?: 'pending' | 'running' | 'completed' | 'failed'
  result_data?: Record<string, any>
  error_message?: string
  execution_time_ms?: number
  created_content_ids?: string[]
}

export interface OptimalPostingTime {
  id: string
  platform: 'linkedin' | 'twitter'
  day_of_week: number // 0 = Sunday, 1 = Monday, etc.
  hour_of_day: number // 0-23
  engagement_score: number
  sample_size: number
  last_updated: string
}

export interface OptimalPostingTimeInput {
  platform: 'linkedin' | 'twitter'
  day_of_week: number
  hour_of_day: number
  engagement_score: number
  sample_size?: number
}

export interface OptimalPostingTimeUpdate {
  platform?: 'linkedin' | 'twitter'
  day_of_week?: number
  hour_of_day?: number
  engagement_score?: number
  sample_size?: number
}

// Template variable replacement context
export interface TemplateContext {
  // Blog-related variables
  title?: string
  summary?: string
  content?: string
  url?: string
  author?: string
  published_date?: string
  categories?: string[]
  tags?: string[]
  key_points?: string[]
  hashtags?: string

  // Social media variables
  platform?: string
  thread_content?: string
  thread_count?: number

  // Newsletter variables
  first_name?: string
  last_name?: string
  email?: string
  week_date?: string
  blog_posts?: string
  social_highlights?: string
  industry_news?: string

  // Analytics variables
  engagement_score?: number
  views?: number
  likes?: number
  shares?: number

  // Custom variables
  [key: string]: any
}

// Automation trigger contexts
export interface BlogPublishedTrigger {
  blog_id: string
  title: string
  slug: string
  content: string
  summary?: string
  author?: string
  categories: string[]
  tags: string[]
  published_at: string
  url: string
}

export interface TimeBasedTrigger {
  scheduled_time: string
  trigger_date: string
  context?: Record<string, any>
}

export interface EngagementThresholdTrigger {
  content_id: string
  content_type: 'blog' | 'social' | 'newsletter'
  platform?: string
  metric_type: 'views' | 'likes' | 'shares' | 'comments' | 'clicks'
  current_value: number
  threshold_value: number
  exceeded_at: string
}

export interface ManualTrigger {
  user_id?: string
  trigger_reason: string
  context?: Record<string, any>
}

// Automation execution results
export interface ContentGenerationResult {
  success: boolean
  content_id?: string
  content_type: 'blog' | 'social' | 'newsletter'
  platform?: string
  content?: string
  scheduled_at?: string
  error?: string
}

export interface SchedulingOptimizationResult {
  success: boolean
  optimized_times: Array<{
    platform: string
    datetime: string
    engagement_score: number
    reason: string
  }>
  applied_to_content_ids: string[]
  error?: string
}

export interface AutomationStats {
  total_rules: number
  active_rules: number
  total_executions: number
  successful_executions: number
  failed_executions: number
  content_generated: number
  by_rule_type: Record<string, number>
  by_trigger_type: Record<string, number>
  recent_executions: AutomationExecution[]
  top_performing_rules: Array<{
    rule_id: string
    rule_name: string
    execution_count: number
    success_rate: number
  }>
}

// Validation and utility types
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings?: string[]
}

export interface AutomationRuleValidation extends ValidationResult {
  trigger_validation: ValidationResult
  actions_validation: ValidationResult[]
  template_validation?: ValidationResult
}

export interface TemplateRenderResult {
  success: boolean
  rendered_content: string
  missing_variables: string[]
  error?: string
}
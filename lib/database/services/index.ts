// Database services index - exports all database service classes

export { SocialPostsService } from './social-posts'
export { NewsletterSubscribersService } from './newsletter-subscribers'
export { NewsletterCampaignsService } from './newsletter-campaigns'
export { ContentAnalyticsService } from './content-analytics'
export { AIContentLogService } from './ai-content-log'
export { AutomationRulesService } from './automation-rules'
export { ContentTemplatesService } from './content-templates'

// Re-export types for convenience
export * from '../types'
export * from '../validation'
export * from '../automation-types'
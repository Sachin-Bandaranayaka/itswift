// Automation Engine Service - Handles rule execution and content automation

import { AutomationRulesService } from '@/lib/database/services/automation-rules'
import { ContentTemplatesService } from '@/lib/database/services/content-templates'
import { SocialPostsService } from '@/lib/database/services/social-posts'
import { NewsletterCampaignsService } from '@/lib/database/services/newsletter-campaigns'
import { 
  AutomationRule, 
  AutomationAction,
  AutomationExecution,
  BlogPublishedTrigger,
  TimeBasedTrigger,
  EngagementThresholdTrigger,
  ManualTrigger,
  ContentGenerationResult,
  SchedulingOptimizationResult,
  TemplateContext
} from '@/lib/database/automation-types'
import { SocialPostInput, NewsletterCampaignInput } from '@/lib/database/types'

interface ExecutionContext {
  trigger_data: any
  rule: AutomationRule
  execution_id?: string
}

interface ExecutionResult {
  success: boolean
  results: any[]
  errors: string[]
  created_content_ids: string[]
  execution_time_ms: number
}

export class AutomationEngine {
  private static instance: AutomationEngine
  private isProcessing: boolean = false
  private executionQueue: Map<string, ExecutionContext> = new Map()

  private constructor() {}

  static getInstance(): AutomationEngine {
    if (!AutomationEngine.instance) {
      AutomationEngine.instance = new AutomationEngine()
    }
    return AutomationEngine.instance
  }

  /**
   * Process blog published trigger
   */
  async processBlogPublishedTrigger(triggerData: BlogPublishedTrigger): Promise<{
    success: boolean
    executed_rules: number
    results: ExecutionResult[]
    errors: string[]
  }> {
    console.log('Processing blog published trigger for:', triggerData.title)

    try {
      // Get active rules for blog published trigger
      const { data: rules, error } = await AutomationRulesService.getActiveRulesByTrigger('blog_published')
      
      if (error) {
        return {
          success: false,
          executed_rules: 0,
          results: [],
          errors: [error]
        }
      }

      const results: ExecutionResult[] = []
      const errors: string[] = []

      // Execute each matching rule
      for (const rule of rules) {
        try {
          // Check if rule conditions match
          if (this.matchesBlogPublishedConditions(rule, triggerData)) {
            console.log(`Executing rule: ${rule.name}`)
            
            const result = await this.executeRule(rule, triggerData)
            results.push(result)

            if (result.success) {
              // Update rule execution count
              await AutomationRulesService.updateExecution(rule.id)
            }
          }
        } catch (error) {
          const errorMsg = `Error executing rule ${rule.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
          console.error(errorMsg)
          errors.push(errorMsg)
        }
      }

      return {
        success: errors.length === 0,
        executed_rules: results.length,
        results,
        errors
      }
    } catch (error) {
      console.error('Error processing blog published trigger:', error)
      return {
        success: false,
        executed_rules: 0,
        results: [],
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }
    }
  }

  /**
   * Process time-based triggers
   */
  async processTimeBasedTriggers(): Promise<{
    success: boolean
    executed_rules: number
    results: ExecutionResult[]
    errors: string[]
  }> {
    console.log('Processing time-based triggers...')

    try {
      // Get active time-based rules
      const { data: rules, error } = await AutomationRulesService.getActiveRulesByTrigger('time_based')
      
      if (error) {
        return {
          success: false,
          executed_rules: 0,
          results: [],
          errors: [error]
        }
      }

      const results: ExecutionResult[] = []
      const errors: string[] = []
      const now = new Date()

      // Execute each matching rule
      for (const rule of rules) {
        try {
          // Check if rule should execute now
          if (this.shouldExecuteTimeBasedRule(rule, now)) {
            console.log(`Executing time-based rule: ${rule.name}`)
            
            const triggerData: TimeBasedTrigger = {
              scheduled_time: now.toISOString(),
              trigger_date: now.toISOString(),
              context: { rule_id: rule.id }
            }
            
            const result = await this.executeRule(rule, triggerData)
            results.push(result)

            if (result.success) {
              // Update rule execution count
              await AutomationRulesService.updateExecution(rule.id)
            }
          }
        } catch (error) {
          const errorMsg = `Error executing time-based rule ${rule.name}: ${error instanceof Error ? error.message : 'Unknown error'}`
          console.error(errorMsg)
          errors.push(errorMsg)
        }
      }

      return {
        success: errors.length === 0,
        executed_rules: results.length,
        results,
        errors
      }
    } catch (error) {
      console.error('Error processing time-based triggers:', error)
      return {
        success: false,
        executed_rules: 0,
        results: [],
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }
    }
  }

  /**
   * Process manual trigger
   */
  async processManualTrigger(
    ruleId: string, 
    triggerData: ManualTrigger
  ): Promise<ExecutionResult> {
    console.log(`Processing manual trigger for rule: ${ruleId}`)

    try {
      // Get the rule
      const { data: rule, error } = await AutomationRulesService.getById(ruleId)
      
      if (error || !rule) {
        return {
          success: false,
          results: [],
          errors: [error || 'Rule not found'],
          created_content_ids: [],
          execution_time_ms: 0
        }
      }

      if (!rule.is_active) {
        return {
          success: false,
          results: [],
          errors: ['Rule is not active'],
          created_content_ids: [],
          execution_time_ms: 0
        }
      }

      // Execute the rule
      const result = await this.executeRule(rule, triggerData)

      if (result.success) {
        // Update rule execution count
        await AutomationRulesService.updateExecution(rule.id)
      }

      return result
    } catch (error) {
      console.error('Error processing manual trigger:', error)
      return {
        success: false,
        results: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        created_content_ids: [],
        execution_time_ms: 0
      }
    }
  }

  /**
   * Execute a single automation rule
   */
  private async executeRule(rule: AutomationRule, triggerData: any): Promise<ExecutionResult> {
    const startTime = Date.now()
    const results: any[] = []
    const errors: string[] = []
    const createdContentIds: string[] = []

    try {
      console.log(`Executing rule: ${rule.name} (${rule.rule_type})`)

      // Execute each action in the rule
      for (let i = 0; i < rule.actions.length; i++) {
        const action = rule.actions[i]
        
        try {
          console.log(`Executing action ${i + 1}/${rule.actions.length}: ${action.type}`)
          
          const actionResult = await this.executeAction(action, triggerData, rule)
          results.push(actionResult)

          // Collect created content IDs
          if (actionResult.success && actionResult.content_id) {
            createdContentIds.push(actionResult.content_id)
          }

          if (!actionResult.success && actionResult.error) {
            errors.push(`Action ${i + 1} failed: ${actionResult.error}`)
          }
        } catch (error) {
          const errorMsg = `Error executing action ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`
          console.error(errorMsg)
          errors.push(errorMsg)
        }
      }

      const executionTime = Date.now() - startTime
      const success = errors.length === 0

      console.log(`Rule execution completed: ${success ? 'SUCCESS' : 'FAILED'} in ${executionTime}ms`)

      return {
        success,
        results,
        errors,
        created_content_ids: createdContentIds,
        execution_time_ms: executionTime
      }
    } catch (error) {
      const executionTime = Date.now() - startTime
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      console.error('Rule execution failed:', errorMsg)

      return {
        success: false,
        results,
        errors: [...errors, errorMsg],
        created_content_ids: createdContentIds,
        execution_time_ms: executionTime
      }
    }
  }

  /**
   * Execute a single action
   */
  private async executeAction(
    action: AutomationAction, 
    triggerData: any, 
    rule: AutomationRule
  ): Promise<any> {
    switch (action.type) {
      case 'generate_social_post':
        return await this.executeGenerateSocialPost(action, triggerData, rule)
      
      case 'generate_newsletter':
        return await this.executeGenerateNewsletter(action, triggerData, rule)
      
      case 'optimize_posting_time':
        return await this.executeOptimizePostingTime(action, triggerData, rule)
      
      case 'send_notification':
        return await this.executeSendNotification(action, triggerData, rule)
      
      case 'update_analytics':
        return await this.executeUpdateAnalytics(action, triggerData, rule)
      
      default:
        return {
          success: false,
          error: `Unknown action type: ${action.type}`
        }
    }
  }

  /**
   * Execute generate social post action
   */
  private async executeGenerateSocialPost(
    action: AutomationAction,
    triggerData: any,
    rule: AutomationRule
  ): Promise<ContentGenerationResult> {
    try {
      const platform = action.platform || 'linkedin'
      
      // Get template if specified
      let template = null
      if (action.template_id) {
        const { data: templateData, error } = await ContentTemplatesService.getById(action.template_id)
        if (error) {
          return { success: false, error: `Template error: ${error}` }
        }
        template = templateData
      } else {
        // Get default template for platform
        const { data: templates } = await ContentTemplatesService.getByTypeAndPlatform('social', platform as any)
        template = templates.find(t => t.platform === platform) || templates[0]
      }

      if (!template) {
        return { success: false, error: 'No suitable template found' }
      }

      // Build template context from trigger data
      const context = this.buildTemplateContext(triggerData, action)
      
      // Render template
      const renderResult = ContentTemplatesService.renderTemplate(template, context)
      if (!renderResult.success) {
        return { success: false, error: renderResult.error || 'Template rendering failed' }
      }

      // Calculate scheduled time
      let scheduledAt: string | undefined
      if (action.schedule_delay_hours && action.schedule_delay_hours > 0) {
        const scheduleTime = new Date()
        scheduleTime.setHours(scheduleTime.getHours() + action.schedule_delay_hours)
        scheduledAt = scheduleTime.toISOString()
      }

      // Create social post
      const postInput: SocialPostInput = {
        platform: platform as 'linkedin' | 'twitter',
        content: renderResult.rendered_content,
        scheduled_at: scheduledAt,
        status: action.auto_publish ? 'scheduled' : 'draft'
      }

      const { data: post, error } = await SocialPostsService.create(postInput)
      if (error || !post) {
        return { success: false, error: error || 'Failed to create social post' }
      }

      return {
        success: true,
        content_id: post.id,
        content_type: 'social',
        platform: platform,
        content: renderResult.rendered_content,
        scheduled_at: scheduledAt
      }
    } catch (error) {
      console.error('Error generating social post:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Execute generate newsletter action
   */
  private async executeGenerateNewsletter(
    action: AutomationAction,
    triggerData: any,
    rule: AutomationRule
  ): Promise<ContentGenerationResult> {
    try {
      // Get template if specified
      let template = null
      if (action.template_id) {
        const { data: templateData, error } = await ContentTemplatesService.getById(action.template_id)
        if (error) {
          return { success: false, error: `Template error: ${error}` }
        }
        template = templateData
      } else {
        // Get default newsletter template
        const { data: templates } = await ContentTemplatesService.getByTypeAndPlatform('newsletter')
        template = templates[0]
      }

      if (!template) {
        return { success: false, error: 'No suitable newsletter template found' }
      }

      // Build template context
      const context = this.buildTemplateContext(triggerData, action)
      
      // Add newsletter-specific context
      if (action.include_blog_posts) {
        // This would typically fetch recent blog posts
        context.blog_posts = 'Recent blog posts would be listed here'
      }
      
      if (action.include_social_highlights) {
        // This would typically fetch top social media posts
        context.social_highlights = 'Top social media highlights would be listed here'
      }

      // Render template
      const renderResult = ContentTemplatesService.renderTemplate(template, context)
      if (!renderResult.success) {
        return { success: false, error: renderResult.error || 'Template rendering failed' }
      }

      // Create newsletter campaign
      const campaignInput: NewsletterCampaignInput = {
        subject: `Newsletter - ${new Date().toLocaleDateString()}`,
        content: renderResult.rendered_content,
        status: action.auto_send ? 'scheduled' : 'draft',
        recipient_count: 0 // Would be calculated based on active subscribers
      }

      const { data: campaign, error } = await NewsletterCampaignsService.create(campaignInput)
      if (error || !campaign) {
        return { success: false, error: error || 'Failed to create newsletter campaign' }
      }

      return {
        success: true,
        content_id: campaign.id,
        content_type: 'newsletter',
        content: renderResult.rendered_content
      }
    } catch (error) {
      console.error('Error generating newsletter:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Execute optimize posting time action
   */
  private async executeOptimizePostingTime(
    action: AutomationAction,
    triggerData: any,
    rule: AutomationRule
  ): Promise<SchedulingOptimizationResult> {
    try {
      // This would typically analyze engagement data and suggest optimal times
      // For now, return mock optimization results
      const optimizedTimes = [
        {
          platform: 'linkedin',
          datetime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          engagement_score: 92,
          reason: 'Peak professional engagement time based on historical data'
        },
        {
          platform: 'twitter',
          datetime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
          engagement_score: 88,
          reason: 'High social media activity period'
        }
      ]

      return {
        success: true,
        optimized_times: optimizedTimes,
        applied_to_content_ids: [] // Would contain IDs of content that was rescheduled
      }
    } catch (error) {
      console.error('Error optimizing posting time:', error)
      return {
        success: false,
        optimized_times: [],
        applied_to_content_ids: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Execute send notification action
   */
  private async executeSendNotification(
    action: AutomationAction,
    triggerData: any,
    rule: AutomationRule
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // This would typically send notifications via email, Slack, etc.
      console.log(`Sending notification: ${action.notification_type}`)
      console.log('Recipients:', action.recipients)
      console.log('Trigger data:', triggerData)

      return { success: true }
    } catch (error) {
      console.error('Error sending notification:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Execute update analytics action
   */
  private async executeUpdateAnalytics(
    action: AutomationAction,
    triggerData: any,
    rule: AutomationRule
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // This would typically update analytics data
      console.log('Updating analytics based on trigger:', triggerData)

      return { success: true }
    } catch (error) {
      console.error('Error updating analytics:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Build template context from trigger data
   */
  private buildTemplateContext(triggerData: any, action: AutomationAction): TemplateContext {
    const context: TemplateContext = {}

    // Handle blog published trigger data
    if (triggerData.title) {
      context.title = triggerData.title
      context.url = triggerData.url
      context.content = triggerData.content
      context.summary = triggerData.summary
      context.author = triggerData.author
      context.published_date = triggerData.published_at
      context.categories = triggerData.categories
      context.tags = triggerData.tags
      
      // Generate key points from content (simplified)
      if (triggerData.content) {
        context.key_points = this.extractKeyPoints(triggerData.content)
      }
      
      // Generate hashtags from tags/categories
      if (triggerData.tags || triggerData.categories) {
        const allTags = [...(triggerData.tags || []), ...(triggerData.categories || [])]
        context.hashtags = allTags.map(tag => tag.replace(/\s+/g, '')).join(' #')
      }
    }

    // Add platform-specific context
    if (action.platform) {
      context.platform = action.platform
    }

    // Add current date/time context
    context.week_date = new Date().toLocaleDateString()

    return context
  }

  /**
   * Extract key points from content (simplified implementation)
   */
  private extractKeyPoints(content: string): string[] {
    // This is a simplified implementation
    // In a real scenario, you might use AI or more sophisticated text analysis
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20)
    return sentences.slice(0, 3).map(s => `• ${s.trim()}`)
  }

  /**
   * Check if blog published conditions match
   */
  private matchesBlogPublishedConditions(rule: AutomationRule, triggerData: BlogPublishedTrigger): boolean {
    const conditions = rule.trigger_conditions

    // Check blog categories
    if (conditions.blog_categories && Array.isArray(conditions.blog_categories)) {
      if (!conditions.blog_categories.includes('all')) {
        const hasMatchingCategory = triggerData.categories.some(category => 
          conditions.blog_categories.includes(category)
        )
        if (!hasMatchingCategory) {
          return false
        }
      }
    }

    return true
  }

  /**
   * Check if time-based rule should execute now
   */
  private shouldExecuteTimeBasedRule(rule: AutomationRule, now: Date): boolean {
    const conditions = rule.trigger_conditions
    const lastExecuted = rule.last_executed ? new Date(rule.last_executed) : null

    // Check schedule type
    switch (conditions.schedule) {
      case 'daily':
        // Execute once per day
        if (lastExecuted) {
          const daysSinceLastExecution = Math.floor((now.getTime() - lastExecuted.getTime()) / (24 * 60 * 60 * 1000))
          if (daysSinceLastExecution < 1) {
            return false
          }
        }
        break

      case 'weekly':
        // Execute once per week on specified day
        if (conditions.day) {
          const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
          const targetDay = dayNames.indexOf(conditions.day.toLowerCase())
          if (now.getDay() !== targetDay) {
            return false
          }
        }
        
        if (lastExecuted) {
          const daysSinceLastExecution = Math.floor((now.getTime() - lastExecuted.getTime()) / (24 * 60 * 60 * 1000))
          if (daysSinceLastExecution < 7) {
            return false
          }
        }
        break

      case 'monthly':
        // Execute once per month
        if (lastExecuted) {
          const monthsSinceLastExecution = (now.getFullYear() - lastExecuted.getFullYear()) * 12 + 
                                          (now.getMonth() - lastExecuted.getMonth())
          if (monthsSinceLastExecution < 1) {
            return false
          }
        }
        break
    }

    // Check hour if specified
    if (conditions.hour !== undefined) {
      if (now.getHours() !== conditions.hour) {
        return false
      }
    }

    return true
  }

  /**
   * Get automation engine status
   */
  getStatus(): {
    is_processing: boolean
    queue_size: number
    last_execution?: string
  } {
    return {
      is_processing: this.isProcessing,
      queue_size: this.executionQueue.size,
      last_execution: undefined // Would track last execution time
    }
  }

  /**
   * Schedule periodic execution of time-based rules
   */
  startScheduler(): void {
    // Run every hour to check for time-based triggers
    setInterval(async () => {
      try {
        console.log('Running scheduled automation check...')
        await this.processTimeBasedTriggers()
      } catch (error) {
        console.error('Error in scheduled automation check:', error)
      }
    }, 60 * 60 * 1000) // 1 hour

    console.log('Automation scheduler started')
  }
}
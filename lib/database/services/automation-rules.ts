// Automation Rules Database Service

import { supabase } from '@/lib/supabase'
import { 
  AutomationRule, 
  AutomationRuleInput, 
  AutomationRuleUpdate,
  AutomationExecution,
  AutomationExecutionInput,
  AutomationRuleValidation,
  AutomationStats,
  ValidationResult
} from '../automation-types'
import { QueryOptions, FilterOptions } from '../types'

export class AutomationRulesService {
  /**
   * Get all automation rules
   */
  static async getAll(
    options: QueryOptions = {},
    filters: FilterOptions & { 
      rule_type?: string
      trigger_type?: string
      is_active?: boolean
    } = {}
  ): Promise<{ data: AutomationRule[]; error: string | null }> {
    try {
      let query = supabase
        .from('automation_rules')
        .select('*')

      // Apply filters
      if (filters.rule_type) {
        query = query.eq('rule_type', filters.rule_type)
      }
      if (filters.trigger_type) {
        query = query.eq('trigger_type', filters.trigger_type)
      }
      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy, { 
          ascending: options.orderDirection !== 'desc' 
        })
      } else {
        query = query.order('priority', { ascending: false })
          .order('created_at', { ascending: false })
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit)
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching automation rules:', error)
        return { data: [], error: error.message }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Error in getAll:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get automation rule by ID
   */
  static async getById(id: string): Promise<{ data: AutomationRule | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching automation rule:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error in getById:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Create new automation rule
   */
  static async create(input: AutomationRuleInput): Promise<{ data: AutomationRule | null; error: string | null }> {
    try {
      // Validate input
      const validation = await this.validateRule(input)
      if (!validation.isValid) {
        return { data: null, error: validation.errors.join(', ') }
      }

      const { data, error } = await supabase
        .from('automation_rules')
        .insert([{
          ...input,
          execution_count: 0
        }])
        .select()
        .single()

      if (error) {
        console.error('Error creating automation rule:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error in create:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Update automation rule
   */
  static async update(id: string, updates: AutomationRuleUpdate): Promise<{ data: AutomationRule | null; error: string | null }> {
    try {
      // Validate updates
      if (Object.keys(updates).length > 0) {
        const validation = await this.validateRule(updates as AutomationRuleInput, true)
        if (!validation.isValid) {
          return { data: null, error: validation.errors.join(', ') }
        }
      }

      const { data, error } = await supabase
        .from('automation_rules')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating automation rule:', error)
        return { data: null, error: error.message }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error in update:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Delete automation rule
   */
  static async delete(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting automation rule:', error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Error in delete:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get active rules by trigger type
   */
  static async getActiveRulesByTrigger(
    triggerType: 'blog_published' | 'time_based' | 'engagement_threshold' | 'manual'
  ): Promise<{ data: AutomationRule[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('trigger_type', triggerType)
        .eq('is_active', true)
        .order('priority', { ascending: false })

      if (error) {
        console.error('Error fetching active rules by trigger:', error)
        return { data: [], error: error.message }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Error in getActiveRulesByTrigger:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Update rule execution count and last executed time
   */
  static async updateExecution(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('automation_rules')
        .update({
          execution_count: supabase.raw('execution_count + 1'),
          last_executed: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        console.error('Error updating rule execution:', error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Error in updateExecution:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Toggle rule active status
   */
  static async toggleActive(id: string): Promise<{ data: AutomationRule | null; error: string | null }> {
    try {
      // First get current status
      const { data: current, error: fetchError } = await this.getById(id)
      if (fetchError || !current) {
        return { data: null, error: fetchError || 'Rule not found' }
      }

      // Toggle the status
      return await this.update(id, { is_active: !current.is_active })
    } catch (error) {
      console.error('Error in toggleActive:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Validate automation rule
   */
  static async validateRule(input: Partial<AutomationRuleInput>, isUpdate = false): Promise<AutomationRuleValidation> {
    const errors: string[] = []
    const warnings: string[] = []

    if (!isUpdate) {
      // Required fields for creation
      if (!input.name?.trim()) {
        errors.push('Rule name is required')
      }
      if (!input.rule_type) {
        errors.push('Rule type is required')
      }
      if (!input.trigger_type) {
        errors.push('Trigger type is required')
      }
      if (!input.actions || input.actions.length === 0) {
        errors.push('At least one action is required')
      }
    }

    // Validate rule type
    if (input.rule_type && !['content_generation', 'scheduling', 'cross_promotion', 'optimization'].includes(input.rule_type)) {
      errors.push('Invalid rule type')
    }

    // Validate trigger type
    if (input.trigger_type && !['blog_published', 'time_based', 'engagement_threshold', 'manual'].includes(input.trigger_type)) {
      errors.push('Invalid trigger type')
    }

    // Validate trigger conditions
    const triggerValidation = this.validateTriggerConditions(input.trigger_type, input.trigger_conditions)

    // Validate actions
    const actionsValidation: ValidationResult[] = []
    if (input.actions) {
      for (let i = 0; i < input.actions.length; i++) {
        const actionValidation = this.validateAction(input.actions[i])
        actionsValidation.push(actionValidation)
        
        if (!actionValidation.isValid) {
          errors.push(`Action ${i + 1}: ${actionValidation.errors.join(', ')}`)
        }
      }
    }

    // Validate template reference if provided
    let templateValidation: ValidationResult | undefined
    if (input.template_id) {
      // This would typically check if the template exists
      // For now, we'll assume it's valid
      templateValidation = { isValid: true, errors: [] }
    }

    // Validate name length
    if (input.name && input.name.length > 255) {
      errors.push('Rule name must be 255 characters or less')
    }

    // Validate priority
    if (input.priority !== undefined && (input.priority < 0 || input.priority > 100)) {
      warnings.push('Priority should be between 0 and 100')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      trigger_validation: triggerValidation,
      actions_validation: actionsValidation,
      template_validation: templateValidation
    }
  }

  /**
   * Validate trigger conditions
   */
  private static validateTriggerConditions(
    triggerType?: string, 
    conditions?: Record<string, any>
  ): ValidationResult {
    const errors: string[] = []

    if (!triggerType || !conditions) {
      return { isValid: true, errors: [] }
    }

    switch (triggerType) {
      case 'blog_published':
        // Validate blog published trigger conditions
        if (conditions.blog_categories && !Array.isArray(conditions.blog_categories)) {
          errors.push('blog_categories must be an array')
        }
        break

      case 'time_based':
        // Validate time-based trigger conditions
        if (!conditions.schedule) {
          errors.push('schedule is required for time-based triggers')
        } else if (!['daily', 'weekly', 'monthly'].includes(conditions.schedule)) {
          errors.push('schedule must be daily, weekly, or monthly')
        }
        
        if (conditions.schedule === 'weekly' && conditions.day && 
            !['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].includes(conditions.day)) {
          errors.push('Invalid day for weekly schedule')
        }
        
        if (conditions.hour !== undefined && (conditions.hour < 0 || conditions.hour > 23)) {
          errors.push('hour must be between 0 and 23')
        }
        break

      case 'engagement_threshold':
        // Validate engagement threshold trigger conditions
        if (!conditions.metric_type) {
          errors.push('metric_type is required for engagement threshold triggers')
        } else if (!['views', 'likes', 'shares', 'comments', 'clicks'].includes(conditions.metric_type)) {
          errors.push('Invalid metric_type')
        }
        
        if (conditions.threshold_value === undefined || conditions.threshold_value <= 0) {
          errors.push('threshold_value must be a positive number')
        }
        break

      case 'manual':
        // Manual triggers don't require specific conditions
        break

      default:
        errors.push('Unknown trigger type')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Validate action
   */
  private static validateAction(action: any): ValidationResult {
    const errors: string[] = []

    if (!action.type) {
      errors.push('Action type is required')
    } else if (!['generate_social_post', 'generate_newsletter', 'optimize_posting_time', 'send_notification', 'update_analytics'].includes(action.type)) {
      errors.push('Invalid action type')
    }

    // Validate action-specific properties
    switch (action.type) {
      case 'generate_social_post':
        if (action.platform && !['linkedin', 'twitter', 'all'].includes(action.platform)) {
          errors.push('Invalid platform for social post generation')
        }
        if (action.schedule_delay_hours !== undefined && action.schedule_delay_hours < 0) {
          errors.push('schedule_delay_hours must be non-negative')
        }
        break

      case 'generate_newsletter':
        if (action.auto_send !== undefined && typeof action.auto_send !== 'boolean') {
          errors.push('auto_send must be a boolean')
        }
        break

      case 'optimize_posting_time':
        if (action.look_ahead_days !== undefined && action.look_ahead_days <= 0) {
          errors.push('look_ahead_days must be positive')
        }
        if (action.min_engagement_score !== undefined && (action.min_engagement_score < 0 || action.min_engagement_score > 100)) {
          errors.push('min_engagement_score must be between 0 and 100')
        }
        break

      case 'send_notification':
        if (!action.notification_type) {
          errors.push('notification_type is required for notifications')
        }
        if (action.recipients && !Array.isArray(action.recipients)) {
          errors.push('recipients must be an array')
        }
        break
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Get automation statistics
   */
  static async getStats(): Promise<{ data: AutomationStats | null; error: string | null }> {
    try {
      // Get rule counts
      const { data: allRules, error: rulesError } = await this.getAll()
      if (rulesError) {
        return { data: null, error: rulesError }
      }

      const totalRules = allRules.length
      const activeRules = allRules.filter(rule => rule.is_active).length

      // Get execution statistics (would typically query automation_executions table)
      // For now, return mock data
      const mockStats: AutomationStats = {
        total_rules: totalRules,
        active_rules: activeRules,
        total_executions: allRules.reduce((sum, rule) => sum + rule.execution_count, 0),
        successful_executions: Math.floor(allRules.reduce((sum, rule) => sum + rule.execution_count, 0) * 0.85),
        failed_executions: Math.floor(allRules.reduce((sum, rule) => sum + rule.execution_count, 0) * 0.15),
        content_generated: Math.floor(allRules.reduce((sum, rule) => sum + rule.execution_count, 0) * 0.7),
        by_rule_type: {
          content_generation: allRules.filter(r => r.rule_type === 'content_generation').length,
          scheduling: allRules.filter(r => r.rule_type === 'scheduling').length,
          cross_promotion: allRules.filter(r => r.rule_type === 'cross_promotion').length,
          optimization: allRules.filter(r => r.rule_type === 'optimization').length
        },
        by_trigger_type: {
          blog_published: allRules.filter(r => r.trigger_type === 'blog_published').length,
          time_based: allRules.filter(r => r.trigger_type === 'time_based').length,
          engagement_threshold: allRules.filter(r => r.trigger_type === 'engagement_threshold').length,
          manual: allRules.filter(r => r.trigger_type === 'manual').length
        },
        recent_executions: [], // Would be populated from executions table
        top_performing_rules: allRules
          .sort((a, b) => b.execution_count - a.execution_count)
          .slice(0, 5)
          .map(rule => ({
            rule_id: rule.id,
            rule_name: rule.name,
            execution_count: rule.execution_count,
            success_rate: Math.random() * 100 // Mock success rate
          }))
      }

      return { data: mockStats, error: null }
    } catch (error) {
      console.error('Error getting automation stats:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Clone rule with new name
   */
  static async clone(id: string, newName: string): Promise<{ data: AutomationRule | null; error: string | null }> {
    try {
      // Get original rule
      const { data: original, error: fetchError } = await this.getById(id)
      if (fetchError || !original) {
        return { data: null, error: fetchError || 'Rule not found' }
      }

      // Create clone
      const cloneInput: AutomationRuleInput = {
        name: newName,
        description: original.description ? `${original.description} (Copy)` : undefined,
        rule_type: original.rule_type,
        trigger_type: original.trigger_type,
        trigger_conditions: { ...original.trigger_conditions },
        actions: [...original.actions],
        template_id: original.template_id,
        is_active: false, // Start as inactive
        priority: original.priority
      }

      return await this.create(cloneInput)
    } catch (error) {
      console.error('Error cloning rule:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Bulk update rules
   */
  static async bulkUpdate(
    ruleIds: string[], 
    updates: AutomationRuleUpdate
  ): Promise<{ success: boolean; updated: number; errors: string[] }> {
    const errors: string[] = []
    let updated = 0

    for (const id of ruleIds) {
      try {
        const { error } = await this.update(id, updates)
        if (error) {
          errors.push(`Failed to update rule ${id}: ${error}`)
        } else {
          updated++
        }
      } catch (error) {
        errors.push(`Error updating rule ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return {
      success: errors.length === 0,
      updated,
      errors
    }
  }
}
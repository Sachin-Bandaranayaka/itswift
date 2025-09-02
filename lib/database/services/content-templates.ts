// Content Templates Database Service

import { getSupabase } from '@/lib/supabase'
import { 
  ContentTemplate, 
  ContentTemplateInput, 
  ContentTemplateUpdate,
  TemplateContext,
  TemplateRenderResult,
  ValidationResult
} from '../automation-types'
import { QueryOptions, FilterOptions } from '../types'

export class ContentTemplatesService {
  /**
   * Get all content templates
   */
  static async getAll(
    options: QueryOptions = {},
    filters: FilterOptions & { 
      template_type?: string
      platform?: string
      is_active?: boolean
    } = {}
  ): Promise<{ data: ContentTemplate[]; error: string | null }> {
    try {
      let query = supabase
        .from('content_templates')
        .select('*')

      // Apply filters
      if (filters.template_type) {
        query = query.eq('template_type', filters.template_type)
      }
      if (filters.platform) {
        query = query.eq('platform', filters.platform)
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
        query = query.order('created_at', { ascending: false })
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
        console.error('Error fetching content templates:', error)
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
   * Get content template by ID
   */
  static async getById(id: string): Promise<{ data: ContentTemplate | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('content_templates')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching content template:', error)
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
   * Create new content template
   */
  static async create(input: ContentTemplateInput): Promise<{ data: ContentTemplate | null; error: string | null }> {
    try {
      // Validate input
      const validation = this.validateTemplate(input)
      if (!validation.isValid) {
        return { data: null, error: validation.errors.join(', ') }
      }

      const { data, error } = await supabase
        .from('content_templates')
        .insert([input])
        .select()
        .single()

      if (error) {
        console.error('Error creating content template:', error)
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
   * Update content template
   */
  static async update(id: string, updates: ContentTemplateUpdate): Promise<{ data: ContentTemplate | null; error: string | null }> {
    try {
      // Validate updates
      if (Object.keys(updates).length > 0) {
        const validation = this.validateTemplate(updates as ContentTemplateInput, true)
        if (!validation.isValid) {
          return { data: null, error: validation.errors.join(', ') }
        }
      }

      const { data, error } = await supabase
        .from('content_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating content template:', error)
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
   * Delete content template
   */
  static async delete(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('content_templates')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting content template:', error)
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
   * Get templates by type and platform
   */
  static async getByTypeAndPlatform(
    templateType: 'blog' | 'social' | 'newsletter',
    platform?: 'linkedin' | 'twitter' | 'all'
  ): Promise<{ data: ContentTemplate[]; error: string | null }> {
    try {
      let query = supabase
        .from('content_templates')
        .select('*')
        .eq('template_type', templateType)
        .eq('is_active', true)

      if (platform && platform !== 'all') {
        query = query.or(`platform.eq.${platform},platform.eq.all`)
      }

      const { data, error } = await query.order('name')

      if (error) {
        console.error('Error fetching templates by type and platform:', error)
        return { data: [], error: error.message }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Error in getByTypeAndPlatform:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Render template with context variables
   */
  static renderTemplate(template: ContentTemplate, context: TemplateContext): TemplateRenderResult {
    try {
      let renderedContent = template.content_template
      const missingVariables: string[] = []

      // Replace variables in template
      for (const variable of template.variables) {
        const placeholder = `{{${variable}}}`
        const value = context[variable]

        if (value !== undefined && value !== null) {
          // Convert arrays to comma-separated strings
          const stringValue = Array.isArray(value) ? value.join(', ') : String(value)
          renderedContent = renderedContent.replace(new RegExp(placeholder, 'g'), stringValue)
        } else {
          missingVariables.push(variable)
        }
      }

      // Check for any remaining unreplaced variables
      const remainingVariables = renderedContent.match(/\{\{([^}]+)\}\}/g)
      if (remainingVariables) {
        for (const match of remainingVariables) {
          const variable = match.replace(/[{}]/g, '')
          if (!missingVariables.includes(variable)) {
            missingVariables.push(variable)
          }
        }
      }

      return {
        success: true,
        rendered_content: renderedContent,
        missing_variables: missingVariables
      }
    } catch (error) {
      console.error('Error rendering template:', error)
      return {
        success: false,
        rendered_content: '',
        missing_variables: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Validate template input
   */
  static validateTemplate(input: Partial<ContentTemplateInput>, isUpdate = false): ValidationResult {
    const errors: string[] = []

    if (!isUpdate) {
      // Required fields for creation
      if (!input.name?.trim()) {
        errors.push('Template name is required')
      }
      if (!input.template_type) {
        errors.push('Template type is required')
      }
      if (!input.content_template?.trim()) {
        errors.push('Template content is required')
      }
    }

    // Validate template type
    if (input.template_type && !['blog', 'social', 'newsletter'].includes(input.template_type)) {
      errors.push('Invalid template type')
    }

    // Validate platform
    if (input.platform && !['linkedin', 'twitter', 'all'].includes(input.platform)) {
      errors.push('Invalid platform')
    }

    // Validate template content and extract variables
    if (input.content_template) {
      try {
        const extractedVariables = this.extractVariablesFromTemplate(input.content_template)
        
        // If variables array is provided, validate it matches extracted variables
        if (input.variables) {
          const providedVars = new Set(input.variables)
          const extractedVars = new Set(extractedVariables)
          
          // Check for missing variables in provided array
          for (const extracted of extractedVars) {
            if (!providedVars.has(extracted)) {
              errors.push(`Variable "${extracted}" found in template but not listed in variables array`)
            }
          }
          
          // Check for extra variables in provided array
          for (const provided of providedVars) {
            if (!extractedVars.has(provided)) {
              errors.push(`Variable "${provided}" listed in variables array but not found in template`)
            }
          }
        }
      } catch (error) {
        errors.push('Invalid template syntax')
      }
    }

    // Validate name length
    if (input.name && input.name.length > 255) {
      errors.push('Template name must be 255 characters or less')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Extract variables from template content
   */
  static extractVariablesFromTemplate(templateContent: string): string[] {
    const variables: string[] = []
    const matches = templateContent.match(/\{\{([^}]+)\}\}/g)
    
    if (matches) {
      for (const match of matches) {
        const variable = match.replace(/[{}]/g, '').trim()
        if (!variables.includes(variable)) {
          variables.push(variable)
        }
      }
    }
    
    return variables
  }

  /**
   * Clone template with new name
   */
  static async clone(id: string, newName: string): Promise<{ data: ContentTemplate | null; error: string | null }> {
    try {
      // Get original template
      const { data: original, error: fetchError } = await this.getById(id)
      if (fetchError || !original) {
        return { data: null, error: fetchError || 'Template not found' }
      }

      // Create clone
      const cloneInput: ContentTemplateInput = {
        name: newName,
        description: original.description ? `${original.description} (Copy)` : undefined,
        template_type: original.template_type,
        platform: original.platform,
        content_template: original.content_template,
        variables: original.variables,
        metadata: { ...original.metadata, cloned_from: original.id },
        is_active: false // Start as inactive
      }

      return await this.create(cloneInput)
    } catch (error) {
      console.error('Error cloning template:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get template usage statistics
   */
  static async getUsageStats(templateId: string): Promise<{
    data: {
      total_uses: number
      recent_uses: number
      success_rate: number
      last_used?: string
    } | null
    error: string | null
  }> {
    try {
      // This would typically query the automation_executions table
      // For now, return mock data
      const mockStats = {
        total_uses: Math.floor(Math.random() * 100),
        recent_uses: Math.floor(Math.random() * 20),
        success_rate: Math.random() * 100,
        last_used: new Date().toISOString()
      }

      return { data: mockStats, error: null }
    } catch (error) {
      console.error('Error getting template usage stats:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Bulk update templates
   */
  static async bulkUpdate(
    templateIds: string[], 
    updates: ContentTemplateUpdate
  ): Promise<{ success: boolean; updated: number; errors: string[] }> {
    const errors: string[] = []
    let updated = 0

    for (const id of templateIds) {
      try {
        const { error } = await this.update(id, updates)
        if (error) {
          errors.push(`Failed to update template ${id}: ${error}`)
        } else {
          updated++
        }
      } catch (error) {
        errors.push(`Error updating template ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return {
      success: errors.length === 0,
      updated,
      errors
    }
  }
}
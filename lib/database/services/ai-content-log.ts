// AI content log database service

import { supabaseAdmin } from '../../supabase'
import { 
  AIContentLog, 
  AIContentLogInput, 
  QueryOptions, 
  FilterOptions 
} from '../types'
import { 
  validateAIContentLog, 
  sanitizeAIContentLogInput 
} from '../validation'

export class AIContentLogService {
  /**
   * Create a new AI content log entry
   */
  static async create(
    input: AIContentLogInput
  ): Promise<{ data: AIContentLog | null; error: string | null }> {
    try {
      // Validate input
      const validation = validateAIContentLog(input)
      if (!validation.isValid) {
        return { data: null, error: validation.errors.join(', ') }
      }

      // Sanitize input
      const sanitizedInput = sanitizeAIContentLogInput(input)

      const { data, error } = await supabaseAdmin
        .from('ai_content_log')
        .insert(sanitizedInput)
        .select()
        .single()

      if (error) {
        console.error('Error creating AI content log:', error)
        return { data: null, error: error.message }
      }

      return { data: data as AIContentLog, error: null }
    } catch (error) {
      console.error('Error creating AI content log:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get AI content log by ID
   */
  static async getById(
    id: string
  ): Promise<{ data: AIContentLog | null; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_content_log')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching AI content log:', error)
        return { data: null, error: error.message }
      }

      return { data: data as AIContentLog, error: null }
    } catch (error) {
      console.error('Error fetching AI content log:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get all AI content logs with optional filtering and pagination
   */
  static async getAll(
    options: QueryOptions = {}, 
    filters: FilterOptions = {}
  ): Promise<{ data: AIContentLog[]; error: string | null; count?: number }> {
    try {
      let query = supabaseAdmin
        .from('ai_content_log')
        .select('*', { count: 'exact' })

      // Apply filters
      if (filters.content_type) {
        query = query.eq('content_type', filters.content_type)
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from)
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to)
      }

      // Apply ordering
      const orderBy = options.orderBy || 'created_at'
      const orderDirection = options.orderDirection || 'desc'
      query = query.order(orderBy, { ascending: orderDirection === 'asc' })

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit)
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
      }

      const { data, error, count } = await query

      if (error) {
        console.error('Error fetching AI content logs:', error)
        return { data: [], error: error.message }
      }

      return { data: data as AIContentLog[], error: null, count: count || 0 }
    } catch (error) {
      console.error('Error fetching AI content logs:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Delete AI content log
   */
  static async delete(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabaseAdmin
        .from('ai_content_log')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting AI content log:', error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Error deleting AI content log:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get logs by content type
   */
  static async getByContentType(
    contentType: string,
    options: QueryOptions = {}
  ): Promise<{ data: AIContentLog[]; error: string | null }> {
    try {
      const result = await this.getAll(options, { content_type: contentType })
      return { data: result.data, error: result.error }
    } catch (error) {
      console.error('Error fetching AI content logs by type:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Search logs by prompt or content
   */
  static async search(
    searchTerm: string,
    options: QueryOptions = {}
  ): Promise<{ data: AIContentLog[]; error: string | null }> {
    try {
      let query = supabaseAdmin
        .from('ai_content_log')
        .select('*')
        .or(`prompt.ilike.%${searchTerm}%,generated_content.ilike.%${searchTerm}%`)

      // Apply ordering
      const orderBy = options.orderBy || 'created_at'
      const orderDirection = options.orderDirection || 'desc'
      query = query.order(orderBy, { ascending: orderDirection === 'asc' })

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit)
      }
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error searching AI content logs:', error)
        return { data: [], error: error.message }
      }

      return { data: data as AIContentLog[], error: null }
    } catch (error) {
      console.error('Error searching AI content logs:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get token usage statistics
   */
  static async getTokenStats(
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    totalTokens: number
    averageTokens: number
    totalRequests: number
    tokensByContentType: Record<string, number>
    error: string | null
  }> {
    try {
      let query = supabaseAdmin
        .from('ai_content_log')
        .select('tokens_used, content_type')

      if (dateFrom) {
        query = query.gte('created_at', dateFrom)
      }
      if (dateTo) {
        query = query.lte('created_at', dateTo)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching token stats:', error)
        return {
          totalTokens: 0, averageTokens: 0, totalRequests: 0,
          tokensByContentType: {}, error: error.message
        }
      }

      const stats = data.reduce(
        (acc, record) => {
          const tokens = record.tokens_used || 0
          acc.totalTokens += tokens
          acc.totalRequests += 1

          if (!acc.tokensByContentType[record.content_type]) {
            acc.tokensByContentType[record.content_type] = 0
          }
          acc.tokensByContentType[record.content_type] += tokens

          return acc
        },
        {
          totalTokens: 0,
          totalRequests: 0,
          tokensByContentType: {} as Record<string, number>
        }
      )

      const averageTokens = stats.totalRequests > 0 
        ? stats.totalTokens / stats.totalRequests 
        : 0

      return {
        ...stats,
        averageTokens,
        error: null
      }
    } catch (error) {
      console.error('Error fetching token stats:', error)
      return {
        totalTokens: 0, averageTokens: 0, totalRequests: 0,
        tokensByContentType: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get recent AI generations for a specific content type
   */
  static async getRecentByContentType(
    contentType: string,
    limit: number = 10
  ): Promise<{ data: AIContentLog[]; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_content_log')
        .select('*')
        .eq('content_type', contentType)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching recent AI content logs:', error)
        return { data: [], error: error.message }
      }

      return { data: data as AIContentLog[], error: null }
    } catch (error) {
      console.error('Error fetching recent AI content logs:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Clean up old logs (delete logs older than specified days)
   */
  static async cleanupOldLogs(
    daysToKeep: number = 90
  ): Promise<{ deletedCount: number; error: string | null }> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

      const { data, error } = await supabaseAdmin
        .from('ai_content_log')
        .delete()
        .lt('created_at', cutoffDate.toISOString())
        .select('id')

      if (error) {
        console.error('Error cleaning up old AI content logs:', error)
        return { deletedCount: 0, error: error.message }
      }

      return { deletedCount: data?.length || 0, error: null }
    } catch (error) {
      console.error('Error cleaning up old AI content logs:', error)
      return { 
        deletedCount: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
}
// Content analytics database service

import { supabaseAdmin } from '../../supabase'
import { 
  ContentAnalytics, 
  ContentAnalyticsInput, 
  ContentAnalyticsUpdate, 
  QueryOptions, 
  FilterOptions 
} from '../types'
import { 
  validateContentAnalytics, 
  sanitizeContentAnalyticsInput 
} from '../validation'

export class ContentAnalyticsService {
  /**
   * Create a new content analytics record
   */
  static async create(
    input: ContentAnalyticsInput
  ): Promise<{ data: ContentAnalytics | null; error: string | null }> {
    try {
      // Validate input
      const validation = validateContentAnalytics(input)
      if (!validation.isValid) {
        return { data: null, error: validation.errors.join(', ') }
      }

      // Sanitize input
      const sanitizedInput = sanitizeContentAnalyticsInput(input)

      const { data, error } = await supabaseAdmin
        .from('content_analytics')
        .insert(sanitizedInput)
        .select()
        .single()

      if (error) {
        console.error('Error creating content analytics:', error)
        return { data: null, error: error.message }
      }

      return { data: data as ContentAnalytics, error: null }
    } catch (error) {
      console.error('Error creating content analytics:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get analytics record by ID
   */
  static async getById(
    id: string
  ): Promise<{ data: ContentAnalytics | null; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('content_analytics')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching content analytics:', error)
        return { data: null, error: error.message }
      }

      return { data: data as ContentAnalytics, error: null }
    } catch (error) {
      console.error('Error fetching content analytics:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get analytics by content ID
   */
  static async getByContentId(
    contentId: string,
    options: QueryOptions = {}
  ): Promise<{ data: ContentAnalytics[]; error: string | null }> {
    try {
      let query = supabaseAdmin
        .from('content_analytics')
        .select('*')
        .eq('content_id', contentId)

      // Apply ordering
      const orderBy = options.orderBy || 'recorded_at'
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
        console.error('Error fetching content analytics by content ID:', error)
        return { data: [], error: error.message }
      }

      return { data: data as ContentAnalytics[], error: null }
    } catch (error) {
      console.error('Error fetching content analytics by content ID:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get all analytics with optional filtering and pagination
   */
  static async getAll(
    options: QueryOptions = {}, 
    filters: FilterOptions = {}
  ): Promise<{ data: ContentAnalytics[]; error: string | null; count?: number }> {
    try {
      let query = supabaseAdmin
        .from('content_analytics')
        .select('*', { count: 'exact' })

      // Apply filters
      if (filters.content_type) {
        query = query.eq('content_type', filters.content_type)
      }
      if (filters.platform) {
        query = query.eq('platform', filters.platform)
      }
      if (filters.date_from) {
        query = query.gte('recorded_at', filters.date_from)
      }
      if (filters.date_to) {
        query = query.lte('recorded_at', filters.date_to)
      }

      // Apply ordering
      const orderBy = options.orderBy || 'recorded_at'
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
        console.error('Error fetching content analytics:', error)
        return { data: [], error: error.message }
      }

      return { data: data as ContentAnalytics[], error: null, count: count || 0 }
    } catch (error) {
      console.error('Error fetching content analytics:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Update analytics record
   */
  static async update(
    id: string, 
    updates: ContentAnalyticsUpdate
  ): Promise<{ data: ContentAnalytics | null; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('content_analytics')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating content analytics:', error)
        return { data: null, error: error.message }
      }

      return { data: data as ContentAnalytics, error: null }
    } catch (error) {
      console.error('Error updating content analytics:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Delete analytics record
   */
  static async delete(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabaseAdmin
        .from('content_analytics')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting content analytics:', error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Error deleting content analytics:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Update or create analytics record (upsert)
   */
  static async upsert(
    contentId: string,
    contentType: 'blog' | 'social' | 'newsletter',
    platform: string | undefined,
    metrics: {
      views?: number
      likes?: number
      shares?: number
      comments?: number
      clicks?: number
    }
  ): Promise<{ data: ContentAnalytics | null; error: string | null }> {
    try {
      // Try to find existing record
      let query = supabaseAdmin
        .from('content_analytics')
        .select('*')
        .eq('content_id', contentId)
        .eq('content_type', contentType)

      if (platform) {
        query = query.eq('platform', platform)
      } else {
        query = query.is('platform', null)
      }

      const { data: existing, error: fetchError } = await query.single()

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching existing analytics:', fetchError)
        return { data: null, error: fetchError.message }
      }

      if (existing) {
        // Update existing record
        const updates: ContentAnalyticsUpdate = {
          views: metrics.views ?? existing.views,
          likes: metrics.likes ?? existing.likes,
          shares: metrics.shares ?? existing.shares,
          comments: metrics.comments ?? existing.comments,
          clicks: metrics.clicks ?? existing.clicks
        }

        return await this.update(existing.id, updates)
      } else {
        // Create new record
        const input: ContentAnalyticsInput = {
          content_id: contentId,
          content_type: contentType,
          platform: platform,
          views: metrics.views ?? 0,
          likes: metrics.likes ?? 0,
          shares: metrics.shares ?? 0,
          comments: metrics.comments ?? 0,
          clicks: metrics.clicks ?? 0
        }

        return await this.create(input)
      }
    } catch (error) {
      console.error('Error upserting content analytics:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get aggregated analytics for a content type
   */
  static async getAggregatedByContentType(
    contentType: 'blog' | 'social' | 'newsletter',
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    totalViews: number
    totalLikes: number
    totalShares: number
    totalComments: number
    totalClicks: number
    recordCount: number
    error: string | null
  }> {
    try {
      let query = supabaseAdmin
        .from('content_analytics')
        .select('views, likes, shares, comments, clicks')
        .eq('content_type', contentType)

      if (dateFrom) {
        query = query.gte('recorded_at', dateFrom)
      }
      if (dateTo) {
        query = query.lte('recorded_at', dateTo)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching aggregated analytics:', error)
        return {
          totalViews: 0, totalLikes: 0, totalShares: 0, 
          totalComments: 0, totalClicks: 0, recordCount: 0,
          error: error.message
        }
      }

      const aggregated = data.reduce(
        (acc, record) => ({
          totalViews: acc.totalViews + (record.views || 0),
          totalLikes: acc.totalLikes + (record.likes || 0),
          totalShares: acc.totalShares + (record.shares || 0),
          totalComments: acc.totalComments + (record.comments || 0),
          totalClicks: acc.totalClicks + (record.clicks || 0),
          recordCount: acc.recordCount + 1
        }),
        {
          totalViews: 0, totalLikes: 0, totalShares: 0,
          totalComments: 0, totalClicks: 0, recordCount: 0
        }
      )

      return { ...aggregated, error: null }
    } catch (error) {
      console.error('Error fetching aggregated analytics:', error)
      return {
        totalViews: 0, totalLikes: 0, totalShares: 0,
        totalComments: 0, totalClicks: 0, recordCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get top performing content
   */
  static async getTopPerforming(
    contentType: 'blog' | 'social' | 'newsletter',
    metric: 'views' | 'likes' | 'shares' | 'comments' | 'clicks' = 'views',
    limit: number = 10
  ): Promise<{ data: ContentAnalytics[]; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('content_analytics')
        .select('*')
        .eq('content_type', contentType)
        .order(metric, { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching top performing content:', error)
        return { data: [], error: error.message }
      }

      return { data: data as ContentAnalytics[], error: null }
    } catch (error) {
      console.error('Error fetching top performing content:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
}
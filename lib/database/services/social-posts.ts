// Social posts database service

import { supabaseAdmin } from '../../supabase'
import { 
  SocialPost, 
  SocialPostInput, 
  SocialPostUpdate, 
  QueryOptions, 
  FilterOptions 
} from '../types'
import { 
  validateSocialPost, 
  sanitizeSocialPostInput 
} from '../validation'

export class SocialPostsService {
  /**
   * Create a new social post
   */
  static async create(input: SocialPostInput): Promise<{ data: SocialPost | null; error: string | null }> {
    try {
      // Validate input
      const validation = validateSocialPost(input)
      if (!validation.isValid) {
        return { data: null, error: validation.errors.join(', ') }
      }

      // Sanitize input
      const sanitizedInput = sanitizeSocialPostInput(input)

      const { data, error } = await supabaseAdmin
        .from('social_posts')
        .insert(sanitizedInput)
        .select()
        .single()

      if (error) {
        console.error('Error creating social post:', error)
        return { data: null, error: error.message }
      }

      return { data: data as SocialPost, error: null }
    } catch (error) {
      console.error('Error creating social post:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get social post by ID
   */
  static async getById(id: string): Promise<{ data: SocialPost | null; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('social_posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching social post:', error)
        return { data: null, error: error.message }
      }

      return { data: data as SocialPost, error: null }
    } catch (error) {
      console.error('Error fetching social post:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get all social posts with optional filtering and pagination
   */
  static async getAll(
    options: QueryOptions = {}, 
    filters: FilterOptions = {}
  ): Promise<{ data: SocialPost[]; error: string | null; count?: number }> {
    try {
      let query = supabaseAdmin
        .from('social_posts')
        .select('*', { count: 'exact' })

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.platform) {
        query = query.eq('platform', filters.platform)
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
        console.error('Error fetching social posts:', error)
        return { data: [], error: error.message }
      }

      return { data: data as SocialPost[], error: null, count: count || 0 }
    } catch (error) {
      console.error('Error fetching social posts:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Update social post
   */
  static async update(
    id: string, 
    updates: SocialPostUpdate
  ): Promise<{ data: SocialPost | null; error: string | null }> {
    try {
      // If updating content or platform, validate the changes
      if (updates.content || updates.platform) {
        const currentPost = await this.getById(id)
        if (currentPost.error || !currentPost.data) {
          return { data: null, error: 'Post not found' }
        }

        const updatedInput = {
          ...currentPost.data,
          ...updates
        }

        const validation = validateSocialPost(updatedInput)
        if (!validation.isValid) {
          return { data: null, error: validation.errors.join(', ') }
        }
      }

      const { data, error } = await supabaseAdmin
        .from('social_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating social post:', error)
        return { data: null, error: error.message }
      }

      return { data: data as SocialPost, error: null }
    } catch (error) {
      console.error('Error updating social post:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Delete social post
   */
  static async delete(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabaseAdmin
        .from('social_posts')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting social post:', error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Error deleting social post:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get scheduled posts that are ready to be published
   */
  static async getScheduledPosts(): Promise<{ data: SocialPost[]; error: string | null }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('social_posts')
        .select('*')
        .eq('status', 'scheduled')
        .lte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })

      if (error) {
        console.error('Error fetching scheduled posts:', error)
        return { data: [], error: error.message }
      }

      return { data: data as SocialPost[], error: null }
    } catch (error) {
      console.error('Error fetching scheduled posts:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Mark post as published
   */
  static async markAsPublished(
    id: string, 
    engagementMetrics?: any
  ): Promise<{ data: SocialPost | null; error: string | null }> {
    try {
      const updates: SocialPostUpdate = {
        status: 'published',
        published_at: new Date().toISOString()
      }

      if (engagementMetrics) {
        updates.engagement_metrics = engagementMetrics
      }

      return await this.update(id, updates)
    } catch (error) {
      console.error('Error marking post as published:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Mark post as failed
   */
  static async markAsFailed(id: string): Promise<{ data: SocialPost | null; error: string | null }> {
    try {
      return await this.update(id, { status: 'failed' })
    } catch (error) {
      console.error('Error marking post as failed:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get posts by platform
   */
  static async getByPlatform(
    platform: 'linkedin' | 'twitter',
    options: QueryOptions = {}
  ): Promise<{ data: SocialPost[]; error: string | null }> {
    try {
      const result = await this.getAll(options, { platform })
      return { data: result.data, error: result.error }
    } catch (error) {
      console.error('Error fetching posts by platform:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
}

// Export individual functions for backward compatibility with tests
export const createSocialPost = SocialPostsService.create
export const getSocialPosts = (options?: { page?: number; limit?: number; platform?: string }) => {
  const queryOptions: QueryOptions = {}
  const filterOptions: FilterOptions = {}
  
  if (options?.limit) queryOptions.limit = options.limit
  if (options?.page && options?.limit) {
    queryOptions.offset = (options.page - 1) * options.limit
  }
  if (options?.platform) filterOptions.platform = options.platform
  
  return SocialPostsService.getAll(queryOptions, filterOptions)
}
export const updateSocialPost = SocialPostsService.update
export const deleteSocialPost = SocialPostsService.delete
export const getScheduledPosts = SocialPostsService.getScheduledPosts
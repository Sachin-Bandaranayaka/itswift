// Newsletter campaigns database service

import { getSupabaseAdmin } from '../../supabase'
import { 
  NewsletterCampaign, 
  NewsletterCampaignInput, 
  NewsletterCampaignUpdate, 
  QueryOptions, 
  FilterOptions 
} from '../types'
import { 
  validateNewsletterCampaign, 
  sanitizeNewsletterCampaignInput 
} from '../validation'

export class NewsletterCampaignsService {
  /**
   * Create a new newsletter campaign
   */
  static async create(
    input: NewsletterCampaignInput
  ): Promise<{ data: NewsletterCampaign | null; error: string | null }> {
    try {
      // Validate input
      const validation = validateNewsletterCampaign(input)
      if (!validation.isValid) {
        return { data: null, error: validation.errors.join(', ') }
      }

      // Sanitize input
      const sanitizedInput = sanitizeNewsletterCampaignInput(input)

      const { data, error } = await getSupabaseAdmin()
        .from('newsletter_campaigns')
        .insert(sanitizedInput)
        .select()
        .single()

      if (error) {
        console.error('Error creating newsletter campaign:', error)
        return { data: null, error: error.message }
      }

      return { data: data as NewsletterCampaign, error: null }
    } catch (error) {
      console.error('Error creating newsletter campaign:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get campaign by ID
   */
  static async getById(
    id: string
  ): Promise<{ data: NewsletterCampaign | null; error: string | null }> {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from('newsletter_campaigns')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching newsletter campaign:', error)
        return { data: null, error: error.message }
      }

      return { data: data as NewsletterCampaign, error: null }
    } catch (error) {
      console.error('Error fetching newsletter campaign:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get all campaigns with optional filtering and pagination
   */
  static async getAll(
    options: QueryOptions = {}, 
    filters: FilterOptions = {}
  ): Promise<{ data: NewsletterCampaign[]; error: string | null; count?: number }> {
    try {
      let query = getSupabaseAdmin()
        .from('newsletter_campaigns')
        .select('*', { count: 'exact' })

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
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
        console.error('Error fetching newsletter campaigns:', error)
        return { data: [], error: error.message }
      }

      return { data: data as NewsletterCampaign[], error: null, count: count || 0 }
    } catch (error) {
      console.error('Error fetching newsletter campaigns:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Update campaign
   */
  static async update(
    id: string, 
    updates: NewsletterCampaignUpdate
  ): Promise<{ data: NewsletterCampaign | null; error: string | null }> {
    try {
      // If updating subject or content, validate the changes
      if (updates.subject || updates.content) {
        const currentCampaign = await this.getById(id)
        if (currentCampaign.error || !currentCampaign.data) {
          return { data: null, error: 'Campaign not found' }
        }

        const updatedInput = {
          ...currentCampaign.data,
          ...updates
        }

        const validation = validateNewsletterCampaign(updatedInput)
        if (!validation.isValid) {
          return { data: null, error: validation.errors.join(', ') }
        }
      }

      const { data, error } = await getSupabaseAdmin()
        .from('newsletter_campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating newsletter campaign:', error)
        return { data: null, error: error.message }
      }

      return { data: data as NewsletterCampaign, error: null }
    } catch (error) {
      console.error('Error updating newsletter campaign:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Delete campaign
   */
  static async delete(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await getSupabaseAdmin()
        .from('newsletter_campaigns')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting newsletter campaign:', error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Error deleting newsletter campaign:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get scheduled campaigns that are ready to be sent
   */
  static async getScheduledCampaigns(): Promise<{ data: NewsletterCampaign[]; error: string | null }> {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from('newsletter_campaigns')
        .select('*')
        .eq('status', 'scheduled')
        .lte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })

      if (error) {
        console.error('Error fetching scheduled campaigns:', error)
        return { data: [], error: error.message }
      }

      return { data: data as NewsletterCampaign[], error: null }
    } catch (error) {
      console.error('Error fetching scheduled campaigns:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Mark campaign as sent
   */
  static async markAsSent(
    id: string, 
    recipientCount: number,
    openRate?: number,
    clickRate?: number
  ): Promise<{ data: NewsletterCampaign | null; error: string | null }> {
    try {
      const updates: NewsletterCampaignUpdate = {
        status: 'sent',
        sent_at: new Date().toISOString(),
        recipient_count: recipientCount
      }

      if (openRate !== undefined) {
        updates.open_rate = openRate
      }

      if (clickRate !== undefined) {
        updates.click_rate = clickRate
      }

      return await this.update(id, updates)
    } catch (error) {
      console.error('Error marking campaign as sent:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Mark campaign as sent with source analytics
   */
  static async markAsSentWithAnalytics(
    id: string, 
    recipientCount: number,
    recipientsBySource: Record<string, number>,
    openRate?: number,
    clickRate?: number
  ): Promise<{ data: NewsletterCampaign | null; error: string | null }> {
    try {
      const updates: NewsletterCampaignUpdate = {
        status: 'sent',
        sent_at: new Date().toISOString(),
        recipient_count: recipientCount,
        analytics: {
          recipientsBySource,
          sentAt: new Date().toISOString(),
          totalRecipients: recipientCount
        }
      }

      if (openRate !== undefined) {
        updates.open_rate = openRate
      }

      if (clickRate !== undefined) {
        updates.click_rate = clickRate
      }

      return await this.update(id, updates)
    } catch (error) {
      console.error('Error marking campaign as sent with analytics:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Mark campaign as failed
   */
  static async markAsFailed(id: string): Promise<{ data: NewsletterCampaign | null; error: string | null }> {
    try {
      return await this.update(id, { status: 'failed' })
    } catch (error) {
      console.error('Error marking campaign as failed:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get campaigns by status
   */
  static async getByStatus(
    status: 'draft' | 'scheduled' | 'sent' | 'failed',
    options: QueryOptions = {}
  ): Promise<{ data: NewsletterCampaign[]; error: string | null }> {
    try {
      const result = await this.getAll(options, { status })
      return { data: result.data, error: result.error }
    } catch (error) {
      console.error('Error fetching campaigns by status:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Search campaigns by subject
   */
  static async search(
    searchTerm: string,
    options: QueryOptions = {}
  ): Promise<{ data: NewsletterCampaign[]; error: string | null }> {
    try {
      let query = getSupabaseAdmin()
        .from('newsletter_campaigns')
        .select('*')
        .ilike('subject', `%${searchTerm}%`)

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
        console.error('Error searching newsletter campaigns:', error)
        return { data: [], error: error.message }
      }

      return { data: data as NewsletterCampaign[], error: null }
    } catch (error) {
      console.error('Error searching newsletter campaigns:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get campaign statistics
   */
  static async getStats(): Promise<{
    total: number
    draft: number
    scheduled: number
    sent: number
    failed: number
    averageOpenRate: number
    averageClickRate: number
    error: string | null
  }> {
    try {
      const [allCampaigns, sentCampaigns] = await Promise.all([
        this.getAll(),
        this.getByStatus('sent')
      ])

      if (allCampaigns.error) {
        return {
          total: 0, draft: 0, scheduled: 0, sent: 0, failed: 0,
          averageOpenRate: 0, averageClickRate: 0,
          error: allCampaigns.error
        }
      }

      const campaigns = allCampaigns.data
      const stats = {
        total: campaigns.length,
        draft: campaigns.filter(c => c.status === 'draft').length,
        scheduled: campaigns.filter(c => c.status === 'scheduled').length,
        sent: campaigns.filter(c => c.status === 'sent').length,
        failed: campaigns.filter(c => c.status === 'failed').length,
        averageOpenRate: 0,
        averageClickRate: 0,
        error: null
      }

      // Calculate average rates for sent campaigns
      if (sentCampaigns.data.length > 0) {
        const validOpenRates = sentCampaigns.data.filter(c => c.open_rate !== null).map(c => c.open_rate!)
        const validClickRates = sentCampaigns.data.filter(c => c.click_rate !== null).map(c => c.click_rate!)

        if (validOpenRates.length > 0) {
          stats.averageOpenRate = validOpenRates.reduce((sum, rate) => sum + rate, 0) / validOpenRates.length
        }

        if (validClickRates.length > 0) {
          stats.averageClickRate = validClickRates.reduce((sum, rate) => sum + rate, 0) / validClickRates.length
        }
      }

      return stats
    } catch (error) {
      console.error('Error getting campaign stats:', error)
      return {
        total: 0, draft: 0, scheduled: 0, sent: 0, failed: 0,
        averageOpenRate: 0, averageClickRate: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}
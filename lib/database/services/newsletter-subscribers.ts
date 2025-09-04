// Newsletter subscribers database service

import { getSupabaseAdmin } from '../../supabase'
import { 
  NewsletterSubscriber, 
  NewsletterSubscriberInput, 
  NewsletterSubscriberUpdate, 
  QueryOptions, 
  FilterOptions 
} from '../types'
import { 
  validateNewsletterSubscriber, 
  sanitizeNewsletterSubscriberInput 
} from '../validation'

export class NewsletterSubscribersService {
  /**
   * Create a new newsletter subscriber
   */
  static async create(
    input: NewsletterSubscriberInput
  ): Promise<{ data: NewsletterSubscriber | null; error: string | null }> {
    try {
      // Validate input
      const validation = validateNewsletterSubscriber(input)
      if (!validation.isValid) {
        return { data: null, error: validation.errors.join(', ') }
      }

      // Sanitize input
      const sanitizedInput = sanitizeNewsletterSubscriberInput(input)

      // Check if email already exists
      const existingSubscriber = await this.getByEmail(sanitizedInput.email)
      if (existingSubscriber.data) {
        return { data: null, error: 'Email already subscribed' }
      }

      const { data, error } = await getSupabaseAdmin()
        .from('newsletter_subscribers')
        .insert(sanitizedInput)
        .select()
        .single()

      if (error) {
        console.error('Error creating newsletter subscriber:', error)
        return { data: null, error: error.message }
      }

      return { data: data as NewsletterSubscriber, error: null }
    } catch (error) {
      console.error('Error creating newsletter subscriber:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get subscriber by ID
   */
  static async getById(
    id: string
  ): Promise<{ data: NewsletterSubscriber | null; error: string | null }> {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from('newsletter_subscribers')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching newsletter subscriber:', error)
        return { data: null, error: error.message }
      }

      return { data: data as NewsletterSubscriber, error: null }
    } catch (error) {
      console.error('Error fetching newsletter subscriber:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get subscriber by email
   */
  static async getByEmail(
    email: string
  ): Promise<{ data: NewsletterSubscriber | null; error: string | null }> {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', email.toLowerCase().trim())
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching newsletter subscriber by email:', error)
        return { data: null, error: error.message }
      }

      return { data: data as NewsletterSubscriber || null, error: null }
    } catch (error) {
      console.error('Error fetching newsletter subscriber by email:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get all subscribers with optional filtering and pagination
   */
  static async getAll(
    options: QueryOptions = {}, 
    filters: FilterOptions = {}
  ): Promise<{ data: NewsletterSubscriber[]; error: string | null; count?: number }> {
    try {
      let query = getSupabaseAdmin()
        .from('newsletter_subscribers')
        .select('*', { count: 'exact' })

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.date_from) {
        query = query.gte('subscribed_at', filters.date_from)
      }
      if (filters.date_to) {
        query = query.lte('subscribed_at', filters.date_to)
      }

      // Apply ordering
      const orderBy = options.orderBy || 'subscribed_at'
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
        console.error('Error fetching newsletter subscribers:', error)
        return { data: [], error: error.message }
      }

      return { data: data as NewsletterSubscriber[], error: null, count: count || 0 }
    } catch (error) {
      console.error('Error fetching newsletter subscribers:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Update subscriber
   */
  static async update(
    id: string, 
    updates: NewsletterSubscriberUpdate
  ): Promise<{ data: NewsletterSubscriber | null; error: string | null }> {
    try {
      // If updating email, validate and check for duplicates
      if (updates.email) {
        const validation = validateNewsletterSubscriber({ email: updates.email })
        if (!validation.isValid) {
          return { data: null, error: validation.errors.join(', ') }
        }

        const existingSubscriber = await this.getByEmail(updates.email)
        if (existingSubscriber.data && existingSubscriber.data.id !== id) {
          return { data: null, error: 'Email already exists' }
        }
      }

      const { data, error } = await getSupabaseAdmin()
        .from('newsletter_subscribers')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating newsletter subscriber:', error)
        return { data: null, error: error.message }
      }

      return { data: data as NewsletterSubscriber, error: null }
    } catch (error) {
      console.error('Error updating newsletter subscriber:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Delete subscriber
   */
  static async delete(id: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await getSupabaseAdmin()
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting newsletter subscriber:', error)
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Error deleting newsletter subscriber:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Unsubscribe a subscriber
   */
  static async unsubscribe(
    email: string
  ): Promise<{ data: NewsletterSubscriber | null; error: string | null }> {
    try {
      const subscriber = await this.getByEmail(email)
      if (!subscriber.data) {
        return { data: null, error: 'Subscriber not found' }
      }

      return await this.update(subscriber.data.id, {
        status: 'unsubscribed',
        unsubscribed_at: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error unsubscribing:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Resubscribe a subscriber
   */
  static async resubscribe(
    email: string
  ): Promise<{ data: NewsletterSubscriber | null; error: string | null }> {
    try {
      const subscriber = await this.getByEmail(email)
      if (!subscriber.data) {
        return { data: null, error: 'Subscriber not found' }
      }

      return await this.update(subscriber.data.id, {
        status: 'active',
        unsubscribed_at: null
      })
    } catch (error) {
      console.error('Error resubscribing:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get active subscribers count
   */
  static async getActiveCount(): Promise<{ count: number; error: string | null }> {
    try {
      const { count, error } = await getSupabaseAdmin()
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

      if (error) {
        console.error('Error getting active subscribers count:', error)
        return { count: 0, error: error.message }
      }

      return { count: count || 0, error: null }
    } catch (error) {
      console.error('Error getting active subscribers count:', error)
      return { 
        count: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get subscribers by status
   */
  static async getByStatus(
    status: 'active' | 'unsubscribed' | 'bounced',
    options: QueryOptions = {}
  ): Promise<{ data: NewsletterSubscriber[]; error: string | null }> {
    try {
      const result = await this.getAll(options, { status })
      return { data: result.data, error: result.error }
    } catch (error) {
      console.error('Error fetching subscribers by status:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Search subscribers by email or name
   */
  static async search(
    searchTerm: string,
    options: QueryOptions = {}
  ): Promise<{ data: NewsletterSubscriber[]; error: string | null }> {
    try {
      let query = getSupabaseAdmin()
        .from('newsletter_subscribers')
        .select('*')

      // Search in email, first_name, and last_name
      query = query.or(`email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)

      // Apply ordering
      const orderBy = options.orderBy || 'subscribed_at'
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
        console.error('Error searching newsletter subscribers:', error)
        return { data: [], error: error.message }
      }

      return { data: data as NewsletterSubscriber[], error: null }
    } catch (error) {
      console.error('Error searching newsletter subscribers:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Bulk import subscribers
   */
  static async bulkImport(
    subscribers: NewsletterSubscriberInput[]
  ): Promise<{ 
    success: number; 
    failed: number; 
    errors: string[]; 
    data: NewsletterSubscriber[] 
  }> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
      data: [] as NewsletterSubscriber[]
    }

    for (const subscriber of subscribers) {
      try {
        const result = await this.create(subscriber)
        if (result.error) {
          results.failed++
          results.errors.push(`${subscriber.email}: ${result.error}`)
        } else if (result.data) {
          results.success++
          results.data.push(result.data)
        }
      } catch (error) {
        results.failed++
        results.errors.push(`${subscriber.email}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return results
  }
}

// Export individual functions for backward compatibility with tests
export const addSubscriber = NewsletterSubscribersService.create
export const getSubscribers = (options?: { status?: string }) => 
  NewsletterSubscribersService.getAll({}, options || {})
export const getSubscriberByEmail = NewsletterSubscribersService.getByEmail
export const updateSubscriber = NewsletterSubscribersService.update
export const removeSubscriber = NewsletterSubscribersService.delete
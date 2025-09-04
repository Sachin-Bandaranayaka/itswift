// Newsletter subscribers database service

import { getSupabaseAdmin, Database } from '../../supabase'
import { 
  NewsletterSubscriber, 
  NewsletterSubscriberInput, 
  NewsletterSubscriberUpdate, 
  QueryOptions, 
  FilterOptions,
  HomepageSubscriptionData,
  ServiceResult
} from '../types'
import { 
  validateNewsletterSubscriber, 
  sanitizeNewsletterSubscriberInput 
} from '../validation'
import { generateUnsubscribeToken } from '../../utils/token-generator'
import { getNewsletterCacheManager } from '../../utils/newsletter-cache'

export class NewsletterSubscribersService {
  /**
   * Subscribe a user from the homepage with source tracking
   * Handles both new subscriptions and reactivation of existing subscribers
   */
  static async subscribeFromHomepage(
    data: HomepageSubscriptionData
  ): Promise<ServiceResult<NewsletterSubscriber>> {
    try {
      // Validate input
      const validation = validateNewsletterSubscriber({ email: data.email })
      if (!validation.isValid) {
        return { 
          success: false, 
          error: validation.errors.join(', ') 
        }
      }

      // Check if subscriber already exists
      const existingSubscriber = await this.getByEmail(data.email)
      
      if (existingSubscriber.data) {
        // If subscriber exists but is unsubscribed, reactivate them
        if (existingSubscriber.data.status === 'unsubscribed') {
          const reactivated = await this.reactivateSubscriber(data.email)
          return {
            success: reactivated.success,
            data: reactivated.data,
            error: reactivated.error,
            message: 'Welcome back! Your subscription has been reactivated.'
          }
        }
        
        // If already active, return success with existing data
        return {
          success: true,
          data: existingSubscriber.data,
          message: 'You are already subscribed to our newsletter.'
        }
      }

      // Create new subscriber with homepage source
      const subscriberData: NewsletterSubscriberInput = {
        email: data.email.toLowerCase().trim(),
        first_name: data.first_name?.trim(),
        last_name: data.last_name?.trim(),
        status: 'active',
        source: data.source || 'homepage'
      }

      // Generate unsubscribe token for new subscriber
      const tempId = `temp_${Date.now()}`
      const unsubscribeToken = generateUnsubscribeToken(tempId, subscriberData.email)
      subscriberData.unsubscribe_token = unsubscribeToken

      const { data: newSubscriber, error } = await getSupabaseAdmin()
        .from('newsletter_subscribers')
        .insert(subscriberData as any)
        .select()
        .single()

      if (error) {
        console.error('Error creating homepage subscriber:', error)
        return { 
          success: false, 
          error: error.message 
        }
      }

      // Update the token with the actual subscriber ID
      const actualToken = generateUnsubscribeToken((newSubscriber as any).id, (newSubscriber as any).email)
      const { data: updatedSubscriber, error: updateError } = await (getSupabaseAdmin() as any)
        .from('newsletter_subscribers')
        .update({ unsubscribe_token: actualToken })
        .eq('id', (newSubscriber as any).id)
        .select()
        .single()

      if (updateError) {
        console.warn('Warning: Could not update unsubscribe token:', updateError)
        // Still return success as the subscriber was created
      }

      return {
        success: true,
        data: (updatedSubscriber || newSubscriber) as NewsletterSubscriber,
        message: 'Successfully subscribed to newsletter!'
      }
    } catch (error) {
      console.error('Error in subscribeFromHomepage:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Generate a secure unsubscribe token for a subscriber
   */
  static async generateUnsubscribeToken(subscriberId: string): Promise<string> {
    try {
      // Get subscriber to access email for token generation
      const subscriber = await this.getById(subscriberId)
      if (!subscriber.data) {
        throw new Error('Subscriber not found')
      }

      const token = generateUnsubscribeToken(subscriberId, subscriber.data.email)
      
      // Update subscriber with new token
      await this.update(subscriberId, { unsubscribe_token: token })
      
      return token
    } catch (error) {
      console.error('Error generating unsubscribe token:', error)
      throw error
    }
  }

  /**
   * Reactivate a subscriber (change status from unsubscribed to active)
   */
  static async reactivateSubscriber(email: string): Promise<ServiceResult<NewsletterSubscriber>> {
    try {
      const subscriber = await this.getByEmail(email)
      if (!subscriber.data) {
        return {
          success: false,
          error: 'Subscriber not found'
        }
      }

      // Generate new unsubscribe token for reactivated subscriber
      const newToken = generateUnsubscribeToken(subscriber.data.id, email)

      const { data: updatedSubscriber, error } = await (getSupabaseAdmin() as any)
        .from('newsletter_subscribers')
        .update({
          status: 'active',
          unsubscribed_at: null,
          unsubscribe_token: newToken,
          last_synced_at: null // Reset sync status to trigger re-sync with Brevo
        })
        .eq('id', subscriber.data.id)
        .select()
        .single()

      if (error) {
        console.error('Error reactivating subscriber:', error)
        return {
          success: false,
          error: error.message
        }
      }

      return {
        success: true,
        data: updatedSubscriber as NewsletterSubscriber,
        message: 'Subscriber successfully reactivated'
      }
    } catch (error) {
      console.error('Error in reactivateSubscriber:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Unsubscribe a subscriber using their unsubscribe token
   */
  static async unsubscribeByToken(token: string): Promise<ServiceResult<boolean>> {
    try {
      if (!token || typeof token !== 'string') {
        return {
          success: false,
          error: 'Invalid unsubscribe token'
        }
      }

      // Find subscriber by unsubscribe token
      const { data: subscriber, error: findError } = await getSupabaseAdmin()
        .from('newsletter_subscribers')
        .select('*')
        .eq('unsubscribe_token', token)
        .single()

      if (findError || !subscriber) {
        console.error('Error finding subscriber by token:', findError)
        return {
          success: false,
          error: 'Invalid or expired unsubscribe token'
        }
      }

      const typedSubscriber = subscriber as NewsletterSubscriber

      // Check if already unsubscribed
      if (typedSubscriber.status === 'unsubscribed') {
        return {
          success: true,
          data: true,
          message: 'You are already unsubscribed'
        }
      }

      // Update subscriber status to unsubscribed
      const { error: updateError } = await (getSupabaseAdmin() as any)
        .from('newsletter_subscribers')
        .update({
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString(),
          last_synced_at: null // Reset sync status to trigger sync with Brevo
        })
        .eq('id', typedSubscriber.id)

      if (updateError) {
        console.error('Error updating subscriber status:', updateError)
        return {
          success: false,
          error: 'Failed to process unsubscribe request'
        }
      }

      return {
        success: true,
        data: true,
        message: 'Successfully unsubscribed from newsletter'
      }
    } catch (error) {
      console.error('Error in unsubscribeByToken:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

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

      // Set default source if not provided
      if (!sanitizedInput.source) {
        sanitizedInput.source = 'admin'
      }

      // Check if email already exists
      const existingSubscriber = await this.getByEmail(sanitizedInput.email)
      if (existingSubscriber.data) {
        return { data: null, error: 'Email already subscribed' }
      }

      // Generate unsubscribe token if not provided
      if (!sanitizedInput.unsubscribe_token) {
        const tempId = `temp_${Date.now()}`
        sanitizedInput.unsubscribe_token = generateUnsubscribeToken(tempId, sanitizedInput.email)
      }

      const { data, error } = await getSupabaseAdmin()
        .from('newsletter_subscribers')
        .insert(sanitizedInput as any)
        .select()
        .single()

      if (error) {
        console.error('Error creating newsletter subscriber:', error)
        return { data: null, error: error.message }
      }

      // Update the token with the actual subscriber ID if we generated a temp one
      if (data && sanitizedInput.unsubscribe_token?.includes('temp_')) {
        const typedData = data as NewsletterSubscriber
        const actualToken = generateUnsubscribeToken(typedData.id, typedData.email)
        const { data: updatedData, error: updateError } = await (getSupabaseAdmin() as any)
          .from('newsletter_subscribers')
          .update({ unsubscribe_token: actualToken })
          .eq('id', typedData.id)
          .select()
          .single()

        if (updateError) {
          console.warn('Warning: Could not update unsubscribe token:', updateError)
          // Still return the original data
        } else {
          return { data: updatedData as NewsletterSubscriber, error: null }
        }
      }

      const subscriber = data as NewsletterSubscriber
      
      // Cache the new subscriber and invalidate stats
      const cacheManager = getNewsletterCacheManager()
      cacheManager.cacheSubscriber(subscriber)
      cacheManager.cacheSubscriberByEmail(subscriber.email, subscriber)
      cacheManager.invalidateStats() // Invalidate stats since we added a new subscriber
      
      return { data: subscriber, error: null }
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
   * Get subscriber by unsubscribe token
   */
  static async getByUnsubscribeToken(
    token: string
  ): Promise<{ data: NewsletterSubscriber | null; error: string | null }> {
    try {
      const { data, error } = await getSupabaseAdmin()
        .from('newsletter_subscribers')
        .select('*')
        .eq('unsubscribe_token', token)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching newsletter subscriber by token:', error)
        return { data: null, error: error.message }
      }

      return { data: data as NewsletterSubscriber || null, error: null }
    } catch (error) {
      console.error('Error fetching newsletter subscriber by token:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get subscriber by email with caching
   */
  static async getByEmail(
    email: string
  ): Promise<{ data: NewsletterSubscriber | null; error: string | null }> {
    try {
      const cacheManager = getNewsletterCacheManager()
      const normalizedEmail = email.toLowerCase().trim()
      
      // Check cache first
      const cachedSubscriber = cacheManager.getCachedSubscriberByEmail(normalizedEmail)
      if (cachedSubscriber !== null) {
        return { data: cachedSubscriber, error: null }
      }

      const { data, error } = await getSupabaseAdmin()
        .from('newsletter_subscribers')
        .select('*')
        .eq('email', normalizedEmail)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching newsletter subscriber by email:', error)
        return { data: null, error: error.message }
      }

      const subscriber = data as NewsletterSubscriber || null
      
      // Cache the result (including null results to avoid repeated DB queries)
      cacheManager.cacheSubscriberByEmail(normalizedEmail, subscriber)
      
      // Also cache by ID if subscriber exists
      if (subscriber) {
        cacheManager.cacheSubscriber(subscriber)
      }

      return { data: subscriber, error: null }
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
      if (filters.source) {
        query = query.eq('source', filters.source)
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

      const { data, error } = await (getSupabaseAdmin() as any)
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
    options: QueryOptions = {},
    filters: FilterOptions = {}
  ): Promise<{ data: NewsletterSubscriber[]; error: string | null }> {
    try {
      let query = getSupabaseAdmin()
        .from('newsletter_subscribers')
        .select('*')

      // Search in email, first_name, and last_name
      query = query.or(`email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.source) {
        query = query.eq('source', filters.source)
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
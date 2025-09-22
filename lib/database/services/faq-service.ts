import { getSupabaseAdmin } from '@/lib/supabase'
import { logger } from '@/lib/utils/logger'

export interface FAQ {
  id: string
  question: string
  answer: string
  page_slug: string
  category?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateFAQData {
  question: string
  answer: string
  page_slug: string
  category?: string
  display_order?: number
  is_active?: boolean
}

export interface UpdateFAQData {
  question?: string
  answer?: string
  page_slug?: string
  category?: string
  display_order?: number
  is_active?: boolean
}

export interface FAQFilters {
  page_slug?: string
  category?: string
  is_active?: boolean
}

export class FAQService {
  /**
   * Get all FAQs with optional filtering
   */
  static async getFAQs(filters: FAQFilters = {}): Promise<FAQ[]> {
    try {
      const supabase = getSupabaseAdmin()
      let query = supabase
        .from('faqs')
        .select('*')

      // Apply filters
      if (filters.page_slug) {
        query = query.eq('page_slug', filters.page_slug)
      }
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      if (filters.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active)
      }

      // Add ordering back - but handle it properly
      query = query.order('display_order', { ascending: true, nullsFirst: false })
      
      const { data, error } = await query

      if (error) {
        console.error('FAQ Service - Query error:', error)
        logger.error('Error fetching FAQs:', 'FAQ_SERVICE', { error: error.message })
        throw new Error(`Failed to fetch FAQs: ${error.message}`)
      }
      return (data || []) as FAQ[]
    } catch (error) {
      console.error('FAQ Service - Exception in getFAQs:', error)
      logger.error('Error in getFAQs:', 'FAQ_SERVICE', { error })
      throw error
    }
  }

  /**
   * Get FAQs for a specific page (public method)
   */
  static async getFAQsByPage(pageSlug: string): Promise<FAQ[]> {
    return this.getFAQs({ 
      page_slug: pageSlug, 
      is_active: true 
    })
  }

  /**
   * Get FAQ by ID
   */
  static async getFAQById(id: string): Promise<FAQ | null> {
    try {
      const supabase = getSupabaseAdmin()
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return null // FAQ not found
        }
        logger.error('Error fetching FAQ by ID:', 'FAQ_SERVICE', { error: error.message, id })
        throw new Error(`Failed to fetch FAQ: ${error.message}`)
      }

      return data as FAQ
    } catch (error) {
      logger.error('Error in getFAQById:', 'FAQ_SERVICE', { error, id })
      throw error
    }
  }

  /**
   * Create a new FAQ
   */
  static async createFAQ(faqData: CreateFAQData): Promise<FAQ> {
    try {
      const supabase = getSupabaseAdmin()
      
      // If no display_order provided, get the next available order for the page
      if (faqData.display_order === undefined) {
        const { data: existingFAQs } = await supabase
          .from('faqs')
          .select('display_order')
          .eq('page_slug', faqData.page_slug)
          .order('display_order', { ascending: false })
          .limit(1)

        faqData.display_order = existingFAQs && existingFAQs.length > 0 
          ? (existingFAQs[0] as any).display_order + 1 
          : 1
      }

      const { data, error } = await supabase
        .from('faqs')
        .insert([{
          ...faqData,
          is_active: faqData.is_active ?? true
        }])
        .select()
        .single()

      if (error) {
        logger.error('Error creating FAQ:', 'FAQ_SERVICE', { error: error.message, faqData })
        throw new Error(`Failed to create FAQ: ${error.message}`)
      }

      logger.info('FAQ created successfully:', 'FAQ_SERVICE', { id: (data as FAQ).id, page_slug: (data as FAQ).page_slug })
      return data as FAQ
    } catch (error) {
      logger.error('Error in createFAQ:', 'FAQ_SERVICE', { error, faqData })
      throw error
    }
  }

  /**
   * Update an existing FAQ
   */
  static async updateFAQ(id: string, updateData: UpdateFAQData): Promise<FAQ> {
    try {
      const supabase = getSupabaseAdmin()
      const { data, error } = await supabase
        .from('faqs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        logger.error('Error updating FAQ:', 'FAQ_SERVICE', { error: error.message, id, updateData })
        throw new Error(`Failed to update FAQ: ${error.message}`)
      }

      if (!data) {
        throw new Error('FAQ not found')
      }

      logger.info('FAQ updated successfully:', 'FAQ_SERVICE', { id: (data as FAQ).id })
      return data as FAQ
    } catch (error) {
      logger.error('Error in updateFAQ:', 'FAQ_SERVICE', { error, id, updateData })
      throw error
    }
  }

  /**
   * Delete an FAQ (hard delete)
   */
  static async deleteFAQ(id: string): Promise<void> {
    try {
      const supabase = getSupabaseAdmin()
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id)

      if (error) {
        logger.error('Error deleting FAQ:', 'FAQ_SERVICE', { error: error.message, id })
        throw new Error(`Failed to delete FAQ: ${error.message}`)
      }

      logger.info('FAQ deleted successfully:', 'FAQ_SERVICE', { id })
    } catch (error) {
      logger.error('Error in deleteFAQ:', 'FAQ_SERVICE', { error, id })
      throw error
    }
  }

  /**
   * Soft delete an FAQ (set is_active to false)
   */
  static async deactivateFAQ(id: string): Promise<FAQ> {
    return this.updateFAQ(id, { is_active: false })
  }

  /**
   * Reactivate a FAQ (set is_active to true)
   */
  static async activateFAQ(id: string): Promise<FAQ> {
    return this.updateFAQ(id, { is_active: true })
  }

  /**
   * Reorder FAQs within a page
   */
  static async reorderFAQs(pageSlug: string, faqOrders: { id: string; display_order: number }[]): Promise<void> {
    try {
      const supabase = getSupabaseAdmin()
      
      // Update each FAQ's display order
      const updatePromises = faqOrders.map(({ id, display_order }) =>
        supabase
          .from('faqs')
          .update({ display_order })
          .eq('id', id)
          .eq('page_slug', pageSlug) // Additional safety check
      )

      const results = await Promise.all(updatePromises)
      
      // Check for any errors
      const errors = results.filter((result: any) => result.error)
      if (errors.length > 0) {
        logger.error('Error reordering FAQs:', 'FAQ_SERVICE', { errors, pageSlug })
        throw new Error('Failed to reorder some FAQs')
      }

      logger.info('FAQs reordered successfully:', 'FAQ_SERVICE', { pageSlug, count: faqOrders.length })
    } catch (error) {
      logger.error('Error in reorderFAQs:', 'FAQ_SERVICE', { error, pageSlug, faqOrders })
      throw error
    }
  }

  /**
   * Get unique page slugs that have FAQs
   */
  static async getPageSlugsWithFAQs(): Promise<string[]> {
    try {
      const supabase = getSupabaseAdmin()
      const { data, error } = await supabase
        .from('faqs')
        .select('page_slug')
        .eq('is_active', true)

      if (error) {
        logger.error('Error fetching page slugs:', 'FAQ_SERVICE', { error: error.message })
        throw new Error(`Failed to fetch page slugs: ${error.message}`)
      }

      // Get unique page slugs
      const uniqueSlugs = [...new Set((data || []).map((item: any) => item.page_slug as string))]
      return uniqueSlugs.sort()
    } catch (error) {
      logger.error('Error in getPageSlugsWithFAQs:', 'FAQ_SERVICE', { error })
      throw error
    }
  }

  /**
   * Get unique categories for a specific page
   */
  static async getCategoriesByPage(pageSlug: string): Promise<string[]> {
    try {
      const supabase = getSupabaseAdmin()
      const { data, error } = await supabase
        .from('faqs')
        .select('category')
        .eq('page_slug', pageSlug)
        .eq('is_active', true)
        .not('category', 'is', null)

      if (error) {
        logger.error('Error fetching categories:', 'FAQ_SERVICE', { error: error.message, pageSlug })
        throw new Error(`Failed to fetch categories: ${error.message}`)
      }

      // Get unique categories
      const uniqueCategories = [...new Set((data || []).map((item: any) => item.category as string).filter(Boolean))]
      return uniqueCategories.sort()
    } catch (error) {
      logger.error('Error in getCategoriesByPage:', 'FAQ_SERVICE', { error, pageSlug })
      throw error
    }
  }

  /**
   * Bulk create FAQs
   */
  static async bulkCreateFAQs(faqsData: CreateFAQData[]): Promise<FAQ[]> {
    try {
      const supabase = getSupabaseAdmin()
      
      // Process display orders for each page
      const processedData = await Promise.all(
        faqsData.map(async (faqData) => {
          if (faqData.display_order === undefined) {
            const { data: existingFAQs } = await supabase
              .from('faqs')
              .select('display_order')
              .eq('page_slug', faqData.page_slug)
              .order('display_order', { ascending: false })
              .limit(1)

            faqData.display_order = existingFAQs && existingFAQs.length > 0 
              ? (existingFAQs[0] as any).display_order + 1 
              : 1
          }
          return {
            ...faqData,
            is_active: faqData.is_active ?? true
          }
        })
      )

      const { data, error } = await supabase
        .from('faqs')
        .insert(processedData)
        .select()

      if (error) {
        logger.error('Error bulk creating FAQs:', 'FAQ_SERVICE', { error: error.message, count: faqsData.length })
        throw new Error(`Failed to bulk create FAQs: ${error.message}`)
      }

      logger.info('FAQs bulk created successfully:', 'FAQ_SERVICE', { count: (data || []).length })
      return (data || []) as FAQ[]
    } catch (error) {
      logger.error('Error in bulkCreateFAQs:', 'FAQ_SERVICE', { error, count: faqsData.length })
      throw error
    }
  }
}
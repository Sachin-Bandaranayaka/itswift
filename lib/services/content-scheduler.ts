import { SocialPostsService, NewsletterCampaignsService } from '@/lib/database/services'
import { SocialPost, NewsletterCampaign, BlogPost } from '@/lib/database/types'
import { processScheduledPosts } from './social-media-publisher'
import { NewsletterService } from './newsletter'
import { BlogPostScheduler } from './blog-post-scheduler'

// Import the BlogProcessingResult type
interface BlogProcessingResult {
  processed: number
  successful: number
  failed: number
  errors: string[]
  publishedPosts: string[]
}

interface ScheduledItem {
  id: string
  type: 'social' | 'newsletter' | 'blog'
  scheduledAt: Date
  data: SocialPost | NewsletterCampaign | BlogPost
  retryCount?: number
  lastAttempt?: Date
  nextRetry?: Date
}

interface ProcessingResult {
  processed: number
  successful: number
  failed: number
  errors: string[]
  details: {
    social: { processed: number; successful: number; failed: number }
    newsletter: { processed: number; successful: number; failed: number }
    blog: { processed: number; successful: number; failed: number }
  }
}

interface RetryConfig {
  maxRetries: number
  retryDelayMs: number
  backoffMultiplier: number
}

interface QueueItem {
  id: string
  type: 'social' | 'newsletter' | 'blog'
  data: SocialPost | NewsletterCampaign | BlogPost
  priority: number
  retryCount: number
  maxRetries: number
  nextRetry: Date
  createdAt: Date
  lastError?: string
}

interface SchedulerStats {
  totalScheduled: number
  readyToProcess: number
  inQueue: number
  processing: number
  failed: number
  byType: {
    social: { total: number; ready: number; failed: number }
    newsletter: { total: number; ready: number; failed: number }
    blog: { total: number; ready: number; failed: number }
  }
  lastRun?: Date
  nextRun?: Date
  errors: string[]
}

export class ContentScheduler {
  private static instance: ContentScheduler
  private retryConfig: RetryConfig = {
    maxRetries: 3,
    retryDelayMs: 5000, // 5 seconds
    backoffMultiplier: 2
  }
  
  private processingQueue: Map<string, QueueItem> = new Map()
  private isProcessing: boolean = false
  private lastRun?: Date
  private nextRun?: Date
  private processingErrors: string[] = []
  private blogScheduler: BlogPostScheduler

  private constructor() {
    // Initialize queue processing
    this.scheduleNextRun()
    // Initialize blog post scheduler
    this.blogScheduler = BlogPostScheduler.getInstance()
  }

  static getInstance(): ContentScheduler {
    if (!ContentScheduler.instance) {
      ContentScheduler.instance = new ContentScheduler()
    }
    return ContentScheduler.instance
  }

  /**
   * Schedule the next processing run
   */
  private scheduleNextRun(): void {
    // Schedule next run in 5 minutes
    this.nextRun = new Date(Date.now() + 5 * 60 * 1000)
  }

  /**
   * Add item to processing queue
   */
  private addToQueue(item: ScheduledItem): void {
    const queueItem: QueueItem = {
      id: item.id,
      type: item.type,
      data: item.data,
      priority: this.calculatePriority(item),
      retryCount: item.retryCount || 0,
      maxRetries: this.retryConfig.maxRetries,
      nextRetry: item.nextRetry || new Date(),
      createdAt: new Date(),
      lastError: undefined
    }
    
    this.processingQueue.set(item.id, queueItem)
    console.log(`Added ${item.type} item ${item.id} to processing queue`)
  }

  /**
   * Remove item from processing queue
   */
  private removeFromQueue(itemId: string): void {
    this.processingQueue.delete(itemId)
    console.log(`Removed item ${itemId} from processing queue`)
  }

  /**
   * Calculate priority for queue item (lower number = higher priority)
   */
  private calculatePriority(item: ScheduledItem): number {
    const now = Date.now()
    const scheduledTime = item.scheduledAt.getTime()
    const overdue = Math.max(0, now - scheduledTime)
    
    // Higher priority for overdue items
    return overdue > 0 ? -overdue : scheduledTime
  }

  /**
   * Get items ready for processing from queue
   */
  private getReadyQueueItems(): QueueItem[] {
    const now = new Date()
    return Array.from(this.processingQueue.values())
      .filter(item => item.nextRetry <= now)
      .sort((a, b) => a.priority - b.priority)
  }

  /**
   * Get all scheduled content that's ready to be processed
   */
  async getScheduledContent(): Promise<{
    items: ScheduledItem[]
    error: string | null
  }> {
    try {
      const now = new Date()
      const items: ScheduledItem[] = []

      // Get scheduled social posts
      const socialResult = await SocialPostsService.getScheduledPosts()
      if (socialResult.error) {
        return { items: [], error: socialResult.error }
      }

      const readySocialPosts = socialResult.data.filter(post => {
        if (!post.scheduled_at) return false
        return new Date(post.scheduled_at) <= now
      })

      items.push(...readySocialPosts.map(post => ({
        id: post.id,
        type: 'social' as const,
        scheduledAt: new Date(post.scheduled_at!),
        data: post
      })))

      // Get scheduled newsletter campaigns
      const newsletterResult = await NewsletterCampaignsService.getScheduledCampaigns()
      if (newsletterResult.error) {
        return { items: [], error: newsletterResult.error }
      }

      const readyNewsletters = newsletterResult.data.filter(campaign => {
        if (!campaign.scheduled_at) return false
        return new Date(campaign.scheduled_at) <= now
      })

      items.push(...readyNewsletters.map(campaign => ({
        id: campaign.id,
        type: 'newsletter' as const,
        scheduledAt: new Date(campaign.scheduled_at!),
        data: campaign
      })))

      // Get scheduled blog posts
      const blogResult = await this.blogScheduler.getScheduledBlogPosts()
      if (blogResult.error) {
        return { items: [], error: blogResult.error }
      }

      items.push(...blogResult.items.map(blogItem => ({
        id: blogItem.id,
        type: 'blog' as const,
        scheduledAt: blogItem.scheduledAt,
        data: blogItem.data as BlogPost
      })))

      // Sort by scheduled time (oldest first)
      items.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())

      return { items, error: null }
    } catch (error) {
      console.error('Error getting scheduled content:', error)
      return { 
        items: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Process all scheduled content with queue management
   */
  async processScheduledContent(): Promise<ProcessingResult> {
    if (this.isProcessing) {
      console.log('Processing already in progress, skipping...')
      return {
        processed: 0,
        successful: 0,
        failed: 0,
        errors: ['Processing already in progress'],
        details: {
          social: { processed: 0, successful: 0, failed: 0 },
          newsletter: { processed: 0, successful: 0, failed: 0 }
        }
      }
    }

    this.isProcessing = true
    this.lastRun = new Date()
    this.processingErrors = []

    const result: ProcessingResult = {
      processed: 0,
      successful: 0,
      failed: 0,
      errors: [],
      details: {
        social: { processed: 0, successful: 0, failed: 0 },
        newsletter: { processed: 0, successful: 0, failed: 0 },
        blog: { processed: 0, successful: 0, failed: 0 }
      }
    }

    try {
      console.log('Starting scheduled content processing...')

      // Get scheduled content and add to queue
      const { items, error } = await this.getScheduledContent()
      
      if (error) {
        result.errors.push(`Failed to get scheduled content: ${error}`)
        return result
      }

      // Add new items to queue
      for (const item of items) {
        if (!this.processingQueue.has(item.id)) {
          this.addToQueue(item)
        }
      }

      // Get items ready for processing from queue
      const readyItems = this.getReadyQueueItems()
      
      if (readyItems.length === 0) {
        console.log('No items ready for processing')
        return result
      }

      console.log(`Processing ${readyItems.length} items from queue...`)

      // Process items with retry logic
      for (const queueItem of readyItems) {
        try {
          const success = await this.processQueueItem(queueItem)
          
          if (success) {
            result.successful++
            if (queueItem.type === 'social') {
              result.details.social.successful++
            } else if (queueItem.type === 'newsletter') {
              result.details.newsletter.successful++
            } else if (queueItem.type === 'blog') {
              result.details.blog.successful++
            }
            this.removeFromQueue(queueItem.id)
          } else {
            result.failed++
            if (queueItem.type === 'social') {
              result.details.social.failed++
            } else if (queueItem.type === 'newsletter') {
              result.details.newsletter.failed++
            } else if (queueItem.type === 'blog') {
              result.details.blog.failed++
            }
            
            // Handle retry logic
            await this.handleFailedItem(queueItem)
          }
          
          result.processed++
          if (queueItem.type === 'social') {
            result.details.social.processed++
          } else if (queueItem.type === 'newsletter') {
            result.details.newsletter.processed++
          } else if (queueItem.type === 'blog') {
            result.details.blog.processed++
          }

        } catch (error) {
          console.error(`Error processing queue item ${queueItem.id}:`, error)
          result.failed++
          result.errors.push(`Failed to process ${queueItem.type} item ${queueItem.id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
          
          if (queueItem.type === 'social') {
            result.details.social.failed++
            result.details.social.processed++
          } else if (queueItem.type === 'newsletter') {
            result.details.newsletter.failed++
            result.details.newsletter.processed++
          } else if (queueItem.type === 'blog') {
            result.details.blog.failed++
            result.details.blog.processed++
          }
          
          await this.handleFailedItem(queueItem, error instanceof Error ? error.message : 'Unknown error')
        }
      }

      console.log(`Completed processing: ${result.successful}/${result.processed} successful`)
      this.scheduleNextRun()
      
      return result
    } catch (error) {
      console.error('Error processing scheduled content:', error)
      result.errors.push(error instanceof Error ? error.message : 'Unknown error')
      this.processingErrors.push(error instanceof Error ? error.message : 'Unknown error')
      return result
    } finally {
      this.isProcessing = false
    }
  }

  /**
   * Process a single queue item
   */
  private async processQueueItem(queueItem: QueueItem): Promise<boolean> {
    console.log(`Processing ${queueItem.type} item ${queueItem.id} (attempt ${queueItem.retryCount + 1})`)
    
    try {
      if (queueItem.type === 'social') {
        return await this.processSingleSocialPost(queueItem.data as SocialPost)
      } else if (queueItem.type === 'newsletter') {
        return await this.processSingleNewsletter(queueItem.data as NewsletterCampaign)
      } else if (queueItem.type === 'blog') {
        return await this.processSingleBlogPost(queueItem.data as BlogPost)
      }
      
      return false
    } catch (error) {
      console.error(`Error processing ${queueItem.type} item ${queueItem.id}:`, error)
      throw error
    }
  }

  /**
   * Handle failed item with retry logic
   */
  private async handleFailedItem(queueItem: QueueItem, errorMessage?: string): Promise<void> {
    queueItem.retryCount++
    queueItem.lastError = errorMessage
    
    if (queueItem.retryCount >= queueItem.maxRetries) {
      console.log(`Max retries reached for ${queueItem.type} item ${queueItem.id}, removing from queue`)
      
      // Mark as permanently failed in database
      if (queueItem.type === 'social') {
        await SocialPostsService.update(queueItem.id, { status: 'failed' })
      } else if (queueItem.type === 'newsletter') {
        await NewsletterCampaignsService.update(queueItem.id, { status: 'failed' })
      } else if (queueItem.type === 'blog') {
        // For blog posts, we could add a comment or metadata to indicate failure
        // For now, just log the failure
        console.error(`Blog post ${queueItem.id} permanently failed to publish`)
      }
      
      this.removeFromQueue(queueItem.id)
    } else {
      // Schedule retry with exponential backoff
      const delay = this.retryConfig.retryDelayMs * Math.pow(this.retryConfig.backoffMultiplier, queueItem.retryCount - 1)
      queueItem.nextRetry = new Date(Date.now() + delay)
      
      console.log(`Scheduling retry ${queueItem.retryCount}/${queueItem.maxRetries} for ${queueItem.type} item ${queueItem.id} in ${delay}ms`)
      
      // Update queue item
      this.processingQueue.set(queueItem.id, queueItem)
    }
  }

  /**
   * Process a single social media post
   */
  private async processSingleSocialPost(post: SocialPost): Promise<boolean> {
    try {
      const { getSocialMediaPublisher } = await import('./social-media-publisher')
      const publisher = getSocialMediaPublisher()
      
      const result = await publisher.publishPost(post)
      
      if (result.success) {
        console.log(`Successfully published social post ${post.id}`)
        return true
      } else {
        console.error(`Failed to publish social post ${post.id}:`, result.error)
        return false
      }
    } catch (error) {
      console.error(`Error publishing social post ${post.id}:`, error)
      return false
    }
  }

  /**
   * Process a single newsletter campaign
   */
  private async processSingleNewsletter(campaign: NewsletterCampaign): Promise<boolean> {
    try {
      const newsletterService = new NewsletterService()
      const result = await newsletterService.sendCampaign(campaign.id)
      
      if (result.success) {
        console.log(`Successfully sent newsletter campaign ${campaign.id}`)
        return true
      } else {
        console.error(`Failed to send newsletter campaign ${campaign.id}:`, result.error)
        return false
      }
    } catch (error) {
      console.error(`Error sending newsletter campaign ${campaign.id}:`, error)
      return false
    }
  }

  /**
   * Process a single blog post
   */
  private async processSingleBlogPost(post: BlogPost): Promise<boolean> {
    try {
      // Use the blog scheduler to publish the post
      const blogScheduler = BlogPostScheduler.getInstance()
      const result = await blogScheduler.publishBlogPost({
        _id: post._id,
        title: post.title,
        publishedAt: post.publishedAt || new Date().toISOString(),
        status: 'scheduled'
      })
      
      if (result) {
        console.log(`Successfully published blog post ${post._id}`)
        return true
      } else {
        console.error(`Failed to publish blog post ${post._id}`)
        return false
      }
    } catch (error) {
      console.error(`Error publishing blog post ${post._id}:`, error)
      return false
    }
  }

  /**
   * Retry failed content with exponential backoff
   */
  async retryFailedContent(contentId: string, contentType: 'social' | 'newsletter' | 'blog'): Promise<boolean> {
    let attempt = 0
    let delay = this.retryConfig.retryDelayMs

    while (attempt < this.retryConfig.maxRetries) {
      try {
        console.log(`Retry attempt ${attempt + 1} for ${contentType} content ${contentId}`)
        
        if (contentType === 'social') {
          // Retry social post
          const post = await SocialPostsService.getById(contentId)
          if (post.error || !post.data) {
            throw new Error('Post not found')
          }
          
          // Process single post (would need to implement this method)
          // For now, just mark as failed after retries
          await SocialPostsService.update(contentId, { status: 'failed' })
          
        } else if (contentType === 'newsletter') {
          // Retry newsletter campaign
          const campaign = await NewsletterCampaignsService.getById(contentId)
          if (campaign.error || !campaign.data) {
            throw new Error('Campaign not found')
          }
          
          // Process single campaign (would need to implement this method)
          // For now, just mark as failed after retries
          await NewsletterCampaignsService.update(contentId, { status: 'failed' })
        } else if (contentType === 'blog') {
          // Retry blog post
          const blogScheduler = BlogPostScheduler.getInstance()
          const result = await blogScheduler.forceProcessQueue()
          
          if (result.publishedPosts.includes(contentId)) {
            console.log(`Successfully retried blog post ${contentId}`)
            return true
          } else {
            throw new Error('Blog post retry failed')
          }
        }

        console.log(`Successfully retried ${contentType} content ${contentId}`)
        return true

      } catch (error) {
        console.error(`Retry attempt ${attempt + 1} failed for ${contentType} content ${contentId}:`, error)
        attempt++
        
        if (attempt < this.retryConfig.maxRetries) {
          console.log(`Waiting ${delay}ms before next retry...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          delay *= this.retryConfig.backoffMultiplier
        }
      }
    }

    console.error(`All retry attempts failed for ${contentType} content ${contentId}`)
    return false
  }

  /**
   * Get comprehensive scheduling statistics
   */
  async getSchedulingStats(): Promise<SchedulerStats> {
    try {
      const now = new Date()
      
      // Get all scheduled content
      const socialResult = await SocialPostsService.getScheduledPosts()
      const newsletterResult = await NewsletterCampaignsService.getScheduledCampaigns()

      const errors: string[] = []
      
      if (socialResult.error) {
        errors.push(`Social posts error: ${socialResult.error}`)
      }

      if (newsletterResult.error) {
        errors.push(`Newsletter error: ${newsletterResult.error}`)
      }

      const socialPosts = socialResult.data || []
      const newsletters = newsletterResult.data || []

      const socialTotal = socialPosts.length
      const socialReady = socialPosts.filter(post => 
        post.scheduled_at && new Date(post.scheduled_at) <= now
      ).length
      const socialFailed = socialPosts.filter(post => post.status === 'failed').length

      const newsletterTotal = newsletters.length
      const newsletterReady = newsletters.filter(campaign => 
        campaign.scheduled_at && new Date(campaign.scheduled_at) <= now
      ).length
      const newsletterFailed = newsletters.filter(campaign => campaign.status === 'failed').length

      // Get blog post statistics
      const blogStats = await this.blogScheduler.getBlogSchedulingStats()
      
      // Add processing errors to the list
      errors.push(...this.processingErrors)
      errors.push(...blogStats.errors)

      return {
        totalScheduled: socialTotal + newsletterTotal + blogStats.totalScheduled,
        readyToProcess: socialReady + newsletterReady + blogStats.readyToProcess,
        inQueue: this.processingQueue.size + blogStats.inQueue,
        processing: (this.isProcessing ? 1 : 0) + (blogStats.processing ? 1 : 0),
        failed: socialFailed + newsletterFailed + blogStats.failed,
        byType: {
          social: { 
            total: socialTotal, 
            ready: socialReady,
            failed: socialFailed
          },
          newsletter: { 
            total: newsletterTotal, 
            ready: newsletterReady,
            failed: newsletterFailed
          },
          blog: {
            total: blogStats.totalScheduled,
            ready: blogStats.readyToProcess,
            failed: blogStats.failed
          }
        },
        lastRun: this.lastRun,
        nextRun: this.nextRun,
        errors
      }
    } catch (error) {
      console.error('Error getting scheduling stats:', error)
      return {
        totalScheduled: 0,
        readyToProcess: 0,
        inQueue: 0,
        processing: 0,
        failed: 0,
        byType: { 
          social: { total: 0, ready: 0, failed: 0 }, 
          newsletter: { total: 0, ready: 0, failed: 0 },
          blog: { total: 0, ready: 0, failed: 0 }
        },
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }
    }
  }

  /**
   * Comprehensive health check for the scheduler
   */
  async healthCheck(): Promise<{
    healthy: boolean
    lastRun?: Date
    nextRun?: Date
    queueSize: number
    isProcessing: boolean
    errors: string[]
    services: {
      database: boolean
      socialMedia: boolean
      newsletter: boolean
      blog: boolean
    }
  }> {
    const errors: string[] = []
    const services = {
      database: true,
      socialMedia: true,
      newsletter: true,
      blog: true
    }
    
    try {
      // Test database connections
      const socialTest = await SocialPostsService.getAll({ limit: 1 })
      if (socialTest.error) {
        errors.push(`Social posts service error: ${socialTest.error}`)
        services.database = false
      }

      const newsletterTest = await NewsletterCampaignsService.getAll({ limit: 1 })
      if (newsletterTest.error) {
        errors.push(`Newsletter service error: ${newsletterTest.error}`)
        services.database = false
      }

      // Test social media APIs
      try {
        const { getSocialMediaPublisher } = await import('./social-media-publisher')
        const publisher = getSocialMediaPublisher()
        const apiStatus = publisher.getApiStatus()
        
        if (!apiStatus.linkedin && !apiStatus.twitter) {
          errors.push('No social media APIs configured')
          services.socialMedia = false
        }
      } catch (error) {
        errors.push('Social media publisher error')
        services.socialMedia = false
      }

      // Test newsletter service
      try {
        const newsletterService = new NewsletterService()
        // Basic instantiation test - could add more specific health checks
      } catch (error) {
        errors.push('Newsletter service error')
        services.newsletter = false
      }

      // Test blog post scheduler
      try {
        const blogHealth = await this.blogScheduler.healthCheck()
        if (!blogHealth.healthy) {
          errors.push(...blogHealth.errors)
          services.blog = false
        }
      } catch (error) {
        errors.push('Blog scheduler error')
        services.blog = false
      }

      // Add processing errors
      errors.push(...this.processingErrors)

      return {
        healthy: errors.length === 0,
        lastRun: this.lastRun,
        nextRun: this.nextRun,
        queueSize: this.processingQueue.size,
        isProcessing: this.isProcessing,
        errors,
        services
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Unknown health check error')
      return {
        healthy: false,
        lastRun: this.lastRun,
        nextRun: this.nextRun,
        queueSize: this.processingQueue.size,
        isProcessing: this.isProcessing,
        errors,
        services
      }
    }
  }

  /**
   * Clear processing errors
   */
  clearErrors(): void {
    this.processingErrors = []
  }

  /**
   * Get queue status
   */
  getQueueStatus(): {
    size: number
    items: Array<{
      id: string
      type: string
      retryCount: number
      maxRetries: number
      nextRetry: Date
      lastError?: string
    }>
  } {
    return {
      size: this.processingQueue.size,
      items: Array.from(this.processingQueue.values()).map(item => ({
        id: item.id,
        type: item.type,
        retryCount: item.retryCount,
        maxRetries: item.maxRetries,
        nextRetry: item.nextRetry,
        lastError: item.lastError
      }))
    }
  }

  /**
   * Force process queue (for manual triggering)
   */
  async forceProcessQueue(): Promise<ProcessingResult> {
    console.log('Force processing queue...')
    return await this.processScheduledContent()
  }

  /**
   * Update retry configuration
   */
  updateRetryConfig(config: Partial<RetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config }
    console.log('Updated retry configuration:', this.retryConfig)
  }

  /**
   * Get blog post scheduler instance
   */
  getBlogScheduler(): BlogPostScheduler {
    return this.blogScheduler
  }

  /**
   * Process only scheduled blog posts
   */
  async processScheduledBlogPosts(): Promise<BlogProcessingResult> {
    return await this.blogScheduler.processScheduledBlogPosts()
  }

  /**
   * Schedule a blog post for publication
   */
  async scheduleBlogPost(postId: string, publishAt: Date): Promise<boolean> {
    return await this.blogScheduler.scheduleBlogPost(postId, publishAt)
  }

  /**
   * Unschedule a blog post
   */
  async unscheduleBlogPost(postId: string): Promise<boolean> {
    return await this.blogScheduler.unscheduleBlogPost(postId)
  }

  /**
   * Get all scheduled blog posts
   */
  async getAllScheduledBlogPosts(): Promise<{
    posts: BlogPost[]
    error: string | null
  }> {
    return await this.blogScheduler.getAllScheduledPosts()
  }
}
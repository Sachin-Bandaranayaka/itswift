import { client } from '@/lib/sanity.client'
import { BlogPost, BlogPostScheduleData } from '@/lib/database/types'

interface BlogScheduledItem {
  id: string
  type: 'blog'
  scheduledAt: Date
  data: BlogPostScheduleData
  retryCount?: number
  lastAttempt?: Date
  nextRetry?: Date
}

interface BlogProcessingResult {
  processed: number
  successful: number
  failed: number
  errors: string[]
  publishedPosts: string[]
}

interface BlogRetryConfig {
  maxRetries: number
  retryDelayMs: number
  backoffMultiplier: number
}

interface BlogQueueItem {
  id: string
  type: 'blog'
  data: BlogPostScheduleData
  priority: number
  retryCount: number
  maxRetries: number
  nextRetry: Date
  createdAt: Date
  lastError?: string
}

export class BlogPostScheduler {
  private static instance: BlogPostScheduler
  private retryConfig: BlogRetryConfig = {
    maxRetries: 3,
    retryDelayMs: 5000, // 5 seconds
    backoffMultiplier: 2
  }
  
  private processingQueue: Map<string, BlogQueueItem> = new Map()
  private isProcessing: boolean = false
  private lastRun?: Date
  private nextRun?: Date
  private processingErrors: string[] = []

  private constructor() {
    // Initialize queue processing
    this.scheduleNextRun()
  }

  static getInstance(): BlogPostScheduler {
    if (!BlogPostScheduler.instance) {
      BlogPostScheduler.instance = new BlogPostScheduler()
    }
    return BlogPostScheduler.instance
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
  private addToQueue(item: BlogScheduledItem): void {
    const queueItem: BlogQueueItem = {
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
    console.log(`Added blog post ${item.id} to processing queue`)
  }

  /**
   * Remove item from processing queue
   */
  private removeFromQueue(itemId: string): void {
    this.processingQueue.delete(itemId)
    console.log(`Removed blog post ${itemId} from processing queue`)
  }

  /**
   * Calculate priority for queue item (lower number = higher priority)
   */
  private calculatePriority(item: BlogScheduledItem): number {
    const now = Date.now()
    const scheduledTime = item.scheduledAt.getTime()
    const overdue = Math.max(0, now - scheduledTime)
    
    // Higher priority for overdue items
    return overdue > 0 ? -overdue : scheduledTime
  }

  /**
   * Get items ready for processing from queue
   */
  private getReadyQueueItems(): BlogQueueItem[] {
    const now = new Date()
    return Array.from(this.processingQueue.values())
      .filter(item => item.nextRetry <= now)
      .sort((a, b) => a.priority - b.priority)
  }

  /**
   * Get all scheduled blog posts that are ready to be published
   */
  async getScheduledBlogPosts(): Promise<{
    items: BlogScheduledItem[]
    error: string | null
  }> {
    try {
      const now = new Date().toISOString()
      
      // Query Sanity for scheduled blog posts that are ready to publish
      const query = `*[_type == "post" && publishedAt <= $now && publishedAt != null && !(_id in path("drafts.**"))] {
        _id,
        title,
        publishedAt,
        "status": "scheduled"
      }`
      
      const scheduledPosts = await client.fetch<BlogPostScheduleData[]>(query, { now })
      
      const items: BlogScheduledItem[] = scheduledPosts.map(post => ({
        id: post._id,
        type: 'blog' as const,
        scheduledAt: new Date(post.publishedAt),
        data: post
      }))

      // Sort by scheduled time (oldest first)
      items.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())

      return { items, error: null }
    } catch (error) {
      console.error('Error getting scheduled blog posts:', error)
      return { 
        items: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Process all scheduled blog posts with queue management
   */
  async processScheduledBlogPosts(): Promise<BlogProcessingResult> {
    if (this.isProcessing) {
      console.log('Blog post processing already in progress, skipping...')
      return {
        processed: 0,
        successful: 0,
        failed: 0,
        errors: ['Processing already in progress'],
        publishedPosts: []
      }
    }

    this.isProcessing = true
    this.lastRun = new Date()
    this.processingErrors = []

    const result: BlogProcessingResult = {
      processed: 0,
      successful: 0,
      failed: 0,
      errors: [],
      publishedPosts: []
    }

    try {
      console.log('Starting scheduled blog post processing...')

      // Get scheduled blog posts and add to queue
      const { items, error } = await this.getScheduledBlogPosts()
      
      if (error) {
        result.errors.push(`Failed to get scheduled blog posts: ${error}`)
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
        console.log('No blog posts ready for processing')
        return result
      }

      console.log(`Processing ${readyItems.length} blog posts from queue...`)

      // Process items with retry logic
      for (const queueItem of readyItems) {
        try {
          const success = await this.processBlogPostQueueItem(queueItem)
          
          if (success) {
            result.successful++
            result.publishedPosts.push(queueItem.id)
            this.removeFromQueue(queueItem.id)
          } else {
            result.failed++
            result.errors.push(`Failed to process blog post ${queueItem.id}: Processing returned false`)
            // Handle retry logic
            await this.handleFailedBlogPost(queueItem)
          }
          
          result.processed++

        } catch (error) {
          console.error(`Error processing blog post ${queueItem.id}:`, error)
          result.failed++
          result.processed++
          result.errors.push(`Failed to process blog post ${queueItem.id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
          
          await this.handleFailedBlogPost(queueItem, error instanceof Error ? error.message : 'Unknown error')
        }
      }

      console.log(`Completed blog post processing: ${result.successful}/${result.processed} successful`)
      this.scheduleNextRun()
      
      return result
    } catch (error) {
      console.error('Error processing scheduled blog posts:', error)
      result.errors.push(error instanceof Error ? error.message : 'Unknown error')
      this.processingErrors.push(error instanceof Error ? error.message : 'Unknown error')
      return result
    } finally {
      this.isProcessing = false
    }
  }

  /**
   * Process a single blog post queue item
   */
  private async processBlogPostQueueItem(queueItem: BlogQueueItem): Promise<boolean> {
    console.log(`Processing blog post ${queueItem.id} (attempt ${queueItem.retryCount + 1})`)
    
    try {
      return await this.publishBlogPost(queueItem.data)
    } catch (error) {
      console.error(`Error processing blog post ${queueItem.id}:`, error)
      throw error
    }
  }

  /**
   * Publish a single blog post by updating its status and trigger automation
   */
  async publishBlogPost(postData: BlogPostScheduleData): Promise<boolean> {
    try {
      // Update the blog post status to published in Sanity
      const result = await client
        .patch(postData._id)
        .set({ 
          publishedAt: new Date().toISOString(),
          // Note: We don't set a status field as it's not in the original schema
          // The publishedAt field being set indicates the post is published
        })
        .commit()
      
      if (result) {
        console.log(`Successfully published blog post ${postData._id}: "${postData.title}"`)
        
        // Trigger blog automation after successful publication
        await this.triggerBlogAutomation(result)
        
        return true
      } else {
        console.error(`Failed to publish blog post ${postData._id}`)
        return false
      }
    } catch (error) {
      console.error(`Error publishing blog post ${postData._id}:`, error)
      return false
    }
  }

  /**
   * Trigger automation for newly published blog post
   */
  private async triggerBlogAutomation(blogPost: any): Promise<void> {
    try {
      console.log(`Triggering automation for published blog post: ${blogPost.title}`)
      
      // Import AutomationEngine dynamically to avoid circular dependencies
      const { AutomationEngine } = await import('./automation-engine')
      const automationEngine = AutomationEngine.getInstance()
      
      // Process blog published automation
      const automationResult = await automationEngine.processBlogPublishedWithAutomation(blogPost)
      
      if (automationResult.success) {
        console.log(`Blog automation completed successfully for ${blogPost.title}`)
        console.log(`Generated ${automationResult.socialPosts.length} social media posts`)
        console.log(`Analytics tracking: ${automationResult.analyticsTracked ? 'enabled' : 'failed'}`)
      } else {
        console.warn(`Blog automation completed with errors for ${blogPost.title}:`, automationResult.errors)
      }
    } catch (error) {
      console.error('Error triggering blog automation:', error)
      // Don't fail the blog publication if automation fails
    }
  }

  /**
   * Handle failed blog post with retry logic
   */
  private async handleFailedBlogPost(queueItem: BlogQueueItem, errorMessage?: string): Promise<void> {
    queueItem.retryCount++
    queueItem.lastError = errorMessage
    
    if (queueItem.retryCount >= queueItem.maxRetries) {
      console.log(`Max retries reached for blog post ${queueItem.id}, removing from queue`)
      
      // Log the permanent failure (could extend to mark in Sanity if needed)
      console.error(`Permanently failed to publish blog post ${queueItem.id}: ${errorMessage}`)
      
      this.removeFromQueue(queueItem.id)
    } else {
      // Schedule retry with exponential backoff
      const delay = this.retryConfig.retryDelayMs * Math.pow(this.retryConfig.backoffMultiplier, queueItem.retryCount - 1)
      queueItem.nextRetry = new Date(Date.now() + delay)
      
      console.log(`Scheduling retry ${queueItem.retryCount}/${queueItem.maxRetries} for blog post ${queueItem.id} in ${delay}ms`)
      
      // Update queue item
      this.processingQueue.set(queueItem.id, queueItem)
    }
  }

  /**
   * Get blog post scheduling statistics
   */
  async getBlogSchedulingStats(): Promise<{
    totalScheduled: number
    readyToProcess: number
    inQueue: number
    processing: boolean
    failed: number
    lastRun?: Date
    nextRun?: Date
    errors: string[]
  }> {
    try {
      const now = new Date().toISOString()
      
      // Get all scheduled blog posts
      const scheduledQuery = `count(*[_type == "post" && publishedAt > $now && publishedAt != null && !(_id in path("drafts.**"))])`
      const readyQuery = `count(*[_type == "post" && publishedAt <= $now && publishedAt != null && !(_id in path("drafts.**"))])`
      
      const totalScheduled = await client.fetch<number>(scheduledQuery, { now })
      const readyToProcess = await client.fetch<number>(readyQuery, { now })

      // Add processing errors to the list
      const errors = [...this.processingErrors]

      return {
        totalScheduled,
        readyToProcess,
        inQueue: this.processingQueue.size,
        processing: this.isProcessing,
        failed: 0, // Could be enhanced to track failed posts in Sanity
        lastRun: this.lastRun,
        nextRun: this.nextRun,
        errors
      }
    } catch (error) {
      console.error('Error getting blog scheduling stats:', error)
      return {
        totalScheduled: 0,
        readyToProcess: 0,
        inQueue: 0,
        processing: false,
        failed: 0,
        lastRun: this.lastRun,
        nextRun: this.nextRun,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }
    }
  }

  /**
   * Health check for the blog post scheduler
   */
  async healthCheck(): Promise<{
    healthy: boolean
    lastRun?: Date
    nextRun?: Date
    queueSize: number
    isProcessing: boolean
    errors: string[]
    services: {
      sanity: boolean
    }
  }> {
    const errors: string[] = []
    const services = {
      sanity: true
    }
    
    try {
      // Test Sanity connection
      const testQuery = `count(*[_type == "post"])`
      await client.fetch<number>(testQuery)
      
    } catch (error) {
      errors.push(`Sanity connection error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      services.sanity = false
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
  }

  /**
   * Clear processing errors
   */
  clearErrors(): void {
    this.processingErrors = []
  }

  /**
   * Clear processing queue (for testing)
   */
  clearQueue(): void {
    this.processingQueue.clear()
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
  async forceProcessQueue(): Promise<BlogProcessingResult> {
    console.log('Force processing blog post queue...')
    return await this.processScheduledBlogPosts()
  }

  /**
   * Update retry configuration
   */
  updateRetryConfig(config: Partial<BlogRetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config }
    console.log('Updated blog post retry configuration:', this.retryConfig)
  }

  /**
   * Schedule a blog post for publication
   */
  async scheduleBlogPost(postId: string, publishAt: Date): Promise<boolean> {
    try {
      const result = await client
        .patch(postId)
        .set({ 
          publishedAt: publishAt.toISOString()
        })
        .commit()
      
      if (result) {
        console.log(`Successfully scheduled blog post ${postId} for ${publishAt.toISOString()}`)
        return true
      } else {
        console.error(`Failed to schedule blog post ${postId}`)
        return false
      }
    } catch (error) {
      console.error(`Error scheduling blog post ${postId}:`, error)
      return false
    }
  }

  /**
   * Unschedule a blog post (remove publishedAt date)
   */
  async unscheduleBlogPost(postId: string): Promise<boolean> {
    try {
      const result = await client
        .patch(postId)
        .unset(['publishedAt'])
        .commit()
      
      if (result) {
        console.log(`Successfully unscheduled blog post ${postId}`)
        return true
      } else {
        console.error(`Failed to unschedule blog post ${postId}`)
        return false
      }
    } catch (error) {
      console.error(`Error unscheduling blog post ${postId}:`, error)
      return false
    }
  }

  /**
   * Get all scheduled blog posts
   */
  async getAllScheduledPosts(): Promise<{
    posts: BlogPost[]
    error: string | null
  }> {
    try {
      const now = new Date().toISOString()
      
      const query = `*[_type == "post" && publishedAt > $now && publishedAt != null && !(_id in path("drafts.**"))] | order(publishedAt asc) {
        _id,
        title,
        slug,
        author->{
          _id,
          name
        },
        mainImage{
          asset->{
            url
          },
          alt
        },
        categories[]->{
          _id,
          title
        },
        publishedAt,
        body,
        _createdAt,
        _updatedAt,
        "status": "scheduled"
      }`
      
      const posts = await client.fetch<BlogPost[]>(query, { now })
      
      return { posts, error: null }
    } catch (error) {
      console.error('Error getting all scheduled blog posts:', error)
      return { 
        posts: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
}
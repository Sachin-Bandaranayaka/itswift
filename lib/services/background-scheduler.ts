// Background scheduling service with queue management and retry logic

import { SocialPostsService, NewsletterCampaignsService } from '@/lib/database/services'
import { SocialPost, NewsletterCampaign } from '@/lib/database/types'
import { SchedulerQueue, QueueItem } from './scheduler-queue'
import { SchedulerLogger } from './scheduler-logger'
import { getSocialMediaPublisher } from './social-media-publisher'
import { NewsletterService } from './newsletter'

export interface BackgroundSchedulerConfig {
  maxConcurrentJobs: number
  processingIntervalMs: number
  retryConfig: {
    maxRetries: number
    baseDelayMs: number
    backoffMultiplier: number
  }
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error'
    logFile?: string
    enableConsole: boolean
  }
}

export interface ProcessingStats {
  totalProcessed: number
  successful: number
  failed: number
  retries: number
  duration: number
  errors: string[]
  byType: {
    social: { processed: number; successful: number; failed: number }
    newsletter: { processed: number; successful: number; failed: number }
  }
}

export class BackgroundScheduler {
  private static instance: BackgroundScheduler
  private queue: SchedulerQueue
  private logger: SchedulerLogger
  private config: BackgroundSchedulerConfig
  private isRunning: boolean = false
  private processingInterval?: NodeJS.Timeout
  private activeJobs: Set<string> = new Set()
  private stats: ProcessingStats = this.initStats()

  private constructor(config?: Partial<BackgroundSchedulerConfig>) {
    this.config = {
      maxConcurrentJobs: 3,
      processingIntervalMs: 30000, // 30 seconds
      retryConfig: {
        maxRetries: 3,
        baseDelayMs: 5000, // 5 seconds
        backoffMultiplier: 2
      },
      logging: {
        level: 'info',
        enableConsole: true
      },
      ...config
    }

    this.queue = new SchedulerQueue()
    this.logger = SchedulerLogger.getInstance(
      this.config.logging.level,
      this.config.logging.logFile,
      this.config.logging.enableConsole
    )

    this.logger.info('Background scheduler initialized', { config: this.config }, 'scheduler')
  }

  static getInstance(config?: Partial<BackgroundSchedulerConfig>): BackgroundScheduler {
    if (!BackgroundScheduler.instance) {
      BackgroundScheduler.instance = new BackgroundScheduler(config)
    }
    return BackgroundScheduler.instance
  }

  /**
   * Start the background scheduler
   */
  start(): void {
    if (this.isRunning) {
      this.logger.warn('Scheduler already running', undefined, 'scheduler')
      return
    }

    this.isRunning = true
    this.logger.info('Starting background scheduler', undefined, 'scheduler')

    // Start processing interval
    this.processingInterval = setInterval(() => {
      this.processQueue().catch(error => {
        this.logger.error('Error in processing interval', { error: error.message }, 'scheduler')
      })
    }, this.config.processingIntervalMs)

    // Initial processing
    this.processQueue().catch(error => {
      this.logger.error('Error in initial processing', { error: error.message }, 'scheduler')
    })
  }

  /**
   * Stop the background scheduler
   */
  stop(): void {
    if (!this.isRunning) {
      this.logger.warn('Scheduler not running', undefined, 'scheduler')
      return
    }

    this.isRunning = false
    this.logger.info('Stopping background scheduler', undefined, 'scheduler')

    if (this.processingInterval) {
      clearInterval(this.processingInterval)
      this.processingInterval = undefined
    }

    // Wait for active jobs to complete (with timeout)
    const timeout = 30000 // 30 seconds
    const startTime = Date.now()
    
    const waitForJobs = () => {
      if (this.activeJobs.size === 0 || (Date.now() - startTime) > timeout) {
        this.logger.info('Background scheduler stopped', { 
          activeJobs: this.activeJobs.size,
          forcedStop: this.activeJobs.size > 0
        }, 'scheduler')
        return
      }
      
      setTimeout(waitForJobs, 1000)
    }
    
    waitForJobs()
  }

  /**
   * Add scheduled content to queue
   */
  async loadScheduledContent(): Promise<void> {
    try {
      this.logger.debug('Loading scheduled content', undefined, 'scheduler')
      const now = new Date()

      // Load social posts
      const socialResult = await SocialPostsService.getScheduledPosts()
      if (socialResult.error) {
        this.logger.error('Failed to load social posts', { error: socialResult.error }, 'scheduler')
      } else {
        const readyPosts = socialResult.data.filter(post => 
          post.scheduled_at && new Date(post.scheduled_at) <= now
        )

        for (const post of readyPosts) {
          if (!this.queue.get(post.id)) {
            this.queue.add({
              id: post.id,
              type: 'social',
              data: post,
              priority: this.calculatePriority(new Date(post.scheduled_at!)),
              retryCount: 0,
              maxRetries: this.config.retryConfig.maxRetries,
              nextRetry: new Date()
            })
            this.logger.logQueueAdd(post.id, 'social', this.calculatePriority(new Date(post.scheduled_at!)))
          }
        }
      }

      // Load newsletter campaigns
      const newsletterResult = await NewsletterCampaignsService.getScheduledCampaigns()
      if (newsletterResult.error) {
        this.logger.error('Failed to load newsletter campaigns', { error: newsletterResult.error }, 'scheduler')
      } else {
        const readyCampaigns = newsletterResult.data.filter(campaign => 
          campaign.scheduled_at && new Date(campaign.scheduled_at) <= now
        )

        for (const campaign of readyCampaigns) {
          if (!this.queue.get(campaign.id)) {
            this.queue.add({
              id: campaign.id,
              type: 'newsletter',
              data: campaign,
              priority: this.calculatePriority(new Date(campaign.scheduled_at!)),
              retryCount: 0,
              maxRetries: this.config.retryConfig.maxRetries,
              nextRetry: new Date()
            })
            this.logger.logQueueAdd(campaign.id, 'newsletter', this.calculatePriority(new Date(campaign.scheduled_at!)))
          }
        }
      }

    } catch (error) {
      this.logger.error('Error loading scheduled content', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 'scheduler')
    }
  }

  /**
   * Process items in the queue
   */
  private async processQueue(): Promise<void> {
    if (!this.isRunning) return

    try {
      // Load new scheduled content
      await this.loadScheduledContent()

      // Reset stuck items
      const resetCount = this.queue.resetStuckItems(30) // 30 minutes timeout
      if (resetCount > 0) {
        this.logger.warn(`Reset ${resetCount} stuck items`, { resetCount }, 'scheduler')
      }

      // Process items while we have capacity
      while (this.activeJobs.size < this.config.maxConcurrentJobs) {
        const item = this.queue.getNext()
        if (!item) break

        // Start processing this item
        this.processItem(item).catch(error => {
          this.logger.error('Error processing item', { 
            error: error.message,
            itemId: item.id,
            itemType: item.type
          }, 'processor')
        })
      }

    } catch (error) {
      this.logger.error('Error in queue processing', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 'scheduler')
    }
  }

  /**
   * Process a single queue item
   */
  private async processItem(item: QueueItem): Promise<void> {
    const startTime = Date.now()
    
    // Mark as processing
    if (!this.queue.markProcessing(item.id)) {
      this.logger.warn('Failed to mark item as processing', undefined, 'processor', item.id, item.type)
      return
    }

    this.activeJobs.add(item.id)
    this.logger.logProcessingStart(item.id, item.type, item.retryCount + 1)

    try {
      let success = false

      if (item.type === 'social') {
        success = await this.processSocialPost(item.data as SocialPost)
      } else if (item.type === 'newsletter') {
        success = await this.processNewsletterCampaign(item.data as NewsletterCampaign)
      }

      const duration = Date.now() - startTime

      if (success) {
        this.queue.markCompleted(item.id)
        this.logger.logProcessingSuccess(item.id, item.type, duration)
        this.updateStats('success', item.type)
      } else {
        const willRetry = this.queue.markFailed(item.id, 'Processing failed')
        this.logger.logProcessingFailure(item.id, item.type, 'Processing failed', item.retryCount + 1, willRetry)
        this.updateStats(willRetry ? 'retry' : 'failed', item.type)
      }

    } catch (error) {
      const duration = Date.now() - startTime
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      const willRetry = this.queue.markFailed(item.id, errorMessage)
      this.logger.logProcessingFailure(item.id, item.type, errorMessage, item.retryCount + 1, willRetry)
      this.updateStats(willRetry ? 'retry' : 'failed', item.type)

    } finally {
      this.activeJobs.delete(item.id)
    }
  }

  /**
   * Process a social media post
   */
  private async processSocialPost(post: SocialPost): Promise<boolean> {
    try {
      const publisher = getSocialMediaPublisher()
      const result = await publisher.publishPost(post)
      
      return result.success
    } catch (error) {
      this.logger.error('Social post processing error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 'processor', post.id, 'social')
      return false
    }
  }

  /**
   * Process a newsletter campaign
   */
  private async processNewsletterCampaign(campaign: NewsletterCampaign): Promise<boolean> {
    try {
      const newsletterService = new NewsletterService()
      const result = await newsletterService.sendCampaign(campaign.id)
      
      return result.success
    } catch (error) {
      this.logger.error('Newsletter campaign processing error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 'processor', campaign.id, 'newsletter')
      return false
    }
  }

  /**
   * Calculate priority for queue item (lower = higher priority)
   */
  private calculatePriority(scheduledAt: Date): number {
    const now = Date.now()
    const scheduledTime = scheduledAt.getTime()
    const overdue = Math.max(0, now - scheduledTime)
    
    // Higher priority for overdue items
    return overdue > 0 ? -overdue : scheduledTime
  }

  /**
   * Update processing statistics
   */
  private updateStats(result: 'success' | 'failed' | 'retry', type: 'social' | 'newsletter'): void {
    this.stats.totalProcessed++
    
    if (result === 'success') {
      this.stats.successful++
      this.stats.byType[type].successful++
    } else if (result === 'failed') {
      this.stats.failed++
      this.stats.byType[type].failed++
    } else if (result === 'retry') {
      this.stats.retries++
    }
    
    this.stats.byType[type].processed++
  }

  /**
   * Initialize stats object
   */
  private initStats(): ProcessingStats {
    return {
      totalProcessed: 0,
      successful: 0,
      failed: 0,
      retries: 0,
      duration: 0,
      errors: [],
      byType: {
        social: { processed: 0, successful: 0, failed: 0 },
        newsletter: { processed: 0, successful: 0, failed: 0 }
      }
    }
  }

  /**
   * Get current status
   */
  getStatus(): {
    isRunning: boolean
    activeJobs: number
    queueSize: number
    stats: ProcessingStats
    queueStats: any
    logStats: any
  } {
    return {
      isRunning: this.isRunning,
      activeJobs: this.activeJobs.size,
      queueSize: this.queue.getStats().pending,
      stats: { ...this.stats },
      queueStats: this.queue.getStats(),
      logStats: this.logger.getStats()
    }
  }

  /**
   * Force process queue (manual trigger)
   */
  async forceProcess(): Promise<ProcessingStats> {
    this.logger.info('Force processing triggered', undefined, 'scheduler')
    
    const startTime = Date.now()
    const initialStats = { ...this.stats }
    
    await this.processQueue()
    
    // Wait for active jobs to complete (with timeout)
    const timeout = 60000 // 1 minute
    const waitStart = Date.now()
    
    while (this.activeJobs.size > 0 && (Date.now() - waitStart) < timeout) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    const duration = Date.now() - startTime
    const result: ProcessingStats = {
      totalProcessed: this.stats.totalProcessed - initialStats.totalProcessed,
      successful: this.stats.successful - initialStats.successful,
      failed: this.stats.failed - initialStats.failed,
      retries: this.stats.retries - initialStats.retries,
      duration,
      errors: [],
      byType: {
        social: {
          processed: this.stats.byType.social.processed - initialStats.byType.social.processed,
          successful: this.stats.byType.social.successful - initialStats.byType.social.successful,
          failed: this.stats.byType.social.failed - initialStats.byType.social.failed
        },
        newsletter: {
          processed: this.stats.byType.newsletter.processed - initialStats.byType.newsletter.processed,
          successful: this.stats.byType.newsletter.successful - initialStats.byType.newsletter.successful,
          failed: this.stats.byType.newsletter.failed - initialStats.byType.newsletter.failed
        }
      }
    }
    
    this.logger.info('Force processing completed', result, 'scheduler')
    return result
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<BackgroundSchedulerConfig>): void {
    this.config = { ...this.config, ...config }
    
    if (config.logging) {
      this.logger.updateConfig(config.logging)
    }
    
    this.logger.info('Scheduler configuration updated', { config }, 'scheduler')
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{
    healthy: boolean
    issues: string[]
    status: any
  }> {
    const issues: string[] = []
    
    try {
      // Check if scheduler is running
      if (!this.isRunning) {
        issues.push('Scheduler is not running')
      }
      
      // Check for stuck items
      const stuckItems = this.queue.getStuckItems(30)
      if (stuckItems.length > 0) {
        issues.push(`${stuckItems.length} items stuck in processing`)
      }
      
      // Check recent errors
      const logStats = this.logger.getStats()
      if (logStats.recentErrors.length > 10) {
        issues.push(`High error rate: ${logStats.recentErrors.length} errors in last 24h`)
      }
      
      // Check database connectivity
      const socialTest = await SocialPostsService.getAll({ limit: 1 })
      if (socialTest.error) {
        issues.push(`Database connectivity issue: ${socialTest.error}`)
      }
      
      return {
        healthy: issues.length === 0,
        issues,
        status: this.getStatus()
      }
      
    } catch (error) {
      issues.push(`Health check error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      return {
        healthy: false,
        issues,
        status: this.getStatus()
      }
    }
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = this.initStats()
    this.logger.info('Statistics reset', undefined, 'scheduler')
  }

  /**
   * Get queue details
   */
  getQueueDetails(): any {
    return {
      stats: this.queue.getStats(),
      items: this.queue.getAll({ limit: 100 }),
      stuckItems: this.queue.getStuckItems()
    }
  }

  /**
   * Get logs
   */
  getLogs(limit: number = 100): any {
    return {
      recent: this.logger.getRecentLogs(limit),
      stats: this.logger.getStats()
    }
  }
}
// Queue management system for content scheduling

import { SocialPost, NewsletterCampaign } from '@/lib/database/types'

export interface QueueItem {
  id: string
  type: 'social' | 'newsletter'
  data: SocialPost | NewsletterCampaign
  priority: number
  retryCount: number
  maxRetries: number
  nextRetry: Date
  createdAt: Date
  lastAttempt?: Date
  lastError?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
}

export interface QueueStats {
  total: number
  pending: number
  processing: number
  completed: number
  failed: number
  byType: {
    social: { total: number; pending: number; failed: number }
    newsletter: { total: number; pending: number; failed: number }
  }
}

export class SchedulerQueue {
  private queue: Map<string, QueueItem> = new Map()
  private processingItems: Set<string> = new Set()
  private completedItems: Map<string, QueueItem> = new Map()
  private maxCompletedItems = 1000 // Keep last 1000 completed items for monitoring

  /**
   * Add item to queue
   */
  add(item: Omit<QueueItem, 'createdAt' | 'status'>): void {
    const queueItem: QueueItem = {
      ...item,
      createdAt: new Date(),
      status: 'pending'
    }
    
    this.queue.set(item.id, queueItem)
    console.log(`Added ${item.type} item ${item.id} to queue (priority: ${item.priority})`)
  }

  /**
   * Get next item to process (highest priority, ready for retry)
   */
  getNext(): QueueItem | null {
    const now = new Date()
    const availableItems = Array.from(this.queue.values())
      .filter(item => 
        item.status === 'pending' && 
        item.nextRetry <= now &&
        !this.processingItems.has(item.id)
      )
      .sort((a, b) => a.priority - b.priority)

    return availableItems[0] || null
  }

  /**
   * Mark item as processing
   */
  markProcessing(itemId: string): boolean {
    const item = this.queue.get(itemId)
    if (!item || item.status !== 'pending') {
      return false
    }

    item.status = 'processing'
    item.lastAttempt = new Date()
    this.processingItems.add(itemId)
    
    console.log(`Marked item ${itemId} as processing`)
    return true
  }

  /**
   * Mark item as completed successfully
   */
  markCompleted(itemId: string): boolean {
    const item = this.queue.get(itemId)
    if (!item) {
      return false
    }

    item.status = 'completed'
    this.processingItems.delete(itemId)
    this.queue.delete(itemId)
    
    // Add to completed items for monitoring
    this.completedItems.set(itemId, item)
    this.cleanupCompletedItems()
    
    console.log(`Marked item ${itemId} as completed`)
    return true
  }

  /**
   * Mark item as failed and handle retry logic
   */
  markFailed(itemId: string, error?: string): boolean {
    const item = this.queue.get(itemId)
    if (!item) {
      return false
    }

    item.retryCount++
    item.lastError = error
    this.processingItems.delete(itemId)

    if (item.retryCount >= item.maxRetries) {
      // Permanently failed
      item.status = 'failed'
      this.queue.delete(itemId)
      this.completedItems.set(itemId, item)
      this.cleanupCompletedItems()
      
      console.log(`Item ${itemId} permanently failed after ${item.retryCount} attempts`)
      return false
    } else {
      // Schedule retry with exponential backoff
      const baseDelay = 5000 // 5 seconds
      const backoffMultiplier = 2
      const delay = baseDelay * Math.pow(backoffMultiplier, item.retryCount - 1)
      
      item.nextRetry = new Date(Date.now() + delay)
      item.status = 'pending'
      
      console.log(`Scheduled retry ${item.retryCount}/${item.maxRetries} for item ${itemId} in ${delay}ms`)
      return true
    }
  }

  /**
   * Remove item from queue
   */
  remove(itemId: string): boolean {
    const removed = this.queue.delete(itemId)
    this.processingItems.delete(itemId)
    
    if (removed) {
      console.log(`Removed item ${itemId} from queue`)
    }
    
    return removed
  }

  /**
   * Get item by ID
   */
  get(itemId: string): QueueItem | null {
    return this.queue.get(itemId) || this.completedItems.get(itemId) || null
  }

  /**
   * Get all items with optional filtering
   */
  getAll(filter?: {
    status?: QueueItem['status']
    type?: QueueItem['type']
    limit?: number
  }): QueueItem[] {
    let items = Array.from(this.queue.values())
    
    // Include completed items for monitoring
    items.push(...Array.from(this.completedItems.values()))

    if (filter?.status) {
      items = items.filter(item => item.status === filter.status)
    }

    if (filter?.type) {
      items = items.filter(item => item.type === filter.type)
    }

    // Sort by priority (pending items) or completion time (completed items)
    items.sort((a, b) => {
      if (a.status === 'pending' && b.status === 'pending') {
        return a.priority - b.priority
      }
      return b.createdAt.getTime() - a.createdAt.getTime()
    })

    if (filter?.limit) {
      items = items.slice(0, filter.limit)
    }

    return items
  }

  /**
   * Get queue statistics
   */
  getStats(): QueueStats {
    const allItems = [
      ...Array.from(this.queue.values()),
      ...Array.from(this.completedItems.values())
    ]

    const stats: QueueStats = {
      total: allItems.length,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0,
      byType: {
        social: { total: 0, pending: 0, failed: 0 },
        newsletter: { total: 0, pending: 0, failed: 0 }
      }
    }

    for (const item of allItems) {
      // Overall stats
      switch (item.status) {
        case 'pending':
          stats.pending++
          break
        case 'processing':
          stats.processing++
          break
        case 'completed':
          stats.completed++
          break
        case 'failed':
          stats.failed++
          break
      }

      // By type stats
      if (item.type === 'social') {
        stats.byType.social.total++
        if (item.status === 'pending') stats.byType.social.pending++
        if (item.status === 'failed') stats.byType.social.failed++
      } else if (item.type === 'newsletter') {
        stats.byType.newsletter.total++
        if (item.status === 'pending') stats.byType.newsletter.pending++
        if (item.status === 'failed') stats.byType.newsletter.failed++
      }
    }

    return stats
  }

  /**
   * Clear completed items older than specified time
   */
  private cleanupCompletedItems(): void {
    if (this.completedItems.size <= this.maxCompletedItems) {
      return
    }

    // Sort by completion time and keep only the most recent items
    const sortedItems = Array.from(this.completedItems.entries())
      .sort(([, a], [, b]) => b.createdAt.getTime() - a.createdAt.getTime())

    // Keep only the most recent items
    const itemsToKeep = sortedItems.slice(0, this.maxCompletedItems)
    
    this.completedItems.clear()
    for (const [id, item] of itemsToKeep) {
      this.completedItems.set(id, item)
    }

    console.log(`Cleaned up completed items, kept ${itemsToKeep.length} most recent`)
  }

  /**
   * Clear all items (for testing/reset)
   */
  clear(): void {
    this.queue.clear()
    this.processingItems.clear()
    this.completedItems.clear()
    console.log('Cleared all queue items')
  }

  /**
   * Get items that are stuck in processing state
   */
  getStuckItems(timeoutMinutes: number = 30): QueueItem[] {
    const timeout = timeoutMinutes * 60 * 1000
    const now = Date.now()
    
    return Array.from(this.queue.values()).filter(item => 
      item.status === 'processing' &&
      item.lastAttempt &&
      (now - item.lastAttempt.getTime()) > timeout
    )
  }

  /**
   * Reset stuck items back to pending
   */
  resetStuckItems(timeoutMinutes: number = 30): number {
    const stuckItems = this.getStuckItems(timeoutMinutes)
    
    for (const item of stuckItems) {
      item.status = 'pending'
      item.nextRetry = new Date() // Make available immediately
      this.processingItems.delete(item.id)
      console.log(`Reset stuck item ${item.id} back to pending`)
    }
    
    return stuckItems.length
  }
}
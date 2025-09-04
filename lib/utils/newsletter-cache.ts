import { NewsletterSubscriber, NewsletterCampaign } from '@/lib/database/types'

/**
 * Cache configuration for newsletter data
 */
export const NEWSLETTER_CACHE_CONFIG = {
  // Subscriber data cache settings
  subscribers: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 1000, // Maximum number of cached subscribers
    staleWhileRevalidate: 2 * 60 * 1000, // 2 minutes
  },
  
  // Subscriber stats cache settings
  stats: {
    ttl: 15 * 60 * 1000, // 15 minutes
    maxSize: 50, // Maximum number of cached stat queries
    staleWhileRevalidate: 5 * 60 * 1000, // 5 minutes
  },
  
  // Campaign data cache settings
  campaigns: {
    ttl: 10 * 60 * 1000, // 10 minutes
    maxSize: 100, // Maximum number of cached campaigns
    staleWhileRevalidate: 3 * 60 * 1000, // 3 minutes
  },
  
  // Search results cache settings
  search: {
    ttl: 2 * 60 * 1000, // 2 minutes
    maxSize: 200, // Maximum number of cached search results
    staleWhileRevalidate: 1 * 60 * 1000, // 1 minute
  }
}

/**
 * Cache entry interface
 */
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
  key: string
}

/**
 * Newsletter data cache manager
 */
export class NewsletterCacheManager {
  private subscriberCache = new Map<string, CacheEntry<NewsletterSubscriber>>()
  private statsCache = new Map<string, CacheEntry<any>>()
  private campaignCache = new Map<string, CacheEntry<NewsletterCampaign>>()
  private searchCache = new Map<string, CacheEntry<any>>()
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor() {
    // Start cleanup interval
    this.startCleanupInterval()
  }

  /**
   * Cache a subscriber
   */
  cacheSubscriber(subscriber: NewsletterSubscriber): void {
    const key = `subscriber:${subscriber.id}`
    const entry: CacheEntry<NewsletterSubscriber> = {
      data: subscriber,
      timestamp: Date.now(),
      ttl: NEWSLETTER_CACHE_CONFIG.subscribers.ttl,
      key
    }
    
    this.subscriberCache.set(key, entry)
    this.enforceMaxSize(this.subscriberCache, NEWSLETTER_CACHE_CONFIG.subscribers.maxSize)
  }

  /**
   * Get cached subscriber
   */
  getCachedSubscriber(subscriberId: string): NewsletterSubscriber | null {
    const key = `subscriber:${subscriberId}`
    const entry = this.subscriberCache.get(key)
    
    if (!entry) return null
    
    const now = Date.now()
    const age = now - entry.timestamp
    
    // Check if expired
    if (age > entry.ttl) {
      this.subscriberCache.delete(key)
      return null
    }
    
    return entry.data
  }

  /**
   * Cache subscriber by email
   */
  cacheSubscriberByEmail(email: string, subscriber: NewsletterSubscriber | null): void {
    const key = `subscriber:email:${email.toLowerCase()}`
    const entry: CacheEntry<NewsletterSubscriber | null> = {
      data: subscriber,
      timestamp: Date.now(),
      ttl: NEWSLETTER_CACHE_CONFIG.subscribers.ttl,
      key
    }
    
    this.subscriberCache.set(key, entry as CacheEntry<NewsletterSubscriber>)
    this.enforceMaxSize(this.subscriberCache, NEWSLETTER_CACHE_CONFIG.subscribers.maxSize)
  }

  /**
   * Get cached subscriber by email
   */
  getCachedSubscriberByEmail(email: string): NewsletterSubscriber | null {
    const key = `subscriber:email:${email.toLowerCase()}`
    const entry = this.subscriberCache.get(key)
    
    if (!entry) return null
    
    const now = Date.now()
    const age = now - entry.timestamp
    
    if (age > entry.ttl) {
      this.subscriberCache.delete(key)
      return null
    }
    
    return entry.data
  }

  /**
   * Cache subscriber statistics
   */
  cacheStats(statsKey: string, stats: any): void {
    const key = `stats:${statsKey}`
    const entry: CacheEntry<any> = {
      data: stats,
      timestamp: Date.now(),
      ttl: NEWSLETTER_CACHE_CONFIG.stats.ttl,
      key
    }
    
    this.statsCache.set(key, entry)
    this.enforceMaxSize(this.statsCache, NEWSLETTER_CACHE_CONFIG.stats.maxSize)
  }

  /**
   * Get cached statistics
   */
  getCachedStats(statsKey: string): any | null {
    const key = `stats:${statsKey}`
    const entry = this.statsCache.get(key)
    
    if (!entry) return null
    
    const now = Date.now()
    const age = now - entry.timestamp
    
    if (age > entry.ttl) {
      this.statsCache.delete(key)
      return null
    }
    
    return entry.data
  }

  /**
   * Cache search results
   */
  cacheSearchResults(query: string, filters: any, results: any): void {
    const key = `search:${query}:${JSON.stringify(filters)}`
    const entry: CacheEntry<any> = {
      data: results,
      timestamp: Date.now(),
      ttl: NEWSLETTER_CACHE_CONFIG.search.ttl,
      key
    }
    
    this.searchCache.set(key, entry)
    this.enforceMaxSize(this.searchCache, NEWSLETTER_CACHE_CONFIG.search.maxSize)
  }

  /**
   * Get cached search results
   */
  getCachedSearchResults(query: string, filters: any): any | null {
    const key = `search:${query}:${JSON.stringify(filters)}`
    const entry = this.searchCache.get(key)
    
    if (!entry) return null
    
    const now = Date.now()
    const age = now - entry.timestamp
    
    if (age > entry.ttl) {
      this.searchCache.delete(key)
      return null
    }
    
    return entry.data
  }

  /**
   * Cache campaign data
   */
  cacheCampaign(campaign: NewsletterCampaign): void {
    const key = `campaign:${campaign.id}`
    const entry: CacheEntry<NewsletterCampaign> = {
      data: campaign,
      timestamp: Date.now(),
      ttl: NEWSLETTER_CACHE_CONFIG.campaigns.ttl,
      key
    }
    
    this.campaignCache.set(key, entry)
    this.enforceMaxSize(this.campaignCache, NEWSLETTER_CACHE_CONFIG.campaigns.maxSize)
  }

  /**
   * Get cached campaign
   */
  getCachedCampaign(campaignId: string): NewsletterCampaign | null {
    const key = `campaign:${campaignId}`
    const entry = this.campaignCache.get(key)
    
    if (!entry) return null
    
    const now = Date.now()
    const age = now - entry.timestamp
    
    if (age > entry.ttl) {
      this.campaignCache.delete(key)
      return null
    }
    
    return entry.data
  }

  /**
   * Invalidate subscriber cache
   */
  invalidateSubscriber(subscriberId: string, email?: string): void {
    this.subscriberCache.delete(`subscriber:${subscriberId}`)
    if (email) {
      this.subscriberCache.delete(`subscriber:email:${email.toLowerCase()}`)
    }
    
    // Also invalidate related stats
    this.invalidateStats()
  }

  /**
   * Invalidate all statistics cache
   */
  invalidateStats(): void {
    this.statsCache.clear()
  }

  /**
   * Invalidate search cache
   */
  invalidateSearchCache(): void {
    this.searchCache.clear()
  }

  /**
   * Invalidate campaign cache
   */
  invalidateCampaign(campaignId: string): void {
    this.campaignCache.delete(`campaign:${campaignId}`)
  }

  /**
   * Clear all caches
   */
  clearAll(): void {
    this.subscriberCache.clear()
    this.statsCache.clear()
    this.campaignCache.clear()
    this.searchCache.clear()
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    subscribers: { size: number; hitRate: number }
    stats: { size: number; hitRate: number }
    campaigns: { size: number; hitRate: number }
    search: { size: number; hitRate: number }
    totalMemoryUsage: number
  } {
    return {
      subscribers: {
        size: this.subscriberCache.size,
        hitRate: this.calculateHitRate(this.subscriberCache)
      },
      stats: {
        size: this.statsCache.size,
        hitRate: this.calculateHitRate(this.statsCache)
      },
      campaigns: {
        size: this.campaignCache.size,
        hitRate: this.calculateHitRate(this.campaignCache)
      },
      search: {
        size: this.searchCache.size,
        hitRate: this.calculateHitRate(this.searchCache)
      },
      totalMemoryUsage: this.estimateMemoryUsage()
    }
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    
    // Cleanup subscribers cache
    for (const [key, entry] of this.subscriberCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.subscriberCache.delete(key)
      }
    }
    
    // Cleanup stats cache
    for (const [key, entry] of this.statsCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.statsCache.delete(key)
      }
    }
    
    // Cleanup campaigns cache
    for (const [key, entry] of this.campaignCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.campaignCache.delete(key)
      }
    }
    
    // Cleanup search cache
    for (const [key, entry] of this.searchCache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.searchCache.delete(key)
      }
    }
  }

  /**
   * Start cleanup interval
   */
  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60 * 1000) // Cleanup every minute
  }

  /**
   * Stop cleanup interval
   */
  stopCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }

  /**
   * Enforce maximum cache size by removing oldest entries
   */
  private enforceMaxSize<T>(cache: Map<string, CacheEntry<T>>, maxSize: number): void {
    if (cache.size <= maxSize) return
    
    // Convert to array and sort by timestamp (oldest first)
    const entries = Array.from(cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)
    
    // Remove oldest entries until we're under the limit
    const toRemove = cache.size - maxSize
    for (let i = 0; i < toRemove; i++) {
      cache.delete(entries[i][0])
    }
  }

  /**
   * Calculate hit rate for a cache (simplified)
   */
  private calculateHitRate<T>(cache: Map<string, CacheEntry<T>>): number {
    // This is a simplified calculation
    // In a real implementation, you'd track hits and misses
    return cache.size > 0 ? 0.8 : 0 // Placeholder
  }

  /**
   * Estimate memory usage (simplified)
   */
  private estimateMemoryUsage(): number {
    let totalSize = 0
    
    // Estimate subscriber cache size
    for (const entry of this.subscriberCache.values()) {
      totalSize += JSON.stringify(entry.data).length
    }
    
    // Estimate stats cache size
    for (const entry of this.statsCache.values()) {
      totalSize += JSON.stringify(entry.data).length
    }
    
    // Estimate campaign cache size
    for (const entry of this.campaignCache.values()) {
      totalSize += JSON.stringify(entry.data).length
    }
    
    // Estimate search cache size
    for (const entry of this.searchCache.values()) {
      totalSize += JSON.stringify(entry.data).length
    }
    
    return totalSize
  }

  /**
   * Destroy the cache manager
   */
  destroy(): void {
    this.stopCleanupInterval()
    this.clearAll()
  }
}

// Global cache manager instance
let cacheManager: NewsletterCacheManager | null = null

/**
 * Get or create the global cache manager
 */
export function getNewsletterCacheManager(): NewsletterCacheManager {
  if (!cacheManager) {
    cacheManager = new NewsletterCacheManager()
  }
  return cacheManager
}

/**
 * Destroy the global cache manager
 */
export function destroyNewsletterCacheManager(): void {
  if (cacheManager) {
    cacheManager.destroy()
    cacheManager = null
  }
}
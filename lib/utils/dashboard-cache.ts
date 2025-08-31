/**
 * Advanced Dashboard Caching Utilities
 * Implements selective updates, background sync, and memory optimization
 */

import { QueryClient } from '@tanstack/react-query';
import { 
  CACHE_CONFIG, 
  BACKGROUND_SYNC, 
  CACHE_INVALIDATION,
  SELECTIVE_UPDATE,
  isBusinessHours,
  getUserActivityLevel
} from '@/lib/config/react-query';

/**
 * Cache manager for dashboard data with intelligent update strategies
 */
export class DashboardCacheManager {
  private queryClient: QueryClient;
  private backgroundSyncInterval: NodeJS.Timeout | null = null;
  private memoryMonitorInterval: NodeJS.Timeout | null = null;
  private lastUpdateTimes: Map<string, number> = new Map();
  private updateQueue: Set<string> = new Set();
  private isProcessingQueue = false;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
    this.initializeBackgroundSync();
    this.initializeMemoryMonitoring();
  }

  /**
   * Initialize intelligent background sync based on user activity and business hours
   */
  private initializeBackgroundSync(): void {
    const updateSyncStrategy = () => {
      // Clear existing interval
      if (this.backgroundSyncInterval) {
        clearInterval(this.backgroundSyncInterval);
      }

      const userActivity = getUserActivityLevel();
      const businessHours = isBusinessHours();
      
      let config;
      if (businessHours && userActivity === 'active') {
        config = BACKGROUND_SYNC.businessHours;
      } else if (userActivity === 'active') {
        config = BACKGROUND_SYNC.activeUser;
      } else if (businessHours) {
        config = BACKGROUND_SYNC.businessHours;
      } else {
        config = BACKGROUND_SYNC.offHours;
      }

      // Set up new sync interval
      this.backgroundSyncInterval = setInterval(() => {
        this.performBackgroundSync(config.priority);
      }, config.interval);
    };

    // Initial setup
    updateSyncStrategy();

    // Update strategy every 5 minutes
    setInterval(updateSyncStrategy, 5 * 60 * 1000);

    // Update on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        updateSyncStrategy();
        this.performImmediateSync(['activity', 'stats']);
      }
    });

    // Update on network status change
    window.addEventListener('online', () => {
      this.performImmediateSync(['activity', 'stats', 'scheduled']);
    });
  }

  /**
   * Initialize memory monitoring and cleanup
   */
  private initializeMemoryMonitoring(): void {
    this.memoryMonitorInterval = setInterval(() => {
      this.performMemoryCleanup();
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  /**
   * Perform background sync for specified data types
   */
  private async performBackgroundSync(priorities: string[]): Promise<void> {
    for (const priority of priorities) {
      const queryKey = this.getQueryKeyForPriority(priority);
      if (queryKey) {
        const lastUpdate = this.lastUpdateTimes.get(queryKey);
        const cacheConfig = this.getCacheConfigForPriority(priority);
        
        // Only sync if data is stale
        if (!lastUpdate || Date.now() - lastUpdate > cacheConfig.staleTime) {
          await this.queryClient.refetchQueries({
            queryKey: [queryKey],
            type: 'active',
          });
          this.lastUpdateTimes.set(queryKey, Date.now());
        }
      }
    }
  }

  /**
   * Perform immediate sync for critical data
   */
  private async performImmediateSync(priorities: string[]): Promise<void> {
    const promises = priorities.map(priority => {
      const queryKey = this.getQueryKeyForPriority(priority);
      if (queryKey) {
        return this.queryClient.refetchQueries({
          queryKey: [queryKey],
          type: 'active',
        });
      }
      return Promise.resolve();
    });

    await Promise.allSettled(promises);
  }

  /**
   * Selective update with batching to minimize API calls
   */
  public async selectiveUpdate(
    dataTypes: Array<keyof typeof CACHE_CONFIG>,
    options: {
      force?: boolean;
      batch?: boolean;
      priority?: 'high' | 'normal' | 'low';
    } = {}
  ): Promise<void> {
    const { force = false, batch = SELECTIVE_UPDATE.batchUpdates, priority = 'normal' } = options;

    if (batch) {
      // Add to update queue
      dataTypes.forEach(type => {
        this.updateQueue.add(type);
      });

      // Process queue with delay
      if (!this.isProcessingQueue) {
        setTimeout(() => {
          this.processBatchedUpdates(force, priority);
        }, SELECTIVE_UPDATE.batchDelay);
      }
    } else {
      // Immediate update
      await this.performSelectiveUpdate(dataTypes, force, priority);
    }
  }

  /**
   * Process batched updates
   */
  private async processBatchedUpdates(force: boolean, priority: 'high' | 'normal' | 'low'): Promise<void> {
    if (this.isProcessingQueue) return;
    
    this.isProcessingQueue = true;
    const dataTypes = Array.from(this.updateQueue) as Array<keyof typeof CACHE_CONFIG>;
    this.updateQueue.clear();

    try {
      await this.performSelectiveUpdate(dataTypes, force, priority);
    } finally {
      this.isProcessingQueue = false;
    }
  }

  /**
   * Perform selective update for specific data types
   */
  private async performSelectiveUpdate(
    dataTypes: Array<keyof typeof CACHE_CONFIG>,
    force: boolean,
    priority: 'high' | 'normal' | 'low'
  ): Promise<void> {
    // Sort by priority
    const sortedTypes = this.sortByPriority(dataTypes, priority);
    
    const updatePromises = sortedTypes.map(async (dataType) => {
      const queryKey = this.getQueryKeyForDataType(dataType);
      const cacheConfig = CACHE_CONFIG[dataType];
      
      if (!queryKey) return;

      const lastUpdate = this.lastUpdateTimes.get(queryKey);
      const shouldUpdate = force || !lastUpdate || Date.now() - lastUpdate > cacheConfig.staleTime;

      if (shouldUpdate) {
        try {
          await this.queryClient.refetchQueries({
            queryKey: [queryKey],
            type: 'active',
          });
          this.lastUpdateTimes.set(queryKey, Date.now());
        } catch (error) {
          console.warn(`Failed to update ${dataType}:`, error);
        }
      }
    });

    // Execute updates based on priority
    if (priority === 'high') {
      // Execute all updates immediately
      await Promise.all(updatePromises);
    } else {
      // Execute updates with some delay to prevent overwhelming the system
      await Promise.allSettled(updatePromises);
    }
  }

  /**
   * Invalidate cache based on user actions
   */
  public invalidateOnAction(action: keyof typeof CACHE_INVALIDATION): void {
    const queryKeys = CACHE_INVALIDATION[action];
    
    queryKeys.forEach(queryKey => {
      this.queryClient.invalidateQueries({ queryKey: [queryKey] });
    });
  }

  /**
   * Optimistic update with rollback capability
   */
  public async optimisticUpdate<T>(
    queryKey: string[],
    updater: (oldData: T | undefined) => T,
    mutationPromise: Promise<T>
  ): Promise<T> {
    if (!SELECTIVE_UPDATE.optimisticUpdates.enabled) {
      return mutationPromise;
    }

    // Store previous data for rollback
    const previousData = this.queryClient.getQueryData<T>(queryKey);
    
    // Apply optimistic update
    this.queryClient.setQueryData<T>(queryKey, updater);

    try {
      // Wait for mutation with timeout
      const result = await Promise.race([
        mutationPromise,
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Mutation timeout')), SELECTIVE_UPDATE.optimisticUpdates.timeout)
        )
      ]);

      // Update with real data
      this.queryClient.setQueryData<T>(queryKey, result);
      return result;
    } catch (error) {
      // Rollback on error
      if (SELECTIVE_UPDATE.optimisticUpdates.rollbackOnError) {
        this.queryClient.setQueryData<T>(queryKey, previousData);
      }
      throw error;
    }
  }

  /**
   * Prefetch data based on user behavior patterns
   */
  public async intelligentPrefetch(): Promise<void> {
    const userActivity = getUserActivityLevel();
    const businessHours = isBusinessHours();

    // Prefetch likely-to-be-accessed data
    const prefetchTargets: Array<keyof typeof CACHE_CONFIG> = [];

    if (userActivity === 'active') {
      prefetchTargets.push('activity', 'stats');
    }

    if (businessHours) {
      prefetchTargets.push('scheduled', 'performance');
    }

    // Prefetch AI usage during active hours
    if (businessHours && userActivity === 'active') {
      prefetchTargets.push('aiUsage');
    }

    await this.performSelectiveUpdate(prefetchTargets, false, 'low');
  }

  /**
   * Memory cleanup and optimization
   */
  private performMemoryCleanup(): void {
    const cache = this.queryClient.getQueryCache();
    const queries = cache.getAll();
    
    // Remove old inactive queries
    const cutoffTime = Date.now() - 30 * 60 * 1000; // 30 minutes
    
    queries.forEach(query => {
      const lastFetch = query.state.dataUpdatedAt;
      const isInactive = !query.getObserversCount();
      
      if (isInactive && lastFetch < cutoffTime) {
        cache.remove(query);
      }
    });

    // Clear update tracking for removed queries
    this.lastUpdateTimes.forEach((time, key) => {
      if (time < cutoffTime) {
        this.lastUpdateTimes.delete(key);
      }
    });
  }

  /**
   * Get cache statistics for monitoring
   */
  public getCacheStats(): {
    totalQueries: number;
    activeQueries: number;
    cacheSize: number;
    hitRatio: number;
    memoryUsage: number;
  } {
    const cache = this.queryClient.getQueryCache();
    const queries = cache.getAll();
    
    const totalQueries = queries.length;
    const activeQueries = queries.filter(q => q.getObserversCount() > 0).length;
    
    // Estimate cache size (rough calculation)
    const cacheSize = queries.reduce((size, query) => {
      const dataSize = JSON.stringify(query.state.data || {}).length;
      return size + dataSize;
    }, 0);

    // Calculate hit ratio (simplified)
    const successfulQueries = queries.filter(q => q.state.status === 'success').length;
    const hitRatio = totalQueries > 0 ? successfulQueries / totalQueries : 0;

    return {
      totalQueries,
      activeQueries,
      cacheSize,
      hitRatio,
      memoryUsage: cacheSize, // Simplified memory usage estimate
    };
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    if (this.backgroundSyncInterval) {
      clearInterval(this.backgroundSyncInterval);
    }
    if (this.memoryMonitorInterval) {
      clearInterval(this.memoryMonitorInterval);
    }
    this.lastUpdateTimes.clear();
    this.updateQueue.clear();
  }

  // Helper methods
  private getQueryKeyForPriority(priority: string): string | null {
    const mapping: Record<string, string> = {
      'activity': 'dashboard-recent-activity',
      'stats': 'dashboard-blog-stats',
      'scheduled': 'dashboard-upcoming-scheduled',
      'performance': 'dashboard-top-performing-content',
      'ai': 'dashboard-ai-usage-stats',
    };
    return mapping[priority] || null;
  }

  private getQueryKeyForDataType(dataType: keyof typeof CACHE_CONFIG): string | null {
    const mapping: Record<string, string> = {
      'stats': 'dashboard-blog-stats',
      'activity': 'dashboard-recent-activity',
      'performance': 'dashboard-top-performing-content',
      'scheduled': 'dashboard-upcoming-scheduled',
      'aiUsage': 'dashboard-ai-usage-stats',
    };
    return mapping[dataType] || null;
  }

  private getCacheConfigForPriority(priority: string) {
    const mapping: Record<string, keyof typeof CACHE_CONFIG> = {
      'activity': 'activity',
      'stats': 'stats',
      'scheduled': 'scheduled',
      'performance': 'performance',
      'ai': 'aiUsage',
    };
    const dataType = mapping[priority] || 'stats';
    return CACHE_CONFIG[dataType];
  }

  private sortByPriority(
    dataTypes: Array<keyof typeof CACHE_CONFIG>,
    priority: 'high' | 'normal' | 'low'
  ): Array<keyof typeof CACHE_CONFIG> {
    const priorityOrder: Record<'high' | 'normal' | 'low', Array<keyof typeof CACHE_CONFIG>> = {
      high: ['activity', 'stats', 'aiUsage', 'scheduled', 'performance'],
      normal: ['stats', 'activity', 'scheduled', 'performance', 'aiUsage'],
      low: ['performance', 'scheduled', 'stats', 'activity', 'aiUsage'],
    };

    const order = priorityOrder[priority];
    return dataTypes.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }
}

/**
 * Global cache manager instance
 */
let cacheManager: DashboardCacheManager | null = null;

/**
 * Initialize cache manager
 */
export function initializeCacheManager(queryClient: QueryClient): DashboardCacheManager {
  if (cacheManager) {
    cacheManager.cleanup();
  }
  cacheManager = new DashboardCacheManager(queryClient);
  return cacheManager;
}

/**
 * Get cache manager instance
 */
export function getCacheManager(): DashboardCacheManager | null {
  return cacheManager;
}

/**
 * Hook for using cache manager in components
 */
export function useCacheManager(): DashboardCacheManager | null {
  return getCacheManager();
}
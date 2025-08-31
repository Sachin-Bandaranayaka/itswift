/**
 * React Query Configuration for Optimal Dashboard Performance
 */

import { QueryClient, QueryClientConfig } from '@tanstack/react-query';

/**
 * Cache configuration for different data types
 */
export const CACHE_CONFIG = {
  // Statistics data - relatively stable, can be cached longer
  stats: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  },
  
  // Activity data - changes frequently, shorter cache
  activity: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 3 * 60 * 1000, // 3 minutes
  },
  
  // Performance data - changes slowly, can be cached longer
  performance: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: 15 * 60 * 1000, // 15 minutes
  },
  
  // Scheduled content - changes moderately, medium cache
  scheduled: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  },
  
  // AI usage - changes frequently during active use
  aiUsage: {
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  }
} as const;

/**
 * Optimized Query Client configuration for dashboard
 */
export const createOptimizedQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Default cache settings
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
        
        // Retry configuration
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Background refetch settings
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
        
        // Network mode for offline support
        networkMode: 'online',
        
        // Structural sharing for performance
        structuralSharing: true,
        
        // Prevent unnecessary re-renders
        notifyOnChangeProps: 'all',
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
        retryDelay: 1000,
        
        // Network mode
        networkMode: 'online',
      },
    },
  });
};

/**
 * Cache invalidation strategies
 */
export const CACHE_INVALIDATION = {
  // Invalidate stats when content is published
  onContentPublished: ['dashboard-blog-stats', 'dashboard-social-stats', 'dashboard-recent-activity'],
  
  // Invalidate activity when any action occurs
  onUserAction: ['dashboard-recent-activity'],
  
  // Invalidate performance data when engagement changes
  onEngagementUpdate: ['dashboard-top-performing-content'],
  
  // Invalidate scheduled content when scheduling changes
  onScheduleUpdate: ['dashboard-upcoming-scheduled'],
  
  // Invalidate AI usage when AI content is generated
  onAIUsage: ['dashboard-ai-usage-stats', 'dashboard-recent-activity'],
} as const;

/**
 * Background sync configuration
 */
export const BACKGROUND_SYNC = {
  // Sync intervals based on user activity
  activeUser: {
    interval: 2 * 60 * 1000, // 2 minutes when user is active
    priority: ['activity', 'stats'],
  },
  
  inactiveUser: {
    interval: 10 * 60 * 1000, // 10 minutes when user is inactive
    priority: ['stats'],
  },
  
  // Business hours (9 AM - 5 PM) - more frequent updates
  businessHours: {
    interval: 1 * 60 * 1000, // 1 minute during business hours
    priority: ['activity', 'stats', 'scheduled'],
  },
  
  // Off hours - less frequent updates
  offHours: {
    interval: 15 * 60 * 1000, // 15 minutes during off hours
    priority: ['stats'],
  },
} as const;

/**
 * Memory management configuration
 */
export const MEMORY_CONFIG = {
  // Maximum number of queries to keep in memory
  maxQueries: 50,
  
  // Maximum age for inactive queries
  maxAge: 30 * 60 * 1000, // 30 minutes
  
  // Garbage collection interval
  gcInterval: 5 * 60 * 1000, // 5 minutes
  
  // Memory pressure thresholds
  memoryPressure: {
    low: 0.7, // 70% memory usage
    high: 0.9, // 90% memory usage
  },
} as const;

/**
 * Selective update strategies
 */
export const SELECTIVE_UPDATE = {
  // Update only changed data sections
  diffStrategy: 'deep', // 'shallow' | 'deep'
  
  // Batch updates to reduce re-renders
  batchUpdates: true,
  batchDelay: 100, // milliseconds
  
  // Optimistic updates for user actions
  optimisticUpdates: {
    enabled: true,
    rollbackOnError: true,
    timeout: 5000, // 5 seconds
  },
} as const;

/**
 * Performance monitoring configuration
 */
export const PERFORMANCE_CONFIG = {
  // Track query performance
  enableMetrics: process.env.NODE_ENV === 'development',
  
  // Performance thresholds
  thresholds: {
    queryTime: 2000, // 2 seconds
    cacheHitRatio: 0.8, // 80%
    memoryUsage: 50 * 1024 * 1024, // 50MB
  },
  
  // Logging configuration
  logging: {
    enabled: process.env.NODE_ENV === 'development',
    level: 'warn', // 'debug' | 'info' | 'warn' | 'error'
  },
} as const;

/**
 * Utility function to get cache config for specific data type
 */
export function getCacheConfig(dataType: keyof typeof CACHE_CONFIG) {
  return CACHE_CONFIG[dataType];
}

/**
 * Utility function to determine if it's business hours
 */
export function isBusinessHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Monday to Friday, 9 AM to 5 PM
  return day >= 1 && day <= 5 && hour >= 9 && hour <= 17;
}

/**
 * Utility function to determine user activity level
 */
export function getUserActivityLevel(): 'active' | 'inactive' {
  // Check if user has interacted with the page recently
  const lastActivity = localStorage.getItem('lastUserActivity');
  if (!lastActivity) return 'inactive';
  
  const timeSinceActivity = Date.now() - parseInt(lastActivity);
  return timeSinceActivity < 5 * 60 * 1000 ? 'active' : 'inactive'; // 5 minutes
}

/**
 * Utility function to track user activity
 */
export function trackUserActivity(): void {
  localStorage.setItem('lastUserActivity', Date.now().toString());
}
/**
 * Dashboard Data Hook - Aggregates all dashboard data using React Query with advanced caching
 */

import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback, useMemo } from 'react';
import { dashboardAPI } from '@/lib/services/dashboard-api';
import { 
  DashboardData, 
  BlogStats, 
  SocialStats, 
  NewsletterStats, 
  AIUsageStats,
  ActivityItem,
  PerformingContentItem,
  ScheduledItem
} from '@/lib/types/dashboard';
import { 
  CACHE_CONFIG, 
  isBusinessHours, 
  getUserActivityLevel 
} from '@/lib/config/react-query';
import { 
  initializeCacheManager, 
  getCacheManager, 
  DashboardCacheManager 
} from '@/lib/utils/dashboard-cache';

// Using client-side API service instead of direct server-side services

/**
 * Configuration options for dashboard data hook
 */
interface UseDashboardDataOptions {
  /** Enable automatic background refresh */
  enableAutoRefresh?: boolean;
  /** Auto refresh interval in milliseconds (default: 5 minutes) */
  autoRefreshInterval?: number;
  /** Enable refetch on window focus */
  refetchOnWindowFocus?: boolean;
  /** Enable refetch on reconnect */
  refetchOnReconnect?: boolean;
  /** Custom stale time for different data types */
  staleTime?: {
    stats?: number;
    activity?: number;
    performance?: number;
    scheduled?: number;
  };
}

/**
 * Hook for fetching and caching all dashboard data with advanced caching strategies
 */
export function useDashboardData(options: UseDashboardDataOptions = {}) {
  const queryClient = useQueryClient();
  
  // Initialize cache manager
  const cacheManager = useMemo(() => {
    return initializeCacheManager(queryClient);
  }, [queryClient]);

  // Intelligent default options based on user activity and business hours
  const intelligentDefaults = useMemo(() => {
    const userActivity = getUserActivityLevel();
    const businessHours = isBusinessHours();
    
    // Adjust refresh intervals based on context
    let baseInterval = 5 * 60 * 1000; // 5 minutes default
    
    if (businessHours && userActivity === 'active') {
      baseInterval = 2 * 60 * 1000; // 2 minutes during active business hours
    } else if (userActivity === 'active') {
      baseInterval = 3 * 60 * 1000; // 3 minutes when user is active
    } else if (!businessHours) {
      baseInterval = 10 * 60 * 1000; // 10 minutes during off hours
    }

    return {
      enableAutoRefresh: true,
      autoRefreshInterval: baseInterval,
      refetchOnWindowFocus: businessHours,
      refetchOnReconnect: true,
      staleTime: {
        stats: CACHE_CONFIG.stats.staleTime,
        activity: CACHE_CONFIG.activity.staleTime,
        performance: CACHE_CONFIG.performance.staleTime,
        scheduled: CACHE_CONFIG.scheduled.staleTime,
      }
    };
  }, []);
  
  // Merge with user options
  const {
    enableAutoRefresh = intelligentDefaults.enableAutoRefresh,
    autoRefreshInterval = intelligentDefaults.autoRefreshInterval,
    refetchOnWindowFocus = intelligentDefaults.refetchOnWindowFocus,
    refetchOnReconnect = intelligentDefaults.refetchOnReconnect,
    staleTime = intelligentDefaults.staleTime
  } = options;
  // Parallel queries for all dashboard data with real-time configuration
  const queries = useQueries({
    queries: [
      {
        queryKey: ['dashboard', 'blog-stats'],
        queryFn: () => dashboardAPI.getBlogStats(),
        staleTime: staleTime.stats,
        refetchInterval: enableAutoRefresh ? autoRefreshInterval : false,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus,
        refetchOnReconnect,
        retry: 2,
      },
      {
        queryKey: ['dashboard', 'social-stats'],
        queryFn: () => dashboardAPI.getSocialStats(),
        staleTime: staleTime.stats,
        refetchInterval: enableAutoRefresh ? autoRefreshInterval : false,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus,
        refetchOnReconnect,
        retry: 2,
      },
      {
        queryKey: ['dashboard', 'newsletter-stats'],
        queryFn: () => dashboardAPI.getNewsletterStats(),
        staleTime: staleTime.stats,
        refetchInterval: enableAutoRefresh ? autoRefreshInterval : false,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus,
        refetchOnReconnect,
        retry: 2,
      },
      {
        queryKey: ['dashboard', 'ai-usage-stats'],
        queryFn: () => dashboardAPI.getAIUsageStats(),
        staleTime: staleTime.stats,
        refetchInterval: enableAutoRefresh ? autoRefreshInterval : false,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus,
        refetchOnReconnect,
        retry: 2,
      },
      {
        queryKey: ['dashboard', 'recent-activity'],
        queryFn: () => dashboardAPI.getRecentActivity(),
        staleTime: staleTime.activity,
        refetchInterval: enableAutoRefresh ? Math.min(autoRefreshInterval, 3 * 60 * 1000) : false, // More frequent for activity
        refetchIntervalInBackground: true,
        refetchOnWindowFocus,
        refetchOnReconnect,
        retry: 1,
      },
      {
        queryKey: ['dashboard', 'top-performing-content'],
        queryFn: () => dashboardAPI.getTopPerformingContent(),
        staleTime: staleTime.performance,
        refetchInterval: enableAutoRefresh ? autoRefreshInterval * 2 : false, // Less frequent for performance data
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false, // Don't refetch performance data on focus
        refetchOnReconnect,
        retry: 1,
      },
      {
        queryKey: ['dashboard', 'upcoming-scheduled'],
        queryFn: () => dashboardAPI.getUpcomingScheduled(),
        staleTime: staleTime.scheduled,
        refetchInterval: enableAutoRefresh ? autoRefreshInterval : false,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus,
        refetchOnReconnect,
        retry: 1,
      }
    ]
  });

  // Extract individual query results
  const [
    blogStatsQuery,
    socialStatsQuery,
    newsletterStatsQuery,
    aiUsageStatsQuery,
    recentActivityQuery,
    topPerformingContentQuery,
    upcomingScheduledQuery
  ] = queries;

  // Determine overall loading state
  const isLoading = queries.some(query => query.isLoading);
  const isError = queries.some(query => query.isError);
  const isFetching = queries.some(query => query.isFetching);

  // Collect all errors
  const errors = queries
    .filter(query => query.error)
    .map(query => query.error);

  // Manual refetch function for all queries
  const refetch = useCallback(() => {
    queries.forEach(query => query.refetch());
  }, [queries]);

  // Manual refresh function that forces fresh data
  const refresh = useCallback(() => {
    queries.forEach(query => {
      query.refetch({ cancelRefetch: true });
    });
  }, [queries]);

  // Force refresh with cache invalidation
  const forceRefresh = useCallback(() => {
    // Invalidate all dashboard queries to force fresh data
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  }, [queryClient]);

  // Enhanced selective refresh functions using cache manager
  const refreshStats = useCallback(async () => {
    if (cacheManager) {
      await cacheManager.selectiveUpdate(['stats'], { force: true, priority: 'high' });
    } else {
      queries.slice(0, 4).forEach(query => query.refetch({ cancelRefetch: true }));
    }
  }, [queries, cacheManager]);

  const refreshActivity = useCallback(async () => {
    if (cacheManager) {
      await cacheManager.selectiveUpdate(['activity'], { force: true, priority: 'high' });
    } else {
      queries[4]?.refetch({ cancelRefetch: true });
    }
  }, [queries, cacheManager]);

  const refreshPerformance = useCallback(async () => {
    if (cacheManager) {
      await cacheManager.selectiveUpdate(['performance'], { force: true, priority: 'normal' });
    } else {
      queries[5]?.refetch({ cancelRefetch: true });
    }
  }, [queries, cacheManager]);

  const refreshScheduled = useCallback(async () => {
    if (cacheManager) {
      await cacheManager.selectiveUpdate(['scheduled'], { force: true, priority: 'high' });
    } else {
      queries[6]?.refetch({ cancelRefetch: true });
    }
  }, [queries, cacheManager]);

  // Intelligent batch refresh based on data relationships
  const refreshRelatedData = useCallback(async (trigger: 'content-published' | 'engagement-updated' | 'schedule-changed' | 'ai-generated') => {
    if (!cacheManager) return;

    const updateMap = {
      'content-published': ['stats', 'activity'] as const,
      'engagement-updated': ['performance', 'stats'] as const,
      'schedule-changed': ['scheduled', 'activity'] as const,
      'ai-generated': ['aiUsage', 'activity'] as const,
    };

    const dataTypes = updateMap[trigger];
    await cacheManager.selectiveUpdate(dataTypes, { force: true, priority: 'high', batch: true });
  }, [cacheManager]);

  // Optimistic update function
  const optimisticUpdate = useCallback(async <T>(
    section: 'blog' | 'social' | 'newsletter' | 'ai',
    updater: (oldData: T | undefined) => T,
    mutationPromise: Promise<T>
  ) => {
    if (!cacheManager) return mutationPromise;

    const queryKeyMap = {
      blog: ['dashboard', 'blog-stats'],
      social: ['dashboard', 'social-stats'],
      newsletter: ['dashboard', 'newsletter-stats'],
      ai: ['dashboard', 'ai-usage-stats'],
    };

    const queryKey = queryKeyMap[section];
    return cacheManager.optimisticUpdate(queryKey, updater, mutationPromise);
  }, [cacheManager]);

  // Auto-refresh control
  const pauseAutoRefresh = useCallback(() => {
    queries.forEach(query => {
      queryClient.setQueryData(query.queryKey, query.data, {
        updatedAt: Date.now(),
      });
    });
  }, [queries, queryClient]);

  const resumeAutoRefresh = useCallback(() => {
    queries.forEach(query => query.refetch());
  }, [queries]);

  // Intelligent prefetching and cache warming
  useEffect(() => {
    if (!enableAutoRefresh || !cacheManager) return;

    // Intelligent prefetching based on user patterns
    const prefetchInterval = setInterval(() => {
      cacheManager.intelligentPrefetch();
    }, 10 * 60 * 1000); // Every 10 minutes

    return () => clearInterval(prefetchInterval);
  }, [enableAutoRefresh, cacheManager]);

  // Enhanced real-time update effect with intelligent intervals
  useEffect(() => {
    if (!enableAutoRefresh) return;

    const businessHours = isBusinessHours();
    const userActivity = getUserActivityLevel();

    // Dynamic interval based on context
    let activityRefreshInterval = 5 * 60 * 1000; // 5 minutes default
    
    if (businessHours && userActivity === 'active') {
      activityRefreshInterval = 60 * 1000; // 1 minute during active business hours
    } else if (userActivity === 'active') {
      activityRefreshInterval = 2 * 60 * 1000; // 2 minutes when user is active
    } else if (businessHours) {
      activityRefreshInterval = 3 * 60 * 1000; // 3 minutes during business hours
    }

    const activityInterval = setInterval(() => {
      if (cacheManager) {
        cacheManager.selectiveUpdate(['activity'], { priority: 'normal', batch: true });
      } else {
        queries[4]?.refetch(); // Fallback to direct refetch
      }
    }, activityRefreshInterval);

    return () => clearInterval(activityInterval);
  }, [enableAutoRefresh, queries, cacheManager]);

  // Background sync effect
  useEffect(() => {
    if (!enableAutoRefresh) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Refresh data when tab becomes visible
        refresh();
      }
    };

    const handleOnline = () => {
      // Refresh data when connection is restored
      refresh();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [enableAutoRefresh, refresh]);

  // Aggregate dashboard data
  const dashboardData: Partial<DashboardData> = {
    blogStats: blogStatsQuery.data,
    socialStats: socialStatsQuery.data,
    newsletterStats: newsletterStatsQuery.data,
    aiUsage: aiUsageStatsQuery.data,
    recentActivity: recentActivityQuery.data || [],
    topPerformingContent: topPerformingContentQuery.data || [],
    upcomingScheduled: upcomingScheduledQuery.data || []
  };

  return {
    // Data
    data: dashboardData,
    blogStats: blogStatsQuery.data,
    socialStats: socialStatsQuery.data,
    newsletterStats: newsletterStatsQuery.data,
    aiUsage: aiUsageStatsQuery.data,
    recentActivity: recentActivityQuery.data || [],
    topPerformingContent: topPerformingContentQuery.data || [],
    upcomingScheduled: upcomingScheduledQuery.data || [],

    // Loading states
    isLoading,
    isFetching,
    isError,

    // Individual loading states for granular control
    isLoadingBlogStats: blogStatsQuery.isLoading,
    isLoadingSocialStats: socialStatsQuery.isLoading,
    isLoadingNewsletterStats: newsletterStatsQuery.isLoading,
    isLoadingAIUsage: aiUsageStatsQuery.isLoading,
    isLoadingRecentActivity: recentActivityQuery.isLoading,
    isLoadingTopPerforming: topPerformingContentQuery.isLoading,
    isLoadingUpcomingScheduled: upcomingScheduledQuery.isLoading,

    // Fetching states for background updates
    isFetchingBlogStats: blogStatsQuery.isFetching,
    isFetchingSocialStats: socialStatsQuery.isFetching,
    isFetchingNewsletterStats: newsletterStatsQuery.isFetching,
    isFetchingAIUsage: aiUsageStatsQuery.isFetching,
    isFetchingRecentActivity: recentActivityQuery.isFetching,
    isFetchingTopPerforming: topPerformingContentQuery.isFetching,
    isFetchingUpcomingScheduled: upcomingScheduledQuery.isFetching,

    // Error handling
    errors,
    error: errors[0] || null,

    // Individual errors for granular error handling
    blogStatsError: blogStatsQuery.error,
    socialStatsError: socialStatsQuery.error,
    newsletterStatsError: newsletterStatsQuery.error,
    aiUsageError: aiUsageStatsQuery.error,
    recentActivityError: recentActivityQuery.error,
    topPerformingError: topPerformingContentQuery.error,
    upcomingScheduledError: upcomingScheduledQuery.error,

    // Refetch functions
    refetch,
    refresh,
    forceRefresh,

    // Selective refresh functions
    refreshStats,
    refreshActivity,
    refreshPerformance,
    refreshScheduled,

    // Auto-refresh control
    pauseAutoRefresh,
    resumeAutoRefresh,

    // Individual refetch functions
    refetchBlogStats: blogStatsQuery.refetch,
    refetchSocialStats: socialStatsQuery.refetch,
    refetchNewsletterStats: newsletterStatsQuery.refetch,
    refetchAIUsage: aiUsageStatsQuery.refetch,
    refetchRecentActivity: recentActivityQuery.refetch,
    refetchTopPerforming: topPerformingContentQuery.refetch,
    refetchUpcomingScheduled: upcomingScheduledQuery.refetch,

    // Data freshness indicators
    isStale: queries.some(query => query.isStale),
    dataUpdatedAt: Math.max(...queries.map(query => query.dataUpdatedAt || 0)),
    lastSuccessfulFetch: Math.max(...queries.map(query => query.dataUpdatedAt || 0)),

    // Real-time status
    isAutoRefreshEnabled: enableAutoRefresh,
    autoRefreshInterval,
    nextRefreshIn: enableAutoRefresh ? Math.min(...queries.map(query => {
      const lastFetch = query.dataUpdatedAt || 0;
      const nextRefresh = lastFetch + autoRefreshInterval;
      return Math.max(0, nextRefresh - Date.now());
    })) : null,

    // Connection status
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    
    // Cache status
    hasData: queries.some(query => query.data !== undefined),
    allDataLoaded: queries.every(query => query.data !== undefined || query.isError),

    // Enhanced cache management functions
    refreshRelatedData,
    optimisticUpdate,
    
    // Cache invalidation based on actions
    invalidateOnContentPublished: () => cacheManager?.invalidateOnAction('onContentPublished'),
    invalidateOnUserAction: () => cacheManager?.invalidateOnAction('onUserAction'),
    invalidateOnEngagementUpdate: () => cacheManager?.invalidateOnAction('onEngagementUpdate'),
    invalidateOnScheduleUpdate: () => cacheManager?.invalidateOnAction('onScheduleUpdate'),
    invalidateOnAIUsage: () => cacheManager?.invalidateOnAction('onAIUsage'),

    // Cache statistics for monitoring
    getCacheStats: () => cacheManager?.getCacheStats() || null,
    
    // Intelligent prefetch
    prefetchData: () => cacheManager?.intelligentPrefetch(),
    
    // Cache manager instance for advanced usage
    cacheManager,
  };
}

/**
 * Hook for fetching individual dashboard sections with more control and real-time updates
 */
export function useDashboardSection(
  section: 'blog' | 'social' | 'newsletter' | 'ai' | 'activity' | 'performance' | 'scheduled',
  options: {
    enableAutoRefresh?: boolean;
    autoRefreshInterval?: number;
    refetchOnWindowFocus?: boolean;
  } = {}
) {
  const {
    enableAutoRefresh = true,
    autoRefreshInterval = 5 * 60 * 1000,
    refetchOnWindowFocus = true
  } = options;
  const queryConfig = {
    blog: {
      queryKey: ['dashboard', 'blog-stats'],
      queryFn: () => dashboardAPI.getBlogStats(),
    },
    social: {
      queryKey: ['dashboard', 'social-stats'],
      queryFn: () => dashboardAPI.getSocialStats(),
    },
    newsletter: {
      queryKey: ['dashboard', 'newsletter-stats'],
      queryFn: () => dashboardAPI.getNewsletterStats(),
    },
    ai: {
      queryKey: ['dashboard', 'ai-usage-stats'],
      queryFn: () => dashboardAPI.getAIUsageStats(),
    },
    activity: {
      queryKey: ['dashboard', 'recent-activity'],
      queryFn: () => dashboardAPI.getRecentActivity(),
    },
    performance: {
      queryKey: ['dashboard', 'top-performing-content'],
      queryFn: () => dashboardAPI.getTopPerformingContent(),
    },
    scheduled: {
      queryKey: ['dashboard', 'upcoming-scheduled'],
      queryFn: () => dashboardAPI.getUpcomingScheduled(),
    }
  };

  const config = queryConfig[section];
  
  return useQuery({
    ...config,
    staleTime: section === 'activity' ? 2 * 60 * 1000 : 5 * 60 * 1000,
    refetchInterval: enableAutoRefresh ? (section === 'activity' ? Math.min(autoRefreshInterval, 3 * 60 * 1000) : autoRefreshInterval) : false,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus,
    refetchOnReconnect: true,
    retry: 2,
  });
}

/**
 * Hook for manual dashboard data management
 */
export function useDashboardControls() {
  const queryClient = useQueryClient();

  const invalidateAll = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  }, [queryClient]);

  const invalidateSection = useCallback((section: string) => {
    queryClient.invalidateQueries({ queryKey: ['dashboard', section] });
  }, [queryClient]);

  const clearCache = useCallback(() => {
    queryClient.removeQueries({ queryKey: ['dashboard'] });
  }, [queryClient]);

  const prefetchSection = useCallback(async (section: 'blog' | 'social' | 'newsletter' | 'ai' | 'activity' | 'performance' | 'scheduled') => {
    const queryConfig = {
      blog: {
        queryKey: ['dashboard', 'blog-stats'],
        queryFn: () => dashboardAPI.getBlogStats(),
      },
      social: {
        queryKey: ['dashboard', 'social-stats'],
        queryFn: () => dashboardAPI.getSocialStats(),
      },
      newsletter: {
        queryKey: ['dashboard', 'newsletter-stats'],
        queryFn: () => dashboardAPI.getNewsletterStats(),
      },
      ai: {
        queryKey: ['dashboard', 'ai-usage-stats'],
        queryFn: () => dashboardAPI.getAIUsageStats(),
      },
      activity: {
        queryKey: ['dashboard', 'recent-activity'],
        queryFn: () => dashboardAPI.getRecentActivity(),
      },
      performance: {
        queryKey: ['dashboard', 'top-performing-content'],
        queryFn: () => dashboardAPI.getTopPerformingContent(),
      },
      scheduled: {
        queryKey: ['dashboard', 'upcoming-scheduled'],
        queryFn: () => dashboardAPI.getUpcomingScheduled(),
      }
    };

    const config = queryConfig[section];
    await queryClient.prefetchQuery({
      ...config,
      staleTime: 5 * 60 * 1000,
    });
  }, [queryClient]);

  return {
    invalidateAll,
    invalidateSection,
    clearCache,
    prefetchSection,
  };
}
'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardErrorBoundary } from "@/components/admin/dashboard-error-boundary"
import { StatCard } from "@/components/admin/stat-card"
import { RecentActivityCard } from "@/components/admin/recent-activity-card"
import { TopPerformingContentCard } from "@/components/admin/top-performing-content-card"
import { UpcomingScheduledCard } from "@/components/admin/upcoming-scheduled-card"
import { 
  DashboardErrorFallback, 
  NetworkStatus, 
  DataFreshness 
} from "@/components/admin/dashboard-error-fallback"
import { BlogAnalyticsCard } from "@/components/admin/blog-analytics-card"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { useRetryMechanism } from "@/hooks/use-retry-mechanism"
import {
  FileText,
  Share2,
  Mail,
  Users,
  TrendingUp,
  Bot,
  Plus,
  RefreshCw,
  AlertCircle,
  WifiOff,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"

// Format numbers for display
const formatNumber = (num: number | undefined): string => {
  if (num === undefined) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Format time saved in hours
const formatTimeSaved = (minutes: number | undefined): string => {
  if (!minutes) return '0 hours';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours} hours`;
  return `${hours}h ${remainingMinutes}m`;
};

function DashboardContent() {
  const [isOnline, setIsOnline] = useState(true);
  const [hasNetworkError, setHasNetworkError] = useState(false);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setHasNetworkError(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setHasNetworkError(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const {
    blogStats,
    socialStats,
    newsletterStats,
    aiUsage,
    recentActivity,
    topPerformingContent,
    upcomingScheduled,
    isLoading,
    error,
    refetch,
    // Individual loading states for granular control
    isLoadingBlogStats,
    isLoadingSocialStats,
    isLoadingNewsletterStats,
    isLoadingAIUsage,
    isLoadingRecentActivity,
    isLoadingTopPerforming,
    isLoadingUpcomingScheduled,
    // Individual errors for granular error handling
    blogStatsError,
    socialStatsError,
    newsletterStatsError,
    aiUsageError,
    recentActivityError,
    topPerformingError,
    upcomingScheduledError,
    // Individual refetch functions
    refetchBlogStats,
    refetchSocialStats,
    refetchNewsletterStats,
    refetchAIUsage,
    refetchRecentActivity,
    refetchTopPerforming,
    refetchUpcomingScheduled,
    // Data freshness
    dataUpdatedAt,
    isStale,
    hasData,
    allDataLoaded,
  } = useDashboardData({
    enableAutoRefresh: true,
    autoRefreshInterval: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  // Retry mechanism for critical failures
  const {
    retry: retryAll,
    isRetrying,
    retryCount,
    lastError: retryError,
    nextRetryInSeconds,
    canRetry
  } = useRetryMechanism(
    async () => {
      await refetch();
    },
    {
      maxRetries: 3,
      initialDelay: 2000,
      backoffFactor: 2,
      onRetry: (attempt, error) => {
        console.log(`Dashboard retry attempt ${attempt}:`, error.message);
      },
      onMaxRetriesReached: (error) => {
        console.error('Dashboard max retries reached:', error);
        setHasNetworkError(true);
      }
    }
  );

  const handleRefreshAll = useCallback(() => {
    if (isRetrying) return;
    
    if (hasNetworkError || !isOnline) {
      retryAll();
    } else {
      refetch();
    }
  }, [refetch, retryAll, isRetrying, hasNetworkError, isOnline]);

  // Check if we should show the full error fallback
  const shouldShowErrorFallback = !hasData && !isLoading && (error || hasNetworkError);

  // If we have a critical error and no cached data, show full error fallback
  if (shouldShowErrorFallback) {
    return (
      <DashboardErrorFallback
        error={error || retryError}
        onRetry={canRetry ? retryAll : undefined}
        onRefresh={() => window.location.reload()}
        title={hasNetworkError ? "Connection Problem" : "Dashboard Unavailable"}
        description={
          hasNetworkError 
            ? "Unable to connect to our servers. Please check your internet connection."
            : "We're having trouble loading your dashboard data. This could be due to a network issue or temporary service interruption."
        }
        showErrorDetails={process.env.NODE_ENV === 'development'}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your content.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Content
          </Button>
        </div>
      </div>

      {/* Network Status Indicator */}
      <NetworkStatus 
        isOnline={isOnline} 
        onRetry={handleRefreshAll}
      />

      {/* Data Freshness Indicator */}
      <DataFreshness
        lastUpdated={dataUpdatedAt}
        staleThreshold={10 * 60 * 1000} // 10 minutes
        onRefresh={handleRefreshAll}
      />

      {/* Retry Status */}
      {isRetrying && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <RefreshCw className="h-5 w-5 text-blue-500 mr-2 animate-spin" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800">
                Retrying Connection
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Attempt {retryCount + 1} of 3
                {nextRetryInSeconds && ` • Next retry in ${nextRetryInSeconds}s`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Global Error Alert for partial failures */}
      {error && hasData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">
                Some Data May Be Outdated
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                We're having trouble updating some dashboard sections. Showing cached data where available.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              disabled={isRetrying}
              className="ml-4"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Retry'}
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards with Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Blog Posts This Month"
          value={blogStats?.publishedThisMonth}
          change={blogStats?.growthPercentage}
          icon={FileText}
          isLoading={isLoadingBlogStats}
          error={blogStatsError}
          onRetry={refetchBlogStats}
          formatValue={(value) => formatNumber(typeof value === 'number' ? value : undefined)}
        />
        
        <StatCard
          title="Social Posts"
          value={socialStats?.totalPosts}
          change={socialStats?.growthPercentage}
          icon={Share2}
          isLoading={isLoadingSocialStats}
          error={socialStatsError}
          onRetry={refetchSocialStats}
          formatValue={(value) => formatNumber(typeof value === 'number' ? value : undefined)}
        />
        
        <StatCard
          title="Newsletter Subscribers"
          value={newsletterStats?.totalSubscribers}
          change={newsletterStats?.growthPercentage}
          icon={Users}
          isLoading={isLoadingNewsletterStats}
          error={newsletterStatsError}
          onRetry={refetchNewsletterStats}
          formatValue={(value) => formatNumber(typeof value === 'number' ? value : undefined)}
        />
        
        <StatCard
          title="Total Engagement"
          value={socialStats?.totalEngagement}
          change={socialStats?.growthPercentage}
          icon={TrendingUp}
          isLoading={isLoadingSocialStats}
          error={socialStatsError}
          onRetry={refetchSocialStats}
          formatValue={(value) => formatNumber(typeof value === 'number' ? value : undefined)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity with Real Data */}
        <RecentActivityCard
          activities={recentActivity}
          isLoading={isLoadingRecentActivity}
          error={recentActivityError}
          onRetry={refetchRecentActivity}
        />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.open('/admin/blog/new', '_blank')}
              >
                <FileText className="h-6 w-6" />
                <span className="text-sm">New Blog Post</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.open('/admin/social', '_blank')}
              >
                <Share2 className="h-6 w-6" />
                <span className="text-sm">Social Post</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.open('/admin/newsletter', '_blank')}
              >
                <Mail className="h-6 w-6" />
                <span className="text-sm">Newsletter</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.open('/admin/content', '_blank')}
              >
                <Bot className="h-6 w-6" />
                <span className="text-sm">AI Assistant</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Performance with Real Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopPerformingContentCard
          content={topPerformingContent}
          isLoading={isLoadingTopPerforming}
          error={topPerformingError}
          onRetry={refetchTopPerforming}
        />

        <UpcomingScheduledCard
          scheduledContent={upcomingScheduled}
          isLoading={isLoadingUpcomingScheduled}
          error={upcomingScheduledError}
          onRetry={refetchUpcomingScheduled}
          onScheduleNew={() => {
            // TODO: Navigate to content scheduler
            console.log('Navigate to scheduler');
          }}
        />

        <BlogAnalyticsCard
          topPerformingPosts={topPerformingContent.filter(item => item.type === 'blog')}
          isLoading={isLoadingTopPerforming}
          error={topPerformingError}
          onRetry={refetchTopPerforming}
        />


      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <DashboardErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Dashboard error:', error, errorInfo);
        // TODO: Send error to monitoring service
      }}
    >
      <DashboardContent />
    </DashboardErrorBoundary>
  );
}
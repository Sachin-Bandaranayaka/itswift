/**
 * Example usage of the useDashboardData hook
 * This demonstrates how to use the hook in a React component
 */

import React from 'react';
import { useDashboardData, useDashboardSection, useDashboardControls } from '@/hooks/use-dashboard-data';

// Example 1: Basic usage with all dashboard data
export function DashboardExample() {
  const {
    // Data
    blogStats,
    socialStats,
    newsletterStats,
    aiUsage,
    recentActivity,
    topPerformingContent,
    upcomingScheduled,
    
    // Loading states
    isLoading,
    isFetching,
    
    // Error handling
    error,
    
    // Refresh functions
    refresh,
    forceRefresh,
    refreshActivity,
    
    // Real-time status
    isAutoRefreshEnabled,
    nextRefreshIn,
  } = useDashboardData({
    enableAutoRefresh: true,
    autoRefreshInterval: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error loading dashboard data: {error.message}</p>
        <button onClick={refresh}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="dashboard-controls">
          <button onClick={refresh} disabled={isFetching}>
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </button>
          <button onClick={forceRefresh}>Force Refresh</button>
          <button onClick={refreshActivity}>Refresh Activity</button>
        </div>
        {isAutoRefreshEnabled && nextRefreshIn && (
          <p>Next auto-refresh in: {Math.round(nextRefreshIn / 1000)}s</p>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Blog Posts</h3>
          <p>Total: {blogStats?.totalPosts || 0}</p>
          <p>This Month: {blogStats?.publishedThisMonth || 0}</p>
          <p>Growth: {blogStats?.growthPercentage || 0}%</p>
        </div>

        <div className="stat-card">
          <h3>Social Media</h3>
          <p>Total Posts: {socialStats?.totalPosts || 0}</p>
          <p>This Week: {socialStats?.postsThisWeek || 0}</p>
          <p>Engagement: {socialStats?.totalEngagement || 0}</p>
        </div>

        <div className="stat-card">
          <h3>Newsletter</h3>
          <p>Subscribers: {newsletterStats?.totalSubscribers || 0}</p>
          <p>New This Month: {newsletterStats?.newSubscribersThisMonth || 0}</p>
          <p>Growth: {newsletterStats?.growthPercentage || 0}%</p>
        </div>

        <div className="stat-card">
          <h3>AI Usage</h3>
          <p>Content Generated: {aiUsage?.contentGenerated || 0}</p>
          <p>Tokens Used: {aiUsage?.tokensUsed || 0}</p>
          <p>Time Saved: {aiUsage?.timeSaved || 0} minutes</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <ul>
              {recentActivity.map((activity) => (
                <li key={activity.id}>
                  <strong>{activity.title}</strong> - {activity.description}
                  <br />
                  <small>{activity.timestamp.toLocaleString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent activity</p>
          )}
        </div>

        <div className="top-performing">
          <h3>Top Performing Content</h3>
          {topPerformingContent.length > 0 ? (
            <ul>
              {topPerformingContent.map((content) => (
                <li key={content.id}>
                  <strong>{content.title}</strong> ({content.type})
                  <br />
                  <small>
                    Likes: {content.metrics.likes || 0}, 
                    Shares: {content.metrics.shares || 0}, 
                    Opens: {content.metrics.opens || 0}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No performance data available</p>
          )}
        </div>

        <div className="upcoming-scheduled">
          <h3>Upcoming Scheduled</h3>
          {upcomingScheduled.length > 0 ? (
            <ul>
              {upcomingScheduled.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong> ({item.type})
                  <br />
                  <small>Scheduled: {item.scheduledAt.toLocaleString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No scheduled content</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Example 2: Using individual sections
export function BlogStatsSection() {
  const { data: blogStats, isLoading, error, refetch } = useDashboardSection('blog', {
    enableAutoRefresh: true,
    autoRefreshInterval: 3 * 60 * 1000, // 3 minutes
  });

  if (isLoading) return <div>Loading blog stats...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="blog-stats">
      <h3>Blog Statistics</h3>
      <p>Total Posts: {blogStats?.totalPosts || 0}</p>
      <p>Published This Month: {blogStats?.publishedThisMonth || 0}</p>
      <p>Growth: {blogStats?.growthPercentage || 0}%</p>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}

// Example 3: Using dashboard controls
export function DashboardControls() {
  const { invalidateAll, invalidateSection, clearCache, prefetchSection } = useDashboardControls();

  return (
    <div className="dashboard-controls">
      <h3>Dashboard Controls</h3>
      <button onClick={invalidateAll}>Invalidate All Data</button>
      <button onClick={() => invalidateSection('blog-stats')}>Invalidate Blog Stats</button>
      <button onClick={clearCache}>Clear Cache</button>
      <button onClick={() => prefetchSection('social')}>Prefetch Social Data</button>
    </div>
  );
}

// Example 4: Custom configuration
export function CustomDashboard() {
  const dashboardData = useDashboardData({
    enableAutoRefresh: false, // Disable auto-refresh
    refetchOnWindowFocus: false, // Don't refetch on window focus
    staleTime: {
      stats: 10 * 60 * 1000, // 10 minutes for stats
      activity: 1 * 60 * 1000, // 1 minute for activity
      performance: 30 * 60 * 1000, // 30 minutes for performance
      scheduled: 5 * 60 * 1000, // 5 minutes for scheduled
    },
  });

  return (
    <div className="custom-dashboard">
      <h2>Custom Dashboard Configuration</h2>
      <p>Auto-refresh: {dashboardData.isAutoRefreshEnabled ? 'Enabled' : 'Disabled'}</p>
      <p>Data freshness: {dashboardData.isStale ? 'Stale' : 'Fresh'}</p>
      <p>Has data: {dashboardData.hasData ? 'Yes' : 'No'}</p>
      <p>All data loaded: {dashboardData.allDataLoaded ? 'Yes' : 'No'}</p>
      
      <div className="manual-controls">
        <button onClick={dashboardData.refresh}>Manual Refresh</button>
        <button onClick={dashboardData.forceRefresh}>Force Refresh</button>
        <button onClick={dashboardData.refreshStats}>Refresh Stats Only</button>
        <button onClick={dashboardData.refreshActivity}>Refresh Activity Only</button>
      </div>
    </div>
  );
}
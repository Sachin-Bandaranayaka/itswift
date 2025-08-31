/**
 * Optimized Dashboard Data Services
 * Uses optimized database queries and connection pooling for better performance
 */

import { getOptimizedDatabaseService } from '@/lib/database/optimized-connection';
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
import { BlogDataService } from './blog-data';

/**
 * Optimized Social Data Service using database optimization
 */
export class OptimizedSocialDataService {
  private dbService = getOptimizedDatabaseService();

  async getSocialStats(): Promise<SocialStats> {
    try {
      const stats = await this.dbService.getSocialDashboardStats();
      return {
        totalPosts: stats.totalPosts,
        postsThisWeek: stats.postsThisWeek,
        totalEngagement: stats.totalEngagement,
        growthPercentage: stats.growthPercentage
      };
    } catch (error) {
      console.error('Error fetching optimized social stats:', error);
      return {
        totalPosts: 0,
        postsThisWeek: 0,
        totalEngagement: 0,
        growthPercentage: 0
      };
    }
  }

  async getRecentSocialActivity(): Promise<ActivityItem[]> {
    try {
      const activities = await this.dbService.getRecentDashboardActivity(10);
      return activities
        .filter(activity => activity.type === 'social')
        .slice(0, 5)
        .map(activity => ({
          id: activity.id,
          type: 'social' as const,
          title: activity.title,
          description: activity.description,
          timestamp: activity.timestamp,
          status: activity.status as any,
          platform: activity.platform
        }));
    } catch (error) {
      console.error('Error fetching optimized social activity:', error);
      return [];
    }
  }

  async getTopPerformingSocialContent(): Promise<PerformingContentItem[]> {
    try {
      const content = await this.dbService.getTopPerformingContent(5);
      return content
        .filter(item => item.type === 'social')
        .map(item => ({
          id: item.id,
          title: item.title,
          type: 'social' as const,
          platform: item.platform,
          metrics: item.metrics
        }));
    } catch (error) {
      console.error('Error fetching optimized top performing social content:', error);
      return [];
    }
  }

  async getScheduledSocialPosts(): Promise<ScheduledItem[]> {
    try {
      const scheduled = await this.dbService.getScheduledContent(5);
      return scheduled
        .filter(item => item.type === 'social')
        .map(item => ({
          id: item.id,
          title: item.title,
          type: 'social' as const,
          platform: item.platform,
          scheduledAt: item.scheduledAt
        }));
    } catch (error) {
      console.error('Error fetching optimized scheduled social posts:', error);
      return [];
    }
  }
}

/**
 * Optimized Newsletter Data Service using database optimization
 */
export class OptimizedNewsletterDataService {
  private dbService = getOptimizedDatabaseService();

  async getNewsletterStats(): Promise<NewsletterStats> {
    try {
      const stats = await this.dbService.getNewsletterDashboardStats();
      return {
        totalSubscribers: stats.totalSubscribers,
        newSubscribersThisMonth: stats.newSubscribersThisMonth,
        growthPercentage: stats.growthPercentage
      };
    } catch (error) {
      console.error('Error fetching optimized newsletter stats:', error);
      return {
        totalSubscribers: 0,
        newSubscribersThisMonth: 0,
        growthPercentage: 0
      };
    }
  }

  async getRecentNewsletterActivity(): Promise<ActivityItem[]> {
    try {
      const activities = await this.dbService.getRecentDashboardActivity(10);
      return activities
        .filter(activity => activity.type === 'newsletter')
        .slice(0, 5)
        .map(activity => ({
          id: activity.id,
          type: 'newsletter' as const,
          title: activity.title,
          description: activity.description,
          timestamp: activity.timestamp,
          status: activity.status as any,
          platform: activity.platform
        }));
    } catch (error) {
      console.error('Error fetching optimized newsletter activity:', error);
      return [];
    }
  }

  async getTopPerformingNewsletterCampaigns(): Promise<PerformingContentItem[]> {
    try {
      const content = await this.dbService.getTopPerformingContent(5);
      return content
        .filter(item => item.type === 'newsletter')
        .map(item => ({
          id: item.id,
          title: item.title,
          type: 'newsletter' as const,
          platform: item.platform,
          metrics: item.metrics
        }));
    } catch (error) {
      console.error('Error fetching optimized top performing newsletter campaigns:', error);
      return [];
    }
  }

  async getScheduledNewsletterCampaigns(): Promise<ScheduledItem[]> {
    try {
      const scheduled = await this.dbService.getScheduledContent(5);
      return scheduled
        .filter(item => item.type === 'newsletter')
        .map(item => ({
          id: item.id,
          title: item.title,
          type: 'newsletter' as const,
          platform: item.platform,
          scheduledAt: item.scheduledAt
        }));
    } catch (error) {
      console.error('Error fetching optimized scheduled newsletter campaigns:', error);
      return [];
    }
  }
}

/**
 * Optimized AI Usage Data Service using database optimization
 */
export class OptimizedAIUsageDataService {
  private dbService = getOptimizedDatabaseService();

  async getAIUsageStats(): Promise<AIUsageStats> {
    try {
      const stats = await this.dbService.getAIUsageDashboardStats();
      return {
        contentGenerated: stats.contentGenerated,
        tokensUsed: stats.tokensUsed,
        timeSaved: stats.timeSaved
      };
    } catch (error) {
      console.error('Error fetching optimized AI usage stats:', error);
      return {
        contentGenerated: 0,
        tokensUsed: 0,
        timeSaved: 0
      };
    }
  }

  async getRecentAIActivity(): Promise<ActivityItem[]> {
    try {
      const activities = await this.dbService.getRecentDashboardActivity(10);
      return activities
        .filter(activity => activity.type === 'ai')
        .slice(0, 5)
        .map(activity => ({
          id: activity.id,
          type: 'ai' as const,
          title: activity.title,
          description: activity.description,
          timestamp: activity.timestamp,
          status: activity.status as any,
          platform: activity.platform
        }));
    } catch (error) {
      console.error('Error fetching optimized AI activity:', error);
      return [];
    }
  }
}

/**
 * Optimized Dashboard Data Aggregation Service
 * Provides high-performance data fetching for the entire dashboard
 */
export class OptimizedDashboardDataService {
  private dbService = getOptimizedDatabaseService();
  private blogDataService = new BlogDataService();
  private socialDataService = new OptimizedSocialDataService();
  private newsletterDataService = new OptimizedNewsletterDataService();
  private aiUsageDataService = new OptimizedAIUsageDataService();

  /**
   * Get all dashboard data in a single optimized batch query
   */
  async getAllDashboardData(): Promise<Partial<DashboardData>> {
    try {
      // Use batch query for database operations
      const batchData = await this.dbService.getBatchDashboardData();
      
      // Get blog data separately (from Sanity CMS)
      const [blogStats, blogActivity, blogTopPerforming, blogScheduled] = await Promise.all([
        this.blogDataService.getBlogStats(),
        this.blogDataService.getRecentBlogActivity(),
        this.blogDataService.getTopPerformingBlogPosts(),
        this.blogDataService.getScheduledBlogPosts()
      ]);

      // Combine all activity data and sort by timestamp
      const allActivity = [
        ...blogActivity,
        ...batchData.recentActivity.filter(a => a.type !== 'blog')
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 10);

      // Combine all top performing content and sort by engagement
      const allTopPerforming = [
        ...blogTopPerforming,
        ...batchData.topPerforming.filter(c => c.type !== 'blog')
      ].sort((a, b) => {
        const aEngagement = (a.metrics.likes || 0) + (a.metrics.shares || 0) + (a.metrics.opens || 0) + (a.metrics.clicks || 0);
        const bEngagement = (b.metrics.likes || 0) + (b.metrics.shares || 0) + (b.metrics.opens || 0) + (b.metrics.clicks || 0);
        return bEngagement - aEngagement;
      }).slice(0, 5);

      // Combine all scheduled content and sort by scheduled time
      const allScheduled = [
        ...blogScheduled,
        ...batchData.scheduled.filter(s => s.type !== 'blog')
      ].sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime()).slice(0, 5);

      return {
        blogStats,
        socialStats: {
          totalPosts: batchData.socialStats.totalPosts,
          postsThisWeek: batchData.socialStats.postsThisWeek,
          totalEngagement: batchData.socialStats.totalEngagement,
          growthPercentage: batchData.socialStats.growthPercentage
        },
        newsletterStats: {
          totalSubscribers: batchData.newsletterStats.totalSubscribers,
          newSubscribersThisMonth: batchData.newsletterStats.newSubscribersThisMonth,
          growthPercentage: batchData.newsletterStats.growthPercentage
        },
        aiUsage: {
          contentGenerated: batchData.aiUsageStats.contentGenerated,
          tokensUsed: batchData.aiUsageStats.tokensUsed,
          timeSaved: batchData.aiUsageStats.timeSaved
        },
        recentActivity: allActivity,
        topPerformingContent: allTopPerforming,
        upcomingScheduled: allScheduled
      };
    } catch (error) {
      console.error('Error fetching optimized dashboard data:', error);
      throw new Error('Failed to fetch dashboard data');
    }
  }

  /**
   * Get dashboard data with performance metrics
   */
  async getDashboardDataWithMetrics(): Promise<{
    data: Partial<DashboardData>;
    performance: {
      executionTime: number;
      queryMetrics: any;
      connectionPoolStatus: any;
    };
  }> {
    const startTime = Date.now();
    
    try {
      const data = await this.getAllDashboardData();
      const executionTime = Date.now() - startTime;
      
      return {
        data,
        performance: {
          executionTime,
          queryMetrics: this.dbService.getQueryMetrics(),
          connectionPoolStatus: this.dbService.getConnectionPoolStatus()
        }
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      throw {
        error,
        performance: {
          executionTime,
          queryMetrics: this.dbService.getQueryMetrics(),
          connectionPoolStatus: this.dbService.getConnectionPoolStatus()
        }
      };
    }
  }

  /**
   * Refresh materialized views for better performance
   */
  async refreshCachedData(): Promise<{ success: boolean; error?: string }> {
    return this.dbService.refreshMaterializedViews();
  }

  /**
   * Get database performance analysis
   */
  async getPerformanceAnalysis(): Promise<{
    queryPerformance: any[];
    recommendations: any[];
    connectionPoolStatus: any;
    queryMetrics: any;
  }> {
    const analysis = await this.dbService.getDatabasePerformanceAnalysis();
    
    return {
      ...analysis,
      connectionPoolStatus: this.dbService.getConnectionPoolStatus(),
      queryMetrics: this.dbService.getQueryMetrics()
    };
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.dbService.cleanup();
  }
}

/**
 * Get optimized dashboard data service instance
 */
export function getOptimizedDashboardDataService(): OptimizedDashboardDataService {
  return new OptimizedDashboardDataService();
}

/**
 * Hook for using optimized dashboard data service in React components
 */
export function useOptimizedDashboardData(): OptimizedDashboardDataService {
  return getOptimizedDashboardDataService();
}
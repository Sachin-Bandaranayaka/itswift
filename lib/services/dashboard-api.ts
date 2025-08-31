/**
 * Client-side Dashboard API Service
 * Handles API calls to dashboard endpoints from the client
 */

import { 
  BlogStats, 
  SocialStats, 
  NewsletterStats, 
  AIUsageStats,
  ActivityItem,
  PerformingContentItem,
  ScheduledItem
} from '@/lib/types/dashboard';

interface APIResponse<T> {
  success: boolean;
  data: T;
  errors?: Array<{ type: string; error: string }>;
  error?: string;
}

class DashboardAPIService {
  private async fetchAPI<T>(endpoint: string): Promise<T> {
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const result: APIResponse<T> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'API request failed');
    }
    
    return result.data;
  }

  /**
   * Get all dashboard stats
   */
  async getAllStats(): Promise<{
    blogStats: BlogStats | null;
    socialStats: SocialStats | null;
    newsletterStats: NewsletterStats | null;
    aiUsage: AIUsageStats | null;
    errors?: Array<{ type: string; error: string }>;
  }> {
    return this.fetchAPI('/api/admin/dashboard/stats?type=all');
  }

  /**
   * Get blog stats
   */
  async getBlogStats(): Promise<BlogStats> {
    return this.fetchAPI('/api/admin/dashboard/stats?type=blog');
  }

  /**
   * Get social stats
   */
  async getSocialStats(): Promise<SocialStats> {
    return this.fetchAPI('/api/admin/dashboard/stats?type=social');
  }

  /**
   * Get newsletter stats
   */
  async getNewsletterStats(): Promise<NewsletterStats> {
    return this.fetchAPI('/api/admin/dashboard/stats?type=newsletter');
  }

  /**
   * Get AI usage stats
   */
  async getAIUsageStats(): Promise<AIUsageStats> {
    return this.fetchAPI('/api/admin/dashboard/stats?type=ai');
  }

  /**
   * Get recent activity from all sources
   */
  async getRecentActivity(): Promise<ActivityItem[]> {
    return this.fetchAPI('/api/admin/dashboard/activity');
  }

  /**
   * Get top performing content
   */
  async getTopPerformingContent(): Promise<PerformingContentItem[]> {
    return this.fetchAPI('/api/admin/dashboard/performance');
  }

  /**
   * Get upcoming scheduled content
   */
  async getUpcomingScheduled(): Promise<ScheduledItem[]> {
    return this.fetchAPI('/api/admin/dashboard/scheduled');
  }
}

// Export singleton instance
export const dashboardAPI = new DashboardAPIService();
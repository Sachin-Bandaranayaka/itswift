/**
 * Social Data Service - Fetches social media data from Supabase
 */

import { supabaseAdmin } from '@/lib/supabase';
import { SocialStats, ActivityItem, PerformingContentItem, ScheduledItem } from '@/lib/types/dashboard';
import { isThisWeek, isLastWeek, calculateGrowth } from '@/lib/utils/dashboard-utils';

export class SocialDataService {
  /**
   * Fetch social media statistics from Supabase
   */
  async getSocialStats(): Promise<SocialStats> {
    try {
      // Fetch all published social posts
      const { data: posts, error } = await supabaseAdmin
        .from('social_posts')
        .select('*')
        .eq('status', 'published');

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (!posts) {
        return {
          totalPosts: 0,
          postsThisWeek: 0,
          totalEngagement: 0,
          growthPercentage: 0
        };
      }

      // Filter posts for this week
      const thisWeekPosts = posts.filter(post => {
        if (!post.published_at) return false;
        const publishedDate = new Date(post.published_at);
        return isThisWeek(publishedDate);
      });

      // Filter posts for last week
      const lastWeekPosts = posts.filter(post => {
        if (!post.published_at) return false;
        const publishedDate = new Date(post.published_at);
        return isLastWeek(publishedDate);
      });

      // Calculate total engagement across all posts
      const totalEngagement = posts.reduce((sum, post) => {
        const metrics = post.engagement_metrics || {};
        const likes = metrics.likes || 0;
        const shares = metrics.shares || 0;
        const comments = metrics.comments || 0;
        return sum + likes + shares + comments;
      }, 0);

      const thisWeekCount = thisWeekPosts.length;
      const lastWeekCount = lastWeekPosts.length;
      const growthPercentage = calculateGrowth(thisWeekCount, lastWeekCount);

      return {
        totalPosts: posts.length,
        postsThisWeek: thisWeekCount,
        totalEngagement,
        growthPercentage
      };
    } catch (error) {
      console.error('Error fetching social stats:', error);
      throw new Error('Failed to fetch social media statistics');
    }
  }

  /**
   * Fetch recent social media activity
   */
  async getRecentSocialActivity(): Promise<ActivityItem[]> {
    try {
      const { data: posts, error } = await supabaseAdmin
        .from('social_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Supabase error:', error);
        return [];
      }

      if (!posts) {
        return [];
      }

      return posts.map(post => ({
        id: post.id,
        type: 'social' as const,
        title: this.truncateContent(post.content, 50),
        description: `Posted on ${post.platform}`,
        timestamp: new Date(post.published_at || post.created_at),
        status: 'published' as const,
        platform: post.platform
      }));
    } catch (error) {
      console.error('Error fetching recent social activity:', error);
      return [];
    }
  }

  /**
   * Get top performing social media content
   */
  async getTopPerformingSocialContent(): Promise<PerformingContentItem[]> {
    try {
      const { data: posts, error } = await supabaseAdmin
        .from('social_posts')
        .select('*')
        .eq('status', 'published')
        .not('engagement_metrics', 'is', null)
        .order('engagement_metrics->likes', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Supabase error:', error);
        return [];
      }

      if (!posts) {
        return [];
      }

      return posts.map(post => {
        const metrics = post.engagement_metrics || {};
        return {
          id: post.id,
          title: this.truncateContent(post.content, 50),
          type: 'social' as const,
          platform: post.platform,
          metrics: {
            likes: metrics.likes || 0,
            shares: metrics.shares || 0,
            comments: metrics.comments || 0
          }
        };
      });
    } catch (error) {
      console.error('Error fetching top performing social content:', error);
      return [];
    }
  }

  /**
   * Get scheduled social media posts
   */
  async getScheduledSocialPosts(): Promise<ScheduledItem[]> {
    try {
      const now = new Date().toISOString();
      
      const { data: posts, error } = await supabaseAdmin
        .from('social_posts')
        .select('*')
        .eq('status', 'scheduled')
        .gte('scheduled_at', now)
        .order('scheduled_at', { ascending: true })
        .limit(5);

      if (error) {
        console.error('Supabase error:', error);
        return [];
      }

      if (!posts) {
        return [];
      }

      return posts.map(post => ({
        id: post.id,
        title: this.truncateContent(post.content, 50),
        type: 'social' as const,
        platform: post.platform,
        scheduledAt: new Date(post.scheduled_at || post.created_at)
      }));
    } catch (error) {
      console.error('Error fetching scheduled social posts:', error);
      return [];
    }
  }

  /**
   * Helper method to truncate content for display
   */
  private truncateContent(content: string, maxLength: number): string {
    if (!content) return 'Untitled Post';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }

  /**
   * Get engagement metrics for a specific time period
   */
  async getEngagementMetrics(days: number = 30): Promise<{
    totalLikes: number;
    totalShares: number;
    totalComments: number;
  }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data: posts, error } = await supabaseAdmin
        .from('social_posts')
        .select('engagement_metrics')
        .eq('status', 'published')
        .gte('published_at', cutoffDate.toISOString());

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (!posts) {
        return { totalLikes: 0, totalShares: 0, totalComments: 0 };
      }

      const metrics = posts.reduce(
        (acc, post) => {
          const engagement = post.engagement_metrics || {};
          return {
            totalLikes: acc.totalLikes + (engagement.likes || 0),
            totalShares: acc.totalShares + (engagement.shares || 0),
            totalComments: acc.totalComments + (engagement.comments || 0)
          };
        },
        { totalLikes: 0, totalShares: 0, totalComments: 0 }
      );

      return metrics;
    } catch (error) {
      console.error('Error fetching engagement metrics:', error);
      return { totalLikes: 0, totalShares: 0, totalComments: 0 };
    }
  }
}
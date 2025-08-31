/**
 * Blog Data Service - Fetches blog statistics from Sanity CMS
 */

import { client } from '@/lib/sanity.client';
import { BlogStats, ActivityItem, ScheduledItem } from '@/lib/types/dashboard';
import { isThisMonth, isLastMonth, calculateGrowth } from '@/lib/utils/dashboard-utils';

export class BlogDataService {
  /**
   * Fetch blog statistics from Sanity CMS
   */
  async getBlogStats(): Promise<BlogStats> {
    try {
      // Fetch all published blog posts with their publication dates
      const posts = await client.fetch(`
        *[_type == "post" && defined(publishedAt)] {
          _id,
          title,
          publishedAt,
          _createdAt
        }
      `);

      if (!Array.isArray(posts)) {
        throw new Error('Invalid response format from Sanity');
      }

      const now = new Date();
      
      // Filter posts for this month
      const thisMonthPosts = posts.filter(post => {
        const publishedDate = new Date(post.publishedAt);
        return isThisMonth(publishedDate);
      });

      // Filter posts for last month
      const lastMonthPosts = posts.filter(post => {
        const publishedDate = new Date(post.publishedAt);
        return isLastMonth(publishedDate);
      });

      const thisMonthCount = thisMonthPosts.length;
      const lastMonthCount = lastMonthPosts.length;
      const growthPercentage = calculateGrowth(thisMonthCount, lastMonthCount);

      return {
        totalPosts: posts.length,
        publishedThisMonth: thisMonthCount,
        growthPercentage
      };
    } catch (error) {
      console.error('Error fetching blog stats:', error);
      throw new Error('Failed to fetch blog statistics');
    }
  }

  /**
   * Fetch recent blog activity for dashboard
   */
  async getRecentBlogActivity(): Promise<ActivityItem[]> {
    try {
      // Fetch the 5 most recent published blog posts
      const recentPosts = await client.fetch(`
        *[_type == "post" && defined(publishedAt)] 
        | order(publishedAt desc)[0...5] {
          _id,
          title,
          publishedAt,
          slug
        }
      `);

      if (!Array.isArray(recentPosts)) {
        return [];
      }

      return recentPosts.map(post => ({
        id: post._id,
        type: 'blog' as const,
        title: post.title || 'Untitled Post',
        description: 'Blog post published',
        timestamp: new Date(post.publishedAt),
        status: 'published' as const,
        platform: 'blog'
      }));
    } catch (error) {
      console.error('Error fetching recent blog activity:', error);
      return [];
    }
  }

  /**
   * Get blog posts scheduled for future publication
   */
  async getScheduledBlogPosts(): Promise<ScheduledItem[]> {
    try {
      const now = new Date().toISOString();
      
      // Fetch blog posts scheduled for future publication
      const scheduledPosts = await client.fetch(`
        *[_type == "post" && publishedAt > $now] 
        | order(publishedAt asc)[0...5] {
          _id,
          title,
          publishedAt,
          slug
        }
      `, { now });

      if (!Array.isArray(scheduledPosts)) {
        return [];
      }

      return scheduledPosts
        .filter(post => post.publishedAt) // Filter out posts without publishedAt
        .map(post => ({
          id: post._id,
          type: 'blog' as const,
          title: post.title || 'Untitled Post',
          platform: 'blog',
          scheduledAt: new Date(post.publishedAt)
        }))
        .filter(item => !isNaN(item.scheduledAt.getTime())); // Filter out invalid dates
    } catch (error) {
      console.error('Error fetching scheduled blog posts:', error);
      return [];
    }
  }

  /**
   * Get top performing blog posts based on view counts
   * Note: This requires analytics data to be properly tracked
   */
  async getTopPerformingBlogPosts(): Promise<any[]> {
    try {
      // This would typically join with analytics data
      // For now, we'll return recent popular posts
      const posts = await client.fetch(`
        *[_type == "post" && defined(publishedAt)] 
        | order(publishedAt desc)[0...5] {
          _id,
          title,
          publishedAt,
          slug,
          excerpt
        }
      `);

      if (!Array.isArray(posts)) {
        return [];
      }

      return posts.map(post => ({
        id: post._id,
        title: post.title || 'Untitled Post',
        type: 'blog' as const,
        platform: 'blog',
        metrics: {
          views: 0, // Would be populated from analytics
          likes: 0,
          shares: 0
        }
      }));
    } catch (error) {
      console.error('Error fetching top performing blog posts:', error);
      return [];
    }
  }
}
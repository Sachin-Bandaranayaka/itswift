/**
 * Blog Data Service - Fetches blog statistics with real-time metrics tracking
 */

import { BlogService } from '@/lib/services/blog.service';
import { getSupabaseAdmin } from '@/lib/supabase';
import { BlogStats, ActivityItem, ScheduledItem, PerformingContentItem } from '@/lib/types/dashboard';
import { isThisMonth, isLastMonth, calculateGrowth, isThisWeek, isLastWeek } from '@/lib/utils/dashboard-utils';

export class BlogDataService {
  private blogService: BlogService;

  constructor() {
    this.blogService = new BlogService();
  }

  /**
   * Fetch comprehensive blog statistics with real-time metrics
   */
  async getBlogStats(): Promise<BlogStats> {
    try {
      const supabase = getSupabaseAdmin();

      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, status, created_at, published_at')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) {
        console.error('Error querying blog posts for stats:', error);
        throw new Error(error.message || 'Failed to query blog posts');
      }

      const posts = data || [];
      const now = new Date();

      const toDate = (value?: string | null): Date | null => {
        if (!value) return null;
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? null : date;
      };

      const getEffectivePublishedDate = (post: { published_at?: string | null; created_at?: string | null }): Date | null => {
        return toDate(post.published_at) || toDate(post.created_at);
      };

      const publishedPosts = posts.filter(post => post.status === 'published');
      const draftPosts = posts.filter(post => post.status === 'draft');

      const publishedThisMonth = publishedPosts.filter(post => {
        const date = getEffectivePublishedDate(post);
        return date ? isThisMonth(date) : false;
      }).length;

      const publishedLastMonth = publishedPosts.filter(post => {
        const date = getEffectivePublishedDate(post);
        return date ? isLastMonth(date) : false;
      }).length;

      const publishedThisWeek = publishedPosts.filter(post => {
        const date = getEffectivePublishedDate(post);
        return date ? isThisWeek(date) : false;
      }).length;

      const publishedLastWeek = publishedPosts.filter(post => {
        const date = getEffectivePublishedDate(post);
        return date ? isLastWeek(date) : false;
      }).length;

      const growthPercentage = calculateGrowth(publishedThisMonth, publishedLastMonth);
      const weeklyGrowthPercentage = calculateGrowth(publishedThisWeek, publishedLastWeek);

      const fourWeeksAgo = new Date(now);
      fourWeeksAgo.setDate(now.getDate() - 28);
      const postsLastFourWeeks = publishedPosts.filter(post => {
        const date = getEffectivePublishedDate(post);
        return date ? date >= fourWeeksAgo : false;
      });
      const averagePostsPerWeek = Math.round(postsLastFourWeeks.length / 4);

      const lastPublishedAt = publishedPosts
        .map(getEffectivePublishedDate)
        .filter((date): date is Date => Boolean(date))
        .sort((a, b) => b.getTime() - a.getTime())[0] || null;

      return {
        totalPosts: posts.length,
        publishedThisMonth,
        publishedThisWeek,
        draftPosts: draftPosts.length,
        growthPercentage,
        weeklyGrowthPercentage,
        averagePostsPerWeek,
        lastPublishedAt
      };
    } catch (error) {
      console.error('Error fetching blog stats:', error);
      throw new Error('Failed to fetch blog statistics');
    }
  }

  /**
   * Get recent blog activity
   */
  async getRecentBlogActivity(): Promise<ActivityItem[]> {
    try {
      const supabase = getSupabaseAdmin();
      
      // Get recent blog posts (published, updated, or created in the last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: recentPosts, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          status,
          created_at,
          updated_at,
          published_at,
          author:blog_authors(name)
        `)
        .or(`created_at.gte.${thirtyDaysAgo.toISOString()},updated_at.gte.${thirtyDaysAgo.toISOString()},published_at.gte.${thirtyDaysAgo.toISOString()}`)
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching recent blog activity:', error);
        return [];
      }

      // Transform posts into activity items
      const activities: ActivityItem[] = [];
      
      for (const post of recentPosts || []) {
        const postData = post as any;
        
        // Determine the most recent activity type
        const createdAt = new Date(postData.created_at);
        const updatedAt = new Date(postData.updated_at);
        const publishedAt = postData.published_at ? new Date(postData.published_at) : null;
        
        let activityType = 'created';
        let activityDate = createdAt;
        
        if (publishedAt && publishedAt > activityDate) {
          activityType = 'published';
          activityDate = publishedAt;
        } else if (updatedAt > createdAt) {
          activityType = 'updated';
          activityDate = updatedAt;
        }
        
        // Determine status based on post status and activity type
        let status: 'published' | 'scheduled' | 'sent' | 'generated' = 'generated';
        if (postData.status === 'published' || activityType === 'published') {
          status = 'published';
        } else if (postData.status === 'scheduled') {
          status = 'scheduled';
        }
        
        activities.push({
          id: `blog-${postData.id}-${activityType}`,
          type: 'blog',
          title: `Blog post ${activityType}`,
          description: `"${postData.title}" was ${activityType}${postData.author?.name ? ` by ${postData.author.name}` : ''}`,
          timestamp: activityDate.toISOString(),
          status,
          metadata: {
            postId: postData.id,
            postTitle: postData.title,
            postSlug: postData.slug,
            postStatus: postData.status,
            authorName: postData.author?.name,
            activityType
          }
        });
      }
      
      return activities;
    } catch (error) {
      console.error('Error fetching recent blog activity:', error);
      return [];
    }
  }

  /**
   * Get scheduled blog posts
   */
  async getScheduledBlogPosts(): Promise<ScheduledItem[]> {
    try {
      const supabase = getSupabaseAdmin();

      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          status,
          published_at,
          created_at,
          author:blog_authors(name)
        `)
        .in('status', ['scheduled', 'draft'])
        .order('published_at', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true })
        .limit(20);

      if (error) {
        console.error('Supabase error fetching scheduled blog posts:', error);
        return [];
      }

      const now = new Date();

      const scheduledPosts = (data || [])
        .map((post: any) => {
          const publishedAt = post.published_at ? new Date(post.published_at) : null;
          const createdAt = post.created_at ? new Date(post.created_at) : null;
          const scheduledAt = publishedAt && !isNaN(publishedAt.getTime()) ? publishedAt : createdAt;

          if (!scheduledAt || isNaN(scheduledAt.getTime())) {
            return null;
          }

          // Only include future items
          if (scheduledAt.getTime() <= now.getTime()) {
            return null;
          }

          const diffMs = scheduledAt.getTime() - now.getTime();

          return {
            id: post.id,
            title: post.title,
            type: 'blog' as const,
            scheduledAt: scheduledAt.toISOString(),
            metadata: {
              slug: post.slug,
              author: post.author?.name || undefined,
              status: post.status,
              createdAt: createdAt || undefined,
              hoursUntilPublish: Math.max(0, Math.round(diffMs / (1000 * 60 * 60))),
              timeUntilPublish: this.formatTimeUntil(diffMs),
            }
          } satisfies ScheduledItem;
        })
        .filter((item): item is ScheduledItem => Boolean(item))
        .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
        .slice(0, 5);

      return scheduledPosts;
    } catch (error) {
      console.error('Error fetching scheduled blog posts:', error);
      return [];
    }
  }

  /**
   * Get top performing blog posts
   */
  async getTopPerformingBlogPosts(): Promise<PerformingContentItem[]> {
    try {
      const supabase = getSupabaseAdmin();

      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          content,
          view_count,
          published_at,
          created_at,
          featured_image_url,
          author:blog_authors(name),
          category:blog_categories(name, slug)
        `)
        .eq('status', 'published')
        .not('published_at', 'is', null)
        .order('view_count', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Supabase error fetching top performing blog posts:', error);
        return [];
      }

      const posts = (data || []).filter((post: any) => Boolean(post.published_at));

      if (posts.length === 0) {
        return [];
      }

      const maxViews = posts.reduce((max: number, post: any) => {
        return Math.max(max, post.view_count || 0);
      }, 0);

      const now = Date.now();

      const topPosts = posts.slice(0, 5).map((post: any) => {
        const publishedAt = post.published_at ? new Date(post.published_at) : null;
        const views = post.view_count || 0;
        const engagementRate = maxViews > 0 ? Math.min(100, (views / maxViews) * 100) : 0;
        const categories: string[] = [];

        if (post.category?.name) {
          categories.push(post.category.name);
        }

        const wordCount = typeof post.content === 'string'
          ? post.content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length
          : 0;

        return {
          id: post.id,
          title: post.title,
          type: 'blog' as const,
          metrics: {
            views
          },
          metadata: {
            slug: post.slug,
            author: post.author?.name,
            categories,
            publishedAt,
            daysSincePublished: publishedAt ? Math.max(0, Math.floor((now - publishedAt.getTime()) / (1000 * 60 * 60 * 24))) : undefined,
            wordCount,
            hasImage: Boolean(post.featured_image_url),
            engagementRate: `${engagementRate.toFixed(1)}%`
          }
        } satisfies PerformingContentItem;
      });

      return topPosts;
    } catch (error) {
      console.error('Error fetching top performing blog posts:', error);
      return [];
    }
  }

  /**
   * Get blog post metrics
   */
  async getBlogPostMetrics(postId: string): Promise<{
    views: number;
    likes: number;
    shares: number;
    comments: number;
    engagementRate: number;
  } | null> {
    try {
      // TODO: Implement with Supabase
      // For now, return placeholder data
      return {
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
        engagementRate: 0
      };
    } catch (error) {
      console.error('Error fetching blog post metrics:', error);
      return null;
    }
  }

  /**
   * Track blog post view
   */
  async trackBlogPostView(postId: string, metadata?: { 
    referrer?: string; 
    userAgent?: string; 
    location?: string; 
  }): Promise<boolean> {
    try {
      // TODO: Implement with Supabase
      // For now, return true
      return true;
    } catch (error) {
      console.error('Error tracking blog post view:', error);
      return false;
    }
  }

  /**
   * Get blog analytics summary
   */
  async getBlogAnalyticsSummary(): Promise<{
    totalViews: number;
    totalEngagement: number;
    averageEngagementRate: number;
    topCategories: Array<{ category: string; postCount: number; avgViews: number }>;
    publishingTrend: Array<{ date: string; count: number }>;
  }> {
    try {
      // TODO: Implement with Supabase
      // For now, return placeholder data
      return {
        totalViews: 0,
        totalEngagement: 0,
        averageEngagementRate: 0,
        topCategories: [],
        publishingTrend: []
      };
    } catch (error) {
      console.error('Error fetching blog analytics summary:', error);
      throw new Error('Failed to fetch blog analytics summary');
    }
  }

  /**
   * Estimate word count from content
   */
  private estimateWordCount(body: any[]): number {
    if (!Array.isArray(body)) return 0;
    
    return body.reduce((count, block) => {
      if (block._type === 'block' && block.children) {
        const text = block.children
          .filter((child: any) => child._type === 'span')
          .map((child: any) => child.text || '')
          .join(' ');
        return count + text.split(/\s+/).filter((word: string) => word.length > 0).length;
      }
      return count;
    }, 0);
  }

  /**
   * Format time until a future date
   */
  private formatTimeUntil(milliseconds: number): string {
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }
}

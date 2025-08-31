// Analytics tracking service for content performance monitoring

import { ContentAnalyticsService } from '../database/services/content-analytics'
import { SocialPostsService } from '../database/services/social-posts'
import { NewsletterCampaignsService } from '../database/services/newsletter-campaigns'
import { ContentAnalytics, EngagementMetrics } from '../database/types'

export interface PerformanceMetrics {
  totalViews: number
  totalLikes: number
  totalShares: number
  totalComments: number
  totalClicks: number
  engagementRate: number
  averageEngagement: number
}

export interface ContentPerformanceData {
  contentId: string
  contentType: 'blog' | 'social' | 'newsletter'
  platform?: string
  title?: string
  publishedAt?: string
  metrics: PerformanceMetrics
  trend: 'up' | 'down' | 'stable'
}

export interface PlatformComparison {
  platform: string
  metrics: PerformanceMetrics
  contentCount: number
  averagePerformance: PerformanceMetrics
}

export class AnalyticsTracker {
  /**
   * Track engagement metrics for social media posts
   */
  static async trackSocialEngagement(
    postId: string,
    platform: 'linkedin' | 'twitter',
    metrics: EngagementMetrics
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      // Update the social post with engagement metrics
      const { error: updateError } = await SocialPostsService.update(postId, {
        engagement_metrics: metrics
      })

      if (updateError) {
        return { success: false, error: updateError }
      }

      // Create or update analytics record
      const { error: analyticsError } = await ContentAnalyticsService.upsert(
        postId,
        'social',
        platform,
        {
          views: metrics.views,
          likes: metrics.likes,
          shares: metrics.shares,
          comments: metrics.comments,
          clicks: metrics.clicks
        }
      )

      if (analyticsError) {
        return { success: false, error: analyticsError }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Error tracking social engagement:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Track newsletter campaign performance
   */
  static async trackNewsletterPerformance(
    campaignId: string,
    metrics: {
      openRate?: number
      clickRate?: number
      views?: number
      clicks?: number
    }
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      // Update the newsletter campaign with performance metrics
      const { error: updateError } = await NewsletterCampaignsService.update(campaignId, {
        open_rate: metrics.openRate,
        click_rate: metrics.clickRate
      })

      if (updateError) {
        return { success: false, error: updateError }
      }

      // Create or update analytics record
      const { error: analyticsError } = await ContentAnalyticsService.upsert(
        campaignId,
        'newsletter',
        undefined,
        {
          views: metrics.views,
          clicks: metrics.clicks
        }
      )

      if (analyticsError) {
        return { success: false, error: analyticsError }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Error tracking newsletter performance:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Track blog post performance
   */
  static async trackBlogPerformance(
    blogId: string,
    metrics: {
      views?: number
      likes?: number
      shares?: number
      comments?: number
    }
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      // Create or update analytics record for blog
      const { error: analyticsError } = await ContentAnalyticsService.upsert(
        blogId,
        'blog',
        undefined,
        metrics
      )

      if (analyticsError) {
        return { success: false, error: analyticsError }
      }

      return { success: true, error: null }
    } catch (error) {
      console.error('Error tracking blog performance:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get performance comparison across content types
   */
  static async getContentTypeComparison(
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    data: {
      blog: PerformanceMetrics
      social: PerformanceMetrics
      newsletter: PerformanceMetrics
    }
    error: string | null
  }> {
    try {
      const [blogData, socialData, newsletterData] = await Promise.all([
        ContentAnalyticsService.getAggregatedByContentType('blog', dateFrom, dateTo),
        ContentAnalyticsService.getAggregatedByContentType('social', dateFrom, dateTo),
        ContentAnalyticsService.getAggregatedByContentType('newsletter', dateFrom, dateTo)
      ])

      if (blogData.error || socialData.error || newsletterData.error) {
        return {
          data: {
            blog: this.createEmptyMetrics(),
            social: this.createEmptyMetrics(),
            newsletter: this.createEmptyMetrics()
          },
          error: blogData.error || socialData.error || newsletterData.error
        }
      }

      return {
        data: {
          blog: this.calculatePerformanceMetrics(blogData),
          social: this.calculatePerformanceMetrics(socialData),
          newsletter: this.calculatePerformanceMetrics(newsletterData)
        },
        error: null
      }
    } catch (error) {
      console.error('Error getting content type comparison:', error)
      return {
        data: {
          blog: this.createEmptyMetrics(),
          social: this.createEmptyMetrics(),
          newsletter: this.createEmptyMetrics()
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get platform-specific performance comparison
   */
  static async getPlatformComparison(
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    data: PlatformComparison[]
    error: string | null
  }> {
    try {
      // Get analytics data filtered by platform
      const { data: analyticsData, error } = await ContentAnalyticsService.getAll(
        { orderBy: 'recorded_at', orderDirection: 'desc' },
        { date_from: dateFrom, date_to: dateTo }
      )

      if (error) {
        return { data: [], error }
      }

      // Group by platform
      const platformGroups = analyticsData.reduce((acc, record) => {
        const platform = record.platform || 'blog'
        if (!acc[platform]) {
          acc[platform] = []
        }
        acc[platform].push(record)
        return acc
      }, {} as Record<string, ContentAnalytics[]>)

      // Calculate metrics for each platform
      const platformComparisons: PlatformComparison[] = Object.entries(platformGroups).map(
        ([platform, records]) => {
          const totalMetrics = records.reduce(
            (acc, record) => ({
              totalViews: acc.totalViews + record.views,
              totalLikes: acc.totalLikes + record.likes,
              totalShares: acc.totalShares + record.shares,
              totalComments: acc.totalComments + record.comments,
              totalClicks: acc.totalClicks + record.clicks
            }),
            { totalViews: 0, totalLikes: 0, totalShares: 0, totalComments: 0, totalClicks: 0 }
          )

          const contentCount = records.length
          const totalEngagement = totalMetrics.totalLikes + totalMetrics.totalShares + totalMetrics.totalComments
          const engagementRate = totalMetrics.totalViews > 0 ? (totalEngagement / totalMetrics.totalViews) * 100 : 0

          const metrics: PerformanceMetrics = {
            ...totalMetrics,
            engagementRate,
            averageEngagement: contentCount > 0 ? totalEngagement / contentCount : 0
          }

          const averagePerformance: PerformanceMetrics = {
            totalViews: contentCount > 0 ? totalMetrics.totalViews / contentCount : 0,
            totalLikes: contentCount > 0 ? totalMetrics.totalLikes / contentCount : 0,
            totalShares: contentCount > 0 ? totalMetrics.totalShares / contentCount : 0,
            totalComments: contentCount > 0 ? totalMetrics.totalComments / contentCount : 0,
            totalClicks: contentCount > 0 ? totalMetrics.totalClicks / contentCount : 0,
            engagementRate,
            averageEngagement: metrics.averageEngagement
          }

          return {
            platform,
            metrics,
            contentCount,
            averagePerformance
          }
        }
      )

      return { data: platformComparisons, error: null }
    } catch (error) {
      console.error('Error getting platform comparison:', error)
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get top performing content across all types
   */
  static async getTopPerformingContent(
    metric: 'views' | 'likes' | 'shares' | 'comments' | 'clicks' = 'views',
    limit: number = 10,
    contentType?: 'blog' | 'social' | 'newsletter'
  ): Promise<{
    data: ContentPerformanceData[]
    error: string | null
  }> {
    try {
      let analyticsData: ContentAnalytics[]

      if (contentType) {
        const { data, error } = await ContentAnalyticsService.getTopPerforming(contentType, metric, limit)
        if (error) return { data: [], error }
        analyticsData = data
      } else {
        // Get top performing across all content types
        const { data, error } = await ContentAnalyticsService.getAll(
          { orderBy: metric, orderDirection: 'desc', limit }
        )
        if (error) return { data: [], error }
        analyticsData = data
      }

      // Transform to ContentPerformanceData
      const performanceData: ContentPerformanceData[] = analyticsData.map(record => {
        const totalEngagement = record.likes + record.shares + record.comments
        const engagementRate = record.views > 0 ? (totalEngagement / record.views) * 100 : 0

        return {
          contentId: record.content_id,
          contentType: record.content_type,
          platform: record.platform,
          publishedAt: record.recorded_at,
          metrics: {
            totalViews: record.views,
            totalLikes: record.likes,
            totalShares: record.shares,
            totalComments: record.comments,
            totalClicks: record.clicks,
            engagementRate,
            averageEngagement: totalEngagement
          },
          trend: 'stable' // TODO: Calculate trend based on historical data
        }
      })

      return { data: performanceData, error: null }
    } catch (error) {
      console.error('Error getting top performing content:', error)
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get analytics summary for dashboard
   */
  static async getAnalyticsSummary(
    dateFrom?: string,
    dateTo?: string
  ): Promise<{
    data: {
      totalContent: number
      totalViews: number
      totalEngagement: number
      averageEngagementRate: number
      topPlatform: string
      growthRate: number
    }
    error: string | null
  }> {
    try {
      const { data: analyticsData, error } = await ContentAnalyticsService.getAll(
        {},
        { date_from: dateFrom, date_to: dateTo }
      )

      if (error) {
        return {
          data: {
            totalContent: 0,
            totalViews: 0,
            totalEngagement: 0,
            averageEngagementRate: 0,
            topPlatform: '',
            growthRate: 0
          },
          error
        }
      }

      const totalContent = analyticsData.length
      const totalViews = analyticsData.reduce((sum, record) => sum + record.views, 0)
      const totalEngagement = analyticsData.reduce(
        (sum, record) => sum + record.likes + record.shares + record.comments,
        0
      )
      const averageEngagementRate = totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0

      // Find top platform by engagement
      const platformEngagement = analyticsData.reduce((acc, record) => {
        const platform = record.platform || 'blog'
        const engagement = record.likes + record.shares + record.comments
        acc[platform] = (acc[platform] || 0) + engagement
        return acc
      }, {} as Record<string, number>)

      const topPlatform = Object.entries(platformEngagement).reduce(
        (top, [platform, engagement]) => 
          engagement > top.engagement ? { platform, engagement } : top,
        { platform: '', engagement: 0 }
      ).platform

      // TODO: Calculate growth rate based on previous period comparison
      const growthRate = 0

      return {
        data: {
          totalContent,
          totalViews,
          totalEngagement,
          averageEngagementRate,
          topPlatform,
          growthRate
        },
        error: null
      }
    } catch (error) {
      console.error('Error getting analytics summary:', error)
      return {
        data: {
          totalContent: 0,
          totalViews: 0,
          totalEngagement: 0,
          averageEngagementRate: 0,
          topPlatform: '',
          growthRate: 0
        },
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Helper method to calculate performance metrics
   */
  private static calculatePerformanceMetrics(data: {
    totalViews: number
    totalLikes: number
    totalShares: number
    totalComments: number
    totalClicks: number
    recordCount: number
  }): PerformanceMetrics {
    const totalEngagement = data.totalLikes + data.totalShares + data.totalComments
    const engagementRate = data.totalViews > 0 ? (totalEngagement / data.totalViews) * 100 : 0
    const averageEngagement = data.recordCount > 0 ? totalEngagement / data.recordCount : 0

    return {
      totalViews: data.totalViews,
      totalLikes: data.totalLikes,
      totalShares: data.totalShares,
      totalComments: data.totalComments,
      totalClicks: data.totalClicks,
      engagementRate,
      averageEngagement
    }
  }

  /**
   * Helper method to create empty metrics
   */
  private static createEmptyMetrics(): PerformanceMetrics {
    return {
      totalViews: 0,
      totalLikes: 0,
      totalShares: 0,
      totalComments: 0,
      totalClicks: 0,
      engagementRate: 0,
      averageEngagement: 0
    }
  }
}
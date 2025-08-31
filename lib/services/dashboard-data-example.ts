/**
 * Example usage of Dashboard Data Services
 * This file demonstrates how to use the data services to fetch dashboard statistics
 */

import {
  blogDataService,
  socialDataService,
  newsletterDataService,
  aiUsageDataService,
  type DashboardData
} from './dashboard-data-services';

/**
 * Example function to fetch all dashboard data
 */
export async function fetchDashboardData(): Promise<Partial<DashboardData>> {
  try {
    console.log('Fetching dashboard data...');

    // Fetch all data in parallel for better performance
    const [
      blogStats,
      socialStats,
      newsletterStats,
      aiUsage,
      recentBlogActivity,
      recentSocialActivity,
      recentNewsletterActivity,
      recentAIActivity,
      topSocialContent,
      topNewsletterCampaigns
    ] = await Promise.allSettled([
      blogDataService.getBlogStats(),
      socialDataService.getSocialStats(),
      newsletterDataService.getNewsletterStats(),
      aiUsageDataService.getAIUsageStats(),
      blogDataService.getRecentBlogActivity(),
      socialDataService.getRecentSocialActivity(),
      newsletterDataService.getRecentNewsletterActivity(),
      aiUsageDataService.getRecentAIActivity(),
      socialDataService.getTopPerformingSocialContent(),
      newsletterDataService.getTopPerformingNewsletterCampaigns()
    ]);

    // Combine recent activities from all sources
    const recentActivity = [
      ...(recentBlogActivity.status === 'fulfilled' ? recentBlogActivity.value : []),
      ...(recentSocialActivity.status === 'fulfilled' ? recentSocialActivity.value : []),
      ...(recentNewsletterActivity.status === 'fulfilled' ? recentNewsletterActivity.value : []),
      ...(recentAIActivity.status === 'fulfilled' ? recentAIActivity.value : [])
    ]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10); // Keep only the 10 most recent

    // Combine top performing content
    const topPerformingContent = [
      ...(topSocialContent.status === 'fulfilled' ? topSocialContent.value : []),
      ...(topNewsletterCampaigns.status === 'fulfilled' ? topNewsletterCampaigns.value : [])
    ];

    const dashboardData: Partial<DashboardData> = {
      blogStats: blogStats.status === 'fulfilled' ? blogStats.value : undefined,
      socialStats: socialStats.status === 'fulfilled' ? socialStats.value : undefined,
      newsletterStats: newsletterStats.status === 'fulfilled' ? newsletterStats.value : undefined,
      aiUsage: aiUsage.status === 'fulfilled' ? aiUsage.value : undefined,
      recentActivity,
      topPerformingContent
    };

    console.log('Dashboard data fetched successfully:', {
      blogPosts: dashboardData.blogStats?.totalPosts || 0,
      socialPosts: dashboardData.socialStats?.totalPosts || 0,
      subscribers: dashboardData.newsletterStats?.totalSubscribers || 0,
      aiContentGenerated: dashboardData.aiUsage?.contentGenerated || 0,
      recentActivities: recentActivity.length,
      topContent: topPerformingContent.length
    });

    return dashboardData;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}

/**
 * Example function to fetch specific metrics
 */
export async function fetchSpecificMetrics() {
  try {
    // Example: Get blog statistics
    const blogStats = await blogDataService.getBlogStats();
    console.log('Blog Statistics:', blogStats);

    // Example: Get social media engagement
    const socialEngagement = await socialDataService.getEngagementMetrics(30);
    console.log('Social Engagement (30 days):', socialEngagement);

    // Example: Get newsletter growth
    const newsletterGrowth = await newsletterDataService.getSubscriberGrowth(6);
    console.log('Newsletter Growth (6 months):', newsletterGrowth);

    // Example: Get AI usage trends
    const aiTrends = await aiUsageDataService.getAIUsageTrends(6);
    console.log('AI Usage Trends (6 months):', aiTrends);

    // Example: Get cost savings from AI
    const costSavings = await aiUsageDataService.getEstimatedCostSavings();
    console.log('AI Cost Savings:', costSavings);

    // Example: Get AI usage limits and warnings
    const usageLimits = await aiUsageDataService.getUsageLimitStatus();
    console.log('AI Usage Limits:', usageLimits);
    if (usageLimits.warningMessage) {
      console.warn('AI Usage Warning:', usageLimits.warningMessage);
    }

    // Example: Get AI efficiency metrics
    const efficiencyMetrics = await aiUsageDataService.getUsageEfficiencyMetrics();
    console.log('AI Efficiency Metrics:', efficiencyMetrics);

    return {
      blogStats,
      socialEngagement,
      newsletterGrowth,
      aiTrends,
      costSavings,
      usageLimits,
      efficiencyMetrics
    };
  } catch (error) {
    console.error('Error fetching specific metrics:', error);
    throw error;
  }
}

/**
 * Example function to handle errors gracefully
 */
export async function fetchDashboardDataWithFallbacks(): Promise<DashboardData> {
  const defaultStats = {
    blogStats: { totalPosts: 0, publishedThisMonth: 0, growthPercentage: 0 },
    socialStats: { totalPosts: 0, postsThisWeek: 0, totalEngagement: 0, growthPercentage: 0 },
    newsletterStats: { totalSubscribers: 0, newSubscribersThisMonth: 0, growthPercentage: 0 },
    aiUsage: { contentGenerated: 0, tokensUsed: 0, timeSaved: 0 },
    recentActivity: [],
    topPerformingContent: [],
    upcomingScheduled: []
  };

  try {
    const data = await fetchDashboardData();
    
    return {
      blogStats: data.blogStats || defaultStats.blogStats,
      socialStats: data.socialStats || defaultStats.socialStats,
      newsletterStats: data.newsletterStats || defaultStats.newsletterStats,
      aiUsage: data.aiUsage || defaultStats.aiUsage,
      recentActivity: data.recentActivity || defaultStats.recentActivity,
      topPerformingContent: data.topPerformingContent || defaultStats.topPerformingContent,
      upcomingScheduled: defaultStats.upcomingScheduled
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data, using defaults:', error);
    return defaultStats;
  }
}
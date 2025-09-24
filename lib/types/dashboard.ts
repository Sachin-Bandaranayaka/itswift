/**
 * Type definitions for dashboard data structures
 */

export interface BlogStats {
  totalPosts: number;
  publishedThisMonth: number;
  publishedThisWeek?: number;
  draftPosts?: number;
  growthPercentage: number;
  weeklyGrowthPercentage?: number;
  averagePostsPerWeek?: number;
  lastPublishedAt?: Date | null;
}

export interface SocialStats {
  totalPosts: number;
  postsThisWeek: number;
  totalEngagement: number;
  growthPercentage: number;
}

export interface NewsletterStats {
  totalSubscribers: number;
  newSubscribersThisMonth: number;
  growthPercentage: number;
}

export interface ActivityItem {
  id: string;
  type: 'blog' | 'social' | 'newsletter' | 'ai' | 'content' | 'contact' | 'faq';
  title: string;
  description: string;
  timestamp: Date | string;
  status: 'published' | 'scheduled' | 'sent' | 'generated' | 'received' | 'updated';
  platform?: string;
  metadata?: {
    slug?: string;
    author?: string;
    categories?: string[];
    action?: string;
    [key: string]: any;
  };
}

export interface PerformingContentItem {
  id: string;
  title: string;
  type: 'blog' | 'social' | 'newsletter';
  platform?: string;
  metrics: {
    views?: number;
    likes?: number;
    shares?: number;
    opens?: number;
    clicks?: number;
    comments?: number;
  };
  metadata?: {
    slug?: string;
    author?: string;
    categories?: string[];
    publishedAt?: Date;
    daysSincePublished?: number;
    wordCount?: number;
    hasImage?: boolean;
    engagementRate?: string;
    [key: string]: any;
  };
}

export interface ScheduledItem {
  id: string;
  title: string;
  type: 'blog' | 'social' | 'newsletter';
  platform?: string;
  scheduledAt: Date | string;
  metadata?: {
    slug?: string;
    author?: string;
    categories?: string[];
    hoursUntilPublish?: number;
    timeUntilPublish?: string;
    createdAt?: Date;
    [key: string]: any;
  };
}

export interface AIUsageStats {
  contentGenerated: number;
  tokensUsed: number;
  timeSaved: number; // in minutes
}

export interface AIUsageLimitStatus {
  monthlyTokensUsed: number;
  monthlyTokenLimit: number;
  dailyTokensUsed: number;
  dailyTokenLimit: number;
  isApproachingMonthlyLimit: boolean;
  isApproachingDailyLimit: boolean;
  warningMessage?: string;
}

export interface AIUsageEfficiencyMetrics {
  averageTokensPerContent: number;
  mostEfficientContentType: string;
  leastEfficientContentType: string;
  efficiencyTrend: 'improving' | 'declining' | 'stable';
}

export interface DashboardData {
  blogStats: BlogStats;
  socialStats: SocialStats;
  newsletterStats: NewsletterStats;
  recentActivity: ActivityItem[];
  topPerformingContent: PerformingContentItem[];
  upcomingScheduled: ScheduledItem[];
  aiUsage: AIUsageStats;
}

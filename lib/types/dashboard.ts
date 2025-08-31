/**
 * Type definitions for dashboard data structures
 */

export interface BlogStats {
  totalPosts: number;
  publishedThisMonth: number;
  growthPercentage: number;
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
  type: 'blog' | 'social' | 'newsletter' | 'ai';
  title: string;
  description: string;
  timestamp: Date | string;
  status: 'published' | 'scheduled' | 'sent' | 'generated';
  platform?: string;
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
  };
}

export interface ScheduledItem {
  id: string;
  title: string;
  type: 'blog' | 'social' | 'newsletter';
  platform?: string;
  scheduledAt: Date | string;
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
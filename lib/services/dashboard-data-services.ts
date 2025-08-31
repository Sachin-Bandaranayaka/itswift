/**
 * Dashboard Data Services - Main export file for all dashboard data services
 */

import { BlogDataService } from './blog-data';
import { SocialDataService } from './social-data';
import { NewsletterDataService } from './newsletter-data';
import { AIUsageDataService } from './ai-usage-data';

// Export classes
export { BlogDataService, SocialDataService, NewsletterDataService, AIUsageDataService };

// Service instances for easy import
export const blogDataService = new BlogDataService();
export const socialDataService = new SocialDataService();
export const newsletterDataService = new NewsletterDataService();
export const aiUsageDataService = new AIUsageDataService();

// Re-export types
export type {
  BlogStats,
  SocialStats,
  NewsletterStats,
  ActivityItem,
  PerformingContentItem,
  ScheduledItem,
  AIUsageStats,
  AIUsageLimitStatus,
  AIUsageEfficiencyMetrics,
  DashboardData
} from '@/lib/types/dashboard';

// Re-export utilities
export {
  isThisMonth,
  isLastMonth,
  isThisWeek,
  isLastWeek,
  calculateGrowth,
  formatNumber,
  getDateRange
} from '@/lib/utils/dashboard-utils';
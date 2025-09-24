/**
 * Data validation utilities for dashboard data structures
 * Ensures data integrity and provides type guards for dashboard components
 */

import { 
  BlogStats, 
  SocialStats, 
  NewsletterStats, 
  ActivityItem, 
  PerformingContentItem, 
  ScheduledItem, 
  AIUsageStats,
  DashboardData 
} from '@/lib/types/dashboard';

/**
 * Sanitize user-generated content to prevent XSS attacks
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove HTML tags and potentially dangerous characters
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>'"&]/g, (char) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[char] || char;
    })
    .trim()
    .substring(0, 1000); // Limit length to prevent abuse
}

/**
 * Validate and sanitize a number, ensuring it's non-negative
 */
export function validateNumber(input: unknown, defaultValue: number = 0): number {
  if (typeof input === 'number' && !isNaN(input) && isFinite(input) && input >= 0) {
    return Math.floor(input); // Ensure integer for counts
  }
  return defaultValue;
}

/**
 * Validate and sanitize a percentage, ensuring it's within reasonable bounds
 */
export function validatePercentage(input: unknown, defaultValue: number = 0): number {
  if (typeof input === 'number' && !isNaN(input) && isFinite(input)) {
    // Allow negative percentages for decline, but cap at reasonable bounds
    return Math.max(-1000, Math.min(1000, Math.round(input)));
  }
  return defaultValue;
}

/**
 * Validate a date object or date string
 */
export function validateDate(input: unknown): Date | null {
  if (input instanceof Date && !isNaN(input.getTime())) {
    return input;
  }
  
  if (typeof input === 'string') {
    const date = new Date(input);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  return null;
}

/**
 * Type guard for BlogStats
 */
export function isBlogStats(data: unknown): data is BlogStats {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as any).totalPosts === 'number' &&
    typeof (data as any).publishedThisMonth === 'number' &&
    typeof (data as any).growthPercentage === 'number'
  );
}

/**
 * Validate and sanitize BlogStats
 */
export function validateBlogStats(data: unknown): BlogStats {
  const defaultStats: BlogStats = {
    totalPosts: 0,
    publishedThisMonth: 0,
    growthPercentage: 0
  };

  if (!data || typeof data !== 'object') {
    return defaultStats;
  }

  const input = data as any;
  return {
    totalPosts: validateNumber(input.totalPosts, 0),
    publishedThisMonth: validateNumber(input.publishedThisMonth, 0),
    growthPercentage: validatePercentage(input.growthPercentage, 0)
  };
}

/**
 * Type guard for SocialStats
 */
export function isSocialStats(data: unknown): data is SocialStats {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as any).totalPosts === 'number' &&
    typeof (data as any).postsThisWeek === 'number' &&
    typeof (data as any).totalEngagement === 'number' &&
    typeof (data as any).growthPercentage === 'number'
  );
}

/**
 * Validate and sanitize SocialStats
 */
export function validateSocialStats(data: unknown): SocialStats {
  const defaultStats: SocialStats = {
    totalPosts: 0,
    postsThisWeek: 0,
    totalEngagement: 0,
    growthPercentage: 0
  };

  if (!data || typeof data !== 'object') {
    return defaultStats;
  }

  const input = data as any;
  return {
    totalPosts: validateNumber(input.totalPosts, 0),
    postsThisWeek: validateNumber(input.postsThisWeek, 0),
    totalEngagement: validateNumber(input.totalEngagement, 0),
    growthPercentage: validatePercentage(input.growthPercentage, 0)
  };
}

/**
 * Type guard for NewsletterStats
 */
export function isNewsletterStats(data: unknown): data is NewsletterStats {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as any).totalSubscribers === 'number' &&
    typeof (data as any).newSubscribersThisMonth === 'number' &&
    typeof (data as any).growthPercentage === 'number'
  );
}

/**
 * Validate and sanitize NewsletterStats
 */
export function validateNewsletterStats(data: unknown): NewsletterStats {
  const defaultStats: NewsletterStats = {
    totalSubscribers: 0,
    newSubscribersThisMonth: 0,
    growthPercentage: 0
  };

  if (!data || typeof data !== 'object') {
    return defaultStats;
  }

  const input = data as any;
  return {
    totalSubscribers: validateNumber(input.totalSubscribers, 0),
    newSubscribersThisMonth: validateNumber(input.newSubscribersThisMonth, 0),
    growthPercentage: validatePercentage(input.growthPercentage, 0)
  };
}

/**
 * Validate activity item type
 */
function validateActivityType(type: unknown): 'blog' | 'social' | 'newsletter' | 'ai' | 'content' | 'contact' | 'faq' {
  const validTypes = ['blog', 'social', 'newsletter', 'ai', 'content', 'contact', 'faq'] as const;
  return validTypes.includes(type as any) ? (type as any) : 'blog';
}

/**
 * Validate activity item status
 */
function validateActivityStatus(status: unknown): 'published' | 'scheduled' | 'sent' | 'generated' | 'received' | 'updated' {
  const validStatuses = ['published', 'scheduled', 'sent', 'generated', 'received', 'updated'] as const;
  return validStatuses.includes(status as any) ? (status as any) : 'published';
}

/**
 * Type guard for ActivityItem
 */
export function isActivityItem(data: unknown): data is ActivityItem {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as any).id === 'string' &&
    typeof (data as any).title === 'string' &&
    typeof (data as any).description === 'string' &&
    (data as any).timestamp instanceof Date
  );
}

/**
 * Validate and sanitize ActivityItem
 */
export function validateActivityItem(data: unknown): ActivityItem | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const input = data as any;
  const timestamp = validateDate(input.timestamp);
  
  if (!timestamp || !input.id || !input.title) {
    return null;
  }

  return {
    id: sanitizeString(input.id),
    type: validateActivityType(input.type),
    title: sanitizeString(input.title),
    description: sanitizeString(input.description),
    timestamp,
    status: validateActivityStatus(input.status),
    platform: input.platform ? sanitizeString(input.platform) : undefined
  };
}

/**
 * Validate content item type
 */
function validateContentType(type: unknown): 'blog' | 'social' | 'newsletter' {
  const validTypes = ['blog', 'social', 'newsletter'] as const;
  return validTypes.includes(type as any) ? (type as any) : 'blog';
}

/**
 * Type guard for PerformingContentItem
 */
export function isPerformingContentItem(data: unknown): data is PerformingContentItem {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as any).id === 'string' &&
    typeof (data as any).title === 'string' &&
    typeof (data as any).metrics === 'object'
  );
}

/**
 * Validate and sanitize PerformingContentItem
 */
export function validatePerformingContentItem(data: unknown): PerformingContentItem | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const input = data as any;
  
  if (!input.id || !input.title) {
    return null;
  }

  const metrics = input.metrics || {};
  
  return {
    id: sanitizeString(input.id),
    title: sanitizeString(input.title),
    type: validateContentType(input.type),
    platform: input.platform ? sanitizeString(input.platform) : undefined,
    metrics: {
      views: metrics.views ? validateNumber(metrics.views) : undefined,
      likes: metrics.likes ? validateNumber(metrics.likes) : undefined,
      shares: metrics.shares ? validateNumber(metrics.shares) : undefined,
      opens: metrics.opens ? validateNumber(metrics.opens) : undefined,
      clicks: metrics.clicks ? validateNumber(metrics.clicks) : undefined
    }
  };
}

/**
 * Type guard for ScheduledItem
 */
export function isScheduledItem(data: unknown): data is ScheduledItem {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as any).id === 'string' &&
    typeof (data as any).title === 'string' &&
    (data as any).scheduledAt instanceof Date
  );
}

/**
 * Validate and sanitize ScheduledItem
 */
export function validateScheduledItem(data: unknown): ScheduledItem | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const input = data as any;
  const scheduledAt = validateDate(input.scheduledAt);
  
  if (!scheduledAt || !input.id || !input.title) {
    return null;
  }

  return {
    id: sanitizeString(input.id),
    title: sanitizeString(input.title),
    type: validateContentType(input.type),
    platform: input.platform ? sanitizeString(input.platform) : undefined,
    scheduledAt
  };
}

/**
 * Type guard for AIUsageStats
 */
export function isAIUsageStats(data: unknown): data is AIUsageStats {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as any).contentGenerated === 'number' &&
    typeof (data as any).tokensUsed === 'number' &&
    typeof (data as any).timeSaved === 'number'
  );
}

/**
 * Validate and sanitize AIUsageStats
 */
export function validateAIUsageStats(data: unknown): AIUsageStats {
  const defaultStats: AIUsageStats = {
    contentGenerated: 0,
    tokensUsed: 0,
    timeSaved: 0
  };

  if (!data || typeof data !== 'object') {
    return defaultStats;
  }

  const input = data as any;
  return {
    contentGenerated: validateNumber(input.contentGenerated, 0),
    tokensUsed: validateNumber(input.tokensUsed, 0),
    timeSaved: validateNumber(input.timeSaved, 0)
  };
}

/**
 * Validate array of items with a validator function
 */
export function validateArray<T>(
  data: unknown, 
  validator: (item: unknown) => T | null,
  maxLength: number = 100
): T[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .slice(0, maxLength) // Prevent abuse with extremely large arrays
    .map(validator)
    .filter((item): item is T => item !== null);
}

/**
 * Type guard for complete DashboardData
 */
export function isDashboardData(data: unknown): data is DashboardData {
  return (
    typeof data === 'object' &&
    data !== null &&
    isBlogStats((data as any).blogStats) &&
    isSocialStats((data as any).socialStats) &&
    isNewsletterStats((data as any).newsletterStats) &&
    Array.isArray((data as any).recentActivity) &&
    Array.isArray((data as any).topPerformingContent) &&
    Array.isArray((data as any).upcomingScheduled) &&
    isAIUsageStats((data as any).aiUsage)
  );
}

/**
 * Validate and sanitize complete DashboardData
 */
export function validateDashboardData(data: unknown): DashboardData {
  const defaultData: DashboardData = {
    blogStats: { totalPosts: 0, publishedThisMonth: 0, growthPercentage: 0 },
    socialStats: { totalPosts: 0, postsThisWeek: 0, totalEngagement: 0, growthPercentage: 0 },
    newsletterStats: { totalSubscribers: 0, newSubscribersThisMonth: 0, growthPercentage: 0 },
    recentActivity: [],
    topPerformingContent: [],
    upcomingScheduled: [],
    aiUsage: { contentGenerated: 0, tokensUsed: 0, timeSaved: 0 }
  };

  if (!data || typeof data !== 'object') {
    return defaultData;
  }

  const input = data as any;
  
  return {
    blogStats: validateBlogStats(input.blogStats),
    socialStats: validateSocialStats(input.socialStats),
    newsletterStats: validateNewsletterStats(input.newsletterStats),
    recentActivity: validateArray(input.recentActivity, validateActivityItem, 50),
    topPerformingContent: validateArray(input.topPerformingContent, validatePerformingContentItem, 20),
    upcomingScheduled: validateArray(input.upcomingScheduled, validateScheduledItem, 50),
    aiUsage: validateAIUsageStats(input.aiUsage)
  };
}

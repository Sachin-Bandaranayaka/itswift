/**
 * Tests for Dashboard Data Services
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BlogDataService } from '@/lib/services/blog-data';
import { SocialDataService } from '@/lib/services/social-data';
import { NewsletterDataService } from '@/lib/services/newsletter-data';
import { AIUsageDataService } from '@/lib/services/ai-usage-data';
import { calculateGrowth, isThisMonth, isThisWeek } from '@/lib/utils/dashboard-utils';

// Mock the external dependencies
const mockClient = vi.hoisted(() => ({
  fetch: vi.fn()
}));

vi.mock('@/lib/sanity.client', () => ({
  client: mockClient
}));

vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => ({
              data: [],
              error: null
            }))
          }))
        }))
      }))
    }))
  }
}));

describe('Dashboard Utility Functions', () => {
  describe('calculateGrowth', () => {
    it('should calculate positive growth correctly', () => {
      expect(calculateGrowth(120, 100)).toBe(20);
    });

    it('should calculate negative growth correctly', () => {
      expect(calculateGrowth(80, 100)).toBe(-20);
    });

    it('should handle zero previous value', () => {
      expect(calculateGrowth(50, 0)).toBe(100);
    });

    it('should handle zero current value', () => {
      expect(calculateGrowth(0, 100)).toBe(-100);
    });

    it('should handle both values being zero', () => {
      expect(calculateGrowth(0, 0)).toBe(0);
    });
  });

  describe('isThisMonth', () => {
    it('should return true for current month date', () => {
      const now = new Date();
      expect(isThisMonth(now)).toBe(true);
    });

    it('should return false for previous month date', () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      expect(isThisMonth(lastMonth)).toBe(false);
    });
  });

  describe('isThisWeek', () => {
    it('should return true for current week date', () => {
      const now = new Date();
      expect(isThisWeek(now)).toBe(true);
    });

    it('should return false for previous week date', () => {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 8);
      expect(isThisWeek(lastWeek)).toBe(false);
    });
  });
});

describe('BlogDataService', () => {
  let blogService: BlogDataService;

  beforeEach(() => {
    blogService = new BlogDataService();
    vi.clearAllMocks();
  });

  it('should be instantiable', () => {
    expect(blogService).toBeInstanceOf(BlogDataService);
  });

  it('should have required methods', () => {
    expect(typeof blogService.getBlogStats).toBe('function');
    expect(typeof blogService.getRecentBlogActivity).toBe('function');
    expect(typeof blogService.getScheduledBlogPosts).toBe('function');
    expect(typeof blogService.getTopPerformingBlogPosts).toBe('function');
  });

  describe('getBlogStats', () => {
    it('should fetch and calculate blog statistics correctly', async () => {
      const mockPosts = [
        { _id: '1', title: 'Post 1', publishedAt: new Date().toISOString(), _createdAt: new Date().toISOString() },
        { _id: '2', title: 'Post 2', publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), _createdAt: new Date().toISOString() },
        { _id: '3', title: 'Post 3', publishedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), _createdAt: new Date().toISOString() }
      ];

      mockClient.fetch.mockResolvedValue(mockPosts);
      
      const stats = await blogService.getBlogStats();
      
      expect(stats).toHaveProperty('totalPosts');
      expect(stats).toHaveProperty('publishedThisMonth');
      expect(stats).toHaveProperty('growthPercentage');
      expect(stats.totalPosts).toBe(3);
      expect(typeof stats.publishedThisMonth).toBe('number');
      expect(typeof stats.growthPercentage).toBe('number');
    });

    it('should handle empty response from Sanity', async () => {
      mockClient.fetch.mockResolvedValue([]);
      
      const stats = await blogService.getBlogStats();
      
      expect(stats.totalPosts).toBe(0);
      expect(stats.publishedThisMonth).toBe(0);
      expect(stats.growthPercentage).toBe(0);
    });

    it('should handle Sanity API errors', async () => {
      mockClient.fetch.mockRejectedValue(new Error('Sanity API error'));
      
      await expect(blogService.getBlogStats()).rejects.toThrow('Failed to fetch blog statistics');
    });

    it('should handle invalid response format', async () => {
      mockClient.fetch.mockResolvedValue('invalid response');
      
      await expect(blogService.getBlogStats()).rejects.toThrow('Failed to fetch blog statistics');
    });
  });

  describe('getRecentBlogActivity', () => {
    it('should fetch recent blog activity correctly', async () => {
      const mockPosts = [
        { _id: '1', title: 'Recent Post 1', publishedAt: new Date().toISOString(), slug: { current: 'recent-post-1' } },
        { _id: '2', title: 'Recent Post 2', publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), slug: { current: 'recent-post-2' } }
      ];

      mockClient.fetch.mockResolvedValue(mockPosts);
      
      const activity = await blogService.getRecentBlogActivity();
      
      expect(Array.isArray(activity)).toBe(true);
      expect(activity).toHaveLength(2);
      expect(activity[0]).toHaveProperty('id', '1');
      expect(activity[0]).toHaveProperty('type', 'blog');
      expect(activity[0]).toHaveProperty('title', 'Recent Post 1');
      expect(activity[0]).toHaveProperty('status', 'published');
      expect(activity[0]).toHaveProperty('platform', 'blog');
    });

    it('should handle empty response gracefully', async () => {
      mockClient.fetch.mockResolvedValue([]);
      
      const activity = await blogService.getRecentBlogActivity();
      
      expect(Array.isArray(activity)).toBe(true);
      expect(activity).toHaveLength(0);
    });

    it('should handle API errors gracefully', async () => {
      mockClient.fetch.mockRejectedValue(new Error('API error'));
      
      const activity = await blogService.getRecentBlogActivity();
      
      expect(Array.isArray(activity)).toBe(true);
      expect(activity).toHaveLength(0);
    });

    it('should handle posts with missing titles', async () => {
      const mockPosts = [
        { _id: '1', publishedAt: new Date().toISOString(), slug: { current: 'untitled-post' } }
      ];

      mockClient.fetch.mockResolvedValue(mockPosts);
      
      const activity = await blogService.getRecentBlogActivity();
      
      expect(activity[0].title).toBe('Untitled Post');
    });
  });

  describe('getScheduledBlogPosts', () => {
    it('should fetch scheduled blog posts correctly', async () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const mockPosts = [
        { _id: '1', title: 'Scheduled Post 1', publishedAt: futureDate, slug: { current: 'scheduled-post-1' } }
      ];

      mockClient.fetch.mockResolvedValue(mockPosts);
      
      const scheduled = await blogService.getScheduledBlogPosts();
      
      expect(Array.isArray(scheduled)).toBe(true);
      expect(scheduled).toHaveLength(1);
      expect(scheduled[0]).toHaveProperty('status', 'scheduled');
      expect(scheduled[0]).toHaveProperty('type', 'blog');
    });

    it('should handle empty scheduled posts', async () => {
      mockClient.fetch.mockResolvedValue([]);
      
      const scheduled = await blogService.getScheduledBlogPosts();
      
      expect(Array.isArray(scheduled)).toBe(true);
      expect(scheduled).toHaveLength(0);
    });
  });

  describe('getTopPerformingBlogPosts', () => {
    it('should fetch top performing blog posts', async () => {
      const mockPosts = [
        { _id: '1', title: 'Top Post 1', publishedAt: new Date().toISOString(), slug: { current: 'top-post-1' }, excerpt: 'Great post' }
      ];

      mockClient.fetch.mockResolvedValue(mockPosts);
      
      const topPosts = await blogService.getTopPerformingBlogPosts();
      
      expect(Array.isArray(topPosts)).toBe(true);
      expect(topPosts).toHaveLength(1);
      expect(topPosts[0]).toHaveProperty('type', 'blog');
      expect(topPosts[0]).toHaveProperty('metrics');
      expect(topPosts[0].metrics).toHaveProperty('views');
      expect(topPosts[0].metrics).toHaveProperty('likes');
      expect(topPosts[0].metrics).toHaveProperty('shares');
    });

    it('should handle API errors gracefully', async () => {
      mockClient.fetch.mockRejectedValue(new Error('API error'));
      
      const topPosts = await blogService.getTopPerformingBlogPosts();
      
      expect(Array.isArray(topPosts)).toBe(true);
      expect(topPosts).toHaveLength(0);
    });
  });
});

describe('SocialDataService', () => {
  let socialService: SocialDataService;

  beforeEach(() => {
    socialService = new SocialDataService();
    vi.clearAllMocks();
  });

  it('should be instantiable', () => {
    expect(socialService).toBeInstanceOf(SocialDataService);
  });

  it('should have required methods', () => {
    expect(typeof socialService.getSocialStats).toBe('function');
    expect(typeof socialService.getRecentSocialActivity).toBe('function');
    expect(typeof socialService.getTopPerformingSocialContent).toBe('function');
    expect(typeof socialService.getScheduledSocialPosts).toBe('function');
    expect(typeof socialService.getEngagementMetrics).toBe('function');
  });
});

describe('NewsletterDataService', () => {
  let newsletterService: NewsletterDataService;

  beforeEach(() => {
    newsletterService = new NewsletterDataService();
    vi.clearAllMocks();
  });

  it('should be instantiable', () => {
    expect(newsletterService).toBeInstanceOf(NewsletterDataService);
  });

  it('should have required methods', () => {
    expect(typeof newsletterService.getNewsletterStats).toBe('function');
    expect(typeof newsletterService.getRecentNewsletterActivity).toBe('function');
    expect(typeof newsletterService.getTopPerformingNewsletterCampaigns).toBe('function');
    expect(typeof newsletterService.getScheduledNewsletterCampaigns).toBe('function');
    expect(typeof newsletterService.getNewsletterEngagementMetrics).toBe('function');
    expect(typeof newsletterService.getSubscriberGrowth).toBe('function');
  });
});

describe('AIUsageDataService', () => {
  let aiUsageService: AIUsageDataService;

  beforeEach(() => {
    aiUsageService = new AIUsageDataService();
    vi.clearAllMocks();
  });

  it('should be instantiable', () => {
    expect(aiUsageService).toBeInstanceOf(AIUsageDataService);
  });

  it('should have required methods', () => {
    expect(typeof aiUsageService.getAIUsageStats).toBe('function');
    expect(typeof aiUsageService.getRecentAIActivity).toBe('function');
    expect(typeof aiUsageService.getAIUsageMetrics).toBe('function');
    expect(typeof aiUsageService.getAIUsageTrends).toBe('function');
    expect(typeof aiUsageService.getAIUsageGrowth).toBe('function');
    expect(typeof aiUsageService.getEstimatedCostSavings).toBe('function');
  });
});
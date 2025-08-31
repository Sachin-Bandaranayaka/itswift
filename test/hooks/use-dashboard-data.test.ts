/**
 * Comprehensive Integration Tests for useDashboardData hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock the data services
const mockBlogDataService = vi.hoisted(() => ({
  getBlogStats: vi.fn(),
  getRecentBlogActivity: vi.fn(),
  getScheduledBlogPosts: vi.fn(),
  getTopPerformingBlogPosts: vi.fn()
}));

const mockSocialDataService = vi.hoisted(() => ({
  getSocialStats: vi.fn(),
  getRecentSocialActivity: vi.fn(),
  getTopPerformingSocialContent: vi.fn(),
  getScheduledSocialPosts: vi.fn(),
  getEngagementMetrics: vi.fn()
}));

const mockNewsletterDataService = vi.hoisted(() => ({
  getNewsletterStats: vi.fn(),
  getRecentNewsletterActivity: vi.fn(),
  getTopPerformingNewsletterCampaigns: vi.fn(),
  getScheduledNewsletterCampaigns: vi.fn(),
  getNewsletterEngagementMetrics: vi.fn()
}));

const mockAIUsageDataService = vi.hoisted(() => ({
  getAIUsageStats: vi.fn(),
  getRecentAIActivity: vi.fn(),
  getAIUsageMetrics: vi.fn(),
  getAIUsageGrowth: vi.fn(),
  getEstimatedCostSavings: vi.fn(),
  getUsageLimitStatus: vi.fn()
}));

vi.mock('@/lib/services/blog-data', () => ({
  BlogDataService: vi.fn(() => mockBlogDataService)
}));

vi.mock('@/lib/services/social-data', () => ({
  SocialDataService: vi.fn(() => mockSocialDataService)
}));

vi.mock('@/lib/services/newsletter-data', () => ({
  NewsletterDataService: vi.fn(() => mockNewsletterDataService)
}));

vi.mock('@/lib/services/ai-usage-data', () => ({
  AIUsageDataService: vi.fn(() => mockAIUsageDataService)
}));

describe('useDashboardData Integration Tests', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
          gcTime: 0,
        },
      },
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
    vi.resetAllMocks();
  });

  const createWrapper = ({ children }: { children: React.ReactNode }) => 
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  describe('useDashboardData hook', () => {
    it('should fetch and aggregate all dashboard data successfully', async () => {
      // Mock successful responses from all services
      mockBlogDataService.getBlogStats.mockResolvedValue({
        totalPosts: 25,
        publishedThisMonth: 5,
        growthPercentage: 25
      });

      mockSocialDataService.getSocialStats.mockResolvedValue({
        totalPosts: 50,
        postsThisWeek: 8,
        totalEngagement: 1200,
        growthPercentage: 15
      });

      mockNewsletterDataService.getNewsletterStats.mockResolvedValue({
        totalSubscribers: 1500,
        newSubscribersThisMonth: 150,
        growthPercentage: 10
      });

      mockAIUsageDataService.getAIUsageStats.mockResolvedValue({
        contentGenerated: 100,
        tokensUsed: 50000,
        timeSaved: 120
      });

      mockBlogDataService.getRecentBlogActivity.mockResolvedValue([]);
      mockSocialDataService.getRecentSocialActivity.mockResolvedValue([]);
      mockNewsletterDataService.getRecentNewsletterActivity.mockResolvedValue([]);
      mockAIUsageDataService.getRecentAIActivity.mockResolvedValue([]);
      mockBlogDataService.getTopPerformingBlogPosts.mockResolvedValue([]);
      mockSocialDataService.getTopPerformingSocialContent.mockResolvedValue([]);
      mockNewsletterDataService.getTopPerformingNewsletterCampaigns.mockResolvedValue([]);
      mockBlogDataService.getScheduledBlogPosts.mockResolvedValue([]);
      mockSocialDataService.getScheduledSocialPosts.mockResolvedValue([]);
      mockNewsletterDataService.getScheduledNewsletterCampaigns.mockResolvedValue([]);

      const { useDashboardData } = await import('@/hooks/use-dashboard-data');
      const { result } = renderHook(() => useDashboardData({ enableAutoRefresh: false }), {
        wrapper: createWrapper,
      });

      // Wait for all queries to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 3000 });

      // Verify all data is loaded correctly
      expect(result.current.blogStats).toEqual({
        totalPosts: 25,
        publishedThisMonth: 5,
        growthPercentage: 25
      });

      expect(result.current.socialStats).toEqual({
        totalPosts: 50,
        postsThisWeek: 8,
        totalEngagement: 1200,
        growthPercentage: 15
      });

      expect(result.current.newsletterStats).toEqual({
        totalSubscribers: 1500,
        newSubscribersThisMonth: 150,
        growthPercentage: 10
      });

      expect(result.current.aiUsage).toEqual({
        contentGenerated: 100,
        tokensUsed: 50000,
        timeSaved: 120
      });

      expect(result.current.recentActivity).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('should handle loading states correctly', async () => {
      // Mock all required methods
      mockBlogDataService.getBlogStats.mockResolvedValue({
        totalPosts: 25,
        publishedThisMonth: 5,
        growthPercentage: 25
      });

      mockSocialDataService.getSocialStats.mockResolvedValue({
        totalPosts: 50,
        postsThisWeek: 8,
        totalEngagement: 1200,
        growthPercentage: 15
      });

      mockNewsletterDataService.getNewsletterStats.mockResolvedValue({
        totalSubscribers: 1500,
        newSubscribersThisMonth: 150,
        growthPercentage: 10
      });

      mockAIUsageDataService.getAIUsageStats.mockResolvedValue({
        contentGenerated: 100,
        tokensUsed: 50000,
        timeSaved: 120
      });

      // Mock all activity methods
      mockBlogDataService.getRecentBlogActivity.mockResolvedValue([]);
      mockSocialDataService.getRecentSocialActivity.mockResolvedValue([]);
      mockNewsletterDataService.getRecentNewsletterActivity.mockResolvedValue([]);
      mockAIUsageDataService.getRecentAIActivity.mockResolvedValue([]);
      mockBlogDataService.getTopPerformingBlogPosts.mockResolvedValue([]);
      mockSocialDataService.getTopPerformingSocialContent.mockResolvedValue([]);
      mockNewsletterDataService.getTopPerformingNewsletterCampaigns.mockResolvedValue([]);
      mockBlogDataService.getScheduledBlogPosts.mockResolvedValue([]);
      mockSocialDataService.getScheduledSocialPosts.mockResolvedValue([]);
      mockNewsletterDataService.getScheduledNewsletterCampaigns.mockResolvedValue([]);

      const { useDashboardData } = await import('@/hooks/use-dashboard-data');
      const { result } = renderHook(() => useDashboardData({ enableAutoRefresh: false }), {
        wrapper: createWrapper,
      });

      // Initially should be loading
      expect(result.current.isLoading).toBe(true);

      // Wait for loading to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 3000 });

      expect(result.current.blogStats).toBeDefined();
    });

    it('should handle errors gracefully', async () => {
      // Mock error responses
      mockBlogDataService.getBlogStats.mockRejectedValue(new Error('Blog service error'));
      mockSocialDataService.getSocialStats.mockResolvedValue({
        totalPosts: 50,
        postsThisWeek: 8,
        totalEngagement: 1200,
        growthPercentage: 15
      });
      mockNewsletterDataService.getNewsletterStats.mockResolvedValue({
        totalSubscribers: 1500,
        newSubscribersThisMonth: 150,
        growthPercentage: 10
      });
      mockAIUsageDataService.getAIUsageStats.mockResolvedValue({
        contentGenerated: 100,
        tokensUsed: 50000,
        timeSaved: 120
      });

      // Mock all activity methods
      mockBlogDataService.getRecentBlogActivity.mockResolvedValue([]);
      mockSocialDataService.getRecentSocialActivity.mockResolvedValue([]);
      mockNewsletterDataService.getRecentNewsletterActivity.mockResolvedValue([]);
      mockAIUsageDataService.getRecentAIActivity.mockResolvedValue([]);
      mockBlogDataService.getTopPerformingBlogPosts.mockResolvedValue([]);
      mockSocialDataService.getTopPerformingSocialContent.mockResolvedValue([]);
      mockNewsletterDataService.getTopPerformingNewsletterCampaigns.mockResolvedValue([]);
      mockBlogDataService.getScheduledBlogPosts.mockResolvedValue([]);
      mockSocialDataService.getScheduledSocialPosts.mockResolvedValue([]);
      mockNewsletterDataService.getScheduledNewsletterCampaigns.mockResolvedValue([]);

      const { useDashboardData } = await import('@/hooks/use-dashboard-data');
      const { result } = renderHook(() => useDashboardData({ enableAutoRefresh: false }), {
        wrapper: createWrapper,
      });

      await waitFor(() => {
        expect(result.current.blogStatsError).toBeTruthy();
      }, { timeout: 5000 });

      // Should have error for blog stats but other data should still load
      expect(result.current.blogStatsError).toBeTruthy();
      expect(result.current.blogStats).toBeUndefined();
      
      // Wait for other data to load
      await waitFor(() => {
        expect(result.current.socialStats).toBeDefined();
      }, { timeout: 3000 });
      
      expect(result.current.newsletterStats).toBeDefined();
      expect(result.current.aiUsage).toBeDefined();
    });

    it('should support manual refresh functionality', async () => {
      // Mock all required methods
      mockBlogDataService.getBlogStats.mockResolvedValue({
        totalPosts: 25,
        publishedThisMonth: 5,
        growthPercentage: 25
      });

      mockSocialDataService.getSocialStats.mockResolvedValue({
        totalPosts: 50,
        postsThisWeek: 8,
        totalEngagement: 1200,
        growthPercentage: 15
      });

      mockNewsletterDataService.getNewsletterStats.mockResolvedValue({
        totalSubscribers: 1500,
        newSubscribersThisMonth: 150,
        growthPercentage: 10
      });

      mockAIUsageDataService.getAIUsageStats.mockResolvedValue({
        contentGenerated: 100,
        tokensUsed: 50000,
        timeSaved: 120
      });

      // Mock all activity methods
      mockBlogDataService.getRecentBlogActivity.mockResolvedValue([]);
      mockSocialDataService.getRecentSocialActivity.mockResolvedValue([]);
      mockNewsletterDataService.getRecentNewsletterActivity.mockResolvedValue([]);
      mockAIUsageDataService.getRecentAIActivity.mockResolvedValue([]);
      mockBlogDataService.getTopPerformingBlogPosts.mockResolvedValue([]);
      mockSocialDataService.getTopPerformingSocialContent.mockResolvedValue([]);
      mockNewsletterDataService.getTopPerformingNewsletterCampaigns.mockResolvedValue([]);
      mockBlogDataService.getScheduledBlogPosts.mockResolvedValue([]);
      mockSocialDataService.getScheduledSocialPosts.mockResolvedValue([]);
      mockNewsletterDataService.getScheduledNewsletterCampaigns.mockResolvedValue([]);

      const { useDashboardData } = await import('@/hooks/use-dashboard-data');
      const { result } = renderHook(() => useDashboardData({ enableAutoRefresh: false }), {
        wrapper: createWrapper,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 3000 });

      // Verify refetch function exists
      expect(typeof result.current.refetch).toBe('function');
      expect(typeof result.current.refresh).toBe('function');
      expect(typeof result.current.forceRefresh).toBe('function');
    });

    it('should provide access to individual data sections', async () => {
      // Mock all required methods
      mockBlogDataService.getBlogStats.mockResolvedValue({
        totalPosts: 25,
        publishedThisMonth: 5,
        growthPercentage: 25
      });

      mockSocialDataService.getSocialStats.mockResolvedValue({
        totalPosts: 50,
        postsThisWeek: 8,
        totalEngagement: 1200,
        growthPercentage: 15
      });

      mockNewsletterDataService.getNewsletterStats.mockResolvedValue({
        totalSubscribers: 1500,
        newSubscribersThisMonth: 150,
        growthPercentage: 10
      });

      mockAIUsageDataService.getAIUsageStats.mockResolvedValue({
        contentGenerated: 100,
        tokensUsed: 50000,
        timeSaved: 120
      });

      // Mock all activity methods
      mockBlogDataService.getRecentBlogActivity.mockResolvedValue([]);
      mockSocialDataService.getRecentSocialActivity.mockResolvedValue([]);
      mockNewsletterDataService.getRecentNewsletterActivity.mockResolvedValue([]);
      mockAIUsageDataService.getRecentAIActivity.mockResolvedValue([]);
      mockBlogDataService.getTopPerformingBlogPosts.mockResolvedValue([]);
      mockSocialDataService.getTopPerformingSocialContent.mockResolvedValue([]);
      mockNewsletterDataService.getTopPerformingNewsletterCampaigns.mockResolvedValue([]);
      mockBlogDataService.getScheduledBlogPosts.mockResolvedValue([]);
      mockSocialDataService.getScheduledSocialPosts.mockResolvedValue([]);
      mockNewsletterDataService.getScheduledNewsletterCampaigns.mockResolvedValue([]);

      const { useDashboardData } = await import('@/hooks/use-dashboard-data');
      const { result } = renderHook(() => useDashboardData({ enableAutoRefresh: false }), {
        wrapper: createWrapper,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 3000 });

      // Verify individual data sections are accessible
      expect(result.current.blogStats).toBeDefined();
      expect(result.current.socialStats).toBeDefined();
      expect(result.current.newsletterStats).toBeDefined();
      expect(result.current.aiUsage).toBeDefined();
      expect(Array.isArray(result.current.recentActivity)).toBe(true);
      expect(Array.isArray(result.current.topPerformingContent)).toBe(true);
      expect(Array.isArray(result.current.upcomingScheduled)).toBe(true);
    });
  });

  describe('useDashboardSection hook', () => {
    it('should export the required functions', async () => {
      const { useDashboardSection } = await import('@/hooks/use-dashboard-data');
      
      expect(typeof useDashboardSection).toBe('function');
    });
  });

  describe('useDashboardControls hook', () => {
    it('should export the required functions', async () => {
      const { useDashboardControls } = await import('@/hooks/use-dashboard-data');
      
      expect(typeof useDashboardControls).toBe('function');
    });
  });

  describe('Dashboard data caching behavior', () => {
    it('should provide caching and real-time update controls', async () => {
      // Mock all required methods
      mockBlogDataService.getBlogStats.mockResolvedValue({
        totalPosts: 25,
        publishedThisMonth: 5,
        growthPercentage: 25
      });

      mockSocialDataService.getSocialStats.mockResolvedValue({
        totalPosts: 50,
        postsThisWeek: 8,
        totalEngagement: 1200,
        growthPercentage: 15
      });

      mockNewsletterDataService.getNewsletterStats.mockResolvedValue({
        totalSubscribers: 1500,
        newSubscribersThisMonth: 150,
        growthPercentage: 10
      });

      mockAIUsageDataService.getAIUsageStats.mockResolvedValue({
        contentGenerated: 100,
        tokensUsed: 50000,
        timeSaved: 120
      });

      // Mock all activity methods
      mockBlogDataService.getRecentBlogActivity.mockResolvedValue([]);
      mockSocialDataService.getRecentSocialActivity.mockResolvedValue([]);
      mockNewsletterDataService.getRecentNewsletterActivity.mockResolvedValue([]);
      mockAIUsageDataService.getRecentAIActivity.mockResolvedValue([]);
      mockBlogDataService.getTopPerformingBlogPosts.mockResolvedValue([]);
      mockSocialDataService.getTopPerformingSocialContent.mockResolvedValue([]);
      mockNewsletterDataService.getTopPerformingNewsletterCampaigns.mockResolvedValue([]);
      mockBlogDataService.getScheduledBlogPosts.mockResolvedValue([]);
      mockSocialDataService.getScheduledSocialPosts.mockResolvedValue([]);
      mockNewsletterDataService.getScheduledNewsletterCampaigns.mockResolvedValue([]);

      const { useDashboardData } = await import('@/hooks/use-dashboard-data');
      const { result } = renderHook(() => useDashboardData({ enableAutoRefresh: false }), {
        wrapper: createWrapper,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      }, { timeout: 3000 });

      // Verify caching and control functions are available
      expect(typeof result.current.pauseAutoRefresh).toBe('function');
      expect(typeof result.current.resumeAutoRefresh).toBe('function');
      expect(typeof result.current.refreshStats).toBe('function');
      expect(typeof result.current.refreshActivity).toBe('function');
      expect(typeof result.current.refreshPerformance).toBe('function');
      expect(typeof result.current.refreshScheduled).toBe('function');
      expect(result.current.isAutoRefreshEnabled).toBe(false);
    });
  });
});
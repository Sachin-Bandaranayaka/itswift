/**
 * End-to-End Dashboard Integration Tests
 * 
 * These tests verify the complete dashboard functionality with real data integration,
 * including data loading, error handling, performance, and user interactions.
 */

import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import AdminDashboard from '@/app/admin/page';

// Mock the data services with realistic data
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

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error;
const originalConsoleLog = console.log;

describe('Dashboard End-to-End Integration Tests', () => {
  let queryClient: QueryClient;

  beforeAll(() => {
    // Mock console methods
    console.error = vi.fn();
    console.log = vi.fn();
  });

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

  const mockSuccessfulDataResponses = () => {
    // Mock blog data
    mockBlogDataService.getBlogStats.mockResolvedValue({
      totalPosts: 45,
      publishedThisMonth: 8,
      growthPercentage: 33.3
    });

    mockBlogDataService.getRecentBlogActivity.mockResolvedValue([
      {
        id: 'blog-1',
        type: 'blog',
        title: 'Latest Blog Post',
        description: 'Blog post published',
        timestamp: new Date('2024-01-15T10:00:00Z'),
        status: 'published'
      }
    ]);

    mockBlogDataService.getTopPerformingBlogPosts.mockResolvedValue([
      {
        id: 'blog-top-1',
        title: 'Top Performing Blog Post',
        type: 'blog',
        metrics: {
          views: 1500,
          likes: 45,
          shares: 12
        }
      }
    ]);

    mockBlogDataService.getScheduledBlogPosts.mockResolvedValue([
      {
        id: 'blog-scheduled-1',
        title: 'Upcoming Blog Post',
        type: 'blog',
        scheduledAt: new Date('2024-01-20T14:00:00Z')
      }
    ]);

    // Mock social data
    mockSocialDataService.getSocialStats.mockResolvedValue({
      totalPosts: 120,
      postsThisWeek: 15,
      totalEngagement: 2500,
      growthPercentage: 25.0
    });

    mockSocialDataService.getRecentSocialActivity.mockResolvedValue([
      {
        id: 'social-1',
        type: 'social',
        title: 'Latest Social Post',
        description: 'Social post published on LinkedIn',
        timestamp: new Date('2024-01-15T12:00:00Z'),
        status: 'published',
        platform: 'linkedin'
      }
    ]);

    mockSocialDataService.getTopPerformingSocialContent.mockResolvedValue([
      {
        id: 'social-top-1',
        title: 'Top Social Post',
        type: 'social',
        platform: 'linkedin',
        metrics: {
          likes: 150,
          shares: 25,
          comments: 8
        }
      }
    ]);

    mockSocialDataService.getScheduledSocialPosts.mockResolvedValue([
      {
        id: 'social-scheduled-1',
        title: 'Upcoming Social Post',
        type: 'social',
        platform: 'twitter',
        scheduledAt: new Date('2024-01-18T16:00:00Z')
      }
    ]);

    // Mock newsletter data
    mockNewsletterDataService.getNewsletterStats.mockResolvedValue({
      totalSubscribers: 2500,
      newSubscribersThisMonth: 180,
      growthPercentage: 7.8
    });

    mockNewsletterDataService.getRecentNewsletterActivity.mockResolvedValue([
      {
        id: 'newsletter-1',
        type: 'newsletter',
        title: 'Weekly Newsletter',
        description: 'Newsletter sent to 2500 subscribers',
        timestamp: new Date('2024-01-14T09:00:00Z'),
        status: 'sent'
      }
    ]);

    mockNewsletterDataService.getTopPerformingNewsletterCampaigns.mockResolvedValue([
      {
        id: 'newsletter-top-1',
        title: 'Best Newsletter Campaign',
        type: 'newsletter',
        metrics: {
          opens: 1200,
          clicks: 180
        }
      }
    ]);

    mockNewsletterDataService.getScheduledNewsletterCampaigns.mockResolvedValue([
      {
        id: 'newsletter-scheduled-1',
        title: 'Upcoming Newsletter',
        type: 'newsletter',
        scheduledAt: new Date('2024-01-21T10:00:00Z')
      }
    ]);

    // Mock AI usage data
    mockAIUsageDataService.getAIUsageStats.mockResolvedValue({
      contentGenerated: 85,
      tokensUsed: 125000,
      timeSaved: 340
    });

    mockAIUsageDataService.getRecentAIActivity.mockResolvedValue([
      {
        id: 'ai-1',
        type: 'ai',
        title: 'AI Content Generated',
        description: 'Blog post outline generated',
        timestamp: new Date('2024-01-15T14:30:00Z'),
        status: 'generated'
      }
    ]);
  };

  describe('Complete Dashboard Functionality', () => {
    it('should render dashboard with all real data sections', async () => {
      mockSuccessfulDataResponses();

      render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      // Wait for dashboard to load
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      }, { timeout: 5000 });

      // Verify all stat cards are present with real data
      await waitFor(() => {
        expect(screen.getByText('Total Blog Posts')).toBeInTheDocument();
        expect(screen.getByText('Social Posts')).toBeInTheDocument();
        expect(screen.getByText('Newsletter Subscribers')).toBeInTheDocument();
        expect(screen.getByText('Total Engagement')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Verify activity sections are present
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('AI Usage')).toBeInTheDocument();

      // Verify data is displayed (not just loading states)
      await waitFor(() => {
        expect(screen.getAllByText('45')[0]).toBeInTheDocument(); // Blog posts count
        expect(screen.getByText('120')).toBeInTheDocument(); // Social posts count
        expect(screen.getAllByText('2.5K')[0]).toBeInTheDocument(); // Newsletter subscribers
        expect(screen.getAllByText('2.5K')[1]).toBeInTheDocument(); // Total engagement
      }, { timeout: 3000 });
    });

    it('should update statistics correctly when data changes', async () => {
      // Initial data
      mockSuccessfulDataResponses();

      const { rerender } = render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      // Wait for initial data to load
      await waitFor(() => {
        expect(screen.getByText('45')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Update mock data to simulate changes
      mockBlogDataService.getBlogStats.mockResolvedValue({
        totalPosts: 47, // Increased by 2
        publishedThisMonth: 10, // Increased by 2
        growthPercentage: 42.9 // Updated growth
      });

      // Trigger refresh
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      fireEvent.click(refreshButton);

      // Wait for updated data
      await waitFor(() => {
        expect(screen.getByText('47')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Verify growth percentage updated
      await waitFor(() => {
        expect(screen.getByText(/42\.9%/)).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should handle mixed success and error states gracefully', async () => {
      // Mock partial success - blog fails, others succeed
      mockBlogDataService.getBlogStats.mockRejectedValue(new Error('Blog service unavailable'));
      
      mockSocialDataService.getSocialStats.mockResolvedValue({
        totalPosts: 120,
        postsThisWeek: 15,
        totalEngagement: 2500,
        growthPercentage: 25.0
      });

      mockNewsletterDataService.getNewsletterStats.mockResolvedValue({
        totalSubscribers: 2500,
        newSubscribersThisMonth: 180,
        growthPercentage: 7.8
      });

      mockAIUsageDataService.getAIUsageStats.mockResolvedValue({
        contentGenerated: 85,
        tokensUsed: 125000,
        timeSaved: 340
      });

      // Mock activity methods
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

      render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      // Wait for dashboard to load
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Should show error state for blog stats
      await waitFor(() => {
        expect(screen.getByText(/Failed to load data/)).toBeInTheDocument();
      }, { timeout: 3000 });

      // But other stats should load successfully
      await waitFor(() => {
        expect(screen.getByText('120')).toBeInTheDocument(); // Social posts
        expect(screen.getByText('2.5K')).toBeInTheDocument(); // Newsletter subscribers
      }, { timeout: 3000 });

      // Should show partial error warning
      await waitFor(() => {
        expect(screen.getByText(/Some Data May Be Outdated/)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('should provide retry functionality for failed data', async () => {
      // Initially fail, then succeed on retry
      let blogCallCount = 0;
      mockBlogDataService.getBlogStats.mockImplementation(() => {
        blogCallCount++;
        if (blogCallCount === 1) {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.resolve({
          totalPosts: 45,
          publishedThisMonth: 8,
          growthPercentage: 33.3
        });
      });

      // Mock other services to succeed
      mockSocialDataService.getSocialStats.mockResolvedValue({
        totalPosts: 120,
        postsThisWeek: 15,
        totalEngagement: 2500,
        growthPercentage: 25.0
      });

      mockNewsletterDataService.getNewsletterStats.mockResolvedValue({
        totalSubscribers: 2500,
        newSubscribersThisMonth: 180,
        growthPercentage: 7.8
      });

      mockAIUsageDataService.getAIUsageStats.mockResolvedValue({
        contentGenerated: 85,
        tokensUsed: 125000,
        timeSaved: 340
      });

      // Mock activity methods
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

      render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      // Wait for initial error state
      await waitFor(() => {
        expect(screen.getByText(/Failed to load data/)).toBeInTheDocument();
      }, { timeout: 3000 });

      // Find and click retry button
      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);

      // Wait for successful retry
      await waitFor(() => {
        expect(screen.getByText('45')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Verify error message is gone
      expect(screen.queryByText(/Failed to load/)).not.toBeInTheDocument();
    });
  });

  describe('Dashboard Performance Under Load', () => {
    it('should handle large datasets efficiently', { timeout: 10000 }, async () => {
      // Mock large datasets
      const largeActivityList = Array.from({ length: 100 }, (_, i) => ({
        id: `activity-${i}`,
        type: 'blog' as const,
        title: `Activity Item ${i}`,
        description: `Description for activity ${i}`,
        timestamp: new Date(Date.now() - i * 60000),
        status: 'published' as const
      }));

      const largeTopPerformingList = Array.from({ length: 50 }, (_, i) => ({
        id: `top-${i}`,
        title: `Top Content ${i}`,
        type: 'blog' as const,
        metrics: {
          views: 1000 + i * 100,
          likes: 50 + i * 5,
          shares: 10 + i
        }
      }));

      mockBlogDataService.getBlogStats.mockResolvedValue({
        totalPosts: 1000,
        publishedThisMonth: 50,
        growthPercentage: 25.0
      });

      mockSocialDataService.getSocialStats.mockResolvedValue({
        totalPosts: 5000,
        postsThisWeek: 100,
        totalEngagement: 50000,
        growthPercentage: 15.0
      });

      mockNewsletterDataService.getNewsletterStats.mockResolvedValue({
        totalSubscribers: 10000,
        newSubscribersThisMonth: 500,
        growthPercentage: 5.3
      });

      mockAIUsageDataService.getAIUsageStats.mockResolvedValue({
        contentGenerated: 500,
        tokensUsed: 1000000,
        timeSaved: 2000
      });

      // Mock large activity data
      mockBlogDataService.getRecentBlogActivity.mockResolvedValue(largeActivityList.slice(0, 20));
      mockSocialDataService.getRecentSocialActivity.mockResolvedValue([]);
      mockNewsletterDataService.getRecentNewsletterActivity.mockResolvedValue([]);
      mockAIUsageDataService.getRecentAIActivity.mockResolvedValue([]);
      mockBlogDataService.getTopPerformingBlogPosts.mockResolvedValue(largeTopPerformingList.slice(0, 10));
      mockSocialDataService.getTopPerformingSocialContent.mockResolvedValue([]);
      mockNewsletterDataService.getTopPerformingNewsletterCampaigns.mockResolvedValue([]);
      mockBlogDataService.getScheduledBlogPosts.mockResolvedValue([]);
      mockSocialDataService.getScheduledSocialPosts.mockResolvedValue([]);
      mockNewsletterDataService.getScheduledNewsletterCampaigns.mockResolvedValue([]);

      const startTime = performance.now();

      render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      // Wait for dashboard to fully load
      await waitFor(() => {
        expect(screen.getByText('1K')).toBeInTheDocument(); // 1000 blog posts formatted
        expect(screen.getByText('5K')).toBeInTheDocument(); // 5000 social posts formatted
        expect(screen.getByText('10K')).toBeInTheDocument(); // 10000 subscribers formatted
      }, { timeout: 5000 });

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Dashboard should load within reasonable time even with large datasets
      expect(loadTime).toBeLessThan(5000); // 5 seconds max

      // Verify large numbers are properly formatted
      expect(screen.getByText('1K')).toBeInTheDocument();
      expect(screen.getByText('5K')).toBeInTheDocument();
      expect(screen.getByText('10K')).toBeInTheDocument();
      expect(screen.getByText('50K')).toBeInTheDocument(); // Total engagement
    });

    it('should handle concurrent data updates without race conditions', async () => {
      let updateCount = 0;
      
      // Mock services that update data multiple times
      mockBlogDataService.getBlogStats.mockImplementation(async () => {
        updateCount++;
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
        return {
          totalPosts: 40 + updateCount,
          publishedThisMonth: 5 + updateCount,
          growthPercentage: 20 + updateCount
        };
      });

      mockSocialDataService.getSocialStats.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 150));
        return {
          totalPosts: 100 + updateCount,
          postsThisWeek: 10 + updateCount,
          totalEngagement: 2000 + updateCount * 100,
          growthPercentage: 15 + updateCount
        };
      });

      mockNewsletterDataService.getNewsletterStats.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 80));
        return {
          totalSubscribers: 2000 + updateCount * 10,
          newSubscribersThisMonth: 100 + updateCount,
          growthPercentage: 8 + updateCount
        };
      });

      mockAIUsageDataService.getAIUsageStats.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 120));
        return {
          contentGenerated: 50 + updateCount,
          tokensUsed: 100000 + updateCount * 1000,
          timeSaved: 200 + updateCount * 10
        };
      });

      // Mock activity methods
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

      render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Trigger multiple concurrent refreshes
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      
      await act(async () => {
        fireEvent.click(refreshButton);
        fireEvent.click(refreshButton);
        fireEvent.click(refreshButton);
      });

      // Wait for all updates to complete
      await waitFor(() => {
        // Should show consistent data (no race conditions)
        const blogCount = screen.getByText(/4[1-9]/); // Should be 41+ after updates
        expect(blogCount).toBeInTheDocument();
      }, { timeout: 5000 });

      // Verify no error states from race conditions
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  describe('Real-time Data Updates', () => {
    it('should refresh data automatically when enabled', { timeout: 10000 }, async () => {
      vi.useFakeTimers();
      
      let callCount = 0;
      mockBlogDataService.getBlogStats.mockImplementation(() => {
        callCount++;
        return Promise.resolve({
          totalPosts: 40 + callCount,
          publishedThisMonth: 5,
          growthPercentage: 25
        });
      });

      // Mock other services
      mockSocialDataService.getSocialStats.mockResolvedValue({
        totalPosts: 120,
        postsThisWeek: 15,
        totalEngagement: 2500,
        growthPercentage: 25.0
      });

      mockNewsletterDataService.getNewsletterStats.mockResolvedValue({
        totalSubscribers: 2500,
        newSubscribersThisMonth: 180,
        growthPercentage: 7.8
      });

      mockAIUsageDataService.getAIUsageStats.mockResolvedValue({
        contentGenerated: 85,
        tokensUsed: 125000,
        timeSaved: 340
      });

      // Mock activity methods
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

      render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('41')).toBeInTheDocument();
      });

      // Fast-forward time to trigger auto-refresh (5 minutes)
      act(() => {
        vi.advanceTimersByTime(5 * 60 * 1000);
      });

      // Wait for auto-refresh to complete
      await waitFor(() => {
        expect(screen.getByText('42')).toBeInTheDocument();
      }, { timeout: 3000 });

      vi.useRealTimers();
    });

    it('should handle network connectivity changes', { timeout: 10000 }, async () => {
      mockSuccessfulDataResponses();

      render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('45')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Simulate going offline
      act(() => {
        Object.defineProperty(navigator, 'onLine', {
          writable: true,
          value: false,
        });
        window.dispatchEvent(new Event('offline'));
      });

      // Should show offline indicator
      await waitFor(() => {
        expect(screen.getByText(/offline/i)).toBeInTheDocument();
      }, { timeout: 2000 });

      // Simulate coming back online
      act(() => {
        Object.defineProperty(navigator, 'onLine', {
          writable: true,
          value: true,
        });
        window.dispatchEvent(new Event('online'));
      });

      // Offline indicator should disappear
      await waitFor(() => {
        expect(screen.queryByText(/offline/i)).not.toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('User Interaction Flows', () => {
    it('should handle refresh button interactions correctly', { timeout: 10000 }, async () => {
      mockSuccessfulDataResponses();

      render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('45')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Find refresh button
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toBeInTheDocument();
      expect(refreshButton).not.toBeDisabled();

      // Click refresh
      fireEvent.click(refreshButton);

      // Button should be disabled during refresh
      expect(refreshButton).toBeDisabled();

      // Wait for refresh to complete
      await waitFor(() => {
        expect(refreshButton).not.toBeDisabled();
      }, { timeout: 3000 });
    });

    it('should handle quick action button interactions', { timeout: 10000 }, async () => {
      mockSuccessfulDataResponses();

      render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      // Wait for dashboard to load
      await waitFor(() => {
        expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Verify quick action buttons are present
      expect(screen.getByText('New Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Social Post')).toBeInTheDocument();
      expect(screen.getByText('Newsletter')).toBeInTheDocument();
      expect(screen.getByText('AI Assistant')).toBeInTheDocument();

      // Test clicking quick action buttons (they should be clickable)
      const blogButton = screen.getByText('New Blog Post').closest('button');
      const socialButton = screen.getByText('Social Post').closest('button');
      
      expect(blogButton).not.toBeDisabled();
      expect(socialButton).not.toBeDisabled();

      fireEvent.click(blogButton!);
      fireEvent.click(socialButton!);
      
      // No errors should occur from clicking
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  afterAll(() => {
    // Restore console methods
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
  });
});
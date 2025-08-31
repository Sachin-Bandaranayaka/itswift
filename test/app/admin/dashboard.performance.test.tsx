/**
 * Dashboard Performance Tests
 * 
 * Tests dashboard performance under various data loads and network conditions
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import AdminDashboard from '@/app/admin/page';
import {
  PerformanceMonitor,
  createMockDataset,
  simulateNetworkDelay,
  simulateNetworkError,
  DEFAULT_PERFORMANCE_THRESHOLDS,
  STRESS_TEST_THRESHOLDS
} from '@/test/utils/performance-testing';

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

describe('Dashboard Performance Tests', () => {
  let queryClient: QueryClient;
  let performanceMonitor: PerformanceMonitor;

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
    performanceMonitor = new PerformanceMonitor(DEFAULT_PERFORMANCE_THRESHOLDS);
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
    vi.resetAllMocks();
  });

  const createWrapper = ({ children }: { children: React.ReactNode }) => 
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  const setupMockServices = (dataset: ReturnType<typeof createMockDataset>, withDelay: boolean = false) => {
    const delay = withDelay ? simulateNetworkDelay : () => Promise.resolve();

    mockBlogDataService.getBlogStats.mockImplementation(async () => {
      await delay();
      return dataset.blogStats;
    });

    mockSocialDataService.getSocialStats.mockImplementation(async () => {
      await delay();
      return dataset.socialStats;
    });

    mockNewsletterDataService.getNewsletterStats.mockImplementation(async () => {
      await delay();
      return dataset.newsletterStats;
    });

    mockAIUsageDataService.getAIUsageStats.mockImplementation(async () => {
      await delay();
      return dataset.aiUsage;
    });

    mockBlogDataService.getRecentBlogActivity.mockImplementation(async () => {
      await delay();
      return dataset.recentActivity.filter(a => a.type === 'blog');
    });

    mockSocialDataService.getRecentSocialActivity.mockImplementation(async () => {
      await delay();
      return dataset.recentActivity.filter(a => a.type === 'social');
    });

    mockNewsletterDataService.getRecentNewsletterActivity.mockImplementation(async () => {
      await delay();
      return dataset.recentActivity.filter(a => a.type === 'newsletter');
    });

    mockAIUsageDataService.getRecentAIActivity.mockImplementation(async () => {
      await delay();
      return dataset.recentActivity.filter(a => a.type === 'ai');
    });

    mockBlogDataService.getTopPerformingBlogPosts.mockImplementation(async () => {
      await delay();
      return dataset.topPerformingContent.filter(c => c.type === 'blog');
    });

    mockSocialDataService.getTopPerformingSocialContent.mockImplementation(async () => {
      await delay();
      return dataset.topPerformingContent.filter(c => c.type === 'social');
    });

    mockNewsletterDataService.getTopPerformingNewsletterCampaigns.mockImplementation(async () => {
      await delay();
      return dataset.topPerformingContent.filter(c => c.type === 'newsletter');
    });

    mockBlogDataService.getScheduledBlogPosts.mockImplementation(async () => {
      await delay();
      return dataset.upcomingScheduled.filter(s => s.type === 'blog');
    });

    mockSocialDataService.getScheduledSocialPosts.mockImplementation(async () => {
      await delay();
      return dataset.upcomingScheduled.filter(s => s.type === 'social');
    });

    mockNewsletterDataService.getScheduledNewsletterCampaigns.mockImplementation(async () => {
      await delay();
      return dataset.upcomingScheduled.filter(s => s.type === 'newsletter');
    });
  };

  describe('Load Performance Tests', () => {
    it('should load dashboard with small dataset within performance thresholds', async () => {
      const dataset = createMockDataset('small');
      setupMockServices(dataset);

      performanceMonitor.startMeasurement();
      performanceMonitor.markRenderStart();

      render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      performanceMonitor.markRenderEnd();

      // Wait for dashboard to fully load
      await waitFor(() => {
        expect(document.querySelector('[data-testid="dashboard-loaded"]') || 
               document.querySelector('h1')).toBeInTheDocument();
      }, { timeout: 5000 });

      const metrics = performanceMonitor.endMeasurement();
      const validation = performanceMonitor.validatePerformance(metrics);

      expect(validation.passed).toBe(true);
      if (!validation.passed) {
        console.warn('Performance failures:', validation.failures);
      }

      // Specific assertions for small dataset
      expect(metrics.loadTime).toBeLessThan(2000); // 2 seconds for small dataset
      expect(metrics.renderTime).toBeLessThan(500); // 500ms for render
    });

    it('should load dashboard with medium dataset within performance thresholds', async () => {
      const dataset = createMockDataset('medium');
      setupMockServices(dataset);

      performanceMonitor.startMeasurement();
      performanceMonitor.markRenderStart();

      render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      performanceMonitor.markRenderEnd();

      await waitFor(() => {
        expect(document.querySelector('h1')).toBeInTheDocument();
      }, { timeout: 5000 });

      const metrics = performanceMonitor.endMeasurement();
      const validation = performanceMonitor.validatePerformance(metrics);

      expect(validation.passed).toBe(true);
      if (!validation.passed) {
        console.warn('Performance failures:', validation.failures);
      }

      // Medium dataset should still be reasonably fast
      expect(metrics.loadTime).toBeLessThan(3000); // 3 seconds for medium dataset
    });

    it('should handle large dataset within stress test thresholds', async () => {
      const dataset = createMockDataset('large');
      setupMockServices(dataset);

      const stressMonitor = new PerformanceMonitor(STRESS_TEST_THRESHOLDS);
      stressMonitor.startMeasurement();
      stressMonitor.markRenderStart();

      render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      stressMonitor.markRenderEnd();

      await waitFor(() => {
        expect(document.querySelector('h1')).toBeInTheDocument();
      }, { timeout: 8000 });

      const metrics = stressMonitor.endMeasurement();
      const validation = stressMonitor.validatePerformance(metrics);

      expect(validation.passed).toBe(true);
      if (!validation.passed) {
        console.warn('Stress test failures:', validation.failures);
      }

      // Large dataset should complete within stress thresholds
      expect(metrics.loadTime).toBeLessThan(5000); // 5 seconds for large dataset
    });
  });

  describe('Network Performance Tests', () => {
    it('should handle slow network conditions gracefully', async () => {
      const dataset = createMockDataset('medium');
      setupMockServices(dataset, true); // With network delay

      performanceMonitor.startMeasurement();
      performanceMonitor.markDataFetchStart();

      render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      // Should show loading states immediately
      expect(document.querySelector('.animate-pulse') || 
             document.querySelector('[data-loading="true"]')).toBeTruthy();

      await waitFor(() => {
        expect(document.querySelector('h1')).toBeInTheDocument();
      }, { timeout: 8000 });

      performanceMonitor.markDataFetchEnd();
      const metrics = performanceMonitor.endMeasurement();

      // With network delays, we expect longer load times but should still be reasonable
      expect(metrics.loadTime).toBeLessThan(6000); // 6 seconds with network delays
      expect(metrics.dataFetchTime).toBeGreaterThan(100); // Should have some delay
    });

    it('should handle intermittent network errors without performance degradation', async () => {
      const dataset = createMockDataset('small');
      let callCount = 0;

      // Mock services with intermittent failures
      mockBlogDataService.getBlogStats.mockImplementation(async () => {
        callCount++;
        if (callCount === 1 && simulateNetworkError(0.5)) {
          throw new Error('Network error');
        }
        return dataset.blogStats;
      });

      mockSocialDataService.getSocialStats.mockResolvedValue(dataset.socialStats);
      mockNewsletterDataService.getNewsletterStats.mockResolvedValue(dataset.newsletterStats);
      mockAIUsageDataService.getAIUsageStats.mockResolvedValue(dataset.aiUsage);

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

      performanceMonitor.startMeasurement();

      render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(document.querySelector('h1')).toBeInTheDocument();
      }, { timeout: 5000 });

      const metrics = performanceMonitor.endMeasurement();

      // Even with some network errors, performance should not be severely impacted
      expect(metrics.loadTime).toBeLessThan(4000); // 4 seconds with some errors
    });
  });

  describe('Memory Performance Tests', () => {
    it('should not have memory leaks with repeated renders', async () => {
      const dataset = createMockDataset('medium');
      setupMockServices(dataset);

      const initialMemory = typeof window !== 'undefined' && 'memory' in performance 
        ? (performance as any).memory?.usedJSHeapSize 
        : 0;

      // Render and unmount multiple times
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(
          <QueryClientProvider client={queryClient}>
            <AdminDashboard />
          </QueryClientProvider>
        );

        await waitFor(() => {
          expect(document.querySelector('h1')).toBeInTheDocument();
        }, { timeout: 3000 });

        unmount();
        queryClient.clear();
      }

      const finalMemory = typeof window !== 'undefined' && 'memory' in performance 
        ? (performance as any).memory?.usedJSHeapSize 
        : 0;

      // Memory usage should not grow significantly
      if (initialMemory && finalMemory) {
        const memoryGrowth = finalMemory - initialMemory;
        expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024); // Less than 10MB growth
      }
    });

    it('should handle component updates efficiently', async () => {
      const dataset = createMockDataset('small');
      let updateCount = 0;

      // Mock services that return updated data
      mockBlogDataService.getBlogStats.mockImplementation(async () => {
        updateCount++;
        return {
          ...dataset.blogStats,
          totalPosts: dataset.blogStats.totalPosts + updateCount
        };
      });

      setupMockServices(dataset);

      performanceMonitor.startMeasurement();

      const { rerender } = render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(document.querySelector('h1')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Trigger multiple re-renders
      for (let i = 0; i < 3; i++) {
        rerender(
          <QueryClientProvider client={queryClient}>
            <AdminDashboard />
          </QueryClientProvider>
        );
        
        await waitFor(() => {
          expect(document.querySelector('h1')).toBeInTheDocument();
        }, { timeout: 1000 });
      }

      const metrics = performanceMonitor.endMeasurement();

      // Multiple updates should not significantly impact performance
      expect(metrics.loadTime).toBeLessThan(4000); // 4 seconds for multiple updates
    });
  });

  describe('Concurrent Operations Performance', () => {
    it('should handle multiple simultaneous data refreshes efficiently', async () => {
      const dataset = createMockDataset('medium');
      setupMockServices(dataset, true); // With delays

      performanceMonitor.startMeasurement();

      render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(document.querySelector('h1')).toBeInTheDocument();
      }, { timeout: 5000 });

      // Simulate multiple concurrent refreshes
      const refreshPromises = Array.from({ length: 3 }, () => 
        queryClient.invalidateQueries()
      );

      await Promise.all(refreshPromises);

      const metrics = performanceMonitor.endMeasurement();

      // Concurrent operations should not cause exponential performance degradation
      expect(metrics.loadTime).toBeLessThan(8000); // 8 seconds for concurrent operations
    });

    it('should maintain performance with background auto-refresh', async () => {
      vi.useFakeTimers();
      
      const dataset = createMockDataset('small');
      setupMockServices(dataset);

      performanceMonitor.startMeasurement();

      render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(document.querySelector('h1')).toBeInTheDocument();
      });

      // Simulate auto-refresh intervals
      for (let i = 0; i < 3; i++) {
        vi.advanceTimersByTime(5 * 60 * 1000); // 5 minutes
        await waitFor(() => {
          expect(document.querySelector('h1')).toBeInTheDocument();
        }, { timeout: 2000 });
      }

      const metrics = performanceMonitor.endMeasurement();

      // Auto-refresh should not significantly impact performance
      expect(metrics.loadTime).toBeLessThan(5000); // 5 seconds with auto-refresh

      vi.useRealTimers();
    });
  });

  describe('Error Recovery Performance', () => {
    it('should recover from errors without performance penalty', async () => {
      const dataset = createMockDataset('small');
      let shouldFail = true;

      // Mock service that fails initially then succeeds
      mockBlogDataService.getBlogStats.mockImplementation(async () => {
        if (shouldFail) {
          shouldFail = false;
          throw new Error('Service temporarily unavailable');
        }
        return dataset.blogStats;
      });

      setupMockServices(dataset);

      performanceMonitor.startMeasurement();

      render(
        <QueryClientProvider client={queryClient}>
          <AdminDashboard />
        </QueryClientProvider>
      );

      // Wait for error state
      await waitFor(() => {
        expect(document.querySelector('[data-testid="error-state"]') || 
               document.querySelector('h1')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Trigger retry
      queryClient.invalidateQueries();

      // Wait for successful recovery
      await waitFor(() => {
        expect(document.querySelector('h1')).toBeInTheDocument();
      }, { timeout: 3000 });

      const metrics = performanceMonitor.endMeasurement();

      // Error recovery should not significantly impact performance
      expect(metrics.loadTime).toBeLessThan(4000); // 4 seconds including error recovery
    });
  });
});
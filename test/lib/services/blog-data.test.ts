/**
 * Unit Tests for BlogDataService
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BlogDataService } from '@/lib/services/blog-data';
import { BlogStats, ActivityItem } from '@/lib/types/dashboard';

// Mock Sanity client
const mockClient = vi.hoisted(() => ({
  fetch: vi.fn()
}));

vi.mock('@/lib/sanity.client', () => ({
  client: mockClient
}));

// Mock dashboard utilities
vi.mock('@/lib/utils/dashboard-utils', () => ({
  isThisMonth: vi.fn((date: Date) => {
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }),
  isLastMonth: vi.fn((date: Date) => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
  }),
  calculateGrowth: vi.fn((current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  })
}));

describe('BlogDataService', () => {
  let service: BlogDataService;

  beforeEach(() => {
    service = new BlogDataService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getBlogStats', () => {
    it('should fetch and calculate blog statistics correctly', async () => {
      const mockPosts = [
        {
          _id: '1',
          title: 'Post 1',
          publishedAt: new Date().toISOString(),
          _createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          title: 'Post 2',
          publishedAt: new Date(2024, 0, 15).toISOString(),
          _createdAt: new Date().toISOString()
        },
        {
          _id: '3',
          title: 'Post 3',
          publishedAt: new Date(2023, 11, 15).toISOString(),
          _createdAt: new Date().toISOString()
        }
      ];

      mockClient.fetch.mockResolvedValue(mockPosts);

      const stats = await service.getBlogStats();

      expect(stats).toEqual({
        totalPosts: 3,
        publishedThisMonth: expect.any(Number),
        growthPercentage: expect.any(Number)
      });

      expect(mockClient.fetch).toHaveBeenCalledWith(
        expect.stringContaining('*[_type == "post" && defined(publishedAt)]')
      );
    });

    it('should handle empty posts array', async () => {
      mockClient.fetch.mockResolvedValue([]);

      const stats = await service.getBlogStats();

      expect(stats).toEqual({
        totalPosts: 0,
        publishedThisMonth: 0,
        growthPercentage: 0
      });
    });

    it('should handle invalid response format', async () => {
      mockClient.fetch.mockResolvedValue('invalid response');

      await expect(service.getBlogStats()).rejects.toThrow('Failed to fetch blog statistics');
    });

    it('should handle Sanity API errors', async () => {
      mockClient.fetch.mockRejectedValue(new Error('Sanity API error'));

      await expect(service.getBlogStats()).rejects.toThrow('Failed to fetch blog statistics');
    });

    it('should handle posts with missing publishedAt', async () => {
      const mockPosts = [
        {
          _id: '1',
          title: 'Post 1',
          publishedAt: new Date().toISOString(),
          _createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          title: 'Post 2',
          publishedAt: null,
          _createdAt: new Date().toISOString()
        }
      ];

      mockClient.fetch.mockResolvedValue(mockPosts);

      const stats = await service.getBlogStats();

      expect(stats.totalPosts).toBe(2);
      // Should handle null publishedAt gracefully
    });
  });

  describe('getRecentBlogActivity', () => {
    it('should fetch recent blog activity correctly', async () => {
      const mockPosts = [
        {
          _id: '1',
          title: 'Recent Post 1',
          publishedAt: new Date().toISOString(),
          slug: { current: 'recent-post-1' }
        },
        {
          _id: '2',
          title: 'Recent Post 2',
          publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          slug: { current: 'recent-post-2' }
        }
      ];

      mockClient.fetch.mockResolvedValue(mockPosts);

      const activity = await service.getRecentBlogActivity();

      expect(activity).toHaveLength(2);
      expect(activity[0]).toMatchObject({
        id: '1',
        type: 'blog',
        title: 'Recent Post 1',
        description: 'Blog post published',
        status: 'published',
        platform: 'blog'
      });
      expect(activity[0].timestamp).toBeInstanceOf(Date);
    });

    it('should handle posts with missing titles', async () => {
      const mockPosts = [
        {
          _id: '1',
          title: null,
          publishedAt: new Date().toISOString(),
          slug: { current: 'untitled-post' }
        }
      ];

      mockClient.fetch.mockResolvedValue(mockPosts);

      const activity = await service.getRecentBlogActivity();

      expect(activity[0].title).toBe('Untitled Post');
    });

    it('should handle empty response gracefully', async () => {
      mockClient.fetch.mockResolvedValue([]);

      const activity = await service.getRecentBlogActivity();

      expect(activity).toEqual([]);
    });

    it('should handle invalid response format gracefully', async () => {
      mockClient.fetch.mockResolvedValue('invalid response');

      const activity = await service.getRecentBlogActivity();

      expect(activity).toEqual([]);
    });

    it('should handle API errors gracefully', async () => {
      mockClient.fetch.mockRejectedValue(new Error('API error'));

      const activity = await service.getRecentBlogActivity();

      expect(activity).toEqual([]);
    });
  });

  describe('getScheduledBlogPosts', () => {
    it('should fetch scheduled blog posts correctly', async () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const mockPosts = [
        {
          _id: '1',
          title: 'Scheduled Post 1',
          publishedAt: futureDate,
          slug: { current: 'scheduled-post-1' }
        }
      ];

      mockClient.fetch.mockResolvedValue(mockPosts);

      const scheduled = await service.getScheduledBlogPosts();

      expect(scheduled).toHaveLength(1);
      expect(scheduled[0]).toMatchObject({
        id: '1',
        type: 'blog',
        title: 'Scheduled Post 1',
        description: 'Blog post scheduled for publication',
        status: 'scheduled',
        platform: 'blog'
      });
      expect(scheduled[0].timestamp).toBeInstanceOf(Date);
    });

    it('should handle empty scheduled posts', async () => {
      mockClient.fetch.mockResolvedValue([]);

      const scheduled = await service.getScheduledBlogPosts();

      expect(scheduled).toEqual([]);
    });

    it('should handle API errors gracefully', async () => {
      mockClient.fetch.mockRejectedValue(new Error('API error'));

      const scheduled = await service.getScheduledBlogPosts();

      expect(scheduled).toEqual([]);
    });

    it('should pass correct parameters to Sanity query', async () => {
      const now = new Date().toISOString();
      mockClient.fetch.mockResolvedValue([]);

      await service.getScheduledBlogPosts();

      expect(mockClient.fetch).toHaveBeenCalledWith(
        expect.stringContaining('*[_type == "post" && publishedAt > $now]'),
        expect.objectContaining({ now: expect.any(String) })
      );
    });
  });

  describe('getTopPerformingBlogPosts', () => {
    it('should fetch top performing blog posts', async () => {
      const mockPosts = [
        {
          _id: '1',
          title: 'Top Post 1',
          publishedAt: new Date().toISOString(),
          slug: { current: 'top-post-1' },
          excerpt: 'Great post'
        },
        {
          _id: '2',
          title: 'Top Post 2',
          publishedAt: new Date().toISOString(),
          slug: { current: 'top-post-2' },
          excerpt: 'Another great post'
        }
      ];

      mockClient.fetch.mockResolvedValue(mockPosts);

      const topPosts = await service.getTopPerformingBlogPosts();

      expect(topPosts).toHaveLength(2);
      expect(topPosts[0]).toMatchObject({
        id: '1',
        title: 'Top Post 1',
        type: 'blog',
        platform: 'blog',
        metrics: {
          views: 0,
          likes: 0,
          shares: 0
        }
      });
    });

    it('should handle posts with missing titles', async () => {
      const mockPosts = [
        {
          _id: '1',
          title: null,
          publishedAt: new Date().toISOString(),
          slug: { current: 'untitled-post' }
        }
      ];

      mockClient.fetch.mockResolvedValue(mockPosts);

      const topPosts = await service.getTopPerformingBlogPosts();

      expect(topPosts[0].title).toBe('Untitled Post');
    });

    it('should handle empty response gracefully', async () => {
      mockClient.fetch.mockResolvedValue([]);

      const topPosts = await service.getTopPerformingBlogPosts();

      expect(topPosts).toEqual([]);
    });

    it('should handle invalid response format gracefully', async () => {
      mockClient.fetch.mockResolvedValue('invalid response');

      const topPosts = await service.getTopPerformingBlogPosts();

      expect(topPosts).toEqual([]);
    });

    it('should handle API errors gracefully', async () => {
      mockClient.fetch.mockRejectedValue(new Error('API error'));

      const topPosts = await service.getTopPerformingBlogPosts();

      expect(topPosts).toEqual([]);
    });
  });
});
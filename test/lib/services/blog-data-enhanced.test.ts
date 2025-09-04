/**
 * Tests for enhanced BlogDataService with real-time metrics tracking
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BlogDataService } from '@/lib/services/blog-data';

// Mock Sanity client
vi.mock('@/lib/sanity.client', () => ({
  client: {
    fetch: vi.fn()
  }
}));

// Mock dashboard utils
vi.mock('@/lib/utils/dashboard-utils', () => ({
  isThisMonth: vi.fn(),
  isLastMonth: vi.fn(),
  isThisWeek: vi.fn(),
  isLastWeek: vi.fn(),
  calculateGrowth: vi.fn()
}));

import { client } from '@/lib/sanity.client';
import { isThisMonth, isLastMonth, isThisWeek, isLastWeek, calculateGrowth } from '@/lib/utils/dashboard-utils';

describe('BlogDataService Enhanced', () => {
  let blogDataService: BlogDataService;

  beforeEach(() => {
    blogDataService = new BlogDataService();
    vi.clearAllMocks();
  });

  describe('getBlogStats', () => {
    it('should return comprehensive blog statistics', async () => {
      const mockPosts = [
        {
          _id: '1',
          title: 'Test Post 1',
          publishedAt: '2024-01-15T10:00:00Z',
          _createdAt: '2024-01-10T10:00:00Z',
          _updatedAt: '2024-01-15T10:00:00Z',
          slug: { current: 'test-post-1' },
          categories: [{ title: 'Tech' }]
        },
        {
          _id: '2',
          title: 'Test Post 2',
          publishedAt: '2024-01-20T10:00:00Z',
          _createdAt: '2024-01-18T10:00:00Z',
          _updatedAt: '2024-01-20T10:00:00Z',
          slug: { current: 'test-post-2' },
          categories: [{ title: 'Business' }]
        },
        {
          _id: '3',
          title: 'Draft Post',
          publishedAt: null,
          _createdAt: '2024-01-25T10:00:00Z',
          _updatedAt: '2024-01-25T10:00:00Z',
          slug: { current: 'draft-post' },
          categories: []
        }
      ];

      vi.mocked(client.fetch).mockResolvedValue(mockPosts);
      vi.mocked(isThisMonth).mockReturnValue(true);
      vi.mocked(isLastMonth).mockReturnValue(false);
      vi.mocked(isThisWeek).mockReturnValue(true);
      vi.mocked(isLastWeek).mockReturnValue(false);
      vi.mocked(calculateGrowth).mockReturnValue(25);

      const result = await blogDataService.getBlogStats();

      expect(result).toEqual({
        totalPosts: 2, // Only published posts
        publishedThisMonth: 2,
        publishedThisWeek: 2,
        draftPosts: 1,
        growthPercentage: 25,
        weeklyGrowthPercentage: 25,
        averagePostsPerWeek: expect.any(Number),
        lastPublishedAt: expect.any(Date)
      });
    });

    it('should handle empty posts array', async () => {
      vi.mocked(client.fetch).mockResolvedValue([]);
      vi.mocked(calculateGrowth).mockReturnValue(0);

      const result = await blogDataService.getBlogStats();

      expect(result.totalPosts).toBe(0);
      expect(result.publishedThisMonth).toBe(0);
      expect(result.draftPosts).toBe(0);
      expect(result.lastPublishedAt).toBeNull();
    });

    it('should handle Sanity client errors', async () => {
      vi.mocked(client.fetch).mockRejectedValue(new Error('Sanity error'));

      await expect(blogDataService.getBlogStats()).rejects.toThrow('Failed to fetch blog statistics');
    });
  });

  describe('getRecentBlogActivity', () => {
    it('should return recent blog activity with enhanced metadata', async () => {
      const mockRecentPublished = [
        {
          _id: '1',
          title: 'Recent Post',
          publishedAt: '2024-01-20T10:00:00Z',
          slug: { current: 'recent-post' },
          author: { name: 'John Doe' },
          categories: [{ title: 'Tech' }]
        }
      ];

      const mockRecentUpdated = [
        {
          _id: '2',
          title: 'Updated Post',
          publishedAt: '2024-01-15T10:00:00Z',
          _updatedAt: '2024-01-20T12:00:00Z',
          slug: { current: 'updated-post' },
          author: { name: 'Jane Smith' }
        }
      ];

      const mockRecentScheduled = [
        {
          _id: '3',
          title: 'Scheduled Post',
          publishedAt: '2024-01-20T08:00:00Z',
          slug: { current: 'scheduled-post' },
          author: { name: 'Bob Wilson' }
        }
      ];

      vi.mocked(client.fetch)
        .mockResolvedValueOnce(mockRecentPublished)
        .mockResolvedValueOnce(mockRecentUpdated)
        .mockResolvedValueOnce(mockRecentScheduled);

      const result = await blogDataService.getRecentBlogActivity();

      expect(result).toHaveLength(3);
      
      // Check that we have the expected activity types
      const titles = result.map(r => r.title);
      expect(titles).toContain('Recent Post');
      expect(titles).toContain('Updated Post');
      expect(titles).toContain('Scheduled Post');
      
      // Check that all items have the expected structure
      result.forEach(item => {
        expect(item).toMatchObject({
          type: 'blog',
          status: 'published',
          platform: 'blog',
          metadata: expect.objectContaining({
            slug: expect.any(String),
            author: expect.any(String)
          })
        });
      });
    });

    it('should handle Sanity client errors gracefully', async () => {
      vi.mocked(client.fetch).mockRejectedValue(new Error('Sanity error'));

      const result = await blogDataService.getRecentBlogActivity();

      expect(result).toEqual([]);
    });
  });

  describe('getScheduledBlogPosts', () => {
    it('should return scheduled posts with enhanced metadata', async () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const mockScheduledPosts = [
        {
          _id: '1',
          title: 'Future Post',
          publishedAt: futureDate,
          slug: { current: 'future-post' },
          author: { name: 'John Doe' },
          categories: [{ title: 'Tech' }],
          _createdAt: '2024-01-20T10:00:00Z'
        }
      ];

      vi.mocked(client.fetch).mockResolvedValue(mockScheduledPosts);

      const result = await blogDataService.getScheduledBlogPosts();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        type: 'blog',
        title: 'Future Post',
        platform: 'blog',
        metadata: {
          slug: 'future-post',
          author: 'John Doe',
          categories: ['Tech'],
          hoursUntilPublish: expect.any(Number),
          timeUntilPublish: expect.any(String)
        }
      });
    });
  });

  describe('getTopPerformingBlogPosts', () => {
    it('should return top performing posts with simulated metrics', async () => {
      const mockPosts = [
        {
          _id: '1',
          title: 'Popular Post',
          publishedAt: '2024-01-15T10:00:00Z',
          slug: { current: 'popular-post' },
          author: { name: 'John Doe' },
          categories: [{ title: 'Tech' }],
          body: [
            {
              _type: 'block',
              children: [
                { _type: 'span', text: 'This is a test post with some content.' }
              ]
            }
          ],
          mainImage: { asset: { url: 'https://example.com/image.jpg' } }
        }
      ];

      vi.mocked(client.fetch).mockResolvedValue(mockPosts);

      const result = await blogDataService.getTopPerformingBlogPosts();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        type: 'blog',
        title: 'Popular Post',
        platform: 'blog',
        metrics: {
          views: expect.any(Number),
          likes: expect.any(Number),
          shares: expect.any(Number),
          comments: expect.any(Number)
        },
        metadata: {
          slug: 'popular-post',
          author: 'John Doe',
          categories: ['Tech'],
          hasImage: true,
          wordCount: expect.any(Number),
          engagementRate: expect.any(String)
        }
      });
    });
  });

  describe('getBlogAnalyticsSummary', () => {
    it('should return comprehensive analytics summary', async () => {
      const mockPosts = [
        {
          _id: '1',
          title: 'Test Post 1',
          publishedAt: '2024-01-15T10:00:00Z',
          categories: [{ title: 'Tech' }],
          body: [
            {
              _type: 'block',
              children: [
                { _type: 'span', text: 'This is a test post with some content.' }
              ]
            }
          ],
          mainImage: { asset: { url: 'https://example.com/image.jpg' } }
        },
        {
          _id: '2',
          title: 'Test Post 2',
          publishedAt: '2024-01-20T10:00:00Z',
          categories: [{ title: 'Business' }],
          body: [],
          mainImage: null
        }
      ];

      vi.mocked(client.fetch).mockResolvedValue(mockPosts);

      const result = await blogDataService.getBlogAnalyticsSummary();

      expect(result).toMatchObject({
        totalViews: expect.any(Number),
        totalEngagement: expect.any(Number),
        averageEngagementRate: expect.any(Number),
        topCategories: expect.arrayContaining([
          expect.objectContaining({
            category: expect.any(String),
            postCount: expect.any(Number),
            avgViews: expect.any(Number)
          })
        ]),
        publishingTrend: expect.arrayContaining([
          expect.objectContaining({
            date: expect.any(String),
            count: expect.any(Number)
          })
        ])
      });
    });
  });
});
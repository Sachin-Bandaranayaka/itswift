/**
 * Unit Tests for SocialDataService
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SocialDataService } from '@/lib/services/social-data';
import { SocialStats, ActivityItem, PerformingContentItem, ScheduledItem } from '@/lib/types/dashboard';

// Mock Supabase
const mockSupabaseAdmin = vi.hoisted(() => ({
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
        })),
        not: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        })),
        gte: vi.fn(() => ({
          order: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
          }))
        }))
      }))
    }))
  }))
}));

vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: mockSupabaseAdmin
}));

// Mock dashboard utilities
vi.mock('@/lib/utils/dashboard-utils', () => ({
  isThisWeek: vi.fn((date: Date) => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    return date >= startOfWeek;
  }),
  isLastWeek: vi.fn((date: Date) => {
    const now = new Date();
    const startOfLastWeek = new Date(now.setDate(now.getDate() - now.getDay() - 7));
    const endOfLastWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    return date >= startOfLastWeek && date < endOfLastWeek;
  }),
  calculateGrowth: vi.fn((current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  })
}));

describe('SocialDataService', () => {
  let service: SocialDataService;

  beforeEach(() => {
    service = new SocialDataService();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getSocialStats', () => {
    it('should fetch and calculate social media statistics correctly', async () => {
      const mockPosts = [
        {
          id: '1',
          content: 'Test post 1',
          platform: 'twitter',
          status: 'published',
          published_at: new Date().toISOString(),
          engagement_metrics: {
            likes: 10,
            shares: 5,
            comments: 3
          }
        },
        {
          id: '2',
          content: 'Test post 2',
          platform: 'linkedin',
          status: 'published',
          published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          engagement_metrics: {
            likes: 15,
            shares: 8,
            comments: 2
          }
        }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: mockPosts,
            error: null
          })
        })
      });

      const stats = await service.getSocialStats();

      expect(stats).toEqual({
        totalPosts: 2,
        postsThisWeek: expect.any(Number),
        totalEngagement: 43, // 10+5+3+15+8+2
        growthPercentage: expect.any(Number)
      });
    });

    it('should handle empty posts array', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [],
            error: null
          })
        })
      });

      const stats = await service.getSocialStats();

      expect(stats).toEqual({
        totalPosts: 0,
        postsThisWeek: 0,
        totalEngagement: 0,
        growthPercentage: 0
      });
    });

    it('should handle null response', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: null,
            error: null
          })
        })
      });

      const stats = await service.getSocialStats();

      expect(stats).toEqual({
        totalPosts: 0,
        postsThisWeek: 0,
        totalEngagement: 0,
        growthPercentage: 0
      });
    });

    it('should handle Supabase errors', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' }
          })
        })
      });

      await expect(service.getSocialStats()).rejects.toThrow('Failed to fetch social media statistics');
    });

    it('should handle posts with missing engagement metrics', async () => {
      const mockPosts = [
        {
          id: '1',
          content: 'Test post 1',
          platform: 'twitter',
          status: 'published',
          published_at: new Date().toISOString(),
          engagement_metrics: null
        },
        {
          id: '2',
          content: 'Test post 2',
          platform: 'linkedin',
          status: 'published',
          published_at: new Date().toISOString(),
          engagement_metrics: {
            likes: 10
            // missing shares and comments
          }
        }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: mockPosts,
            error: null
          })
        })
      });

      const stats = await service.getSocialStats();

      expect(stats.totalEngagement).toBe(10); // Only count valid metrics
    });

    it('should handle posts with missing published_at', async () => {
      const mockPosts = [
        {
          id: '1',
          content: 'Test post 1',
          platform: 'twitter',
          status: 'published',
          published_at: null,
          engagement_metrics: { likes: 5, shares: 2, comments: 1 }
        }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: mockPosts,
            error: null
          })
        })
      });

      const stats = await service.getSocialStats();

      // Should handle null published_at gracefully
      expect(stats.totalPosts).toBe(1);
      expect(stats.totalEngagement).toBe(8);
    });
  });

  describe('getRecentSocialActivity', () => {
    it('should fetch recent social media activity correctly', async () => {
      const mockPosts = [
        {
          id: '1',
          content: 'This is a test social media post that should be truncated properly',
          platform: 'twitter',
          status: 'published',
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          content: 'Short post',
          platform: 'linkedin',
          status: 'published',
          published_at: new Date(Date.now() - 60000).toISOString(),
          created_at: new Date().toISOString()
        }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({
                data: mockPosts,
                error: null
              })
            })
          })
        })
      });

      const activity = await service.getRecentSocialActivity();

      expect(activity).toHaveLength(2);
      expect(activity[0]).toMatchObject({
        id: '1',
        type: 'social',
        title: 'This is a test social media post that should be tr...',
        description: 'Posted on twitter',
        status: 'published',
        platform: 'twitter'
      });
      expect(activity[0].timestamp).toBeInstanceOf(Date);
    });

    it('should handle posts with missing content', async () => {
      const mockPosts = [
        {
          id: '1',
          content: null,
          platform: 'twitter',
          status: 'published',
          published_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({
                data: mockPosts,
                error: null
              })
            })
          })
        })
      });

      const activity = await service.getRecentSocialActivity();

      expect(activity[0].title).toBe('Untitled Post');
    });

    it('should handle empty response gracefully', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({
                data: null,
                error: null
              })
            })
          })
        })
      });

      const activity = await service.getRecentSocialActivity();

      expect(activity).toEqual([]);
    });

    it('should handle Supabase errors gracefully', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database error' }
              })
            })
          })
        })
      });

      const activity = await service.getRecentSocialActivity();

      expect(activity).toEqual([]);
    });

    it('should use created_at when published_at is missing', async () => {
      const mockPosts = [
        {
          id: '1',
          content: 'Test post',
          platform: 'twitter',
          status: 'published',
          published_at: null,
          created_at: new Date().toISOString()
        }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({
                data: mockPosts,
                error: null
              })
            })
          })
        })
      });

      const activity = await service.getRecentSocialActivity();

      expect(activity[0].timestamp).toBeInstanceOf(Date);
    });
  });

  describe('getTopPerformingSocialContent', () => {
    it('should fetch top performing social content correctly', async () => {
      const mockPosts = [
        {
          id: '1',
          content: 'High performing post with lots of engagement',
          platform: 'twitter',
          status: 'published',
          engagement_metrics: {
            likes: 100,
            shares: 50,
            comments: 25
          }
        },
        {
          id: '2',
          content: 'Another good post',
          platform: 'linkedin',
          status: 'published',
          engagement_metrics: {
            likes: 75,
            shares: 30,
            comments: 15
          }
        }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            not: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({
                  data: mockPosts,
                  error: null
                })
              })
            })
          })
        })
      });

      const topContent = await service.getTopPerformingSocialContent();

      expect(topContent).toHaveLength(2);
      expect(topContent[0]).toMatchObject({
        id: '1',
        title: 'High performing post with lots of engagement',
        type: 'social',
        platform: 'twitter',
        metrics: {
          likes: 100,
          shares: 50,
          comments: 25
        }
      });
    });

    it('should handle posts with missing engagement metrics', async () => {
      const mockPosts = [
        {
          id: '1',
          content: 'Post without metrics',
          platform: 'twitter',
          status: 'published',
          engagement_metrics: null
        }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            not: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({
                  data: mockPosts,
                  error: null
                })
              })
            })
          })
        })
      });

      const topContent = await service.getTopPerformingSocialContent();

      expect(topContent[0].metrics).toEqual({
        likes: 0,
        shares: 0,
        comments: 0
      });
    });

    it('should handle empty response gracefully', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            not: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({
                  data: null,
                  error: null
                })
              })
            })
          })
        })
      });

      const topContent = await service.getTopPerformingSocialContent();

      expect(topContent).toEqual([]);
    });

    it('should handle Supabase errors gracefully', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            not: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Database error' }
                })
              })
            })
          })
        })
      });

      const topContent = await service.getTopPerformingSocialContent();

      expect(topContent).toEqual([]);
    });
  });

  describe('getScheduledSocialPosts', () => {
    it('should fetch scheduled social posts correctly', async () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      const mockPosts = [
        {
          id: '1',
          content: 'Scheduled post for tomorrow',
          platform: 'twitter',
          status: 'scheduled',
          scheduled_at: futureDate,
          created_at: new Date().toISOString()
        }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({
                  data: mockPosts,
                  error: null
                })
              })
            })
          })
        })
      });

      const scheduled = await service.getScheduledSocialPosts();

      expect(scheduled).toHaveLength(1);
      expect(scheduled[0]).toMatchObject({
        id: '1',
        title: 'Scheduled post for tomorrow',
        type: 'social',
        platform: 'twitter'
      });
      expect(scheduled[0].scheduledAt).toBeInstanceOf(Date);
    });

    it('should handle empty scheduled posts', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({
                  data: null,
                  error: null
                })
              })
            })
          })
        })
      });

      const scheduled = await service.getScheduledSocialPosts();

      expect(scheduled).toEqual([]);
    });

    it('should handle Supabase errors gracefully', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Database error' }
                })
              })
            })
          })
        })
      });

      const scheduled = await service.getScheduledSocialPosts();

      expect(scheduled).toEqual([]);
    });

    it('should use created_at when scheduled_at is missing', async () => {
      const mockPosts = [
        {
          id: '1',
          content: 'Scheduled post',
          platform: 'twitter',
          status: 'scheduled',
          scheduled_at: null,
          created_at: new Date().toISOString()
        }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({
                  data: mockPosts,
                  error: null
                })
              })
            })
          })
        })
      });

      const scheduled = await service.getScheduledSocialPosts();

      expect(scheduled[0].scheduledAt).toBeInstanceOf(Date);
    });
  });

  describe('getEngagementMetrics', () => {
    it('should calculate engagement metrics for specified period', async () => {
      const mockPosts = [
        {
          engagement_metrics: {
            likes: 10,
            shares: 5,
            comments: 3
          }
        },
        {
          engagement_metrics: {
            likes: 15,
            shares: 8,
            comments: 2
          }
        }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockResolvedValue({
              data: mockPosts,
              error: null
            })
          })
        })
      });

      const metrics = await service.getEngagementMetrics(30);

      expect(metrics).toEqual({
        totalLikes: 25,
        totalShares: 13,
        totalComments: 5
      });
    });

    it('should handle empty posts for engagement metrics', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockResolvedValue({
              data: null,
              error: null
            })
          })
        })
      });

      const metrics = await service.getEngagementMetrics(30);

      expect(metrics).toEqual({
        totalLikes: 0,
        totalShares: 0,
        totalComments: 0
      });
    });

    it('should handle posts with missing engagement metrics', async () => {
      const mockPosts = [
        {
          engagement_metrics: null
        },
        {
          engagement_metrics: {
            likes: 10
            // missing shares and comments
          }
        }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockResolvedValue({
              data: mockPosts,
              error: null
            })
          })
        })
      });

      const metrics = await service.getEngagementMetrics(30);

      expect(metrics).toEqual({
        totalLikes: 10,
        totalShares: 0,
        totalComments: 0
      });
    });

    it('should handle Supabase errors', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            gte: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' }
            })
          })
        })
      });

      const metrics = await service.getEngagementMetrics(30);

      expect(metrics).toEqual({
        totalLikes: 0,
        totalShares: 0,
        totalComments: 0
      });
    });
  });

  describe('truncateContent', () => {
    it('should truncate long content correctly', () => {
      const service = new SocialDataService();
      const longContent = 'This is a very long social media post that should be truncated';
      
      // Access private method through type assertion for testing
      const truncated = (service as any).truncateContent(longContent, 20);
      
      expect(truncated).toBe('This is a very long ...');
    });

    it('should return content as-is if shorter than max length', () => {
      const service = new SocialDataService();
      const shortContent = 'Short post';
      
      const result = (service as any).truncateContent(shortContent, 50);
      
      expect(result).toBe('Short post');
    });

    it('should handle null or empty content', () => {
      const service = new SocialDataService();
      
      expect((service as any).truncateContent(null, 50)).toBe('Untitled Post');
      expect((service as any).truncateContent('', 50)).toBe('Untitled Post');
      expect((service as any).truncateContent(undefined, 50)).toBe('Untitled Post');
    });
  });
});
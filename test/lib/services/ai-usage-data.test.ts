/**
 * Comprehensive Unit Tests for AI Usage Data Service
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIUsageDataService } from '@/lib/services/ai-usage-data';

// Mock Supabase
const mockSupabaseAdmin = vi.hoisted(() => ({
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      gte: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => ({
            data: [],
            error: null
          }))
        }))
      })),
      order: vi.fn(() => ({
        limit: vi.fn(() => ({
          data: [],
          error: null
        }))
      })),
      limit: vi.fn(() => ({
        data: [],
        error: null
      }))
    }))
  }))
}));

vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: mockSupabaseAdmin
}));

describe('AIUsageDataService', () => {
  let aiUsageService: AIUsageDataService;

  beforeEach(() => {
    aiUsageService = new AIUsageDataService();
    vi.clearAllMocks();
  });

  describe('getAIUsageStats', () => {
    it('should calculate AI usage statistics correctly', async () => {
      const mockLogs = [
        { id: '1', tokens_used: 100, created_at: new Date().toISOString() },
        { id: '2', tokens_used: 200, created_at: new Date().toISOString() },
        { id: '3', tokens_used: 150, created_at: new Date().toISOString() }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          data: mockLogs,
          error: null
        })
      });

      const stats = await aiUsageService.getAIUsageStats();

      expect(stats).toEqual({
        contentGenerated: 3,
        tokensUsed: 450,
        timeSaved: Math.round((450 * 0.75) / 40) // tokens * 0.75 words/token / 40 words/minute
      });
    });

    it('should handle empty logs', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          data: [],
          error: null
        })
      });

      const stats = await aiUsageService.getAIUsageStats();

      expect(stats).toEqual({
        contentGenerated: 0,
        tokensUsed: 0,
        timeSaved: 0
      });
    });

    it('should handle null response', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          data: null,
          error: null
        })
      });

      const stats = await aiUsageService.getAIUsageStats();

      expect(stats).toEqual({
        contentGenerated: 0,
        tokensUsed: 0,
        timeSaved: 0
      });
    });

    it('should handle Supabase errors', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          data: null,
          error: { message: 'Database error' }
        })
      });

      await expect(aiUsageService.getAIUsageStats()).rejects.toThrow('Failed to fetch AI usage statistics');
    });

    it('should handle logs with missing tokens_used', async () => {
      const mockLogs = [
        { id: '1', tokens_used: 100 },
        { id: '2', tokens_used: null },
        { id: '3', tokens_used: undefined },
        { id: '4', tokens_used: 50 }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          data: mockLogs,
          error: null
        })
      });

      const stats = await aiUsageService.getAIUsageStats();

      expect(stats.contentGenerated).toBe(4);
      expect(stats.tokensUsed).toBe(150); // Only count valid token values
    });
  });

  describe('getRecentAIActivity', () => {
    it('should fetch recent AI activity correctly', async () => {
      const mockLogs = [
        {
          id: '1',
          prompt: 'Generate a blog post about AI',
          content_type: 'blog',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          prompt: 'Create social media content',
          content_type: 'social',
          created_at: new Date(Date.now() - 60000).toISOString()
        }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              data: mockLogs,
              error: null
            })
          })
        })
      });

      const activity = await aiUsageService.getRecentAIActivity();

      expect(activity).toHaveLength(2);
      expect(activity[0]).toMatchObject({
        id: '1',
        type: 'ai',
        title: 'Generate a blog post about AI',
        description: 'AI blog generated',
        status: 'generated',
        platform: 'ai'
      });
      expect(activity[0].timestamp).toBeInstanceOf(Date);
    });

    it('should truncate long prompts', async () => {
      const longPrompt = 'This is a very long prompt that should be truncated because it exceeds the maximum length limit';
      const mockLogs = [
        {
          id: '1',
          prompt: longPrompt,
          content_type: 'blog',
          created_at: new Date().toISOString()
        }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              data: mockLogs,
              error: null
            })
          })
        })
      });

      const activity = await aiUsageService.getRecentAIActivity();

      expect(activity[0].title).toBe(longPrompt.substring(0, 50) + '...');
    });

    it('should handle empty prompts', async () => {
      const mockLogs = [
        {
          id: '1',
          prompt: '',
          content_type: 'blog',
          created_at: new Date().toISOString()
        }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              data: mockLogs,
              error: null
            })
          })
        })
      });

      const activity = await aiUsageService.getRecentAIActivity();

      expect(activity[0].title).toBe('AI Content Generated');
    });

    it('should handle Supabase errors gracefully', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              data: null,
              error: { message: 'Database error' }
            })
          })
        })
      });

      const activity = await aiUsageService.getRecentAIActivity();

      expect(activity).toEqual([]);
    });
  });

  describe('getAIUsageMetrics', () => {
    it('should calculate usage metrics for specified period', async () => {
      const mockLogs = [
        { id: '1', tokens_used: 100, content_type: 'blog' },
        { id: '2', tokens_used: 200, content_type: 'social' },
        { id: '3', tokens_used: 150, content_type: 'blog' }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({
            data: mockLogs,
            error: null
          })
        })
      });

      const metrics = await aiUsageService.getAIUsageMetrics(30);

      expect(metrics).toEqual({
        totalGenerated: 3,
        totalTokens: 450,
        averageTokensPerGeneration: 150,
        contentTypeBreakdown: {
          blog: 2,
          social: 1
        }
      });
    });

    it('should handle empty logs for metrics', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({
            data: [],
            error: null
          })
        })
      });

      const metrics = await aiUsageService.getAIUsageMetrics(30);

      expect(metrics).toEqual({
        totalGenerated: 0,
        totalTokens: 0,
        averageTokensPerGeneration: 0,
        contentTypeBreakdown: {}
      });
    });

    it('should handle missing content_type', async () => {
      const mockLogs = [
        { id: '1', tokens_used: 100, content_type: null },
        { id: '2', tokens_used: 200, content_type: undefined },
        { id: '3', tokens_used: 150, content_type: 'blog' }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({
            data: mockLogs,
            error: null
          })
        })
      });

      const metrics = await aiUsageService.getAIUsageMetrics(30);

      expect(metrics.contentTypeBreakdown).toEqual({
        unknown: 2,
        blog: 1
      });
    });
  });

  describe('getAIUsageTrends', () => {
    it('should calculate usage trends over months', async () => {
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 15);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);

      const mockLogs = [
        { created_at: thisMonth.toISOString(), tokens_used: 100 },
        { created_at: thisMonth.toISOString(), tokens_used: 150 },
        { created_at: lastMonth.toISOString(), tokens_used: 200 }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            data: mockLogs,
            error: null
          })
        })
      });

      const trends = await aiUsageService.getAIUsageTrends(6);

      expect(Array.isArray(trends)).toBe(true);
      expect(trends.length).toBe(6); // 6 months of data
      expect(trends[0]).toHaveProperty('month');
      expect(trends[0]).toHaveProperty('contentGenerated');
      expect(trends[0]).toHaveProperty('tokensUsed');
    });

    it('should handle empty trends data', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            data: [],
            error: null
          })
        })
      });

      const trends = await aiUsageService.getAIUsageTrends(6);

      expect(Array.isArray(trends)).toBe(true);
      expect(trends.length).toBe(6);
      expect(trends.every(trend => trend.contentGenerated === 0 && trend.tokensUsed === 0)).toBe(true);
    });
  });

  describe('getAIUsageGrowth', () => {
    it('should calculate growth percentages', async () => {
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 15);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);

      const mockLogs = [
        { created_at: thisMonth.toISOString(), tokens_used: 120 },
        { created_at: thisMonth.toISOString(), tokens_used: 80 },
        { created_at: lastMonth.toISOString(), tokens_used: 100 }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          data: mockLogs,
          error: null
        })
      });

      const growth = await aiUsageService.getAIUsageGrowth();

      expect(growth).toHaveProperty('contentGrowth');
      expect(growth).toHaveProperty('tokenGrowth');
      expect(typeof growth.contentGrowth).toBe('number');
      expect(typeof growth.tokenGrowth).toBe('number');
    });

    it('should handle no data for growth calculation', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          data: [],
          error: null
        })
      });

      const growth = await aiUsageService.getAIUsageGrowth();

      expect(growth).toEqual({
        contentGrowth: 0,
        tokenGrowth: 0
      });
    });
  });

  describe('getEstimatedCostSavings', () => {
    it('should calculate cost savings correctly', async () => {
      // Mock the getAIUsageStats method
      vi.spyOn(aiUsageService, 'getAIUsageStats').mockResolvedValue({
        contentGenerated: 10,
        tokensUsed: 1000,
        timeSaved: 120 // 2 hours in minutes
      });

      const savings = await aiUsageService.getEstimatedCostSavings();

      expect(savings).toEqual({
        timeSavedHours: 2,
        estimatedCostSavings: 100 // 2 hours * $50/hour
      });
    });

    it('should handle errors in cost calculation', async () => {
      vi.spyOn(aiUsageService, 'getAIUsageStats').mockRejectedValue(new Error('Stats error'));

      const savings = await aiUsageService.getEstimatedCostSavings();

      expect(savings).toEqual({
        timeSavedHours: 0,
        estimatedCostSavings: 0
      });
    });
  });

  describe('getUsageLimitStatus', () => {
    it('should check usage limits correctly', async () => {
      const mockMonthlyLogs = [
        { tokens_used: 50000 },
        { tokens_used: 30000 }
      ];
      const mockDailyLogs = [
        { tokens_used: 2000 },
        { tokens_used: 1500 }
      ];

      mockSupabaseAdmin.from
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              data: mockMonthlyLogs,
              error: null
            })
          })
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              data: mockDailyLogs,
              error: null
            })
          })
        });

      const limitStatus = await aiUsageService.getUsageLimitStatus();

      expect(limitStatus).toMatchObject({
        monthlyTokensUsed: 80000,
        monthlyTokenLimit: 100000,
        dailyTokensUsed: 3500,
        dailyTokenLimit: 5000,
        isApproachingMonthlyLimit: true, // 80% of 100k
        isApproachingDailyLimit: false
      });
      expect(limitStatus.warningMessage).toContain('Approaching monthly token limit');
    });

    it('should detect exceeded limits', async () => {
      const mockMonthlyLogs = [{ tokens_used: 110000 }];
      const mockDailyLogs = [{ tokens_used: 3000 }];

      mockSupabaseAdmin.from
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              data: mockMonthlyLogs,
              error: null
            })
          })
        })
        .mockReturnValueOnce({
          select: vi.fn().mockReturnValue({
            gte: vi.fn().mockReturnValue({
              data: mockDailyLogs,
              error: null
            })
          })
        });

      const limitStatus = await aiUsageService.getUsageLimitStatus();

      expect(limitStatus.warningMessage).toBe('Monthly token limit exceeded. AI content generation may be restricted.');
    });

    it('should handle errors in limit checking', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          gte: vi.fn().mockReturnValue({
            data: null,
            error: { message: 'Database error' }
          })
        })
      });

      const limitStatus = await aiUsageService.getUsageLimitStatus();

      expect(limitStatus).toMatchObject({
        monthlyTokensUsed: 0,
        monthlyTokenLimit: 100000,
        dailyTokensUsed: 0,
        dailyTokenLimit: 5000,
        isApproachingMonthlyLimit: false,
        isApproachingDailyLimit: false
      });
    });
  });

  describe('getUsageEfficiencyMetrics', () => {
    it('should calculate efficiency metrics correctly', async () => {
      const mockLogs = [
        { content_type: 'blog', tokens_used: 200, created_at: '2024-01-15' },
        { content_type: 'blog', tokens_used: 180, created_at: '2024-01-14' },
        { content_type: 'social', tokens_used: 50, created_at: '2024-01-13' },
        { content_type: 'social', tokens_used: 60, created_at: '2024-01-12' },
        { content_type: 'newsletter', tokens_used: 300, created_at: '2024-01-11' }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              data: mockLogs,
              error: null
            })
          })
        })
      });

      const efficiency = await aiUsageService.getUsageEfficiencyMetrics();

      expect(efficiency.averageTokensPerContent).toBe(158); // (200+180+50+60+300)/5
      expect(efficiency.mostEfficientContentType).toBe('social'); // Lowest average tokens
      expect(efficiency.leastEfficientContentType).toBe('newsletter'); // Highest average tokens
      expect(['improving', 'declining', 'stable']).toContain(efficiency.efficiencyTrend);
    });

    it('should handle empty logs for efficiency', async () => {
      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              data: [],
              error: null
            })
          })
        })
      });

      const efficiency = await aiUsageService.getUsageEfficiencyMetrics();

      expect(efficiency).toEqual({
        averageTokensPerContent: 0,
        mostEfficientContentType: 'N/A',
        leastEfficientContentType: 'N/A',
        efficiencyTrend: 'stable'
      });
    });

    it('should handle missing content types in efficiency calculation', async () => {
      const mockLogs = [
        { content_type: null, tokens_used: 100 },
        { content_type: undefined, tokens_used: 150 },
        { content_type: 'blog', tokens_used: 200 }
      ];

      mockSupabaseAdmin.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              data: mockLogs,
              error: null
            })
          })
        })
      });

      const efficiency = await aiUsageService.getUsageEfficiencyMetrics();

      expect(efficiency.averageTokensPerContent).toBe(150); // (100+150+200)/3
      expect(['unknown', 'blog']).toContain(efficiency.mostEfficientContentType);
      expect(['unknown', 'blog']).toContain(efficiency.leastEfficientContentType);
    });
  });
});
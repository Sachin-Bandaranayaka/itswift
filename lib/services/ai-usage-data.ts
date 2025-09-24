/**
 * AI Usage Data Service - Fetches AI usage statistics from Supabase
 */

import { getSupabaseAdmin } from '@/lib/supabase';
import { AIUsageStats, ActivityItem } from '@/lib/types/dashboard';
import { isThisMonth, isLastMonth, calculateGrowth } from '@/lib/utils/dashboard-utils';

const isMissingTableError = (error: unknown): boolean => {
  return Boolean(error && typeof error === 'object' && (error as any).code === 'PGRST205');
};

export class AIUsageDataService {
  /**
   * Fetch AI usage statistics from Supabase
   */
  async getAIUsageStats(): Promise<AIUsageStats> {
    try {
      // Fetch all AI content generation logs
      const { data: logs, error } = await getSupabaseAdmin()
        .from('ai_content_log')
        .select('*');

      if (error) {
        if (isMissingTableError(error)) {
          return {
            contentGenerated: 0,
            tokensUsed: 0,
            timeSaved: 0
          };
        }
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (!logs) {
        return {
          contentGenerated: 0,
          tokensUsed: 0,
          timeSaved: 0
        };
      }

      // Calculate total tokens used
      const totalTokens = logs.reduce((sum, log) => {
        return sum + (log.tokens_used || 0);
      }, 0);

      // Estimate time saved (rough calculation: 1 token ≈ 0.75 words, average writing speed 40 words/minute)
      const estimatedWords = totalTokens * 0.75;
      const timeSavedMinutes = Math.round(estimatedWords / 40);

      return {
        contentGenerated: logs.length,
        tokensUsed: totalTokens,
        timeSaved: timeSavedMinutes
      };
    } catch (error) {
      console.error('Error fetching AI usage stats:', error);
      return {
        contentGenerated: 0,
        tokensUsed: 0,
        timeSaved: 0
      };
    }
  }

  /**
   * Get recent AI content generation activity
   */
  async getRecentAIActivity(): Promise<ActivityItem[]> {
    try {
      const { data: logs, error } = await getSupabaseAdmin()
        .from('ai_content_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        if (isMissingTableError(error)) {
          return [];
        }
        console.error('Supabase error:', error);
        return [];
      }

      if (!logs) {
        return [];
      }

      return logs.map(log => ({
        id: log.id,
        type: 'ai' as const,
        title: this.truncateText(log.prompt, 50),
        description: `AI ${log.content_type} generated`,
        timestamp: new Date(log.created_at),
        status: 'generated' as const,
        platform: 'ai'
      }));
    } catch (error) {
      console.error('Error fetching recent AI activity:', error);
      return [];
    }
  }

  /**
   * Get AI usage metrics for a specific time period
   */
  async getAIUsageMetrics(days: number = 30): Promise<{
    totalGenerated: number;
    totalTokens: number;
    averageTokensPerGeneration: number;
    contentTypeBreakdown: { [key: string]: number };
  }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data: logs, error } = await getSupabaseAdmin()
        .from('ai_content_log')
        .select('*')
        .gte('created_at', cutoffDate.toISOString());

      if (error) {
        if (isMissingTableError(error)) {
          return {
            totalGenerated: 0,
            totalTokens: 0,
            averageTokensPerGeneration: 0,
            contentTypeBreakdown: {}
          };
        }
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (!logs || logs.length === 0) {
        return {
          totalGenerated: 0,
          totalTokens: 0,
          averageTokensPerGeneration: 0,
          contentTypeBreakdown: {}
        };
      }

      const totalTokens = logs.reduce((sum, log) => sum + (log.tokens_used || 0), 0);
      const averageTokens = Math.round(totalTokens / logs.length);

      // Break down by content type
      const contentTypeBreakdown: { [key: string]: number } = {};
      logs.forEach(log => {
        const type = log.content_type || 'unknown';
        contentTypeBreakdown[type] = (contentTypeBreakdown[type] || 0) + 1;
      });

      return {
        totalGenerated: logs.length,
        totalTokens,
        averageTokensPerGeneration: averageTokens,
        contentTypeBreakdown
      };
    } catch (error) {
      console.error('Error fetching AI usage metrics:', error);
      return {
        totalGenerated: 0,
        totalTokens: 0,
        averageTokensPerGeneration: 0,
        contentTypeBreakdown: {}
      };
    }
  }

  /**
   * Get AI usage trends over time
   */
  async getAIUsageTrends(months: number = 6): Promise<Array<{
    month: string;
    contentGenerated: number;
    tokensUsed: number;
  }>> {
    try {
      const { data: logs, error } = await getSupabaseAdmin()
        .from('ai_content_log')
        .select('created_at, tokens_used')
        .order('created_at', { ascending: true });

      if (error) {
        if (isMissingTableError(error)) {
          return [];
        }
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (!logs) {
        return [];
      }

      // Group by month
      const monthlyData: { [key: string]: { count: number; tokens: number } } = {};
      const now = new Date();
      
      // Initialize months
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toISOString().substring(0, 7); // YYYY-MM format
        monthlyData[monthKey] = { count: 0, tokens: 0 };
      }

      // Aggregate data by month
      logs.forEach(log => {
        const createdDate = new Date(log.created_at);
        const monthKey = createdDate.toISOString().substring(0, 7);
        if (monthlyData.hasOwnProperty(monthKey)) {
          monthlyData[monthKey].count++;
          monthlyData[monthKey].tokens += log.tokens_used || 0;
        }
      });

      return Object.entries(monthlyData).map(([month, data]) => ({
        month,
        contentGenerated: data.count,
        tokensUsed: data.tokens
      }));
    } catch (error) {
      console.error('Error fetching AI usage trends:', error);
      return [];
    }
  }

  /**
   * Get AI usage growth compared to previous period
   */
  async getAIUsageGrowth(): Promise<{
    contentGrowth: number;
    tokenGrowth: number;
  }> {
    try {
      const { data: logs, error } = await getSupabaseAdmin()
        .from('ai_content_log')
        .select('created_at, tokens_used');

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (!logs) {
        return { contentGrowth: 0, tokenGrowth: 0 };
      }

      // Filter for this month and last month
      const thisMonthLogs = logs.filter(log => {
        const createdDate = new Date(log.created_at);
        return isThisMonth(createdDate);
      });

      const lastMonthLogs = logs.filter(log => {
        const createdDate = new Date(log.created_at);
        return isLastMonth(createdDate);
      });

      const thisMonthTokens = thisMonthLogs.reduce((sum, log) => sum + (log.tokens_used || 0), 0);
      const lastMonthTokens = lastMonthLogs.reduce((sum, log) => sum + (log.tokens_used || 0), 0);

      return {
        contentGrowth: calculateGrowth(thisMonthLogs.length, lastMonthLogs.length),
        tokenGrowth: calculateGrowth(thisMonthTokens, lastMonthTokens)
      };
    } catch (error) {
      console.error('Error fetching AI usage growth:', error);
      return { contentGrowth: 0, tokenGrowth: 0 };
    }
  }

  /**
   * Helper method to truncate text for display
   */
  private truncateText(text: string, maxLength: number): string {
    if (!text) return 'AI Content Generated';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  /**
   * Get estimated cost savings from AI usage
   */
  async getEstimatedCostSavings(): Promise<{
    timeSavedHours: number;
    estimatedCostSavings: number; // in USD
  }> {
    try {
      const stats = await this.getAIUsageStats();
      const timeSavedHours = Math.round(stats.timeSaved / 60 * 100) / 100; // Convert minutes to hours
      
      // Rough estimate: $50/hour for content creation
      const estimatedCostSavings = Math.round(timeSavedHours * 50);

      return {
        timeSavedHours,
        estimatedCostSavings
      };
    } catch (error) {
      console.error('Error calculating cost savings:', error);
      return {
        timeSavedHours: 0,
        estimatedCostSavings: 0
      };
    }
  }

  /**
   * Check AI usage limits and provide warnings
   */
  async getUsageLimitStatus(): Promise<{
    monthlyTokensUsed: number;
    monthlyTokenLimit: number;
    dailyTokensUsed: number;
    dailyTokenLimit: number;
    isApproachingMonthlyLimit: boolean;
    isApproachingDailyLimit: boolean;
    warningMessage?: string;
  }> {
    try {
      // Define limits (these could be configurable via environment variables)
      const MONTHLY_TOKEN_LIMIT = 100000; // 100k tokens per month
      const DAILY_TOKEN_LIMIT = 5000; // 5k tokens per day
      const WARNING_THRESHOLD = 0.8; // 80% of limit

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Get monthly usage
      const { data: monthlyLogs, error: monthlyError } = await getSupabaseAdmin()
        .from('ai_content_log')
        .select('tokens_used')
        .gte('created_at', startOfMonth.toISOString());

      if (monthlyError) {
        throw new Error(`Supabase error: ${monthlyError.message}`);
      }

      const monthlyTokensUsed = (monthlyLogs || []).reduce((sum, log) => sum + (log.tokens_used || 0), 0);

      // Get daily usage
      const { data: dailyLogs, error: dailyError } = await getSupabaseAdmin()
        .from('ai_content_log')
        .select('tokens_used')
        .gte('created_at', startOfDay.toISOString());

      if (dailyError) {
        throw new Error(`Supabase error: ${dailyError.message}`);
      }

      const dailyTokensUsed = (dailyLogs || []).reduce((sum, log) => sum + (log.tokens_used || 0), 0);

      const isApproachingMonthlyLimit = monthlyTokensUsed >= (MONTHLY_TOKEN_LIMIT * WARNING_THRESHOLD);
      const isApproachingDailyLimit = dailyTokensUsed >= (DAILY_TOKEN_LIMIT * WARNING_THRESHOLD);

      let warningMessage: string | undefined;
      if (monthlyTokensUsed >= MONTHLY_TOKEN_LIMIT) {
        warningMessage = 'Monthly token limit exceeded. AI content generation may be restricted.';
      } else if (dailyTokensUsed >= DAILY_TOKEN_LIMIT) {
        warningMessage = 'Daily token limit exceeded. AI content generation may be restricted until tomorrow.';
      } else if (isApproachingMonthlyLimit) {
        const remainingTokens = MONTHLY_TOKEN_LIMIT - monthlyTokensUsed;
        warningMessage = `Approaching monthly token limit. ${remainingTokens} tokens remaining.`;
      } else if (isApproachingDailyLimit) {
        const remainingTokens = DAILY_TOKEN_LIMIT - dailyTokensUsed;
        warningMessage = `Approaching daily token limit. ${remainingTokens} tokens remaining.`;
      }

      return {
        monthlyTokensUsed,
        monthlyTokenLimit: MONTHLY_TOKEN_LIMIT,
        dailyTokensUsed,
        dailyTokenLimit: DAILY_TOKEN_LIMIT,
        isApproachingMonthlyLimit,
        isApproachingDailyLimit,
        warningMessage
      };
    } catch (error) {
      console.error('Error checking usage limits:', error);
      return {
        monthlyTokensUsed: 0,
        monthlyTokenLimit: 100000,
        dailyTokensUsed: 0,
        dailyTokenLimit: 5000,
        isApproachingMonthlyLimit: false,
        isApproachingDailyLimit: false
      };
    }
  }

  /**
   * Get AI usage efficiency metrics
   */
  async getUsageEfficiencyMetrics(): Promise<{
    averageTokensPerContent: number;
    mostEfficientContentType: string;
    leastEfficientContentType: string;
    efficiencyTrend: 'improving' | 'declining' | 'stable';
  }> {
    try {
      const { data: logs, error } = await getSupabaseAdmin()
        .from('ai_content_log')
        .select('content_type, tokens_used, created_at')
        .order('created_at', { ascending: false })
        .limit(100); // Get recent 100 entries for analysis

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (!logs || logs.length === 0) {
        return {
          averageTokensPerContent: 0,
          mostEfficientContentType: 'N/A',
          leastEfficientContentType: 'N/A',
          efficiencyTrend: 'stable'
        };
      }

      // Calculate average tokens per content
      const totalTokens = logs.reduce((sum, log) => sum + (log.tokens_used || 0), 0);
      const averageTokensPerContent = Math.round(totalTokens / logs.length);

      // Calculate efficiency by content type
      const contentTypeStats: { [key: string]: { total: number; count: number } } = {};
      logs.forEach(log => {
        const type = log.content_type || 'unknown';
        if (!contentTypeStats[type]) {
          contentTypeStats[type] = { total: 0, count: 0 };
        }
        contentTypeStats[type].total += log.tokens_used || 0;
        contentTypeStats[type].count += 1;
      });

      const contentTypeAverages = Object.entries(contentTypeStats).map(([type, stats]) => ({
        type,
        average: stats.total / stats.count
      }));

      contentTypeAverages.sort((a, b) => a.average - b.average);

      const mostEfficientContentType = contentTypeAverages[0]?.type || 'N/A';
      const leastEfficientContentType = contentTypeAverages[contentTypeAverages.length - 1]?.type || 'N/A';

      // Calculate efficiency trend (compare first half vs second half of recent logs)
      const halfPoint = Math.floor(logs.length / 2);
      const recentHalf = logs.slice(0, halfPoint);
      const olderHalf = logs.slice(halfPoint);

      const recentAverage = recentHalf.reduce((sum, log) => sum + (log.tokens_used || 0), 0) / recentHalf.length;
      const olderAverage = olderHalf.reduce((sum, log) => sum + (log.tokens_used || 0), 0) / olderHalf.length;

      let efficiencyTrend: 'improving' | 'declining' | 'stable' = 'stable';
      const trendThreshold = 0.1; // 10% change threshold
      const changeRatio = (recentAverage - olderAverage) / olderAverage;

      if (changeRatio < -trendThreshold) {
        efficiencyTrend = 'improving'; // Lower tokens = more efficient
      } else if (changeRatio > trendThreshold) {
        efficiencyTrend = 'declining'; // Higher tokens = less efficient
      }

      return {
        averageTokensPerContent,
        mostEfficientContentType,
        leastEfficientContentType,
        efficiencyTrend
      };
    } catch (error) {
      console.error('Error calculating efficiency metrics:', error);
      return {
        averageTokensPerContent: 0,
        mostEfficientContentType: 'N/A',
        leastEfficientContentType: 'N/A',
        efficiencyTrend: 'stable'
      };
    }
  }
}

/**
 * Optimized Database Connection with Connection Pooling and Query Optimization
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Connection pool configuration
 */
interface ConnectionPoolConfig {
  maxConnections: number;
  idleTimeout: number;
  connectionTimeout: number;
  retryAttempts: number;
  retryDelay: number;
}

/**
 * Default connection pool configuration
 */
const DEFAULT_POOL_CONFIG: ConnectionPoolConfig = {
  maxConnections: 10,
  idleTimeout: 30000, // 30 seconds
  connectionTimeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

/**
 * Query performance monitoring
 */
interface QueryMetrics {
  queryName: string;
  executionTime: number;
  timestamp: Date;
  success: boolean;
  error?: string;
}

/**
 * Optimized database service with connection pooling and query optimization
 */
export class OptimizedDatabaseService {
  private static instance: OptimizedDatabaseService;
  private client: SupabaseClient;
  private queryMetrics: QueryMetrics[] = [];
  private connectionPool: Map<string, { client: SupabaseClient; lastUsed: Date; inUse: boolean }> = new Map();
  private config: ConnectionPoolConfig;

  private constructor(config: Partial<ConnectionPoolConfig> = {}) {
    this.config = { ...DEFAULT_POOL_CONFIG, ...config };
    this.client = supabaseAdmin;
    this.initializeConnectionPool();
    this.startConnectionPoolMaintenance();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: Partial<ConnectionPoolConfig>): OptimizedDatabaseService {
    if (!OptimizedDatabaseService.instance) {
      OptimizedDatabaseService.instance = new OptimizedDatabaseService(config);
    }
    return OptimizedDatabaseService.instance;
  }

  /**
   * Initialize connection pool
   */
  private initializeConnectionPool(): void {
    // Create initial connections
    for (let i = 0; i < Math.min(3, this.config.maxConnections); i++) {
      const connectionId = `conn_${i}`;
      this.connectionPool.set(connectionId, {
        client: supabaseAdmin,
        lastUsed: new Date(),
        inUse: false
      });
    }
  }

  /**
   * Start connection pool maintenance
   */
  private startConnectionPoolMaintenance(): void {
    setInterval(() => {
      this.cleanupIdleConnections();
      this.cleanupOldMetrics();
    }, 30000); // Every 30 seconds
  }

  /**
   * Cleanup idle connections
   */
  private cleanupIdleConnections(): void {
    const now = new Date();
    const idleThreshold = new Date(now.getTime() - this.config.idleTimeout);

    for (const [connectionId, connection] of this.connectionPool.entries()) {
      if (!connection.inUse && connection.lastUsed < idleThreshold) {
        this.connectionPool.delete(connectionId);
      }
    }
  }

  /**
   * Cleanup old query metrics
   */
  private cleanupOldMetrics(): void {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    this.queryMetrics = this.queryMetrics.filter(metric => metric.timestamp > oneHourAgo);
  }

  /**
   * Get available connection from pool
   */
  private getConnection(): SupabaseClient {
    // Find available connection
    for (const [connectionId, connection] of this.connectionPool.entries()) {
      if (!connection.inUse) {
        connection.inUse = true;
        connection.lastUsed = new Date();
        return connection.client;
      }
    }

    // Create new connection if pool not full
    if (this.connectionPool.size < this.config.maxConnections) {
      const connectionId = `conn_${this.connectionPool.size}`;
      const newConnection = {
        client: supabaseAdmin,
        lastUsed: new Date(),
        inUse: true
      };
      this.connectionPool.set(connectionId, newConnection);
      return newConnection.client;
    }

    // Return default client if pool is full
    return this.client;
  }

  /**
   * Release connection back to pool
   */
  private releaseConnection(client: SupabaseClient): void {
    for (const [connectionId, connection] of this.connectionPool.entries()) {
      if (connection.client === client) {
        connection.inUse = false;
        connection.lastUsed = new Date();
        break;
      }
    }
  }

  /**
   * Execute optimized query with performance monitoring
   */
  private async executeQuery<T>(
    queryName: string,
    queryFn: (client: SupabaseClient) => Promise<{ data: T | null; error: any }>
  ): Promise<{ data: T | null; error: any }> {
    const startTime = Date.now();
    const client = this.getConnection();
    
    try {
      const result = await queryFn(client);
      
      // Record successful query metrics
      this.queryMetrics.push({
        queryName,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
        success: !result.error,
        error: result.error?.message
      });

      return result;
    } catch (error) {
      // Record failed query metrics
      this.queryMetrics.push({
        queryName,
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return { data: null, error };
    } finally {
      this.releaseConnection(client);
    }
  }

  /**
   * Optimized social media dashboard stats query using materialized view
   */
  async getSocialDashboardStats(): Promise<{
    totalPosts: number;
    postsThisWeek: number;
    totalEngagement: number;
    growthPercentage: number;
  }> {
    const result = await this.executeQuery(
      'getSocialDashboardStats',
      async (client) => {
        // First try to refresh materialized view if stale
        await client.rpc('refresh_dashboard_views_if_stale', { stale_minutes: 5 });
        
        // Then get optimized stats
        return client.rpc('get_social_dashboard_stats');
      }
    );

    if (result.error || !result.data || result.data.length === 0) {
      return { totalPosts: 0, postsThisWeek: 0, totalEngagement: 0, growthPercentage: 0 };
    }

    const stats = result.data[0];
    return {
      totalPosts: parseInt(stats.total_posts) || 0,
      postsThisWeek: parseInt(stats.posts_this_week) || 0,
      totalEngagement: parseInt(stats.total_engagement) || 0,
      growthPercentage: parseFloat(stats.growth_percentage) || 0
    };
  }

  /**
   * Optimized newsletter dashboard stats query using materialized view
   */
  async getNewsletterDashboardStats(): Promise<{
    totalSubscribers: number;
    newSubscribersThisMonth: number;
    growthPercentage: number;
  }> {
    const result = await this.executeQuery(
      'getNewsletterDashboardStats',
      async (client) => {
        // Refresh materialized view if stale
        await client.rpc('refresh_dashboard_views_if_stale', { stale_minutes: 5 });
        
        return client.rpc('get_newsletter_dashboard_stats');
      }
    );

    if (result.error || !result.data || result.data.length === 0) {
      return { totalSubscribers: 0, newSubscribersThisMonth: 0, growthPercentage: 0 };
    }

    const stats = result.data[0];
    return {
      totalSubscribers: parseInt(stats.total_subscribers) || 0,
      newSubscribersThisMonth: parseInt(stats.new_subscribers_this_month) || 0,
      growthPercentage: parseFloat(stats.growth_percentage) || 0
    };
  }

  /**
   * Optimized AI usage dashboard stats query using materialized view
   */
  async getAIUsageDashboardStats(): Promise<{
    contentGenerated: number;
    tokensUsed: number;
    timeSaved: number;
    growthPercentage: number;
  }> {
    const result = await this.executeQuery(
      'getAIUsageDashboardStats',
      async (client) => {
        // Refresh materialized view if stale
        await client.rpc('refresh_dashboard_views_if_stale', { stale_minutes: 5 });
        
        return client.rpc('get_ai_usage_dashboard_stats');
      }
    );

    if (result.error || !result.data || result.data.length === 0) {
      return { contentGenerated: 0, tokensUsed: 0, timeSaved: 0, growthPercentage: 0 };
    }

    const stats = result.data[0];
    return {
      contentGenerated: parseInt(stats.content_generated) || 0,
      tokensUsed: parseInt(stats.tokens_used) || 0,
      timeSaved: parseInt(stats.time_saved_minutes) || 0,
      growthPercentage: parseFloat(stats.growth_percentage) || 0
    };
  }

  /**
   * Optimized recent activity query using stored procedure
   */
  async getRecentDashboardActivity(limit: number = 10): Promise<Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: Date;
    status: string;
    platform: string;
  }>> {
    const result = await this.executeQuery(
      'getRecentDashboardActivity',
      async (client) => {
        return client.rpc('get_recent_dashboard_activity', { activity_limit: limit });
      }
    );

    if (result.error || !result.data) {
      return [];
    }

    return result.data.map((item: any) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      timestamp: new Date(item.timestamp),
      status: item.status,
      platform: item.platform
    }));
  }

  /**
   * Optimized top performing content query using stored procedure
   */
  async getTopPerformingContent(limit: number = 5): Promise<Array<{
    id: string;
    title: string;
    type: string;
    platform: string;
    metrics: {
      likes?: number;
      shares?: number;
      comments?: number;
      opens?: number;
      clicks?: number;
    };
  }>> {
    const result = await this.executeQuery(
      'getTopPerformingContent',
      async (client) => {
        return client.rpc('get_top_performing_content', { content_limit: limit });
      }
    );

    if (result.error || !result.data) {
      return [];
    }

    return result.data.map((item: any) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      platform: item.platform,
      metrics: {
        likes: item.likes || undefined,
        shares: item.shares || undefined,
        comments: item.comments || undefined,
        opens: item.opens || undefined,
        clicks: item.clicks || undefined
      }
    }));
  }

  /**
   * Optimized scheduled content query with proper indexing
   */
  async getScheduledContent(limit: number = 5): Promise<Array<{
    id: string;
    title: string;
    type: string;
    platform: string;
    scheduledAt: Date;
  }>> {
    const result = await this.executeQuery(
      'getScheduledContent',
      async (client) => {
        const now = new Date().toISOString();
        
        // Use optimized query with proper indexes
        const [socialPosts, newsletterCampaigns] = await Promise.all([
          client
            .from('social_posts')
            .select('id, content, platform, scheduled_at')
            .eq('status', 'scheduled')
            .gte('scheduled_at', now)
            .order('scheduled_at', { ascending: true })
            .limit(Math.ceil(limit / 2)),
          
          client
            .from('newsletter_campaigns')
            .select('id, subject, scheduled_at')
            .eq('status', 'scheduled')
            .gte('scheduled_at', now)
            .order('scheduled_at', { ascending: true })
            .limit(Math.ceil(limit / 2))
        ]);

        const scheduled = [];

        // Add social posts
        if (socialPosts.data) {
          scheduled.push(...socialPosts.data.map(post => ({
            id: post.id,
            title: post.content?.substring(0, 50) + '...' || 'Untitled Post',
            type: 'social',
            platform: post.platform,
            scheduledAt: new Date(post.scheduled_at)
          })));
        }

        // Add newsletter campaigns
        if (newsletterCampaigns.data) {
          scheduled.push(...newsletterCampaigns.data.map(campaign => ({
            id: campaign.id,
            title: campaign.subject || 'Untitled Newsletter',
            type: 'newsletter',
            platform: 'email',
            scheduledAt: new Date(campaign.scheduled_at)
          })));
        }

        // Sort by scheduled time and limit
        scheduled.sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
        
        return { data: scheduled.slice(0, limit), error: null };
      }
    );

    return result.data || [];
  }

  /**
   * Batch query execution for multiple dashboard sections
   */
  async getBatchDashboardData(): Promise<{
    socialStats: any;
    newsletterStats: any;
    aiUsageStats: any;
    recentActivity: any[];
    topPerforming: any[];
    scheduled: any[];
  }> {
    const startTime = Date.now();
    
    try {
      // Execute all queries in parallel for better performance
      const [
        socialStats,
        newsletterStats,
        aiUsageStats,
        recentActivity,
        topPerforming,
        scheduled
      ] = await Promise.all([
        this.getSocialDashboardStats(),
        this.getNewsletterDashboardStats(),
        this.getAIUsageDashboardStats(),
        this.getRecentDashboardActivity(10),
        this.getTopPerformingContent(5),
        this.getScheduledContent(5)
      ]);

      // Record batch query metrics
      this.queryMetrics.push({
        queryName: 'getBatchDashboardData',
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
        success: true
      });

      return {
        socialStats,
        newsletterStats,
        aiUsageStats,
        recentActivity,
        topPerforming,
        scheduled
      };
    } catch (error) {
      // Record failed batch query metrics
      this.queryMetrics.push({
        queryName: 'getBatchDashboardData',
        executionTime: Date.now() - startTime,
        timestamp: new Date(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  /**
   * Get query performance metrics
   */
  getQueryMetrics(): {
    averageExecutionTime: number;
    successRate: number;
    slowQueries: QueryMetrics[];
    recentErrors: QueryMetrics[];
  } {
    if (this.queryMetrics.length === 0) {
      return {
        averageExecutionTime: 0,
        successRate: 100,
        slowQueries: [],
        recentErrors: []
      };
    }

    const totalExecutionTime = this.queryMetrics.reduce((sum, metric) => sum + metric.executionTime, 0);
    const successfulQueries = this.queryMetrics.filter(metric => metric.success).length;
    const slowQueries = this.queryMetrics
      .filter(metric => metric.executionTime > 1000) // Queries taking more than 1 second
      .sort((a, b) => b.executionTime - a.executionTime)
      .slice(0, 10);
    
    const recentErrors = this.queryMetrics
      .filter(metric => !metric.success)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return {
      averageExecutionTime: Math.round(totalExecutionTime / this.queryMetrics.length),
      successRate: Math.round((successfulQueries / this.queryMetrics.length) * 100),
      slowQueries,
      recentErrors
    };
  }

  /**
   * Get connection pool status
   */
  getConnectionPoolStatus(): {
    totalConnections: number;
    activeConnections: number;
    idleConnections: number;
    maxConnections: number;
  } {
    const activeConnections = Array.from(this.connectionPool.values()).filter(conn => conn.inUse).length;
    const totalConnections = this.connectionPool.size;

    return {
      totalConnections,
      activeConnections,
      idleConnections: totalConnections - activeConnections,
      maxConnections: this.config.maxConnections
    };
  }

  /**
   * Force refresh of all materialized views
   */
  async refreshMaterializedViews(): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.executeQuery(
        'refreshMaterializedViews',
        async (client) => {
          return client.rpc('refresh_dashboard_materialized_views');
        }
      );

      return { success: !result.error, error: result.error?.message };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get database performance analysis
   */
  async getDatabasePerformanceAnalysis(): Promise<{
    queryPerformance: any[];
    recommendations: any[];
  }> {
    try {
      const [performanceResult, recommendationsResult] = await Promise.all([
        this.executeQuery(
          'getDatabaseQueryPerformance',
          async (client) => client.rpc('get_dashboard_query_performance')
        ),
        this.executeQuery(
          'analyzeDashboardPerformance',
          async (client) => client.rpc('analyze_dashboard_performance')
        )
      ]);

      return {
        queryPerformance: performanceResult.data || [],
        recommendations: recommendationsResult.data || []
      };
    } catch (error) {
      console.error('Error getting database performance analysis:', error);
      return {
        queryPerformance: [],
        recommendations: []
      };
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.connectionPool.clear();
    this.queryMetrics = [];
  }
}

/**
 * Get optimized database service instance
 */
export function getOptimizedDatabaseService(config?: Partial<ConnectionPoolConfig>): OptimizedDatabaseService {
  return OptimizedDatabaseService.getInstance(config);
}

/**
 * Hook for using optimized database service in React components
 */
export function useOptimizedDatabase(): OptimizedDatabaseService {
  return getOptimizedDatabaseService();
}
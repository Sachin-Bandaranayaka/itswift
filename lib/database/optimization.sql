-- Database Optimization for Dashboard Queries
-- This file contains optimized indexes and queries for dashboard performance

-- ============================================================================
-- ENHANCED INDEXES FOR DASHBOARD QUERIES
-- ============================================================================

-- Social Posts Optimization
-- Composite index for dashboard stats query (status + published_at)
CREATE INDEX IF NOT EXISTS idx_social_posts_dashboard_stats 
ON social_posts(status, published_at) 
WHERE status = 'published';

-- Index for engagement metrics queries
CREATE INDEX IF NOT EXISTS idx_social_posts_engagement 
ON social_posts USING GIN(engagement_metrics) 
WHERE status = 'published' AND engagement_metrics IS NOT NULL;

-- Composite index for recent activity queries
CREATE INDEX IF NOT EXISTS idx_social_posts_recent_activity 
ON social_posts(status, published_at DESC) 
WHERE status = 'published';

-- Index for scheduled posts queries
CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled 
ON social_posts(status, scheduled_at) 
WHERE status = 'scheduled' AND scheduled_at IS NOT NULL;

-- Platform-specific queries optimization
CREATE INDEX IF NOT EXISTS idx_social_posts_platform_status 
ON social_posts(platform, status, published_at DESC);

-- Newsletter Subscribers Optimization
-- Composite index for subscriber stats
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_stats 
ON newsletter_subscribers(status, subscribed_at) 
WHERE status = 'active';

-- Index for subscriber growth queries
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_growth 
ON newsletter_subscribers(subscribed_at DESC) 
WHERE status = 'active';

-- Newsletter Campaigns Optimization
-- Composite index for campaign stats
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_stats 
ON newsletter_campaigns(status, sent_at) 
WHERE status = 'sent';

-- Index for performance queries (open_rate, click_rate)
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_performance 
ON newsletter_campaigns(status, open_rate DESC, click_rate DESC) 
WHERE status = 'sent' AND open_rate IS NOT NULL;

-- Index for scheduled campaigns
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_scheduled 
ON newsletter_campaigns(status, scheduled_at) 
WHERE status = 'scheduled' AND scheduled_at IS NOT NULL;

-- Index for Brevo sync queries
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_brevo_sync 
ON newsletter_campaigns(brevo_message_id, last_synced_at) 
WHERE brevo_message_id IS NOT NULL;

-- Content Analytics Optimization
-- Composite index for content analytics queries
CREATE INDEX IF NOT EXISTS idx_content_analytics_dashboard 
ON content_analytics(content_type, recorded_at DESC);

-- Index for performance metrics
CREATE INDEX IF NOT EXISTS idx_content_analytics_metrics 
ON content_analytics(content_type, content_id, recorded_at DESC);

-- AI Content Log Optimization
-- Index for AI usage stats
CREATE INDEX IF NOT EXISTS idx_ai_content_log_stats 
ON ai_content_log(created_at DESC);

-- Index for content type breakdown
CREATE INDEX IF NOT EXISTS idx_ai_content_log_type_stats 
ON ai_content_log(content_type, created_at DESC);

-- Index for token usage queries
CREATE INDEX IF NOT EXISTS idx_ai_content_log_tokens 
ON ai_content_log(created_at DESC, tokens_used) 
WHERE tokens_used IS NOT NULL;

-- ============================================================================
-- MATERIALIZED VIEWS FOR COMPLEX DASHBOARD QUERIES
-- ============================================================================

-- Materialized view for social media dashboard stats
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_social_dashboard_stats AS
SELECT 
  COUNT(*) as total_posts,
  COUNT(CASE WHEN published_at >= date_trunc('week', now()) THEN 1 END) as posts_this_week,
  COUNT(CASE WHEN published_at >= date_trunc('week', now() - interval '1 week') 
             AND published_at < date_trunc('week', now()) THEN 1 END) as posts_last_week,
  COALESCE(SUM(
    COALESCE((engagement_metrics->>'likes')::int, 0) + 
    COALESCE((engagement_metrics->>'shares')::int, 0) + 
    COALESCE((engagement_metrics->>'comments')::int, 0)
  ), 0) as total_engagement,
  MAX(published_at) as last_updated
FROM social_posts 
WHERE status = 'published';

-- Index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_social_dashboard_stats_unique 
ON mv_social_dashboard_stats(last_updated);

-- Materialized view for newsletter dashboard stats
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_newsletter_dashboard_stats AS
SELECT 
  COUNT(*) as total_subscribers,
  COUNT(CASE WHEN subscribed_at >= date_trunc('month', now()) THEN 1 END) as new_this_month,
  COUNT(CASE WHEN subscribed_at >= date_trunc('month', now() - interval '1 month') 
             AND subscribed_at < date_trunc('month', now()) THEN 1 END) as new_last_month,
  MAX(subscribed_at) as last_updated
FROM newsletter_subscribers 
WHERE status = 'active';

-- Index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_newsletter_dashboard_stats_unique 
ON mv_newsletter_dashboard_stats(last_updated);

-- Materialized view for AI usage dashboard stats
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_ai_usage_dashboard_stats AS
SELECT 
  COUNT(*) as content_generated,
  COALESCE(SUM(tokens_used), 0) as tokens_used,
  COUNT(CASE WHEN created_at >= date_trunc('month', now()) THEN 1 END) as generated_this_month,
  COUNT(CASE WHEN created_at >= date_trunc('month', now() - interval '1 month') 
             AND created_at < date_trunc('month', now()) THEN 1 END) as generated_last_month,
  MAX(created_at) as last_updated
FROM ai_content_log;

-- Index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_ai_usage_dashboard_stats_unique 
ON mv_ai_usage_dashboard_stats(last_updated);

-- ============================================================================
-- OPTIMIZED STORED PROCEDURES FOR DASHBOARD QUERIES
-- ============================================================================

-- Function to get social media dashboard stats with growth calculation
CREATE OR REPLACE FUNCTION get_social_dashboard_stats()
RETURNS TABLE(
  total_posts bigint,
  posts_this_week bigint,
  total_engagement bigint,
  growth_percentage numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.total_posts,
    s.posts_this_week,
    s.total_engagement,
    CASE 
      WHEN s.posts_last_week = 0 THEN 
        CASE WHEN s.posts_this_week > 0 THEN 100.0 ELSE 0.0 END
      ELSE 
        ROUND(((s.posts_this_week - s.posts_last_week)::numeric / s.posts_last_week::numeric) * 100, 2)
    END as growth_percentage
  FROM mv_social_dashboard_stats s;
END;
$$ LANGUAGE plpgsql;

-- Function to get newsletter dashboard stats with growth calculation
CREATE OR REPLACE FUNCTION get_newsletter_dashboard_stats()
RETURNS TABLE(
  total_subscribers bigint,
  new_subscribers_this_month bigint,
  growth_percentage numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    n.total_subscribers,
    n.new_this_month,
    CASE 
      WHEN n.new_last_month = 0 THEN 
        CASE WHEN n.new_this_month > 0 THEN 100.0 ELSE 0.0 END
      ELSE 
        ROUND(((n.new_this_month - n.new_last_month)::numeric / n.new_last_month::numeric) * 100, 2)
    END as growth_percentage
  FROM mv_newsletter_dashboard_stats n;
END;
$$ LANGUAGE plpgsql;

-- Function to get AI usage dashboard stats with growth calculation
CREATE OR REPLACE FUNCTION get_ai_usage_dashboard_stats()
RETURNS TABLE(
  content_generated bigint,
  tokens_used bigint,
  time_saved_minutes integer,
  growth_percentage numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.content_generated,
    a.tokens_used,
    -- Estimate time saved: 1 token ≈ 0.75 words, 40 words/minute writing speed
    ROUND((a.tokens_used * 0.75 / 40)::numeric)::integer as time_saved_minutes,
    CASE 
      WHEN a.generated_last_month = 0 THEN 
        CASE WHEN a.generated_this_month > 0 THEN 100.0 ELSE 0.0 END
      ELSE 
        ROUND(((a.generated_this_month - a.generated_last_month)::numeric / a.generated_last_month::numeric) * 100, 2)
    END as growth_percentage
  FROM mv_ai_usage_dashboard_stats a;
END;
$$ LANGUAGE plpgsql;

-- Function to get recent activity across all content types
CREATE OR REPLACE FUNCTION get_recent_dashboard_activity(activity_limit integer DEFAULT 10)
RETURNS TABLE(
  id text,
  type text,
  title text,
  description text,
  timestamp timestamptz,
  status text,
  platform text
) AS $$
BEGIN
  RETURN QUERY
  (
    -- Social posts
    SELECT 
      sp.id::text,
      'social'::text as type,
      CASE 
        WHEN LENGTH(sp.content) > 50 THEN LEFT(sp.content, 50) || '...'
        ELSE COALESCE(sp.content, 'Untitled Post')
      END as title,
      ('Posted on ' || sp.platform)::text as description,
      sp.published_at as timestamp,
      sp.status::text,
      sp.platform::text
    FROM social_posts sp
    WHERE sp.status = 'published' AND sp.published_at IS NOT NULL
    ORDER BY sp.published_at DESC
    LIMIT activity_limit / 3
  )
  UNION ALL
  (
    -- Newsletter campaigns
    SELECT 
      nc.id::text,
      'newsletter'::text as type,
      COALESCE(nc.subject, 'Untitled Newsletter')::text as title,
      ('Newsletter sent to ' || COALESCE(nc.recipient_count, 0) || ' subscribers')::text as description,
      nc.sent_at as timestamp,
      'sent'::text as status,
      'email'::text as platform
    FROM newsletter_campaigns nc
    WHERE nc.status = 'sent' AND nc.sent_at IS NOT NULL
    ORDER BY nc.sent_at DESC
    LIMIT activity_limit / 3
  )
  UNION ALL
  (
    -- AI content generation
    SELECT 
      acl.id::text,
      'ai'::text as type,
      CASE 
        WHEN LENGTH(acl.prompt) > 50 THEN LEFT(acl.prompt, 50) || '...'
        ELSE COALESCE(acl.prompt, 'AI Content Generated')
      END as title,
      ('AI ' || acl.content_type || ' generated')::text as description,
      acl.created_at as timestamp,
      'generated'::text as status,
      'ai'::text as platform
    FROM ai_content_log acl
    ORDER BY acl.created_at DESC
    LIMIT activity_limit / 3
  )
  ORDER BY timestamp DESC
  LIMIT activity_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get top performing content across all types
CREATE OR REPLACE FUNCTION get_top_performing_content(content_limit integer DEFAULT 5)
RETURNS TABLE(
  id text,
  title text,
  type text,
  platform text,
  engagement_score bigint,
  likes integer,
  shares integer,
  comments integer,
  opens integer,
  clicks integer
) AS $$
BEGIN
  RETURN QUERY
  (
    -- Social posts by engagement
    SELECT 
      sp.id::text,
      CASE 
        WHEN LENGTH(sp.content) > 50 THEN LEFT(sp.content, 50) || '...'
        ELSE COALESCE(sp.content, 'Untitled Post')
      END as title,
      'social'::text as type,
      sp.platform::text,
      (
        COALESCE((sp.engagement_metrics->>'likes')::int, 0) + 
        COALESCE((sp.engagement_metrics->>'shares')::int, 0) + 
        COALESCE((sp.engagement_metrics->>'comments')::int, 0)
      )::bigint as engagement_score,
      COALESCE((sp.engagement_metrics->>'likes')::int, 0) as likes,
      COALESCE((sp.engagement_metrics->>'shares')::int, 0) as shares,
      COALESCE((sp.engagement_metrics->>'comments')::int, 0) as comments,
      0 as opens,
      0 as clicks
    FROM social_posts sp
    WHERE sp.status = 'published' 
      AND sp.engagement_metrics IS NOT NULL
      AND (
        COALESCE((sp.engagement_metrics->>'likes')::int, 0) + 
        COALESCE((sp.engagement_metrics->>'shares')::int, 0) + 
        COALESCE((sp.engagement_metrics->>'comments')::int, 0)
      ) > 0
    ORDER BY engagement_score DESC
    LIMIT content_limit / 2
  )
  UNION ALL
  (
    -- Newsletter campaigns by open rate
    SELECT 
      nc.id::text,
      COALESCE(nc.subject, 'Untitled Newsletter')::text as title,
      'newsletter'::text as type,
      'email'::text as platform,
      COALESCE(ROUND(nc.recipient_count * (nc.open_rate / 100)), 0)::bigint as engagement_score,
      0 as likes,
      0 as shares,
      0 as comments,
      COALESCE(ROUND(nc.recipient_count * (nc.open_rate / 100)), 0)::int as opens,
      COALESCE(ROUND(nc.recipient_count * (nc.click_rate / 100)), 0)::int as clicks
    FROM newsletter_campaigns nc
    WHERE nc.status = 'sent' 
      AND nc.open_rate IS NOT NULL 
      AND nc.open_rate > 0
    ORDER BY nc.open_rate DESC
    LIMIT content_limit / 2
  )
  ORDER BY engagement_score DESC
  LIMIT content_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- REFRESH FUNCTIONS FOR MATERIALIZED VIEWS
-- ============================================================================

-- Function to refresh all dashboard materialized views
CREATE OR REPLACE FUNCTION refresh_dashboard_materialized_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_social_dashboard_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_newsletter_dashboard_stats;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_ai_usage_dashboard_stats;
END;
$$ LANGUAGE plpgsql;

-- Function to refresh materialized views if data is stale
CREATE OR REPLACE FUNCTION refresh_dashboard_views_if_stale(stale_minutes integer DEFAULT 5)
RETURNS boolean AS $$
DECLARE
  needs_refresh boolean := false;
  last_social_update timestamptz;
  last_newsletter_update timestamptz;
  last_ai_update timestamptz;
BEGIN
  -- Check if social stats are stale
  SELECT last_updated INTO last_social_update FROM mv_social_dashboard_stats;
  IF last_social_update IS NULL OR last_social_update < (now() - interval '1 minute' * stale_minutes) THEN
    needs_refresh := true;
  END IF;

  -- Check if newsletter stats are stale
  SELECT last_updated INTO last_newsletter_update FROM mv_newsletter_dashboard_stats;
  IF last_newsletter_update IS NULL OR last_newsletter_update < (now() - interval '1 minute' * stale_minutes) THEN
    needs_refresh := true;
  END IF;

  -- Check if AI stats are stale
  SELECT last_updated INTO last_ai_update FROM mv_ai_usage_dashboard_stats;
  IF last_ai_update IS NULL OR last_ai_update < (now() - interval '1 minute' * stale_minutes) THEN
    needs_refresh := true;
  END IF;

  -- Refresh if needed
  IF needs_refresh THEN
    PERFORM refresh_dashboard_materialized_views();
    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- CONNECTION POOLING AND PERFORMANCE SETTINGS
-- ============================================================================

-- These settings should be applied at the database level, not in SQL files
-- But documenting them here for reference:

/*
-- Connection pooling settings (apply via database configuration)
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;

-- Query optimization settings
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET max_worker_processes = 8;
ALTER SYSTEM SET max_parallel_workers_per_gather = 2;
ALTER SYSTEM SET max_parallel_workers = 8;
*/

-- ============================================================================
-- MONITORING AND MAINTENANCE
-- ============================================================================

-- Function to get database performance statistics
CREATE OR REPLACE FUNCTION get_dashboard_query_performance()
RETURNS TABLE(
  table_name text,
  index_usage_ratio numeric,
  table_size text,
  index_size text,
  seq_scans bigint,
  index_scans bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    schemaname||'.'||tablename as table_name,
    CASE 
      WHEN seq_scan + idx_scan = 0 THEN 0
      ELSE ROUND((idx_scan::numeric / (seq_scan + idx_scan)::numeric) * 100, 2)
    END as index_usage_ratio,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as index_size,
    seq_scan as seq_scans,
    idx_scan as index_scans
  FROM pg_stat_user_tables 
  WHERE tablename IN ('social_posts', 'newsletter_subscribers', 'newsletter_campaigns', 'content_analytics', 'ai_content_log')
  ORDER BY index_usage_ratio ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to analyze query performance and suggest optimizations
CREATE OR REPLACE FUNCTION analyze_dashboard_performance()
RETURNS TABLE(
  recommendation text,
  priority text,
  details text
) AS $$
DECLARE
  social_index_ratio numeric;
  newsletter_index_ratio numeric;
  campaigns_index_ratio numeric;
  ai_index_ratio numeric;
BEGIN
  -- Get index usage ratios
  SELECT index_usage_ratio INTO social_index_ratio 
  FROM get_dashboard_query_performance() 
  WHERE table_name LIKE '%social_posts';
  
  SELECT index_usage_ratio INTO newsletter_index_ratio 
  FROM get_dashboard_query_performance() 
  WHERE table_name LIKE '%newsletter_subscribers';
  
  SELECT index_usage_ratio INTO campaigns_index_ratio 
  FROM get_dashboard_query_performance() 
  WHERE table_name LIKE '%newsletter_campaigns';
  
  SELECT index_usage_ratio INTO ai_index_ratio 
  FROM get_dashboard_query_performance() 
  WHERE table_name LIKE '%ai_content_log';

  -- Generate recommendations
  IF social_index_ratio < 80 THEN
    RETURN QUERY SELECT 
      'Optimize social_posts queries'::text,
      'HIGH'::text,
      ('Index usage ratio is ' || social_index_ratio || '%. Consider adding more specific indexes.')::text;
  END IF;

  IF newsletter_index_ratio < 80 THEN
    RETURN QUERY SELECT 
      'Optimize newsletter_subscribers queries'::text,
      'MEDIUM'::text,
      ('Index usage ratio is ' || newsletter_index_ratio || '%. Consider adding more specific indexes.')::text;
  END IF;

  IF campaigns_index_ratio < 80 THEN
    RETURN QUERY SELECT 
      'Optimize newsletter_campaigns queries'::text,
      'MEDIUM'::text,
      ('Index usage ratio is ' || campaigns_index_ratio || '%. Consider adding more specific indexes.')::text;
  END IF;

  IF ai_index_ratio < 80 THEN
    RETURN QUERY SELECT 
      'Optimize ai_content_log queries'::text,
      'LOW'::text,
      ('Index usage ratio is ' || ai_index_ratio || '%. Consider adding more specific indexes.')::text;
  END IF;

  -- Check materialized view freshness
  RETURN QUERY SELECT 
    'Refresh materialized views'::text,
    'MEDIUM'::text,
    'Consider setting up automated refresh of materialized views for better performance.'::text;

  RETURN;
END;
$$ LANGUAGE plpgsql;
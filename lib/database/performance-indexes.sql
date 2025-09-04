-- Performance optimization indexes for newsletter system
-- This file contains additional indexes for optimal query performance

-- Newsletter Subscribers Performance Indexes
-- ==========================================

-- Composite index for filtering by status and source (common admin query)
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status_source 
ON newsletter_subscribers(status, source) 
WHERE status IN ('active', 'unsubscribed');

-- Index for date-based queries (subscription analytics)
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at_status 
ON newsletter_subscribers(subscribed_at, status) 
WHERE status = 'active';

-- Index for unsubscription analytics
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_unsubscribed_at 
ON newsletter_subscribers(unsubscribed_at) 
WHERE unsubscribed_at IS NOT NULL;

-- Partial index for active subscribers (most common query)
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active 
ON newsletter_subscribers(email, subscribed_at) 
WHERE status = 'active';

-- Index for Brevo sync operations
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_brevo_sync 
ON newsletter_subscribers(brevo_contact_id, last_synced_at) 
WHERE brevo_contact_id IS NOT NULL;

-- Full-text search index for subscriber names and emails
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_search 
ON newsletter_subscribers USING gin(
  to_tsvector('english', 
    COALESCE(first_name, '') || ' ' || 
    COALESCE(last_name, '') || ' ' || 
    email
  )
);

-- Newsletter Campaigns Performance Indexes
-- ========================================

-- Index for campaign status and scheduling
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status_scheduled 
ON newsletter_campaigns(status, scheduled_at) 
WHERE status IN ('scheduled', 'sent');

-- Index for campaign analytics queries
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_sent_at_stats 
ON newsletter_campaigns(sent_at, open_rate, click_rate) 
WHERE sent_at IS NOT NULL;

-- Index for Brevo message tracking
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_brevo_message 
ON newsletter_campaigns(brevo_message_id, last_synced_at) 
WHERE brevo_message_id IS NOT NULL;

-- Social Posts Performance Indexes
-- =================================

-- Composite index for platform and status queries
CREATE INDEX IF NOT EXISTS idx_social_posts_platform_status_scheduled 
ON social_posts(platform, status, scheduled_at);

-- Index for engagement analytics
CREATE INDEX IF NOT EXISTS idx_social_posts_published_engagement 
ON social_posts(published_at, platform) 
WHERE published_at IS NOT NULL AND engagement_metrics IS NOT NULL;

-- Content Analytics Performance Indexes
-- =====================================

-- Composite index for content analytics queries
CREATE INDEX IF NOT EXISTS idx_content_analytics_type_platform_date 
ON content_analytics(content_type, platform, recorded_at);

-- Index for aggregation queries
CREATE INDEX IF NOT EXISTS idx_content_analytics_content_metrics 
ON content_analytics(content_id, content_type, views, likes, shares);

-- AI Content Log Performance Indexes
-- ===================================

-- Index for AI usage analytics
CREATE INDEX IF NOT EXISTS idx_ai_content_log_type_date 
ON ai_content_log(content_type, created_at);

-- Index for token usage tracking
CREATE INDEX IF NOT EXISTS idx_ai_content_log_tokens_date 
ON ai_content_log(tokens_used, created_at) 
WHERE tokens_used IS NOT NULL;

-- Performance Statistics and Monitoring
-- =====================================

-- Create a view for subscriber statistics (cached query)
CREATE OR REPLACE VIEW newsletter_subscriber_stats AS
SELECT 
  status,
  source,
  COUNT(*) as count,
  DATE_TRUNC('day', subscribed_at) as subscription_date
FROM newsletter_subscribers 
GROUP BY status, source, DATE_TRUNC('day', subscribed_at);

-- Create a materialized view for dashboard analytics (refreshed periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS newsletter_dashboard_stats AS
SELECT 
  COUNT(*) FILTER (WHERE status = 'active') as active_subscribers,
  COUNT(*) FILTER (WHERE status = 'unsubscribed') as unsubscribed_count,
  COUNT(*) FILTER (WHERE subscribed_at >= CURRENT_DATE - INTERVAL '30 days') as new_subscribers_30d,
  COUNT(*) FILTER (WHERE unsubscribed_at >= CURRENT_DATE - INTERVAL '30 days') as unsubscribed_30d,
  COUNT(DISTINCT source) as subscription_sources,
  AVG(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as retention_rate
FROM newsletter_subscribers;

-- Index on the materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_dashboard_stats_refresh 
ON newsletter_dashboard_stats ((1));

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_newsletter_stats()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW newsletter_dashboard_stats;
END;
$$ LANGUAGE plpgsql;

-- Cleanup old analytics data (optional - for performance)
-- This function can be called periodically to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_analytics(days_to_keep INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM content_analytics 
  WHERE recorded_at < CURRENT_DATE - INTERVAL '1 day' * days_to_keep;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  DELETE FROM ai_content_log 
  WHERE created_at < CURRENT_DATE - INTERVAL '1 day' * days_to_keep;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Performance monitoring queries
-- ==============================

-- Query to check index usage
CREATE OR REPLACE VIEW index_usage_stats AS
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_tup_read,
  idx_tup_fetch,
  idx_scan
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Query to check table sizes
CREATE OR REPLACE VIEW table_size_stats AS
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(tablename::regclass)) as total_size,
  pg_size_pretty(pg_relation_size(tablename::regclass)) as table_size,
  pg_size_pretty(pg_total_relation_size(tablename::regclass) - pg_relation_size(tablename::regclass)) as index_size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(tablename::regclass) DESC;
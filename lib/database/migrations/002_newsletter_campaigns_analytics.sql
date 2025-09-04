-- Add analytics column to newsletter_campaigns table for tracking subscriber sources and campaign performance

-- Add analytics column to store campaign analytics data
ALTER TABLE newsletter_campaigns 
ADD COLUMN IF NOT EXISTS analytics JSONB;

-- Create index for analytics queries
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_analytics 
ON newsletter_campaigns USING GIN (analytics);

-- Add comment to explain the analytics column structure
COMMENT ON COLUMN newsletter_campaigns.analytics IS 'JSON object containing campaign analytics data including recipientsBySource, sentAt, totalRecipients, and other metrics';
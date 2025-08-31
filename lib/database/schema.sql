-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Social Media Posts Table
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('linkedin', 'twitter')),
  content TEXT NOT NULL,
  media_urls TEXT[],
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  engagement_metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[]
);

-- Newsletter Campaigns Table
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  template_id VARCHAR(100),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')),
  recipient_count INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2),
  click_rate DECIMAL(5,2),
  brevo_message_id VARCHAR(255),
  brevo_stats JSONB,
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Analytics Table
CREATE TABLE IF NOT EXISTS content_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('blog', 'social', 'newsletter')),
  content_id VARCHAR(255) NOT NULL,
  platform VARCHAR(20),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Generated Content Log Table
CREATE TABLE IF NOT EXISTS ai_content_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt TEXT NOT NULL,
  generated_content TEXT NOT NULL,
  content_type VARCHAR(20) NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled_at ON social_posts(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_campaigns_status ON newsletter_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_content_analytics_content_type ON content_analytics(content_type);
CREATE INDEX IF NOT EXISTS idx_content_analytics_content_id ON content_analytics(content_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for social_posts updated_at
CREATE TRIGGER update_social_posts_updated_at 
    BEFORE UPDATE ON social_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_content_log ENABLE ROW LEVEL SECURITY;

-- Create policies (these will be restrictive by default, admin access will use service role)
CREATE POLICY "Enable read access for authenticated users" ON social_posts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for service role" ON social_posts
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for authenticated users" ON newsletter_subscribers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for service role" ON newsletter_subscribers
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for authenticated users" ON newsletter_campaigns
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for service role" ON newsletter_campaigns
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for authenticated users" ON content_analytics
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for service role" ON content_analytics
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for authenticated users" ON ai_content_log
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for service role" ON ai_content_log
    FOR ALL USING (auth.role() = 'service_role');
-- Automation Rules and Content Templates Schema

-- Content Templates Table
CREATE TABLE IF NOT EXISTS content_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_type VARCHAR(50) NOT NULL CHECK (template_type IN ('blog', 'social', 'newsletter')),
  platform VARCHAR(20) CHECK (platform IN ('linkedin', 'twitter', 'all')),
  content_template TEXT NOT NULL,
  variables JSONB DEFAULT '[]', -- Array of variable names that can be replaced
  metadata JSONB DEFAULT '{}', -- Additional template metadata
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation Rules Table
CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  rule_type VARCHAR(50) NOT NULL CHECK (rule_type IN ('content_generation', 'scheduling', 'cross_promotion', 'optimization')),
  trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('blog_published', 'time_based', 'engagement_threshold', 'manual')),
  trigger_conditions JSONB NOT NULL DEFAULT '{}',
  actions JSONB NOT NULL DEFAULT '[]',
  template_id UUID REFERENCES content_templates(id),
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0, -- Higher number = higher priority
  last_executed TIMESTAMP WITH TIME ZONE,
  execution_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automation Executions Log Table
CREATE TABLE IF NOT EXISTS automation_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES automation_rules(id),
  trigger_data JSONB,
  execution_status VARCHAR(20) DEFAULT 'pending' CHECK (execution_status IN ('pending', 'running', 'completed', 'failed')),
  result_data JSONB,
  error_message TEXT,
  execution_time_ms INTEGER,
  created_content_ids TEXT[], -- Array of content IDs created by this execution
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optimal Posting Times Table (for analytics-based suggestions)
CREATE TABLE IF NOT EXISTS optimal_posting_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('linkedin', 'twitter')),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday
  hour_of_day INTEGER NOT NULL CHECK (hour_of_day BETWEEN 0 AND 23),
  engagement_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  sample_size INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(platform, day_of_week, hour_of_day)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_templates_type ON content_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_content_templates_platform ON content_templates(platform);
CREATE INDEX IF NOT EXISTS idx_content_templates_active ON content_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_automation_rules_type ON automation_rules(rule_type);
CREATE INDEX IF NOT EXISTS idx_automation_rules_trigger ON automation_rules(trigger_type);
CREATE INDEX IF NOT EXISTS idx_automation_rules_active ON automation_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_automation_rules_priority ON automation_rules(priority DESC);

CREATE INDEX IF NOT EXISTS idx_automation_executions_rule ON automation_executions(rule_id);
CREATE INDEX IF NOT EXISTS idx_automation_executions_status ON automation_executions(execution_status);
CREATE INDEX IF NOT EXISTS idx_automation_executions_executed_at ON automation_executions(executed_at);

CREATE INDEX IF NOT EXISTS idx_optimal_posting_times_platform ON optimal_posting_times(platform);
CREATE INDEX IF NOT EXISTS idx_optimal_posting_times_score ON optimal_posting_times(engagement_score DESC);

-- Create updated_at triggers
CREATE TRIGGER update_content_templates_updated_at 
    BEFORE UPDATE ON content_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_rules_updated_at 
    BEFORE UPDATE ON automation_rules 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE optimal_posting_times ENABLE ROW LEVEL SECURITY;

-- Create policies for service role access
CREATE POLICY "Enable all access for service role" ON content_templates
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON automation_rules
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON automation_executions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable all access for service role" ON optimal_posting_times
    FOR ALL USING (auth.role() = 'service_role');

-- Insert some default content templates
INSERT INTO content_templates (name, description, template_type, platform, content_template, variables) VALUES
(
  'Blog to LinkedIn Post',
  'Convert blog post to LinkedIn professional post',
  'social',
  'linkedin',
  '🚀 New blog post: {{title}}

{{summary}}

Key insights:
{{key_points}}

Read the full article: {{url}}

#{{hashtags}}',
  '["title", "summary", "key_points", "url", "hashtags"]'
),
(
  'Blog to Twitter Thread',
  'Convert blog post to Twitter thread',
  'social',
  'twitter',
  '🧵 Thread: {{title}}

1/{{thread_count}} {{summary}}

{{thread_content}}

Full article: {{url}}

#{{hashtags}}',
  '["title", "summary", "thread_content", "thread_count", "url", "hashtags"]'
),
(
  'Newsletter Welcome Email',
  'Welcome email for new newsletter subscribers',
  'newsletter',
  'all',
  'Welcome to our newsletter, {{first_name}}!

Thank you for subscribing. You''ll receive:
- Weekly industry insights
- Exclusive content and tips
- Early access to new resources

Best regards,
The Team',
  '["first_name"]'
),
(
  'Weekly Newsletter Template',
  'Standard weekly newsletter format',
  'newsletter',
  'all',
  'Weekly Update - {{week_date}}

Hi {{first_name}},

This week''s highlights:

📝 Latest Blog Posts:
{{blog_posts}}

📱 Social Media Highlights:
{{social_highlights}}

📊 Industry News:
{{industry_news}}

Best regards,
The Team',
  '["week_date", "first_name", "blog_posts", "social_highlights", "industry_news"]'
);

-- Insert some default automation rules
INSERT INTO automation_rules (name, description, rule_type, trigger_type, trigger_conditions, actions, priority) VALUES
(
  'Auto-generate social posts from blog',
  'Automatically create LinkedIn and Twitter posts when a blog is published',
  'content_generation',
  'blog_published',
  '{"blog_categories": ["all"], "auto_publish": false}',
  '[
    {
      "type": "generate_social_post",
      "platform": "linkedin",
      "template_id": null,
      "schedule_delay_hours": 1
    },
    {
      "type": "generate_social_post", 
      "platform": "twitter",
      "template_id": null,
      "schedule_delay_hours": 2
    }
  ]',
  10
),
(
  'Optimal timing scheduler',
  'Schedule posts at optimal times based on analytics',
  'scheduling',
  'manual',
  '{"platforms": ["linkedin", "twitter"]}',
  '[
    {
      "type": "optimize_posting_time",
      "look_ahead_days": 7,
      "min_engagement_score": 80
    }
  ]',
  5
),
(
  'Weekly newsletter automation',
  'Generate and send weekly newsletter with content roundup',
  'content_generation',
  'time_based',
  '{"schedule": "weekly", "day": "monday", "hour": 9}',
  '[
    {
      "type": "generate_newsletter",
      "template_id": null,
      "include_blog_posts": true,
      "include_social_highlights": true,
      "auto_send": false
    }
  ]',
  8
);
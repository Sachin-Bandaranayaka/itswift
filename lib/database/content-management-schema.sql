-- Content Management System Database Schema
-- This schema supports dynamic content management for all website sections

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Content Types Table
-- Defines different types of content (hero, stats, faq, etc.)
CREATE TABLE IF NOT EXISTS content_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  schema_definition JSONB, -- JSON schema for validation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Sections Table
-- Represents different sections of the website
CREATE TABLE IF NOT EXISTS content_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  page_path VARCHAR(255) NOT NULL, -- e.g., '/', '/about-us', '/contact'
  section_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  content_type_id UUID REFERENCES content_types(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Items Table
-- Stores the actual content data
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES content_sections(id) ON DELETE CASCADE,
  key VARCHAR(100) NOT NULL, -- unique identifier within section
  title VARCHAR(255),
  content JSONB NOT NULL, -- flexible content storage
  metadata JSONB, -- SEO metadata, images, etc.
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section_id, key)
);

-- Content Versions Table
-- Tracks content changes for versioning and rollback
CREATE TABLE IF NOT EXISTS content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content JSONB NOT NULL,
  metadata JSONB,
  change_summary TEXT,
  created_by VARCHAR(100), -- admin username
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_item_id, version_number)
);

-- SEO Settings Table
-- Manages SEO metadata for pages
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255),
  description TEXT,
  keywords TEXT[],
  og_title VARCHAR(255),
  og_description TEXT,
  og_image VARCHAR(500),
  twitter_title VARCHAR(255),
  twitter_description TEXT,
  twitter_image VARCHAR(500),
  canonical_url VARCHAR(500),
  robots VARCHAR(100) DEFAULT 'index,follow',
  structured_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Cache Table
-- Caches rendered content for performance
CREATE TABLE IF NOT EXISTS content_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key VARCHAR(255) UNIQUE NOT NULL,
  content JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_sections_page_path ON content_sections(page_path);
CREATE INDEX IF NOT EXISTS idx_content_sections_active ON content_sections(is_active);
CREATE INDEX IF NOT EXISTS idx_content_items_section_id ON content_items(section_id);
CREATE INDEX IF NOT EXISTS idx_content_items_active ON content_items(is_active);
CREATE INDEX IF NOT EXISTS idx_content_items_order ON content_items(display_order);
CREATE INDEX IF NOT EXISTS idx_content_versions_item_id ON content_versions(content_item_id);
CREATE INDEX IF NOT EXISTS idx_content_versions_version ON content_versions(version_number);
CREATE INDEX IF NOT EXISTS idx_seo_settings_page_path ON seo_settings(page_path);
CREATE INDEX IF NOT EXISTS idx_content_cache_key ON content_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_content_cache_expires ON content_cache(expires_at);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_content_types_updated_at 
  BEFORE UPDATE ON content_types 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_sections_updated_at 
  BEFORE UPDATE ON content_sections 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_items_updated_at 
  BEFORE UPDATE ON content_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_settings_updated_at 
  BEFORE UPDATE ON seo_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create version tracking trigger
CREATE OR REPLACE FUNCTION create_content_version()
RETURNS TRIGGER AS $$
BEGIN
    -- Only create version if content actually changed
    IF OLD.content IS DISTINCT FROM NEW.content OR OLD.metadata IS DISTINCT FROM NEW.metadata THEN
        INSERT INTO content_versions (
            content_item_id,
            version_number,
            content,
            metadata,
            change_summary,
            created_by
        ) VALUES (
            NEW.id,
            NEW.version,
            OLD.content,
            OLD.metadata,
            'Auto-saved version',
            'system'
        );
        
        -- Increment version number
        NEW.version = NEW.version + 1;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_content_version_trigger
  BEFORE UPDATE ON content_items
  FOR EACH ROW EXECUTE FUNCTION create_content_version();

-- Row Level Security (RLS) Policies
ALTER TABLE content_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_cache ENABLE ROW LEVEL SECURITY;

-- Public read access for active content
CREATE POLICY "Public can read active content types" ON content_types
  FOR SELECT USING (true);

CREATE POLICY "Public can read active content sections" ON content_sections
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active content items" ON content_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read seo settings" ON seo_settings
  FOR SELECT USING (true);

CREATE POLICY "Public can read content cache" ON content_cache
  FOR SELECT USING (expires_at > NOW() OR expires_at IS NULL);

-- Admin access (service role) for all operations
CREATE POLICY "Service role can manage content types" ON content_types
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage content sections" ON content_sections
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage content items" ON content_items
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage content versions" ON content_versions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage seo settings" ON seo_settings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage content cache" ON content_cache
  FOR ALL USING (auth.role() = 'service_role');
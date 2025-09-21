-- Blog System Database Migration
-- Run this in your Supabase SQL Editor

-- 1. Create blog_authors table
CREATE TABLE IF NOT EXISTS blog_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  social_links JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color for category
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  author_id UUID REFERENCES blog_authors(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  reading_time INTEGER DEFAULT 0, -- in minutes
  view_count INTEGER DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  meta_keywords TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create blog_post_categories junction table (many-to-many)
CREATE TABLE IF NOT EXISTS blog_post_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, category_id)
);

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_authors_slug ON blog_authors(slug);
CREATE INDEX IF NOT EXISTS idx_blog_authors_active ON blog_authors(is_active);

CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_categories_active ON blog_categories(is_active);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured);

CREATE INDEX IF NOT EXISTS idx_blog_post_categories_post ON blog_post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_categories_category ON blog_post_categories(category_id);

-- 6. Enable Row Level Security
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies

-- Authors policies
CREATE POLICY "Public read access for active blog authors" ON blog_authors
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access for blog authors" ON blog_authors
  FOR ALL USING (true);

-- Categories policies
CREATE POLICY "Public read access for active blog categories" ON blog_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access for blog categories" ON blog_categories
  FOR ALL USING (true);

-- Posts policies
CREATE POLICY "Public read access for published blog posts" ON blog_posts
  FOR SELECT USING (status = 'published' AND published_at <= now());

CREATE POLICY "Admin full access for blog posts" ON blog_posts
  FOR ALL USING (true);

-- Post categories policies
CREATE POLICY "Public read access for blog post categories" ON blog_post_categories
  FOR SELECT USING (true);

CREATE POLICY "Admin full access for blog post categories" ON blog_post_categories
  FOR ALL USING (true);

-- 8. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Create triggers for updated_at
CREATE TRIGGER update_blog_authors_updated_at BEFORE UPDATE ON blog_authors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON blog_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 10. Insert some sample data
INSERT INTO blog_authors (name, slug, email, bio) VALUES
  ('Admin User', 'admin-user', 'admin@itswift.com', 'Main blog author and content creator.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_categories (name, slug, description, color) VALUES
  ('Technology', 'technology', 'Posts about latest technology trends', '#3B82F6'),
  ('Business', 'business', 'Business insights and strategies', '#10B981'),
  ('Design', 'design', 'UI/UX and design related content', '#F59E0B'),
  ('Development', 'development', 'Software development tutorials and tips', '#EF4444')
ON CONFLICT (slug) DO NOTHING;
-- Migration: Add category_id column to blog_posts table
-- This fixes the 500 error when creating blog posts by adding the missing category_id foreign key

-- Add category_id column to blog_posts table
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES blog_categories(id);

-- Create index for better performance on category lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON blog_posts(category_id);

-- Add comment for documentation
COMMENT ON COLUMN blog_posts.category_id IS 'Foreign key reference to blog_categories table';
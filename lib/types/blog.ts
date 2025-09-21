// Blog Types for Supabase-based Blog System

export interface BlogAuthor {
  id: string
  name: string
  slug: string
  bio?: string
  avatar_url?: string
  email?: string
  social_links?: {
    twitter?: string
    linkedin?: string
    github?: string
    website?: string
  }
  created_at: string
  updated_at: string
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image_url?: string
  author_id: string
  category_id?: string
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  view_count: number
  published_at?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  created_at: string
  updated_at: string
}

// Extended types with relationships
export interface BlogPostWithAuthor extends BlogPost {
  author: BlogAuthor
}

export interface BlogPostWithCategory extends BlogPost {
  category?: BlogCategory
}

export interface BlogPostWithDetails extends BlogPost {
  author: BlogAuthor
  category?: BlogCategory
}

// API Response types
export interface BlogPostsResponse {
  posts: BlogPost[] | BlogPostWithDetails[]
  total: number
  page?: number
  limit?: number
  totalPages?: number
}

export interface BlogCategoriesResponse {
  categories: BlogCategory[]
  total: number
}

export interface BlogAuthorsResponse {
  authors: BlogAuthor[]
  total: number
}

// Filter types
export interface BlogPostFilters {
  status?: BlogPost['status']
  category_id?: string
  author_id?: string
  is_featured?: boolean
  search?: string
  date_from?: string
  date_to?: string
}

// Legacy alias for backward compatibility
export interface BlogFilters extends BlogPostFilters {}

// Form data types
export interface BlogPostFormData {
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image_url?: string
  author_id: string
  category_id?: string
  status: BlogPost['status']
  is_featured: boolean
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
}

export interface BlogCategoryFormData {
  name: string
  slug: string
  description?: string
  color?: string
}

export interface BlogAuthorFormData {
  name: string
  slug: string
  bio?: string
  avatar_url?: string
  email?: string
  social_links?: BlogAuthor['social_links']
}

// Analytics types
export interface BlogAnalytics {
  total_posts: number
  published_posts: number
  draft_posts: number
  total_views: number
  popular_posts: BlogPostWithDetails[]
  recent_posts: BlogPostWithDetails[]
}

export interface BlogStats {
  total_posts: number
  total_categories: number
  total_authors: number
  published_posts: number
  draft_posts: number
}

// Search types
export interface BlogSearchResult {
  posts: BlogPostWithDetails[]
  total: number
  query: string
  filters: BlogPostFilters
}
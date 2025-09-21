import { getSupabase, Database } from '@/lib/supabase'
import { BlogMockService } from './blog-mock-service'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image_url?: string
  author_id: string
  category_id: string
  status: 'draft' | 'published' | 'archived'
  is_featured: boolean
  view_count: number
  published_at?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  created_at: string
  updated_at: string
  author?: BlogAuthor
  category?: BlogCategory
}

export interface BlogAuthor {
  id: string
  name: string
  slug: string
  bio?: string
  avatar_url?: string
  email: string
  social_links?: Record<string, string>
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

export interface BlogPostFilters {
  category?: string
  author?: string
  status?: 'draft' | 'published' | 'archived'
  featured?: boolean
  search?: string
}

export interface PaginationOptions {
  page?: number
  limit?: number
}

export class BlogSupabaseService {
  private mockService = new BlogMockService()
  private useMockData = false // Database tables are now created and ready to use
  private _supabase: ReturnType<typeof getSupabase> | null = null

  private get supabase() {
    if (!this._supabase) {
      this._supabase = getSupabase()
    }
    return this._supabase
  }

  async getPosts(filters: BlogPostFilters = {}, pagination: PaginationOptions = {}): Promise<{
    posts: BlogPost[]
    total: number
    hasMore: boolean
  }> {
    if (this.useMockData) {
      return this.mockService.getPosts(filters, pagination)
    }

    const { page = 1, limit = 10 } = pagination
    const offset = (page - 1) * limit

    let query = this.supabase
      .from('blog_posts')
      .select(`
        *,
        author:blog_authors(*),
        category:blog_categories(*)
      `)

    // Apply filters
    if (filters.category) {
      query = query.eq('category_id', filters.category)
    }
    if (filters.author) {
      query = query.eq('author_id', filters.author)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.featured !== undefined) {
      query = query.eq('is_featured', filters.featured)
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
    }

    // Get total count
    const { count } = await this.supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })

    // Get paginated results
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return {
      posts: data || [],
      total: count || 0,
      hasMore: (count || 0) > offset + limit
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    if (this.useMockData) {
      return this.mockService.getPostBySlug(slug)
    }

    const { data, error } = await this.supabase
      .from('blog_posts')
      .select(`
        *,
        author:blog_authors(*),
        category:blog_categories(*)
      `)
      .eq('slug', slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null // Not found
      throw error
    }

    return data
  }

  async getCategories(): Promise<BlogCategory[]> {
    if (this.useMockData) {
      return this.mockService.getCategories()
    }

    const { data, error } = await this.supabase
      .from('blog_categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  }

  async getAuthors(): Promise<BlogAuthor[]> {
    if (this.useMockData) {
      return this.mockService.getAuthors()
    }

    const { data, error } = await this.supabase
      .from('blog_authors')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  }

  async getFeaturedPosts(limit = 3): Promise<BlogPost[]> {
    if (this.useMockData) {
      return this.mockService.getFeaturedPosts(limit)
    }

    const { data, error } = await this.supabase
      .from('blog_posts')
      .select(`
        *,
        author:blog_authors(*),
        category:blog_categories(*)
      `)
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  async getRecentPosts(limit = 5): Promise<BlogPost[]> {
    if (this.useMockData) {
      return this.mockService.getRecentPosts(limit)
    }

    const { data, error } = await this.supabase
      .from('blog_posts')
      .select(`
        *,
        author:blog_authors(*),
        category:blog_categories(*)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  async searchPosts(query: string, limit = 10): Promise<BlogPost[]> {
    if (this.useMockData) {
      return this.mockService.searchPosts(query, limit)
    }

    const { data, error } = await this.supabase
      .from('blog_posts')
      .select(`
        *,
        author:blog_authors(*),
        category:blog_categories(*)
      `)
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  async incrementViews(postId: string): Promise<void> {
    if (this.useMockData) {
      return this.mockService.incrementViews(postId)
    }

    // Get current view_count
    const { data: post, error: fetchError } = await this.supabase
      .from('blog_posts')
      .select('view_count')
      .eq('id', postId)
      .single()

    if (fetchError) throw fetchError

    // Update with incremented view_count
    const { error } = await this.supabase
      .from('blog_posts')
      .update({ view_count: (post?.view_count || 0) + 1 })
      .eq('id', postId)

    if (error) throw error
  }
}
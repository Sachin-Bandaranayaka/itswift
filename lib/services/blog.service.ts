import { getSupabase } from '@/lib/supabase'
import type { 
  BlogPost, 
  BlogAuthor, 
  BlogCategory, 
  BlogPostsResponse,
  BlogPostFilters,
  BlogPostFormData,
  BlogCategoryFormData,
  BlogAuthorFormData,
  BlogAnalytics,
  BlogPostWithDetails,
  BlogStats
} from '@/lib/types/blog'

export class BlogService {
  private async getClient() {
    return getSupabase()
  }

  // Posts methods
  async getPosts(filters?: BlogPostFilters, page = 1, limit = 10): Promise<BlogPostsResponse> {
    const supabase = await this.getClient()
    const offset = (page - 1) * limit

    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        author:blog_authors(*),
        category:blog_categories(*)
      `, { count: 'exact' })

    // Apply filters
    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.category_id) {
      query = query.eq('category_id', filters.category_id)
    }
    if (filters?.author_id) {
      query = query.eq('author_id', filters.author_id)
    }
    if (filters?.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured)
    }
    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
    }
    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from)
    }
    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    const totalPages = Math.ceil((count || 0) / limit)

    return {
      posts: (data || []) as BlogPostWithDetails[],
      total: count || 0,
      page,
      limit,
      totalPages
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPostWithDetails | null> {
    const supabase = await this.getClient()
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:blog_authors(*),
        category:blog_categories(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !data) return null
    return data as BlogPostWithDetails
  }

  async getPostById(id: string): Promise<BlogPostWithDetails | null> {
    const supabase = await this.getClient()
    
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:blog_authors(*),
        category:blog_categories(*)
      `)
      .eq('id', id)
      .single()

    if (error || !data) return null
    return data as BlogPostWithDetails
  }

  async createPost(postData: BlogPostFormData): Promise<BlogPost> {
    const supabase = await this.getClient()
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([postData])
      .select()
      .single()

    if (error) throw error
    return data as BlogPost
  }

  async updatePost(id: string, postData: Partial<BlogPostFormData>): Promise<BlogPost | null> {
    const supabase = await this.getClient()
    
    const updateData = {
      ...postData,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error || !data) return null
    return data as BlogPost
  }

  async deletePost(id: string): Promise<boolean> {
    const supabase = await this.getClient()
    
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    return !error
  }

  // Categories methods
  async getCategories(): Promise<BlogCategory[]> {
    const supabase = await this.getClient()
    
    const { data, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  }

  async createCategory(categoryData: BlogCategoryFormData): Promise<BlogCategory> {
    const supabase = await this.getClient()
    
    const { data, error } = await supabase
      .from('blog_categories')
      .insert([categoryData])
      .select()
      .single()

    if (error) throw error
    return data as BlogCategory
  }

  async updateCategory(id: string, categoryData: Partial<BlogCategoryFormData>): Promise<BlogCategory | null> {
    const supabase = await this.getClient()
    
    const { data, error } = await supabase
      .from('blog_categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single()

    if (error || !data) return null
    return data as BlogCategory
  }

  async deleteCategory(id: string): Promise<boolean> {
    const supabase = await this.getClient()
    
    const { error } = await supabase
      .from('blog_categories')
      .delete()
      .eq('id', id)

    return !error
  }

  // Authors methods
  async getAuthors(): Promise<BlogAuthor[]> {
    const supabase = await this.getClient()
    
    const { data, error } = await supabase
      .from('blog_authors')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  }

  async createAuthor(authorData: BlogAuthorFormData): Promise<BlogAuthor> {
    const supabase = await this.getClient()
    
    const { data, error } = await supabase
      .from('blog_authors')
      .insert([authorData])
      .select()
      .single()

    if (error) throw error
    return data as BlogAuthor
  }

  async updateAuthor(id: string, authorData: Partial<BlogAuthorFormData>): Promise<BlogAuthor | null> {
    const supabase = await this.getClient()
    
    const { data, error } = await supabase
      .from('blog_authors')
      .update(authorData)
      .eq('id', id)
      .select()
      .single()

    if (error || !data) return null
    return data as BlogAuthor
  }

  async deleteAuthor(id: string): Promise<boolean> {
    const supabase = await this.getClient()
    
    const { error } = await supabase
      .from('blog_authors')
      .delete()
      .eq('id', id)

    return !error
  }

  // Analytics and stats
  async getAnalytics(): Promise<BlogAnalytics> {
    const supabase = await this.getClient()
    
    const [
      totalCount,
      publishedCount,
      draftCount,
      popularPosts,
      recentPosts
    ] = await Promise.all([
      supabase.from('blog_posts').select('id', { count: 'exact' }),
      supabase.from('blog_posts').select('id', { count: 'exact' }).eq('status', 'published'),
      supabase.from('blog_posts').select('id', { count: 'exact' }).eq('status', 'draft'),
      supabase.from('blog_posts')
        .select(`
          *,
          author:blog_authors(*),
          category:blog_categories(*)
        `)
        .eq('status', 'published')
        .order('view_count', { ascending: false })
        .limit(5),
      supabase.from('blog_posts')
        .select(`
          *,
          author:blog_authors(*),
          category:blog_categories(*)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(5)
    ])

    const totalViews = 0 // This would need to be calculated from view_count

    return {
      total_posts: totalCount.count || 0,
      published_posts: publishedCount.count || 0,
      draft_posts: draftCount.count || 0,
      total_views: totalViews,
      popular_posts: (popularPosts.data || []) as BlogPostWithDetails[],
      recent_posts: (recentPosts.data || []) as BlogPostWithDetails[]
    }
  }

  async getStats(): Promise<BlogStats> {
    const supabase = await this.getClient()
    
    const [postsResult, categoriesResult, authorsResult] = await Promise.all([
      supabase.from('blog_posts').select('id', { count: 'exact' }),
      supabase.from('blog_categories').select('id', { count: 'exact' }),
      supabase.from('blog_authors').select('id', { count: 'exact' })
    ])

    return {
      total_posts: postsResult.count || 0,
      total_categories: categoriesResult.count || 0,
      total_authors: authorsResult.count || 0,
      published_posts: 0, // Will be calculated separately
      draft_posts: 0 // Will be calculated separately
    }
  }
}

export const blogService = new BlogService()
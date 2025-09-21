import { BlogService } from '@/lib/services/blog.service';
import { ExternalServiceError, withRetry } from '@/lib/utils/error-handler';

export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  author?: { name: string; image?: any };
  mainImage?: { asset: { url: string }; alt?: string };
  categories?: Array<{ title: string }>;
  publishedAt?: string;
  excerpt?: string;
  _createdAt: string;
  _updatedAt: string;
}

export interface BlogPostFilters {
  status?: 'published' | 'scheduled' | 'draft';
  category?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'publishedAt' | 'title' | '_createdAt';
  order?: 'asc' | 'desc';
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  postsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface BlogPageData {
  posts: BlogPost[];
  pagination: PaginationInfo;
}

export class BlogPublicDataService {
  private static readonly DEFAULT_POSTS_PER_PAGE = 9;
  private static blogService = new BlogService();

  /**
   * Get a single blog post by slug
   */
  static async getPostBySlug(slug: string): Promise<any | null> {
    try {
      // TODO: Implement with Supabase
      // For now, return null
      return null;
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      throw new ExternalServiceError('Failed to fetch blog post', 'BLOG_FETCH_ERROR');
    }
  }

  /**
   * Get all published blog posts
   */
  static async getAllPublishedPosts(): Promise<BlogPost[]> {
    try {
      // TODO: Implement with Supabase
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error fetching all published posts:', error);
      throw new ExternalServiceError('Failed to fetch published posts', 'BLOG_FETCH_ERROR');
    }
  }

  /**
   * Get paginated published blog posts
   */
  static async getPaginatedPublishedPosts(
    page: number = 1,
    postsPerPage: number = this.DEFAULT_POSTS_PER_PAGE
  ): Promise<BlogPageData> {
    try {
      // TODO: Implement with Supabase
      // For now, return empty pagination data
      return {
        posts: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalPosts: 0,
          postsPerPage,
          hasNext: false,
          hasPrev: false
        }
      };
    } catch (error) {
      console.error('Error fetching paginated posts:', error);
      throw new ExternalServiceError('Failed to fetch paginated posts', 'BLOG_FETCH_ERROR');
    }
  }

  /**
   * Get sorted published blog posts
   */
  static async getSortedPublishedPosts(
    sortBy: 'publishedAt' | 'title' = 'publishedAt',
    order: 'asc' | 'desc' = 'desc'
  ): Promise<BlogPost[]> {
    try {
      // TODO: Implement with Supabase
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error fetching sorted posts:', error);
      throw new ExternalServiceError('Failed to fetch sorted posts', 'BLOG_FETCH_ERROR');
    }
  }

  /**
   * Get blog posts by category
   */
  static async getPostsByCategory(categoryTitle: string): Promise<BlogPost[]> {
    try {
      // TODO: Implement with Supabase
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      throw new ExternalServiceError('Failed to fetch posts by category', 'BLOG_FETCH_ERROR');
    }
  }

  /**
   * Search blog posts
   */
  static async searchPosts(query: string): Promise<BlogPost[]> {
    try {
      // TODO: Implement with Supabase
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error searching posts:', error);
      throw new ExternalServiceError('Failed to search posts', 'BLOG_SEARCH_ERROR');
    }
  }

  /**
   * Get available categories
   */
  static async getAvailableCategories(): Promise<string[]> {
    try {
      // TODO: Implement with Supabase
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new ExternalServiceError('Failed to fetch categories', 'BLOG_FETCH_ERROR');
    }
  }

  /**
   * Get filtered blog posts
   */
  static async getFilteredPosts(filters: BlogPostFilters): Promise<BlogPost[]> {
    try {
      // TODO: Implement with Supabase
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Error fetching filtered posts:', error);
      throw new ExternalServiceError('Failed to fetch filtered posts', 'BLOG_FETCH_ERROR');
    }
  }

  /**
   * Check if a post is published
   */
  static isPostPublished(post: BlogPost): boolean {
    if (!post.publishedAt) return false;
    const publishedDate = new Date(post.publishedAt);
    const now = new Date();
    return publishedDate <= now;
  }

  /**
   * Get filtered and paginated blog posts
   */
  static async getFilteredPaginatedPosts(
    filters: BlogPostFilters,
    page: number = 1,
    postsPerPage: number = this.DEFAULT_POSTS_PER_PAGE
  ): Promise<BlogPageData> {
    try {
      // TODO: Implement with Supabase
      // For now, return empty pagination data
      return {
        posts: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalPosts: 0,
          postsPerPage,
          hasNext: false,
          hasPrev: false
        }
      };
    } catch (error) {
      console.error('Error fetching filtered paginated posts:', error);
      throw new ExternalServiceError('Failed to fetch filtered paginated posts', 'BLOG_FETCH_ERROR');
    }
  }

  /**
   * Get paginated posts (alias for getFilteredPaginatedPosts)
   */
  static async getPaginatedPosts(
    filters: BlogPostFilters,
    page: number = 1,
    postsPerPage: number = this.DEFAULT_POSTS_PER_PAGE
  ): Promise<BlogPageData> {
    return this.getFilteredPaginatedPosts(filters, page, postsPerPage);
  }
}
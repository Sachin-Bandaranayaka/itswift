import { client } from '@/lib/sanity.client';
import { 
  publishedPostsQuery, 
  paginatedPublishedPostsQuery, 
  publishedPostsCountQuery 
} from '@/lib/queries';
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

  /**
   * Fetch all published blog posts
   */
  static async getAllPublishedPosts(): Promise<BlogPost[]> {
    try {
      const posts = await withRetry(
        () => client.fetch(publishedPostsQuery),
        3,
        1000
      );
      return posts || [];
    } catch (error) {
      console.error('Error fetching published posts:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('fetch') || error.message.includes('network')) {
          throw new ExternalServiceError(
            'Unable to connect to content management system',
            'Sanity CMS',
            { originalError: error.message }
          );
        }
        
        if (error.message.includes('timeout')) {
          throw new ExternalServiceError(
            'Content loading timed out',
            'Sanity CMS',
            { originalError: error.message }
          );
        }
      }
      
      throw new ExternalServiceError(
        'Failed to fetch blog posts from content management system',
        'Sanity CMS',
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Fetch paginated published blog posts
   */
  static async getPaginatedPublishedPosts(
    page: number = 1,
    postsPerPage: number = this.DEFAULT_POSTS_PER_PAGE
  ): Promise<BlogPageData> {
    try {
      // Validate pagination parameters
      if (page < 1) {
        throw new Error('Page number must be greater than 0');
      }
      
      if (postsPerPage < 1 || postsPerPage > 100) {
        throw new Error('Posts per page must be between 1 and 100');
      }

      // Calculate pagination parameters
      const start = (page - 1) * postsPerPage;
      const end = start + postsPerPage;

      // Fetch posts and total count in parallel with retry
      const [posts, totalPosts] = await Promise.all([
        withRetry(
          () => client.fetch(paginatedPublishedPostsQuery, { start, end }),
          3,
          1000
        ),
        withRetry(
          () => client.fetch(publishedPostsCountQuery),
          3,
          1000
        )
      ]);

      // Calculate pagination info
      const totalPages = Math.ceil((totalPosts || 0) / postsPerPage);
      const pagination: PaginationInfo = {
        currentPage: page,
        totalPages,
        totalPosts: totalPosts || 0,
        postsPerPage,
        hasNext: page < totalPages,
        hasPrev: page > 1
      };

      return {
        posts: posts || [],
        pagination
      };
    } catch (error) {
      console.error('Error fetching paginated posts:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Page number') || error.message.includes('Posts per page')) {
          throw error; // Re-throw validation errors as-is
        }
        
        if (error.message.includes('fetch') || error.message.includes('network')) {
          throw new ExternalServiceError(
            'Unable to connect to content management system',
            'Sanity CMS',
            { originalError: error.message }
          );
        }
      }
      
      throw new ExternalServiceError(
        'Failed to fetch paginated blog posts',
        'Sanity CMS',
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Get posts sorted by different criteria
   */
  static async getSortedPublishedPosts(
    sortBy: 'publishedAt' | 'title' = 'publishedAt',
    order: 'asc' | 'desc' = 'desc'
  ): Promise<BlogPost[]> {
    try {
      const posts = await this.getAllPublishedPosts();
      
      return posts.sort((a, b) => {
        let comparison = 0;
        
        if (sortBy === 'publishedAt') {
          const dateA = new Date(a.publishedAt || a._createdAt);
          const dateB = new Date(b.publishedAt || b._createdAt);
          comparison = dateA.getTime() - dateB.getTime();
        } else if (sortBy === 'title') {
          comparison = a.title.localeCompare(b.title);
        }
        
        return order === 'desc' ? -comparison : comparison;
      });
    } catch (error) {
      console.error('Error fetching sorted posts:', error);
      throw new Error('Failed to fetch sorted blog posts');
    }
  }

  /**
   * Filter posts by category
   */
  static async getPostsByCategory(categoryTitle: string): Promise<BlogPost[]> {
    try {
      const posts = await this.getAllPublishedPosts();
      return posts.filter(post => 
        post.categories?.some(category => 
          category.title.toLowerCase() === categoryTitle.toLowerCase()
        )
      );
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      throw new Error('Failed to fetch posts by category');
    }
  }

  /**
   * Search posts by title or excerpt
   */
  static async searchPosts(query: string): Promise<BlogPost[]> {
    try {
      const posts = await this.getAllPublishedPosts();
      const searchTerm = query.toLowerCase();
      
      return posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm))
      );
    } catch (error) {
      console.error('Error searching posts:', error);
      throw new Error('Failed to search blog posts');
    }
  }

  /**
   * Get unique categories from all published posts
   */
  static async getAvailableCategories(): Promise<string[]> {
    try {
      const posts = await this.getAllPublishedPosts();
      const categories = new Set<string>();
      
      posts.forEach(post => {
        post.categories?.forEach(category => {
          if (category.title && category.title.trim()) {
            categories.add(category.title.trim());
          }
        });
      });
      
      return Array.from(categories).sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      
      // If we can't fetch posts, return empty array instead of throwing
      if (error instanceof ExternalServiceError) {
        console.warn('Returning empty categories due to service error:', error.message);
        return [];
      }
      
      throw new ExternalServiceError(
        'Failed to fetch blog categories',
        'Sanity CMS',
        { originalError: error instanceof Error ? error.message : String(error) }
      );
    }
  }

  /**
   * Filter posts by publication status and date range
   */
  static async getFilteredPosts(filters: BlogPostFilters): Promise<BlogPost[]> {
    try {
      let posts: BlogPost[];

      // Only allow published posts for public API
      if (filters.status && filters.status !== 'published') {
        throw new Error('Only published posts are available through public API');
      }

      // Get all published posts as base
      posts = await this.getAllPublishedPosts();

      // Apply date range filtering
      if (filters.dateFrom || filters.dateTo) {
        posts = posts.filter(post => {
          const postDate = new Date(post.publishedAt || post._createdAt);
          
          if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            if (postDate < fromDate) return false;
          }
          
          if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            if (postDate > toDate) return false;
          }
          
          return true;
        });
      }

      // Apply category filtering
      if (filters.category) {
        posts = posts.filter(post => 
          post.categories?.some(category => 
            category.title.toLowerCase() === filters.category!.toLowerCase()
          )
        );
      }

      // Apply search filtering
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        posts = posts.filter(post => 
          post.title.toLowerCase().includes(searchTerm) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm))
        );
      }

      // Apply sorting
      const sortBy = filters.sortBy || 'publishedAt';
      const order = filters.order || 'desc';
      
      posts.sort((a, b) => {
        let comparison = 0;
        
        if (sortBy === 'publishedAt') {
          const dateA = new Date(a.publishedAt || a._createdAt);
          const dateB = new Date(b.publishedAt || b._createdAt);
          comparison = dateA.getTime() - dateB.getTime();
        } else if (sortBy === 'title') {
          comparison = a.title.localeCompare(b.title);
        } else if (sortBy === '_createdAt') {
          const dateA = new Date(a._createdAt);
          const dateB = new Date(b._createdAt);
          comparison = dateA.getTime() - dateB.getTime();
        }
        
        return order === 'desc' ? -comparison : comparison;
      });

      return posts;
    } catch (error) {
      console.error('Error filtering posts:', error);
      throw new Error('Failed to filter blog posts');
    }
  }

  /**
   * Validate that a post is published (publishedAt is not null and not in future)
   */
  static isPostPublished(post: BlogPost): boolean {
    if (!post.publishedAt) return false;
    
    const publishedDate = new Date(post.publishedAt);
    const now = new Date();
    
    return publishedDate <= now;
  }

  /**
   * Get posts with enhanced filtering and pagination
   */
  static async getFilteredPaginatedPosts(
    filters: BlogPostFilters,
    page: number = 1,
    postsPerPage: number = this.DEFAULT_POSTS_PER_PAGE
  ): Promise<BlogPageData> {
    try {
      const filteredPosts = await this.getFilteredPosts(filters);
      
      // Apply pagination
      const startIndex = (page - 1) * postsPerPage;
      const endIndex = startIndex + postsPerPage;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
      
      // Calculate pagination info
      const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
      const pagination: PaginationInfo = {
        currentPage: page,
        totalPages,
        totalPosts: filteredPosts.length,
        postsPerPage,
        hasNext: page < totalPages,
        hasPrev: page > 1
      };

      return {
        posts: paginatedPosts,
        pagination
      };
    } catch (error) {
      console.error('Error getting filtered paginated posts:', error);
      throw new Error('Failed to fetch filtered blog posts');
    }
  }

  /**
   * Alias method for API compatibility
   */
  static async getPaginatedPosts(
    filters: BlogPostFilters,
    page: number = 1,
    postsPerPage: number = this.DEFAULT_POSTS_PER_PAGE
  ): Promise<BlogPageData> {
    return this.getFilteredPaginatedPosts(filters, page, postsPerPage);
  }
}
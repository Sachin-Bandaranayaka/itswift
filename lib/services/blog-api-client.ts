import { BlogPost, BlogPageData } from './blog-public-data';

export class BlogApiClient {
  private static getBaseUrl(): string {
    // For server-side requests, we need an absolute URL
    if (typeof window === 'undefined') {
      // Server-side: use environment variable or default
      let baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
      
      if (!baseUrl && process.env.VERCEL_URL) {
        // VERCEL_URL doesn't include protocol, so we need to add it
        baseUrl = `https://${process.env.VERCEL_URL}`;
      }
      
      if (!baseUrl) {
        baseUrl = 'http://localhost:3000';
      }
      
      return `${baseUrl}/api/blog`;
    }
    // Client-side: relative URL is fine
    return '/api/blog';
  }

  /**
   * Fetch paginated blog posts from API route
   */
  static async getPaginatedPosts(
    page: number = 1,
    limit: number = 9,
    filters?: {
      category?: string;
      search?: string;
    }
  ): Promise<BlogPageData> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.category) {
      params.append('category', filters.category);
    }

    if (filters?.search) {
      params.append('search', filters.search);
    }

    const response = await fetch(`${this.getBaseUrl()}/posts?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch all available categories
   */
  static async getCategories(): Promise<Array<{ title: string }>> {
    const response = await fetch(`${this.getBaseUrl()}/categories`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch a single blog post by slug
   */
  static async getPostBySlug(slug: string): Promise<BlogPost> {
    const response = await fetch(`${this.getBaseUrl()}/posts/${slug}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Post not found');
      }
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    return response.json();
  }
}
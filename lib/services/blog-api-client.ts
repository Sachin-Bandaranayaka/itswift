import { BlogPost, BlogPageData } from './blog-public-data';

export class BlogApiClient {
  private static readonly BASE_URL = '/api/blog';

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

    const response = await fetch(`${this.BASE_URL}/posts?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch all available categories
   */
  static async getCategories(): Promise<Array<{ title: string }>> {
    const response = await fetch(`${this.BASE_URL}/categories`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch a single blog post by slug
   */
  static async getPostBySlug(slug: string): Promise<BlogPost> {
    const response = await fetch(`${this.BASE_URL}/posts/${slug}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Post not found');
      }
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    return response.json();
  }
}
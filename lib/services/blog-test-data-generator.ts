/**
 * Blog Test Data Generator Service
 * 
 * This service provides utilities for creating test blog posts with different
 * publication statuses (draft, scheduled, published) for testing the blog
 * content automation system.
 */

import { BlogService } from '@/lib/services/blog.service';

export interface TestBlogPostData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  publishedAt?: string;
  status: 'draft' | 'scheduled' | 'published';
  author?: string;
  categories?: string[];
}

export interface TestBlogPostOptions {
  count?: number;
  publishedCount?: number;
  scheduledCount?: number;
  draftCount?: number;
  scheduleTimeOffsets?: number[]; // Minutes from now
  authorId?: string;
  categoryIds?: string[];
}

export interface GeneratedTestPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt?: string;
  status: 'draft' | 'scheduled' | 'published';
  _createdAt: string;
}

export class BlogTestDataGenerator {
  private static instance: BlogTestDataGenerator;
  private blogService: BlogService;

  private constructor() {
    this.blogService = new BlogService();
  }

  static getInstance(): BlogTestDataGenerator {
    if (!BlogTestDataGenerator.instance) {
      BlogTestDataGenerator.instance = new BlogTestDataGenerator();
    }
    return BlogTestDataGenerator.instance;
  }

  /**
   * Generate multiple test blog posts with different statuses
   */
  async generateTestBlogPosts(options: TestBlogPostOptions = {}): Promise<{
    posts: GeneratedTestPost[];
    published: GeneratedTestPost[];
    scheduled: GeneratedTestPost[];
    drafts: GeneratedTestPost[];
    error: string | null;
  }> {
    try {
      // TODO: Implement with Supabase
      // For now, return placeholder data
      const posts: GeneratedTestPost[] = [];
      
      return {
        posts,
        published: [],
        scheduled: [],
        drafts: [],
        error: null
      };
    } catch (error) {
      console.error('Error generating test blog posts:', error);
      return {
        posts: [],
        published: [],
        scheduled: [],
        drafts: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Create a single test blog post
   */
  async createTestPost(data: TestBlogPostData): Promise<GeneratedTestPost | null> {
    try {
      // TODO: Implement with Supabase
      // For now, return placeholder data
      return {
        _id: `test-${Date.now()}`,
        title: data.title,
        slug: { current: data.slug },
        publishedAt: data.publishedAt,
        status: data.status,
        _createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating test post:', error);
      return null;
    }
  }

  /**
   * Create a blog post scheduled for immediate publication
   */
  async createImmediateScheduledPost(minutesFromNow: number = 2): Promise<GeneratedTestPost | null> {
    const scheduledTime = this.getFutureDate(minutesFromNow);
    
    return this.createTestPost({
      title: `Scheduled Test Post - ${new Date().toLocaleTimeString()}`,
      slug: `scheduled-test-${Date.now()}`,
      content: this.generateTestContent('scheduled', 1),
      excerpt: 'This is a test post scheduled for immediate publication.',
      publishedAt: scheduledTime.toISOString(),
      status: 'scheduled'
    });
  }

  /**
   * Create multiple posts with specific schedule times
   */
  async createPostsWithScheduleTimes(scheduleTimes: Date[]): Promise<{
    posts: GeneratedTestPost[];
    error: string | null;
  }> {
    try {
      const posts: GeneratedTestPost[] = [];
      
      for (let i = 0; i < scheduleTimes.length; i++) {
        const post = await this.createTestPost({
          title: `Scheduled Test Post ${i + 1}`,
          slug: `scheduled-test-${Date.now()}-${i}`,
          content: this.generateTestContent('scheduled', i + 1),
          excerpt: `Test post ${i + 1} scheduled for ${scheduleTimes[i].toLocaleString()}`,
          publishedAt: scheduleTimes[i].toISOString(),
          status: 'scheduled'
        });
        
        if (post) {
          posts.push(post);
        }
      }
      
      return { posts, error: null };
    } catch (error) {
      console.error('Error creating scheduled posts:', error);
      return {
        posts: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate test content based on type and index
   */
  private generateTestContent(type: string, index: number): string {
    const contentTemplates = {
      published: `This is published test content ${index}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      scheduled: `This is scheduled test content ${index}. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
      draft: `This is draft test content ${index}. Ut enim ad minim veniam, quis nostrud exercitation ullamco.`
    };
    
    return contentTemplates[type as keyof typeof contentTemplates] || contentTemplates.published;
  }

  /**
   * Generate a unique key for test data
   */
  private generateKey(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Get a past date for published posts
   */
  private getPastDate(daysAgo: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  }

  /**
   * Get a future date for scheduled posts
   */
  private getFutureDate(minutesFromNow: number): Date {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutesFromNow);
    return date;
  }

  /**
   * Clean up test posts (remove all test posts)
   */
  async cleanupTestPosts(): Promise<{
    deletedCount: number;
    error: string | null;
  }> {
    try {
      // TODO: Implement with Supabase
      // For now, return placeholder data
      return {
        deletedCount: 0,
        error: null
      };
    } catch (error) {
      console.error('Error cleaning up test posts:', error);
      return {
        deletedCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get status of all test posts
   */
  async getTestPostsStatus(): Promise<{
    posts: Array<{
      _id: string;
      title: string;
      publishedAt?: string;
      status: 'draft' | 'scheduled' | 'published';
      _createdAt: string;
    }>;
    error: string | null;
  }> {
    try {
      // TODO: Implement with Supabase
      // For now, return placeholder data
      return {
        posts: [],
        error: null
      };
    } catch (error) {
      console.error('Error getting test posts status:', error);
      return {
        posts: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Create a comprehensive test dataset with various post types
   */
  async createComprehensiveTestDataset(): Promise<{
    summary: {
      totalPosts: number;
      published: number;
      scheduled: number;
      drafts: number;
    };
    posts: GeneratedTestPost[];
    error: string | null;
  }> {
    try {
      // TODO: Implement with Supabase
      // For now, return placeholder data
      return {
        summary: {
          totalPosts: 0,
          published: 0,
          scheduled: 0,
          drafts: 0
        },
        posts: [],
        error: null
      };
    } catch (error) {
      console.error('Error creating comprehensive test dataset:', error);
      return {
        summary: {
          totalPosts: 0,
          published: 0,
          scheduled: 0,
          drafts: 0
        },
        posts: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
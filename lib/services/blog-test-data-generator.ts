/**
 * Blog Test Data Generator Service
 * 
 * This service provides utilities for creating test blog posts with different
 * publication statuses (draft, scheduled, published) for testing the blog
 * content automation system.
 */

import { client } from '@/lib/sanity.client';

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

  private constructor() {}

  static getInstance(): BlogTestDataGenerator {
    if (!BlogTestDataGenerator.instance) {
      BlogTestDataGenerator.instance = new BlogTestDataGenerator();
    }
    return BlogTestDataGenerator.instance;
  }

  /**
   * Generate sample blog posts with different publication statuses
   */
  async generateTestBlogPosts(options: TestBlogPostOptions = {}): Promise<{
    posts: GeneratedTestPost[];
    published: GeneratedTestPost[];
    scheduled: GeneratedTestPost[];
    drafts: GeneratedTestPost[];
    error: string | null;
  }> {
    try {
      const {
        publishedCount = 1,
        scheduledCount = 1,
        draftCount = 1,
        scheduleTimeOffsets = [2, 5, 10], // Default: 2, 5, 10 minutes from now
        authorId,
        categoryIds = []
      } = options;

      const allPosts: GeneratedTestPost[] = [];
      const published: GeneratedTestPost[] = [];
      const scheduled: GeneratedTestPost[] = [];
      const drafts: GeneratedTestPost[] = [];
      let hasErrors = false;
      let lastError: string | null = null;

      // Generate published posts
      for (let i = 0; i < publishedCount; i++) {
        try {
          const post = await this.createTestPost({
            title: `Test Published Post ${i + 1}`,
            slug: `test-published-post-${i + 1}-${Date.now()}`,
            content: this.generateTestContent('published', i + 1),
            status: 'published',
            publishedAt: this.getPastDate(i + 1).toISOString(),
            author: authorId,
            categories: categoryIds
          });
          
          if (post) {
            allPosts.push(post);
            published.push(post);
          } else {
            hasErrors = true;
            lastError = 'Failed to create published post';
          }
        } catch (error) {
          hasErrors = true;
          lastError = error instanceof Error ? error.message : 'Unknown error';
          throw error; // Re-throw to be caught by outer try-catch
        }
      }

      // Generate scheduled posts
      for (let i = 0; i < scheduledCount; i++) {
        try {
          const offsetMinutes = scheduleTimeOffsets[i % scheduleTimeOffsets.length];
          const scheduledTime = this.getFutureDate(offsetMinutes);
          
          const post = await this.createTestPost({
            title: `Test Scheduled Post ${i + 1}`,
            slug: `test-scheduled-post-${i + 1}-${Date.now()}`,
            content: this.generateTestContent('scheduled', i + 1),
            status: 'scheduled',
            publishedAt: scheduledTime.toISOString(),
            author: authorId,
            categories: categoryIds
          });
          
          if (post) {
            allPosts.push(post);
            scheduled.push(post);
          } else {
            hasErrors = true;
            lastError = 'Failed to create scheduled post';
          }
        } catch (error) {
          hasErrors = true;
          lastError = error instanceof Error ? error.message : 'Unknown error';
          throw error; // Re-throw to be caught by outer try-catch
        }
      }

      // Generate draft posts
      for (let i = 0; i < draftCount; i++) {
        try {
          const post = await this.createTestPost({
            title: `Test Draft Post ${i + 1}`,
            slug: `test-draft-post-${i + 1}-${Date.now()}`,
            content: this.generateTestContent('draft', i + 1),
            status: 'draft',
            author: authorId,
            categories: categoryIds
          });
          
          if (post) {
            allPosts.push(post);
            drafts.push(post);
          } else {
            hasErrors = true;
            lastError = 'Failed to create draft post';
          }
        } catch (error) {
          hasErrors = true;
          lastError = error instanceof Error ? error.message : 'Unknown error';
          throw error; // Re-throw to be caught by outer try-catch
        }
      }

      console.log(`Generated ${allPosts.length} test blog posts: ${published.length} published, ${scheduled.length} scheduled, ${drafts.length} drafts`);

      return {
        posts: allPosts,
        published,
        scheduled,
        drafts,
        error: hasErrors ? lastError : null
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
      const postDoc = {
        _type: 'post',
        title: data.title,
        slug: {
          _type: 'slug',
          current: data.slug
        },
        body: this.convertContentToBlocks(data.content),
        ...(data.publishedAt && { publishedAt: data.publishedAt }),
        ...(data.author && { 
          author: {
            _type: 'reference',
            _ref: data.author
          }
        }),
        ...(data.categories && data.categories.length > 0 && {
          categories: data.categories.map(categoryId => ({
            _type: 'reference',
            _ref: categoryId
          }))
        })
      };

      const result = await client.create(postDoc);
      
      if (result) {
        console.log(`Created test ${data.status} post: "${data.title}" (ID: ${result._id})`);
        
        return {
          _id: result._id,
          title: data.title,
          slug: { current: data.slug },
          publishedAt: data.publishedAt,
          status: data.status,
          _createdAt: result._createdAt
        };
      }
      
      return null;
    } catch (error) {
      console.error(`Error creating test post "${data.title}":`, error);
      return null;
    }
  }

  /**
   * Create a test post scheduled for immediate publication (for testing scheduler)
   */
  async createImmediateScheduledPost(minutesFromNow: number = 2): Promise<GeneratedTestPost | null> {
    const scheduledTime = this.getFutureDate(minutesFromNow);
    
    return await this.createTestPost({
      title: `Immediate Test Post - ${new Date().toLocaleTimeString()}`,
      slug: `immediate-test-post-${Date.now()}`,
      content: this.generateTestContent('immediate', 1),
      status: 'scheduled',
      publishedAt: scheduledTime.toISOString()
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
      let hasErrors = false;
      let lastError: string | null = null;
      
      for (let i = 0; i < scheduleTimes.length; i++) {
        try {
          const scheduleTime = scheduleTimes[i];
          const post = await this.createTestPost({
            title: `Scheduled Test Post ${i + 1} - ${scheduleTime.toLocaleString()}`,
            slug: `scheduled-test-post-${i + 1}-${Date.now()}`,
            content: this.generateTestContent('scheduled', i + 1),
            status: 'scheduled',
            publishedAt: scheduleTime.toISOString()
          });
          
          if (post) {
            posts.push(post);
          } else {
            hasErrors = true;
            lastError = 'Failed to create scheduled post';
          }
        } catch (error) {
          hasErrors = true;
          lastError = error instanceof Error ? error.message : 'Unknown error';
          throw error; // Re-throw to be caught by outer try-catch
        }
      }

      return { posts, error: hasErrors ? lastError : null };
    } catch (error) {
      console.error('Error creating posts with schedule times:', error);
      return {
        posts: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate test content based on post type and index
   */
  private generateTestContent(type: string, index: number): string {
    const contentTemplates = {
      published: [
        `This is a published test blog post #${index}. It contains sample content to verify that published posts appear correctly on the public blog page. The content includes multiple paragraphs to test formatting and display.`,
        `Published test content #${index} with rich formatting. This post should be visible on the public blog page immediately after creation.`
      ],
      scheduled: [
        `This is a scheduled test blog post #${index}. It should not appear on the public blog page until the scheduled publication time arrives. This content tests the scheduling functionality.`,
        `Scheduled test content #${index} for automation testing. This post will be automatically published by the scheduler at the designated time.`
      ],
      draft: [
        `This is a draft test blog post #${index}. It should not appear on the public blog page at any time until it is published. This content tests draft functionality.`,
        `Draft test content #${index} for testing purposes. This post remains private until explicitly published.`
      ],
      immediate: [
        `This is an immediate test post for scheduler testing. It should be published automatically within a few minutes of creation. Created at: ${new Date().toLocaleString()}.`
      ]
    };

    const templates = contentTemplates[type as keyof typeof contentTemplates] || contentTemplates.published;
    const template = templates[(index - 1) % templates.length];
    
    return `${template}\n\nAdditional test content:\n- Test bullet point 1\n- Test bullet point 2\n- Test bullet point 3\n\nThis post was generated for testing the blog content automation system.`;
  }

  /**
   * Convert plain text content to Sanity block content format
   */
  private convertContentToBlocks(content: string): any[] {
    const paragraphs = content.split('\n\n');
    
    return paragraphs.map(paragraph => ({
      _type: 'block',
      _key: this.generateKey(),
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: this.generateKey(),
          text: paragraph,
          marks: []
        }
      ]
    }));
  }

  /**
   * Generate a random key for Sanity blocks
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
      // Query for all test posts (posts with titles starting with "Test" or "Immediate Test")
      const testPosts = await client.fetch(`
        *[_type == "post" && (title match "Test*" || title match "Immediate Test*")] {
          _id,
          title
        }
      `);

      let deletedCount = 0;
      
      for (const post of testPosts) {
        try {
          await client.delete(post._id);
          deletedCount++;
          console.log(`Deleted test post: "${post.title}" (ID: ${post._id})`);
        } catch (error) {
          console.error(`Error deleting test post ${post._id}:`, error);
        }
      }

      console.log(`Cleaned up ${deletedCount} test blog posts`);
      
      return { deletedCount, error: null };
    } catch (error) {
      console.error('Error cleaning up test posts:', error);
      return {
        deletedCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get all test posts with their current status
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
      const now = new Date().toISOString();
      
      const testPosts = await client.fetch(`
        *[_type == "post" && (title match "Test*" || title match "Immediate Test*")] | order(_createdAt desc) {
          _id,
          title,
          publishedAt,
          _createdAt,
          "status": select(
            !defined(publishedAt) => "draft",
            publishedAt > $now => "scheduled",
            "published"
          )
        }
      `, { now });

      return { posts: testPosts || [], error: null };
    } catch (error) {
      console.error('Error getting test posts status:', error);
      return {
        posts: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Create a comprehensive test dataset for full system testing
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
      // Create a comprehensive dataset with various scenarios
      const result = await this.generateTestBlogPosts({
        publishedCount: 3, // 3 published posts from different dates
        scheduledCount: 3, // 3 scheduled posts at different future times
        draftCount: 2, // 2 draft posts
        scheduleTimeOffsets: [1, 3, 15] // 1 minute, 3 minutes, 15 minutes from now
      });

      if (result.error) {
        return {
          summary: { totalPosts: 0, published: 0, scheduled: 0, drafts: 0 },
          posts: [],
          error: result.error
        };
      }

      const summary = {
        totalPosts: result.posts.length,
        published: result.published.length,
        scheduled: result.scheduled.length,
        drafts: result.drafts.length
      };

      console.log('Created comprehensive test dataset:', summary);

      return {
        summary,
        posts: result.posts,
        error: result.error
      };
    } catch (error) {
      console.error('Error creating comprehensive test dataset:', error);
      return {
        summary: { totalPosts: 0, published: 0, scheduled: 0, drafts: 0 },
        posts: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
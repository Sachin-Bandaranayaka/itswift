/**
 * Blog Test Helper Utilities
 * 
 * Utility functions for creating and managing test blog posts in test scenarios.
 * These helpers provide convenient methods for setting up test data and verifying
 * blog post creation, scheduling, and publication functionality.
 */

import { BlogTestDataGenerator, GeneratedTestPost, TestBlogPostOptions } from '@/lib/services/blog-test-data-generator';
import { BlogService } from '@/lib/services/blog.service';

export interface BlogTestScenario {
  name: string;
  description: string;
  setup: () => Promise<GeneratedTestPost[]>;
  verify: (posts: GeneratedTestPost[]) => Promise<boolean>;
  cleanup: () => Promise<void>;
}

export class BlogTestHelpers {
  private static generator = BlogTestDataGenerator.getInstance();
  private static blogService = new BlogService();

  /**
   * Create test posts for basic functionality testing
   */
  static async createBasicTestPosts(): Promise<{
    published: GeneratedTestPost[];
    scheduled: GeneratedTestPost[];
    drafts: GeneratedTestPost[];
  }> {
    const result = await this.generator.generateTestBlogPosts({
      publishedCount: 1,
      scheduledCount: 1,
      draftCount: 1,
      scheduleTimeOffsets: [2] // 2 minutes from now
    });

    if (result.error) {
      throw new Error(`Failed to create basic test posts: ${result.error}`);
    }

    return {
      published: result.published,
      scheduled: result.scheduled,
      drafts: result.drafts
    };
  }

  /**
   * Create posts for scheduler testing (immediate publication)
   */
  static async createSchedulerTestPosts(minutesFromNow: number[] = [1, 2, 3]): Promise<GeneratedTestPost[]> {
    const posts: GeneratedTestPost[] = [];
    
    for (const minutes of minutesFromNow) {
      const post = await this.generator.createImmediateScheduledPost(minutes);
      if (post) {
        posts.push(post);
      }
    }

    return posts;
  }

  /**
   * Create posts with specific publication dates for testing
   */
  static async createPostsWithSpecificDates(dates: Date[]): Promise<GeneratedTestPost[]> {
    const result = await this.generator.createPostsWithScheduleTimes(dates);
    
    if (result.error) {
      throw new Error(`Failed to create posts with specific dates: ${result.error}`);
    }

    return result.posts;
  }

  /**
   * Verify that a post exists in Sanity with expected properties
   */
  static async verifyPostExists(postId: string, expectedStatus: 'draft' | 'scheduled' | 'published'): Promise<boolean> {
    try {
      const post = await this.blogService.getPostById(postId);

      if (!post) {
        console.error(`Post ${postId} not found`);
        return false;
      }

      if (post.status !== expectedStatus) {
        console.error(`Post ${postId} has status ${post.status}, expected ${expectedStatus}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Error verifying post ${postId}:`, error);
      return false;
    }
  }

  /**
   * Verify that published posts appear in public blog query
   */
  static async verifyPublishedPostsVisible(postIds: string[]): Promise<boolean> {
    try {
      const response = await this.blogService.getPosts({ status: 'published' }, 1, 1000);
      const publishedIds = response.posts.map((post: any) => post.id);
      
      for (const postId of postIds) {
        if (!publishedIds.includes(postId)) {
          console.error(`Published post ${postId} not visible in public query`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error verifying published posts visibility:', error);
      return false;
    }
  }

  /**
   * Verify that scheduled posts do not appear in public blog query
   */
  static async verifyScheduledPostsHidden(postIds: string[]): Promise<boolean> {
    try {
      const response = await this.blogService.getPosts({ status: 'published' }, 1, 1000);
      const publishedIds = response.posts.map((post: any) => post.id);
      
      for (const postId of postIds) {
        if (publishedIds.includes(postId)) {
          console.error(`Scheduled post ${postId} incorrectly visible in public query`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error verifying scheduled posts are hidden:', error);
      return false;
    }
  }

  /**
   * Wait for scheduled posts to be published (for scheduler testing)
   */
  static async waitForPostsToBePublished(postIds: string[], timeoutMs: number = 300000): Promise<boolean> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      try {
        const allPublished = await this.verifyPublishedPostsVisible(postIds);
        if (allPublished) {
          return true;
        }
        
        // Wait 10 seconds before checking again
        await new Promise(resolve => setTimeout(resolve, 10000));
      } catch (error) {
        console.error('Error waiting for posts to be published:', error);
      }
    }

    console.error(`Timeout waiting for posts to be published: ${postIds.join(', ')}`);
    return false;
  }

  /**
   * Get current status of test posts
   */
  static async getTestPostsStatus(): Promise<Array<{
    _id: string;
    title: string;
    publishedAt?: string;
    status: 'draft' | 'scheduled' | 'published';
    _createdAt: string;
  }>> {
    const result = await this.generator.getTestPostsStatus();
    
    if (result.error) {
      throw new Error(`Failed to get test posts status: ${result.error}`);
    }

    return result.posts;
  }

  /**
   * Clean up all test posts
   */
  static async cleanupAllTestPosts(): Promise<number> {
    const result = await this.generator.cleanupTestPosts();
    
    if (result.error) {
      throw new Error(`Failed to cleanup test posts: ${result.error}`);
    }

    return result.deletedCount;
  }

  /**
   * Create a complete test scenario for end-to-end testing
   */
  static createEndToEndTestScenario(): BlogTestScenario {
    let testPosts: GeneratedTestPost[] = [];

    return {
      name: 'End-to-End Blog Automation Test',
      description: 'Tests complete blog post lifecycle from creation to publication',
      
      setup: async () => {
        console.log('Setting up end-to-end test scenario...');
        
        // Create comprehensive test dataset
        const result = await this.generator.createComprehensiveTestDataset();
        
        if (result.error) {
          throw new Error(`Failed to setup test scenario: ${result.error}`);
        }

        testPosts = result.posts;
        console.log(`Created ${result.summary.totalPosts} test posts for scenario`);
        
        return testPosts;
      },

      verify: async (posts: GeneratedTestPost[]) => {
        console.log('Verifying end-to-end test scenario...');
        
        const publishedPosts = posts.filter(p => p.status === 'published');
        const scheduledPosts = posts.filter(p => p.status === 'scheduled');
        const draftPosts = posts.filter(p => p.status === 'draft');

        // Verify published posts are visible
        const publishedVisible = await this.verifyPublishedPostsVisible(
          publishedPosts.map(p => p._id)
        );

        // Verify scheduled posts are hidden
        const scheduledHidden = await this.verifyScheduledPostsHidden(
          scheduledPosts.map(p => p._id)
        );

        // Verify draft posts are hidden
        const draftsHidden = await this.verifyScheduledPostsHidden(
          draftPosts.map(p => p._id)
        );

        const success = publishedVisible && scheduledHidden && draftsHidden;
        
        if (success) {
          console.log('End-to-end test scenario verification passed');
        } else {
          console.error('End-to-end test scenario verification failed');
        }

        return success;
      },

      cleanup: async () => {
        console.log('Cleaning up end-to-end test scenario...');
        const deletedCount = await this.cleanupAllTestPosts();
        console.log(`Cleaned up ${deletedCount} test posts`);
      }
    };
  }

  /**
   * Create a scheduler test scenario
   */
  static createSchedulerTestScenario(): BlogTestScenario {
    let testPosts: GeneratedTestPost[] = [];

    return {
      name: 'Blog Scheduler Test',
      description: 'Tests automatic publication of scheduled blog posts',
      
      setup: async () => {
        console.log('Setting up scheduler test scenario...');
        
        // Create posts scheduled for immediate publication
        testPosts = await this.createSchedulerTestPosts([1, 2]); // 1 and 2 minutes from now
        
        console.log(`Created ${testPosts.length} posts for scheduler testing`);
        return testPosts;
      },

      verify: async (posts: GeneratedTestPost[]) => {
        console.log('Verifying scheduler test scenario...');
        
        // Wait for posts to be published (5 minute timeout)
        const success = await this.waitForPostsToBePublished(
          posts.map(p => p._id),
          300000 // 5 minutes
        );

        if (success) {
          console.log('Scheduler test scenario verification passed');
        } else {
          console.error('Scheduler test scenario verification failed');
        }

        return success;
      },

      cleanup: async () => {
        console.log('Cleaning up scheduler test scenario...');
        const deletedCount = await this.cleanupAllTestPosts();
        console.log(`Cleaned up ${deletedCount} test posts`);
      }
    };
  }

  /**
   * Run a test scenario
   */
  static async runTestScenario(scenario: BlogTestScenario): Promise<{
    success: boolean;
    error?: string;
    posts?: GeneratedTestPost[];
  }> {
    try {
      console.log(`\n=== Running ${scenario.name} ===`);
      console.log(scenario.description);

      // Setup
      const posts = await scenario.setup();
      
      // Verify
      const success = await scenario.verify(posts);
      
      // Cleanup
      await scenario.cleanup();

      return { success, posts };
    } catch (error) {
      console.error(`Error running test scenario "${scenario.name}":`, error);
      
      // Attempt cleanup even if test failed
      try {
        await scenario.cleanup();
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
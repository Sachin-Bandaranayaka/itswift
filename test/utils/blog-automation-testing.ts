/**
 * Blog Automation Testing Utilities
 * 
 * Comprehensive testing utilities for blog content automation system.
 * Provides functions for creating test posts, verifying publication and visibility,
 * and running automated test scenarios for scheduler functionality.
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4
 */

import { BlogTestDataGenerator, GeneratedTestPost } from '@/lib/services/blog-test-data-generator';
import { BlogTestHelpers, BlogTestScenario } from './blog-test-helpers';
import { client } from '@/lib/sanity.client';

export interface AutomationTestResult {
  success: boolean;
  message: string;
  details?: any;
  error?: string;
  duration?: number;
}

export interface SchedulerTestOptions {
  immediatePostCount?: number;
  scheduleOffsetMinutes?: number[];
  timeoutMs?: number;
  verificationIntervalMs?: number;
}

export interface PublicationTestOptions {
  publishedCount?: number;
  scheduledCount?: number;
  draftCount?: number;
  verifyVisibility?: boolean;
  verifyHidden?: boolean;
}

export interface VisibilityTestResult {
  postId: string;
  title: string;
  expectedStatus: 'published' | 'scheduled' | 'draft';
  actualStatus: string;
  isVisible: boolean;
  shouldBeVisible: boolean;
  passed: boolean;
}

export class BlogAutomationTesting {
  private static getGenerator() {
    return BlogTestDataGenerator.getInstance();
  }

  /**
   * Test blog post creation with different publication statuses
   * Requirement 2.1: Create at least 3 sample blog posts with different publication statuses
   */
  static async testBlogPostCreation(options: PublicationTestOptions = {}): Promise<AutomationTestResult> {
    const startTime = Date.now();
    
    try {
      const {
        publishedCount = 1,
        scheduledCount = 1,
        draftCount = 1,
        verifyVisibility = true,
        verifyHidden = true
      } = options;

      console.log('🚀 Starting blog post creation test...');
      console.log(`Creating ${publishedCount} published, ${scheduledCount} scheduled, ${draftCount} draft posts`);

      // Generate test posts
      const result = await this.getGenerator().generateTestBlogPosts({
        publishedCount,
        scheduledCount,
        draftCount,
        scheduleTimeOffsets: [5, 10, 15] // 5, 10, 15 minutes from now
      });

      if (result.error) {
        return {
          success: false,
          message: 'Failed to create test blog posts',
          error: result.error,
          duration: Date.now() - startTime
        };
      }

      const testResults = {
        created: {
          published: result.published.length,
          scheduled: result.scheduled.length,
          drafts: result.drafts.length,
          total: result.posts.length
        },
        posts: result.posts
      };

      // Verify visibility if requested
      if (verifyVisibility || verifyHidden) {
        console.log('🔍 Verifying post visibility...');
        
        const visibilityResults = await this.verifyPostVisibility(result.posts);
        testResults.visibility = visibilityResults;

        const failedVisibility = visibilityResults.filter(r => !r.passed);
        if (failedVisibility.length > 0) {
          return {
            success: false,
            message: `Post visibility verification failed for ${failedVisibility.length} posts`,
            details: testResults,
            duration: Date.now() - startTime
          };
        }
      }

      console.log('✅ Blog post creation test completed successfully');
      
      return {
        success: true,
        message: `Successfully created and verified ${result.posts.length} test blog posts`,
        details: testResults,
        duration: Date.now() - startTime
      };

    } catch (error) {
      console.error('❌ Blog post creation test failed:', error);
      
      return {
        success: false,
        message: 'Blog post creation test failed with error',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Test scheduler functionality with immediate publication
   * Requirement 2.2, 2.3: Test posts with past/future publishedAt dates and scheduler automation
   */
  static async testSchedulerFunctionality(options: SchedulerTestOptions = {}): Promise<AutomationTestResult> {
    const startTime = Date.now();
    
    try {
      const {
        immediatePostCount = 2,
        scheduleOffsetMinutes = [1, 2], // 1 and 2 minutes from now
        timeoutMs = 300000, // 5 minutes
        verificationIntervalMs = 10000 // 10 seconds
      } = options;

      console.log('⏰ Starting scheduler functionality test...');
      console.log(`Creating ${immediatePostCount} posts scheduled for immediate publication`);

      // Create posts scheduled for immediate publication
      const scheduledPosts: GeneratedTestPost[] = [];
      
      for (let i = 0; i < immediatePostCount; i++) {
        const offsetMinutes = scheduleOffsetMinutes[i % scheduleOffsetMinutes.length];
        const post = await this.getGenerator().createImmediateScheduledPost(offsetMinutes);
        
        if (post) {
          scheduledPosts.push(post);
          console.log(`📅 Created post "${post.title}" scheduled for ${offsetMinutes} minutes from now`);
        }
      }

      if (scheduledPosts.length === 0) {
        return {
          success: false,
          message: 'Failed to create any scheduled posts for testing',
          duration: Date.now() - startTime
        };
      }

      // Verify posts are initially hidden
      console.log('🔍 Verifying posts are initially hidden...');
      const initiallyHidden = await BlogTestHelpers.verifyScheduledPostsHidden(
        scheduledPosts.map(p => p._id)
      );

      if (!initiallyHidden) {
        return {
          success: false,
          message: 'Scheduled posts are incorrectly visible before publication time',
          details: { scheduledPosts },
          duration: Date.now() - startTime
        };
      }

      // Wait for posts to be published by scheduler
      console.log('⏳ Waiting for scheduler to publish posts...');
      const publishedSuccessfully = await this.waitForSchedulerPublication(
        scheduledPosts.map(p => p._id),
        timeoutMs,
        verificationIntervalMs
      );

      if (!publishedSuccessfully) {
        return {
          success: false,
          message: 'Scheduler failed to publish posts within timeout period',
          details: { 
            scheduledPosts,
            timeoutMs,
            verificationIntervalMs
          },
          duration: Date.now() - startTime
        };
      }

      console.log('✅ Scheduler functionality test completed successfully');
      
      return {
        success: true,
        message: `Scheduler successfully published ${scheduledPosts.length} posts`,
        details: {
          scheduledPosts,
          publicationTime: Date.now() - startTime
        },
        duration: Date.now() - startTime
      };

    } catch (error) {
      console.error('❌ Scheduler functionality test failed:', error);
      
      return {
        success: false,
        message: 'Scheduler functionality test failed with error',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * Verify post publication and visibility status
   * Requirement 2.4: Verify post publication and visibility
   */
  static async verifyPostVisibility(posts: GeneratedTestPost[]): Promise<VisibilityTestResult[]> {
    const results: VisibilityTestResult[] = [];
    
    try {
      // Get current published posts from public query
      const now = new Date().toISOString();
      const publishedPosts = await client.fetch(`
        *[_type == "post" && publishedAt <= $now && publishedAt != null] {
          _id,
          title,
          publishedAt
        }
      `, { now });

      const publishedIds = new Set(publishedPosts.map((post: any) => post._id));

      // Check each test post
      for (const post of posts) {
        const isVisible = publishedIds.has(post._id);
        const shouldBeVisible = post.status === 'published';
        
        // Get actual current status
        const actualStatus = await this.getCurrentPostStatus(post._id);
        
        const result: VisibilityTestResult = {
          postId: post._id,
          title: post.title,
          expectedStatus: post.status,
          actualStatus,
          isVisible,
          shouldBeVisible,
          passed: isVisible === shouldBeVisible
        };

        results.push(result);
        
        if (result.passed) {
          console.log(`✅ ${post.title}: Visibility correct (${result.actualStatus})`);
        } else {
          console.log(`❌ ${post.title}: Visibility incorrect - Expected: ${shouldBeVisible ? 'visible' : 'hidden'}, Actual: ${isVisible ? 'visible' : 'hidden'}`);
        }
      }

    } catch (error) {
      console.error('Error verifying post visibility:', error);
      
      // Return failed results for all posts
      return posts.map(post => ({
        postId: post._id,
        title: post.title,
        expectedStatus: post.status,
        actualStatus: 'error',
        isVisible: false,
        shouldBeVisible: post.status === 'published',
        passed: false
      }));
    }

    return results;
  }

  /**
   * Get current status of a post
   */
  private static async getCurrentPostStatus(postId: string): Promise<string> {
    try {
      const now = new Date().toISOString();
      
      const post = await client.fetch(`
        *[_type == "post" && _id == $postId][0] {
          _id,
          publishedAt,
          "status": select(
            !defined(publishedAt) => "draft",
            publishedAt > $now => "scheduled",
            "published"
          )
        }
      `, { postId, now });

      return post?.status || 'not_found';
    } catch (error) {
      console.error(`Error getting status for post ${postId}:`, error);
      return 'error';
    }
  }

  /**
   * Wait for scheduler to publish posts with detailed monitoring
   */
  private static async waitForSchedulerPublication(
    postIds: string[],
    timeoutMs: number,
    intervalMs: number
  ): Promise<boolean> {
    const startTime = Date.now();
    let lastCheck = 0;
    
    console.log(`⏳ Monitoring ${postIds.length} posts for publication...`);
    
    while (Date.now() - startTime < timeoutMs) {
      try {
        // Check if all posts are now published
        const allPublished = await BlogTestHelpers.verifyPublishedPostsVisible(postIds);
        
        if (allPublished) {
          const duration = Date.now() - startTime;
          console.log(`🎉 All posts published successfully after ${Math.round(duration / 1000)}s`);
          return true;
        }

        // Log progress every minute
        const elapsed = Date.now() - startTime;
        if (elapsed - lastCheck >= 60000) {
          console.log(`⏳ Still waiting... ${Math.round(elapsed / 1000)}s elapsed`);
          lastCheck = elapsed;
          
          // Check individual post statuses for debugging
          await this.logPostStatuses(postIds);
        }
        
        // Wait before next check
        await new Promise(resolve => setTimeout(resolve, intervalMs));
        
      } catch (error) {
        console.error('Error checking post publication status:', error);
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      }
    }

    console.log(`⏰ Timeout reached after ${Math.round(timeoutMs / 1000)}s`);
    await this.logPostStatuses(postIds);
    return false;
  }

  /**
   * Log current status of posts for debugging
   */
  private static async logPostStatuses(postIds: string[]): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      const posts = await client.fetch(`
        *[_type == "post" && _id in $postIds] {
          _id,
          title,
          publishedAt,
          "status": select(
            !defined(publishedAt) => "draft",
            publishedAt > $now => "scheduled",
            "published"
          ),
          "minutesUntilPublish": round((dateTime(publishedAt) - dateTime($now)) / 60)
        }
      `, { postIds, now });

      console.log('📊 Current post statuses:');
      posts.forEach((post: any) => {
        const timeInfo = post.status === 'scheduled' 
          ? ` (${post.minutesUntilPublish} min remaining)`
          : '';
        console.log(`  - ${post.title}: ${post.status}${timeInfo}`);
      });
      
    } catch (error) {
      console.error('Error logging post statuses:', error);
    }
  }

  /**
   * Create comprehensive automation test scenario
   * Combines all testing requirements into a single scenario
   */
  static createComprehensiveAutomationTestScenario(): BlogTestScenario {
    let testPosts: GeneratedTestPost[] = [];
    let testResults: any = {};

    return {
      name: 'Comprehensive Blog Automation Test',
      description: 'Tests complete blog automation system including creation, scheduling, and publication',
      
      setup: async () => {
        console.log('🚀 Setting up comprehensive automation test...');
        
        // Test post creation with different statuses
        const creationResult = await this.testBlogPostCreation({
          publishedCount: 2,
          scheduledCount: 2,
          draftCount: 1,
          verifyVisibility: true
        });

        if (!creationResult.success) {
          throw new Error(`Post creation test failed: ${creationResult.error || creationResult.message}`);
        }

        testPosts = creationResult.details?.posts || [];
        testResults.creation = creationResult;

        console.log(`✅ Created ${testPosts.length} test posts for comprehensive testing`);
        return testPosts;
      },

      verify: async (posts: GeneratedTestPost[]) => {
        console.log('🔍 Running comprehensive automation verification...');
        
        // Test scheduler functionality
        console.log('⏰ Testing scheduler functionality...');
        const schedulerResult = await this.testSchedulerFunctionality({
          immediatePostCount: 2,
          scheduleOffsetMinutes: [1, 2],
          timeoutMs: 300000
        });

        testResults.scheduler = schedulerResult;

        if (!schedulerResult.success) {
          console.error('❌ Scheduler test failed:', schedulerResult.message);
          return false;
        }

        // Verify all posts have correct visibility
        console.log('🔍 Final visibility verification...');
        const allTestPosts = [...posts, ...(schedulerResult.details?.scheduledPosts || [])];
        const visibilityResults = await this.verifyPostVisibility(allTestPosts);
        
        testResults.finalVisibility = visibilityResults;
        
        const failedVisibility = visibilityResults.filter(r => !r.passed);
        if (failedVisibility.length > 0) {
          console.error(`❌ Final visibility check failed for ${failedVisibility.length} posts`);
          return false;
        }

        console.log('✅ Comprehensive automation test verification passed');
        return true;
      },

      cleanup: async () => {
        console.log('🧹 Cleaning up comprehensive automation test...');
        
        try {
          const deletedCount = await BlogTestHelpers.cleanupAllTestPosts();
          console.log(`🗑️ Cleaned up ${deletedCount} test posts`);
          
          // Log test summary
          console.log('\n📊 Test Summary:');
          console.log(`  - Post Creation: ${testResults.creation?.success ? '✅ PASSED' : '❌ FAILED'}`);
          console.log(`  - Scheduler: ${testResults.scheduler?.success ? '✅ PASSED' : '❌ FAILED'}`);
          console.log(`  - Final Visibility: ${testResults.finalVisibility?.every((r: any) => r.passed) ? '✅ PASSED' : '❌ FAILED'}`);
          
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      }
    };
  }

  /**
   * Create scheduler-specific test scenario
   * Focuses on testing scheduler automation functionality
   */
  static createSchedulerAutomationTestScenario(): BlogTestScenario {
    let scheduledPosts: GeneratedTestPost[] = [];

    return {
      name: 'Scheduler Automation Test',
      description: 'Tests automatic publication of scheduled blog posts by the scheduler',
      
      setup: async () => {
        console.log('⏰ Setting up scheduler automation test...');
        
        // Create posts with different schedule times
        const scheduleTimes = [
          new Date(Date.now() + 1 * 60 * 1000), // 1 minute from now
          new Date(Date.now() + 2 * 60 * 1000), // 2 minutes from now
          new Date(Date.now() + 3 * 60 * 1000)  // 3 minutes from now
        ];

        const result = await this.getGenerator().createPostsWithScheduleTimes(scheduleTimes);
        
        if (result.error) {
          throw new Error(`Failed to create scheduled posts: ${result.error}`);
        }

        scheduledPosts = result.posts;
        console.log(`📅 Created ${scheduledPosts.length} posts for scheduler testing`);
        
        return scheduledPosts;
      },

      verify: async (posts: GeneratedTestPost[]) => {
        console.log('⏳ Verifying scheduler automation...');
        
        // Test the scheduler functionality
        const result = await this.testSchedulerFunctionality({
          immediatePostCount: 0, // Don't create new posts, use existing ones
          timeoutMs: 360000, // 6 minutes timeout
          verificationIntervalMs: 15000 // Check every 15 seconds
        });

        // Wait for the existing scheduled posts to be published
        const publishedSuccessfully = await this.waitForSchedulerPublication(
          posts.map(p => p._id),
          360000, // 6 minutes
          15000   // 15 seconds
        );

        if (!publishedSuccessfully) {
          console.error('❌ Scheduler failed to publish posts within timeout');
          return false;
        }

        console.log('✅ Scheduler automation verification passed');
        return true;
      },

      cleanup: async () => {
        console.log('🧹 Cleaning up scheduler automation test...');
        const deletedCount = await BlogTestHelpers.cleanupAllTestPosts();
        console.log(`🗑️ Cleaned up ${deletedCount} test posts`);
      }
    };
  }

  /**
   * Run all automation tests in sequence
   */
  static async runAllAutomationTests(): Promise<AutomationTestResult> {
    const startTime = Date.now();
    const results: any = {};
    
    try {
      console.log('🚀 Starting comprehensive blog automation testing...\n');

      // Test 1: Blog post creation
      console.log('=== Test 1: Blog Post Creation ===');
      results.creation = await this.testBlogPostCreation({
        publishedCount: 2,
        scheduledCount: 2,
        draftCount: 1
      });
      
      if (!results.creation.success) {
        throw new Error(`Blog post creation test failed: ${results.creation.message}`);
      }

      // Test 2: Scheduler functionality
      console.log('\n=== Test 2: Scheduler Functionality ===');
      results.scheduler = await this.testSchedulerFunctionality({
        immediatePostCount: 2,
        scheduleOffsetMinutes: [1, 2]
      });

      if (!results.scheduler.success) {
        throw new Error(`Scheduler functionality test failed: ${results.scheduler.message}`);
      }

      // Test 3: Run comprehensive scenario
      console.log('\n=== Test 3: Comprehensive Scenario ===');
      const comprehensiveScenario = this.createComprehensiveAutomationTestScenario();
      const scenarioResult = await BlogTestHelpers.runTestScenario(comprehensiveScenario);
      results.comprehensive = scenarioResult;

      if (!scenarioResult.success) {
        throw new Error(`Comprehensive scenario test failed: ${scenarioResult.error}`);
      }

      // Cleanup all test posts
      console.log('\n=== Cleanup ===');
      const deletedCount = await BlogTestHelpers.cleanupAllTestPosts();
      console.log(`🗑️ Final cleanup: ${deletedCount} test posts deleted`);

      const duration = Date.now() - startTime;
      console.log(`\n✅ All automation tests completed successfully in ${Math.round(duration / 1000)}s`);

      return {
        success: true,
        message: 'All blog automation tests passed successfully',
        details: results,
        duration
      };

    } catch (error) {
      console.error('\n❌ Automation testing failed:', error);
      
      // Attempt cleanup even if tests failed
      try {
        await BlogTestHelpers.cleanupAllTestPosts();
      } catch (cleanupError) {
        console.error('Error during cleanup:', cleanupError);
      }

      return {
        success: false,
        message: 'Blog automation testing failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        details: results,
        duration: Date.now() - startTime
      };
    }
  }
}
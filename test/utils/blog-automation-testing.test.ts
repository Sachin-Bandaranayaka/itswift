/**
 * Blog Automation Testing Utilities Tests
 * 
 * Tests for the comprehensive blog automation testing utilities that verify
 * blog post creation, scheduling, and publication functionality.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BlogAutomationTesting } from './blog-automation-testing';
import { BlogTestDataGenerator, GeneratedTestPost } from '@/lib/services/blog-test-data-generator';
import { BlogTestHelpers } from './blog-test-helpers';
import { client } from '@/lib/sanity.client';

// Mock dependencies
vi.mock('@/lib/services/blog-test-data-generator');
vi.mock('./blog-test-helpers');
vi.mock('@/lib/sanity.client', () => ({
  client: {
    fetch: vi.fn()
  }
}));

const mockGenerator = vi.mocked(BlogTestDataGenerator);
const mockHelpers = vi.mocked(BlogTestHelpers);
const mockClient = vi.mocked(client);

describe('BlogAutomationTesting', () => {
  let mockGeneratorInstance: any;

  beforeEach(() => {
    mockGeneratorInstance = {
      generateTestBlogPosts: vi.fn(),
      createImmediateScheduledPost: vi.fn(),
      createPostsWithScheduleTimes: vi.fn()
    };

    mockGenerator.getInstance.mockReturnValue(mockGeneratorInstance);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('testBlogPostCreation', () => {
    it('should successfully test blog post creation with different statuses', async () => {
      const mockResult = {
        published: [
          { _id: 'pub-1', title: 'Published 1', status: 'published' as const, slug: { current: 'pub-1' }, _createdAt: '2024-01-01' }
        ],
        scheduled: [
          { _id: 'sch-1', title: 'Scheduled 1', status: 'scheduled' as const, slug: { current: 'sch-1' }, _createdAt: '2024-01-01' }
        ],
        drafts: [
          { _id: 'draft-1', title: 'Draft 1', status: 'draft' as const, slug: { current: 'draft-1' }, _createdAt: '2024-01-01' }
        ],
        posts: [
          { _id: 'pub-1', title: 'Published 1', status: 'published' as const, slug: { current: 'pub-1' }, _createdAt: '2024-01-01' },
          { _id: 'sch-1', title: 'Scheduled 1', status: 'scheduled' as const, slug: { current: 'sch-1' }, _createdAt: '2024-01-01' },
          { _id: 'draft-1', title: 'Draft 1', status: 'draft' as const, slug: { current: 'draft-1' }, _createdAt: '2024-01-01' }
        ],
        error: null
      };

      mockGeneratorInstance.generateTestBlogPosts.mockResolvedValue(mockResult);

      // Mock visibility verification
      const mockPublishedPosts = [{ _id: 'pub-1' }];
      mockClient.fetch.mockResolvedValue(mockPublishedPosts);

      const result = await BlogAutomationTesting.testBlogPostCreation({
        publishedCount: 1,
        scheduledCount: 1,
        draftCount: 1,
        verifyVisibility: true
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain('Successfully created and verified 3 test blog posts');
      expect(result.details.created.total).toBe(3);
      expect(result.details.created.published).toBe(1);
      expect(result.details.created.scheduled).toBe(1);
      expect(result.details.created.drafts).toBe(1);
      expect(result.duration).toBeGreaterThan(0);
    });

    it('should handle post generation errors', async () => {
      const mockResult = {
        published: [],
        scheduled: [],
        drafts: [],
        posts: [],
        error: 'Generation failed'
      };

      mockGeneratorInstance.generateTestBlogPosts.mockResolvedValue(mockResult);

      const result = await BlogAutomationTesting.testBlogPostCreation();

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to create test blog posts');
      expect(result.error).toBe('Generation failed');
    });

    it('should handle visibility verification failures', async () => {
      const mockResult = {
        published: [
          { _id: 'pub-1', title: 'Published 1', status: 'published' as const, slug: { current: 'pub-1' }, _createdAt: '2024-01-01' }
        ],
        scheduled: [],
        drafts: [],
        posts: [
          { _id: 'pub-1', title: 'Published 1', status: 'published' as const, slug: { current: 'pub-1' }, _createdAt: '2024-01-01' }
        ],
        error: null
      };

      mockGeneratorInstance.generateTestBlogPosts.mockResolvedValue(mockResult);

      // Mock visibility verification to fail
      mockClient.fetch.mockResolvedValue([]); // No published posts found

      const result = await BlogAutomationTesting.testBlogPostCreation({
        verifyVisibility: true
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('Post visibility verification failed');
    });

    it('should handle exceptions during testing', async () => {
      mockGeneratorInstance.generateTestBlogPosts.mockRejectedValue(new Error('Unexpected error'));

      const result = await BlogAutomationTesting.testBlogPostCreation();

      expect(result.success).toBe(false);
      expect(result.message).toBe('Blog post creation test failed with error');
      expect(result.error).toBe('Unexpected error');
    });
  });

  describe('testSchedulerFunctionality', () => {
    it('should successfully test scheduler functionality', async () => {
      const mockScheduledPosts = [
        { _id: 'sch-1', title: 'Immediate 1', status: 'scheduled' as const, slug: { current: 'sch-1' }, _createdAt: '2024-01-01' },
        { _id: 'sch-2', title: 'Immediate 2', status: 'scheduled' as const, slug: { current: 'sch-2' }, _createdAt: '2024-01-01' }
      ];

      mockGeneratorInstance.createImmediateScheduledPost
        .mockResolvedValueOnce(mockScheduledPosts[0])
        .mockResolvedValueOnce(mockScheduledPosts[1]);

      // Mock helpers
      mockHelpers.verifyScheduledPostsHidden.mockResolvedValue(true);
      mockHelpers.verifyPublishedPostsVisible.mockResolvedValue(true);

      const result = await BlogAutomationTesting.testSchedulerFunctionality({
        immediatePostCount: 2,
        scheduleOffsetMinutes: [1, 2],
        timeoutMs: 1000 // Short timeout for testing
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain('Scheduler successfully published 2 posts');
      expect(result.details.scheduledPosts).toHaveLength(2);
    });

    it('should handle failure to create scheduled posts', async () => {
      mockGeneratorInstance.createImmediateScheduledPost
        .mockResolvedValue(null);

      const result = await BlogAutomationTesting.testSchedulerFunctionality({
        immediatePostCount: 1
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to create any scheduled posts for testing');
    });

    it('should handle posts that are incorrectly visible before publication', async () => {
      const mockScheduledPost = { 
        _id: 'sch-1', 
        title: 'Immediate 1', 
        status: 'scheduled' as const, 
        slug: { current: 'sch-1' }, 
        _createdAt: '2024-01-01' 
      };

      mockGeneratorInstance.createImmediateScheduledPost.mockResolvedValue(mockScheduledPost);
      mockHelpers.verifyScheduledPostsHidden.mockResolvedValue(false); // Posts are incorrectly visible

      const result = await BlogAutomationTesting.testSchedulerFunctionality({
        immediatePostCount: 1
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe('Scheduled posts are incorrectly visible before publication time');
    });

    it('should handle scheduler timeout', async () => {
      const mockScheduledPost = { 
        _id: 'sch-1', 
        title: 'Immediate 1', 
        status: 'scheduled' as const, 
        slug: { current: 'sch-1' }, 
        _createdAt: '2024-01-01' 
      };

      mockGeneratorInstance.createImmediateScheduledPost.mockResolvedValue(mockScheduledPost);
      mockHelpers.verifyScheduledPostsHidden.mockResolvedValue(true);
      mockHelpers.verifyPublishedPostsVisible.mockResolvedValue(false); // Never becomes published

      // Mock the waitForSchedulerPublication to return false immediately
      const waitSpy = vi.spyOn(BlogAutomationTesting as any, 'waitForSchedulerPublication').mockResolvedValue(false);
      
      const result = await BlogAutomationTesting.testSchedulerFunctionality({
        immediatePostCount: 1,
        timeoutMs: 100 // Very short timeout
      });
      
      waitSpy.mockRestore();

      expect(result.success).toBe(false);
      expect(result.message).toBe('Scheduler failed to publish posts within timeout period');
    }, 1000); // 1 second timeout for this test

    it('should handle exceptions during scheduler testing', async () => {
      mockGeneratorInstance.createImmediateScheduledPost.mockRejectedValue(new Error('Creation failed'));

      const result = await BlogAutomationTesting.testSchedulerFunctionality();

      expect(result.success).toBe(false);
      expect(result.message).toBe('Scheduler functionality test failed with error');
      expect(result.error).toBe('Creation failed');
    });
  });

  describe('verifyPostVisibility', () => {
    it('should verify post visibility correctly', async () => {
      const testPosts: GeneratedTestPost[] = [
        { _id: 'pub-1', title: 'Published', status: 'published', slug: { current: 'pub-1' }, _createdAt: '2024-01-01' },
        { _id: 'sch-1', title: 'Scheduled', status: 'scheduled', slug: { current: 'sch-1' }, _createdAt: '2024-01-01' },
        { _id: 'draft-1', title: 'Draft', status: 'draft', slug: { current: 'draft-1' }, _createdAt: '2024-01-01' }
      ];

      // Mock published posts query
      const mockPublishedPosts = [{ _id: 'pub-1', title: 'Published', publishedAt: '2024-01-01' }];
      mockClient.fetch
        .mockResolvedValueOnce(mockPublishedPosts) // For visibility check
        .mockResolvedValueOnce({ _id: 'pub-1', status: 'published' }) // For status check
        .mockResolvedValueOnce({ _id: 'sch-1', status: 'scheduled' }) // For status check
        .mockResolvedValueOnce({ _id: 'draft-1', status: 'draft' }); // For status check

      const results = await BlogAutomationTesting.verifyPostVisibility(testPosts);

      expect(results).toHaveLength(3);
      
      // Published post should be visible and pass
      expect(results[0].postId).toBe('pub-1');
      expect(results[0].isVisible).toBe(true);
      expect(results[0].shouldBeVisible).toBe(true);
      expect(results[0].passed).toBe(true);
      
      // Scheduled post should not be visible and pass
      expect(results[1].postId).toBe('sch-1');
      expect(results[1].isVisible).toBe(false);
      expect(results[1].shouldBeVisible).toBe(false);
      expect(results[1].passed).toBe(true);
      
      // Draft post should not be visible and pass
      expect(results[2].postId).toBe('draft-1');
      expect(results[2].isVisible).toBe(false);
      expect(results[2].shouldBeVisible).toBe(false);
      expect(results[2].passed).toBe(true);
    });

    it('should handle visibility check errors', async () => {
      const testPosts: GeneratedTestPost[] = [
        { _id: 'pub-1', title: 'Published', status: 'published', slug: { current: 'pub-1' }, _createdAt: '2024-01-01' }
      ];

      mockClient.fetch.mockRejectedValue(new Error('Fetch failed'));

      const results = await BlogAutomationTesting.verifyPostVisibility(testPosts);

      expect(results).toHaveLength(1);
      expect(results[0].actualStatus).toBe('error');
      expect(results[0].passed).toBe(false);
    });
  });

  describe('test scenarios', () => {
    describe('createComprehensiveAutomationTestScenario', () => {
      it('should create comprehensive automation test scenario', () => {
        const scenario = BlogAutomationTesting.createComprehensiveAutomationTestScenario();

        expect(scenario.name).toBe('Comprehensive Blog Automation Test');
        expect(scenario.description).toBeTruthy();
        expect(typeof scenario.setup).toBe('function');
        expect(typeof scenario.verify).toBe('function');
        expect(typeof scenario.cleanup).toBe('function');
      });
    });

    describe('createSchedulerAutomationTestScenario', () => {
      it('should create scheduler automation test scenario', () => {
        const scenario = BlogAutomationTesting.createSchedulerAutomationTestScenario();

        expect(scenario.name).toBe('Scheduler Automation Test');
        expect(scenario.description).toBeTruthy();
        expect(typeof scenario.setup).toBe('function');
        expect(typeof scenario.verify).toBe('function');
        expect(typeof scenario.cleanup).toBe('function');
      });
    });
  });

  describe('runAllAutomationTests', () => {
    it('should run all automation tests successfully', async () => {
      // Mock all the individual test methods
      const mockCreationResult = {
        success: true,
        message: 'Creation test passed',
        details: { posts: [] }
      };

      const mockSchedulerResult = {
        success: true,
        message: 'Scheduler test passed',
        details: { scheduledPosts: [] }
      };

      const mockScenarioResult = {
        success: true,
        posts: []
      };

      // Spy on the static methods
      const creationSpy = vi.spyOn(BlogAutomationTesting, 'testBlogPostCreation').mockResolvedValue(mockCreationResult);
      const schedulerSpy = vi.spyOn(BlogAutomationTesting, 'testSchedulerFunctionality').mockResolvedValue(mockSchedulerResult);
      
      mockHelpers.runTestScenario.mockResolvedValue(mockScenarioResult);
      mockHelpers.cleanupAllTestPosts.mockResolvedValue(5);

      const result = await BlogAutomationTesting.runAllAutomationTests();

      expect(result.success).toBe(true);
      expect(result.message).toBe('All blog automation tests passed successfully');
      expect(result.details.creation).toEqual(mockCreationResult);
      expect(result.details.scheduler).toEqual(mockSchedulerResult);
      expect(result.details.comprehensive).toEqual(mockScenarioResult);
      expect(result.duration).toBeGreaterThanOrEqual(0);

      // Verify all tests were called
      expect(creationSpy).toHaveBeenCalled();
      expect(schedulerSpy).toHaveBeenCalled();
      expect(mockHelpers.runTestScenario).toHaveBeenCalled();
      expect(mockHelpers.cleanupAllTestPosts).toHaveBeenCalled();

      creationSpy.mockRestore();
      schedulerSpy.mockRestore();
    });

    it('should handle test failures and cleanup', async () => {
      // Mock creation test to fail
      const mockCreationResult = {
        success: false,
        message: 'Creation test failed',
        error: 'Test error'
      };

      const creationSpy = vi.spyOn(BlogAutomationTesting, 'testBlogPostCreation').mockResolvedValue(mockCreationResult);
      mockHelpers.cleanupAllTestPosts.mockResolvedValue(3);

      const result = await BlogAutomationTesting.runAllAutomationTests();

      expect(result.success).toBe(false);
      expect(result.message).toBe('Blog automation testing failed');
      expect(result.error).toContain('Blog post creation test failed');
      
      // Verify cleanup was still called
      expect(mockHelpers.cleanupAllTestPosts).toHaveBeenCalled();

      creationSpy.mockRestore();
    });

    it('should handle exceptions during testing', async () => {
      const creationSpy = vi.spyOn(BlogAutomationTesting, 'testBlogPostCreation').mockRejectedValue(new Error('Unexpected error'));
      mockHelpers.cleanupAllTestPosts.mockResolvedValue(0);

      const result = await BlogAutomationTesting.runAllAutomationTests();

      expect(result.success).toBe(false);
      expect(result.message).toBe('Blog automation testing failed');
      expect(result.error).toBe('Unexpected error');

      creationSpy.mockRestore();
    });
  });
});
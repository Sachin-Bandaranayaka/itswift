/**
 * Blog Test Helpers Tests
 * 
 * Tests for the blog test helper utilities that provide convenient methods
 * for setting up test data and verifying blog post functionality.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BlogTestHelpers } from './blog-test-helpers';
import { BlogTestDataGenerator } from '@/lib/services/blog-test-data-generator';
import { client } from '@/lib/sanity.client';

// Mock dependencies
vi.mock('@/lib/services/blog-test-data-generator');
vi.mock('@/lib/sanity.client', () => ({
  client: {
    fetch: vi.fn()
  }
}));

const mockGenerator = vi.mocked(BlogTestDataGenerator);
const mockClient = vi.mocked(client);

describe('BlogTestHelpers', () => {
  let mockGeneratorInstance: any;

  beforeEach(() => {
    mockGeneratorInstance = {
      generateTestBlogPosts: vi.fn(),
      createImmediateScheduledPost: vi.fn(),
      createPostsWithScheduleTimes: vi.fn(),
      getTestPostsStatus: vi.fn(),
      cleanupTestPosts: vi.fn(),
      createComprehensiveTestDataset: vi.fn()
    };

    mockGenerator.getInstance.mockReturnValue(mockGeneratorInstance);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('createBasicTestPosts', () => {
    it('should create basic test posts successfully', async () => {
      const mockResult = {
        published: [{ _id: 'pub-1', title: 'Published', status: 'published' as const, slug: { current: 'pub-1' }, _createdAt: '2024-01-01' }],
        scheduled: [{ _id: 'sch-1', title: 'Scheduled', status: 'scheduled' as const, slug: { current: 'sch-1' }, _createdAt: '2024-01-01' }],
        drafts: [{ _id: 'draft-1', title: 'Draft', status: 'draft' as const, slug: { current: 'draft-1' }, _createdAt: '2024-01-01' }],
        posts: [],
        error: null
      };

      mockGeneratorInstance.generateTestBlogPosts.mockResolvedValue(mockResult);

      const result = await BlogTestHelpers.createBasicTestPosts();

      expect(result.published).toHaveLength(1);
      expect(result.scheduled).toHaveLength(1);
      expect(result.drafts).toHaveLength(1);
      
      expect(mockGeneratorInstance.generateTestBlogPosts).toHaveBeenCalledWith({
        publishedCount: 1,
        scheduledCount: 1,
        draftCount: 1,
        scheduleTimeOffsets: [2]
      });
    });

    it('should throw error when generation fails', async () => {
      const mockResult = {
        published: [],
        scheduled: [],
        drafts: [],
        posts: [],
        error: 'Generation failed'
      };

      mockGeneratorInstance.generateTestBlogPosts.mockResolvedValue(mockResult);

      await expect(BlogTestHelpers.createBasicTestPosts()).rejects.toThrow('Failed to create basic test posts: Generation failed');
    });
  });

  describe('createSchedulerTestPosts', () => {
    it('should create posts for scheduler testing', async () => {
      const mockPosts = [
        { _id: 'sch-1', title: 'Scheduler Test 1', status: 'scheduled' as const, slug: { current: 'sch-1' }, _createdAt: '2024-01-01' },
        { _id: 'sch-2', title: 'Scheduler Test 2', status: 'scheduled' as const, slug: { current: 'sch-2' }, _createdAt: '2024-01-01' }
      ];

      mockGeneratorInstance.createImmediateScheduledPost
        .mockResolvedValueOnce(mockPosts[0])
        .mockResolvedValueOnce(mockPosts[1]);

      const result = await BlogTestHelpers.createSchedulerTestPosts([1, 2]);

      expect(result).toHaveLength(2);
      expect(mockGeneratorInstance.createImmediateScheduledPost).toHaveBeenCalledTimes(2);
      expect(mockGeneratorInstance.createImmediateScheduledPost).toHaveBeenCalledWith(1);
      expect(mockGeneratorInstance.createImmediateScheduledPost).toHaveBeenCalledWith(2);
    });

    it('should handle null responses from generator', async () => {
      mockGeneratorInstance.createImmediateScheduledPost
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ _id: 'sch-1', title: 'Test', status: 'scheduled' as const, slug: { current: 'sch-1' }, _createdAt: '2024-01-01' });

      const result = await BlogTestHelpers.createSchedulerTestPosts([1, 2]);

      expect(result).toHaveLength(1);
    });
  });

  describe('createPostsWithSpecificDates', () => {
    it('should create posts with specific dates', async () => {
      const dates = [new Date('2024-01-01'), new Date('2024-01-02')];
      const mockResult = {
        posts: [
          { _id: 'post-1', title: 'Post 1', status: 'scheduled' as const, slug: { current: 'post-1' }, _createdAt: '2024-01-01' },
          { _id: 'post-2', title: 'Post 2', status: 'scheduled' as const, slug: { current: 'post-2' }, _createdAt: '2024-01-01' }
        ],
        error: null
      };

      mockGeneratorInstance.createPostsWithScheduleTimes.mockResolvedValue(mockResult);

      const result = await BlogTestHelpers.createPostsWithSpecificDates(dates);

      expect(result).toHaveLength(2);
      expect(mockGeneratorInstance.createPostsWithScheduleTimes).toHaveBeenCalledWith(dates);
    });

    it('should throw error when creation fails', async () => {
      const dates = [new Date('2024-01-01')];
      const mockResult = {
        posts: [],
        error: 'Creation failed'
      };

      mockGeneratorInstance.createPostsWithScheduleTimes.mockResolvedValue(mockResult);

      await expect(BlogTestHelpers.createPostsWithSpecificDates(dates)).rejects.toThrow('Failed to create posts with specific dates: Creation failed');
    });
  });

  describe('verifyPostExists', () => {
    it('should verify post exists with correct status', async () => {
      const mockPost = {
        _id: 'post-1',
        title: 'Test Post',
        publishedAt: '2024-01-01T00:00:00Z',
        status: 'published'
      };

      mockClient.fetch.mockResolvedValue(mockPost);

      const result = await BlogTestHelpers.verifyPostExists('post-1', 'published');

      expect(result).toBe(true);
      expect(mockClient.fetch).toHaveBeenCalledWith(
        expect.stringContaining('*[_type == "post" && _id == $postId][0]'),
        expect.objectContaining({ postId: 'post-1' })
      );
    });

    it('should return false when post not found', async () => {
      mockClient.fetch.mockResolvedValue(null);

      const result = await BlogTestHelpers.verifyPostExists('post-1', 'published');

      expect(result).toBe(false);
    });

    it('should return false when status does not match', async () => {
      const mockPost = {
        _id: 'post-1',
        title: 'Test Post',
        status: 'draft'
      };

      mockClient.fetch.mockResolvedValue(mockPost);

      const result = await BlogTestHelpers.verifyPostExists('post-1', 'published');

      expect(result).toBe(false);
    });

    it('should handle fetch errors', async () => {
      mockClient.fetch.mockRejectedValue(new Error('Fetch failed'));

      const result = await BlogTestHelpers.verifyPostExists('post-1', 'published');

      expect(result).toBe(false);
    });
  });

  describe('verifyPublishedPostsVisible', () => {
    it('should verify published posts are visible', async () => {
      const mockPublishedPosts = [
        { _id: 'post-1' },
        { _id: 'post-2' },
        { _id: 'post-3' }
      ];

      mockClient.fetch.mockResolvedValue(mockPublishedPosts);

      const result = await BlogTestHelpers.verifyPublishedPostsVisible(['post-1', 'post-2']);

      expect(result).toBe(true);
    });

    it('should return false when some posts are not visible', async () => {
      const mockPublishedPosts = [
        { _id: 'post-1' }
      ];

      mockClient.fetch.mockResolvedValue(mockPublishedPosts);

      const result = await BlogTestHelpers.verifyPublishedPostsVisible(['post-1', 'post-2']);

      expect(result).toBe(false);
    });

    it('should handle fetch errors', async () => {
      mockClient.fetch.mockRejectedValue(new Error('Fetch failed'));

      const result = await BlogTestHelpers.verifyPublishedPostsVisible(['post-1']);

      expect(result).toBe(false);
    });
  });

  describe('verifyScheduledPostsHidden', () => {
    it('should verify scheduled posts are hidden', async () => {
      const mockPublishedPosts = [
        { _id: 'post-1' }
      ];

      mockClient.fetch.mockResolvedValue(mockPublishedPosts);

      const result = await BlogTestHelpers.verifyScheduledPostsHidden(['post-2', 'post-3']);

      expect(result).toBe(true);
    });

    it('should return false when scheduled posts are visible', async () => {
      const mockPublishedPosts = [
        { _id: 'post-1' },
        { _id: 'post-2' }
      ];

      mockClient.fetch.mockResolvedValue(mockPublishedPosts);

      const result = await BlogTestHelpers.verifyScheduledPostsHidden(['post-2']);

      expect(result).toBe(false);
    });
  });

  describe('getTestPostsStatus', () => {
    it('should get test posts status', async () => {
      const mockPosts = [
        { _id: 'post-1', title: 'Test 1', status: 'published', _createdAt: '2024-01-01' },
        { _id: 'post-2', title: 'Test 2', status: 'scheduled', _createdAt: '2024-01-01' }
      ];

      const mockResult = {
        posts: mockPosts,
        error: null
      };

      mockGeneratorInstance.getTestPostsStatus.mockResolvedValue(mockResult);

      const result = await BlogTestHelpers.getTestPostsStatus();

      expect(result).toEqual(mockPosts);
    });

    it('should throw error when getting status fails', async () => {
      const mockResult = {
        posts: [],
        error: 'Fetch failed'
      };

      mockGeneratorInstance.getTestPostsStatus.mockResolvedValue(mockResult);

      await expect(BlogTestHelpers.getTestPostsStatus()).rejects.toThrow('Failed to get test posts status: Fetch failed');
    });
  });

  describe('cleanupAllTestPosts', () => {
    it('should cleanup all test posts', async () => {
      const mockResult = {
        deletedCount: 5,
        error: null
      };

      mockGeneratorInstance.cleanupTestPosts.mockResolvedValue(mockResult);

      const result = await BlogTestHelpers.cleanupAllTestPosts();

      expect(result).toBe(5);
    });

    it('should throw error when cleanup fails', async () => {
      const mockResult = {
        deletedCount: 0,
        error: 'Cleanup failed'
      };

      mockGeneratorInstance.cleanupTestPosts.mockResolvedValue(mockResult);

      await expect(BlogTestHelpers.cleanupAllTestPosts()).rejects.toThrow('Failed to cleanup test posts: Cleanup failed');
    });
  });

  describe('test scenarios', () => {
    describe('createEndToEndTestScenario', () => {
      it('should create end-to-end test scenario', () => {
        const scenario = BlogTestHelpers.createEndToEndTestScenario();

        expect(scenario.name).toBe('End-to-End Blog Automation Test');
        expect(scenario.description).toBeTruthy();
        expect(typeof scenario.setup).toBe('function');
        expect(typeof scenario.verify).toBe('function');
        expect(typeof scenario.cleanup).toBe('function');
      });
    });

    describe('createSchedulerTestScenario', () => {
      it('should create scheduler test scenario', () => {
        const scenario = BlogTestHelpers.createSchedulerTestScenario();

        expect(scenario.name).toBe('Blog Scheduler Test');
        expect(scenario.description).toBeTruthy();
        expect(typeof scenario.setup).toBe('function');
        expect(typeof scenario.verify).toBe('function');
        expect(typeof scenario.cleanup).toBe('function');
      });
    });

    describe('runTestScenario', () => {
      it('should run test scenario successfully', async () => {
        const mockPosts = [
          { _id: 'post-1', title: 'Test', status: 'published' as const, slug: { current: 'post-1' }, _createdAt: '2024-01-01' }
        ];

        const scenario = {
          name: 'Test Scenario',
          description: 'Test description',
          setup: vi.fn().mockResolvedValue(mockPosts),
          verify: vi.fn().mockResolvedValue(true),
          cleanup: vi.fn().mockResolvedValue(undefined)
        };

        const result = await BlogTestHelpers.runTestScenario(scenario);

        expect(result.success).toBe(true);
        expect(result.posts).toEqual(mockPosts);
        expect(scenario.setup).toHaveBeenCalled();
        expect(scenario.verify).toHaveBeenCalledWith(mockPosts);
        expect(scenario.cleanup).toHaveBeenCalled();
      });

      it('should handle scenario failures and cleanup', async () => {
        const scenario = {
          name: 'Test Scenario',
          description: 'Test description',
          setup: vi.fn().mockRejectedValue(new Error('Setup failed')),
          verify: vi.fn(),
          cleanup: vi.fn().mockResolvedValue(undefined)
        };

        const result = await BlogTestHelpers.runTestScenario(scenario);

        expect(result.success).toBe(false);
        expect(result.error).toBe('Setup failed');
        expect(scenario.cleanup).toHaveBeenCalled();
      });

      it('should handle cleanup failures', async () => {
        const scenario = {
          name: 'Test Scenario',
          description: 'Test description',
          setup: vi.fn().mockRejectedValue(new Error('Setup failed')),
          verify: vi.fn(),
          cleanup: vi.fn().mockRejectedValue(new Error('Cleanup failed'))
        };

        const result = await BlogTestHelpers.runTestScenario(scenario);

        expect(result.success).toBe(false);
        expect(result.error).toBe('Setup failed');
      });
    });
  });

  describe('waitForPostsToBePublished', () => {
    it('should return true when posts are published quickly', async () => {
      // Mock verifyPublishedPostsVisible to return true immediately
      const spy = vi.spyOn(BlogTestHelpers, 'verifyPublishedPostsVisible').mockResolvedValue(true);

      const result = await BlogTestHelpers.waitForPostsToBePublished(['post-1'], 1000);

      expect(result).toBe(true);
      expect(spy).toHaveBeenCalledWith(['post-1']);
      
      spy.mockRestore();
    });

    it('should return false when timeout is reached', async () => {
      // Mock verifyPublishedPostsVisible to always return false
      const spy = vi.spyOn(BlogTestHelpers, 'verifyPublishedPostsVisible').mockResolvedValue(false);

      const result = await BlogTestHelpers.waitForPostsToBePublished(['post-1'], 100); // Very short timeout

      expect(result).toBe(false);
      
      spy.mockRestore();
    }, 10000); // Increase test timeout
  });
});
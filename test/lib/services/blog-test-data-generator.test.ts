/**
 * Blog Test Data Generator Tests
 * 
 * Tests for the blog test data generation service that creates sample blog posts
 * with different publication statuses for testing the blog automation system.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BlogTestDataGenerator } from '@/lib/services/blog-test-data-generator';
import { client } from '@/lib/sanity.client';

// Mock Sanity client
vi.mock('@/lib/sanity.client', () => ({
  client: {
    create: vi.fn(),
    fetch: vi.fn(),
    delete: vi.fn()
  }
}));

const mockClient = vi.mocked(client);

describe('BlogTestDataGenerator', () => {
  let generator: BlogTestDataGenerator;

  beforeEach(() => {
    generator = BlogTestDataGenerator.getInstance();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getInstance', () => {
    it('should return a singleton instance', () => {
      const instance1 = BlogTestDataGenerator.getInstance();
      const instance2 = BlogTestDataGenerator.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('generateTestBlogPosts', () => {
    it('should generate test posts with default options', async () => {
      const mockCreatedPost = {
        _id: 'test-post-1',
        _createdAt: '2024-01-01T00:00:00Z',
        title: 'Test Published Post 1'
      };

      mockClient.create.mockResolvedValue(mockCreatedPost);

      const result = await generator.generateTestBlogPosts();

      expect(result.error).toBeNull();
      expect(result.posts).toHaveLength(3); // 1 published + 1 scheduled + 1 draft
      expect(result.published).toHaveLength(1);
      expect(result.scheduled).toHaveLength(1);
      expect(result.drafts).toHaveLength(1);
      
      // Verify client.create was called 3 times
      expect(mockClient.create).toHaveBeenCalledTimes(3);
    });

    it('should generate posts with custom counts', async () => {
      const mockCreatedPost = {
        _id: 'test-post-1',
        _createdAt: '2024-01-01T00:00:00Z',
        title: 'Test Post'
      };

      mockClient.create.mockResolvedValue(mockCreatedPost);

      const result = await generator.generateTestBlogPosts({
        publishedCount: 2,
        scheduledCount: 3,
        draftCount: 1
      });

      expect(result.error).toBeNull();
      expect(result.posts).toHaveLength(6); // 2 + 3 + 1
      expect(result.published).toHaveLength(2);
      expect(result.scheduled).toHaveLength(3);
      expect(result.drafts).toHaveLength(1);
      
      expect(mockClient.create).toHaveBeenCalledTimes(6);
    });

    it('should handle Sanity client errors gracefully', async () => {
      mockClient.create.mockRejectedValue(new Error('Sanity connection failed'));

      const result = await generator.generateTestBlogPosts();

      expect(result.error).toBe('Sanity connection failed');
      expect(result.posts).toHaveLength(0);
      expect(result.published).toHaveLength(0);
      expect(result.scheduled).toHaveLength(0);
      expect(result.drafts).toHaveLength(0);
    });

    it('should create posts with correct document structure', async () => {
      const mockCreatedPost = {
        _id: 'test-post-1',
        _createdAt: '2024-01-01T00:00:00Z',
        title: 'Test Published Post 1'
      };

      mockClient.create.mockResolvedValue(mockCreatedPost);

      await generator.generateTestBlogPosts({
        publishedCount: 1,
        scheduledCount: 0,
        draftCount: 0,
        authorId: 'author-123',
        categoryIds: ['cat-1', 'cat-2']
      });

      expect(mockClient.create).toHaveBeenCalledWith(
        expect.objectContaining({
          _type: 'post',
          title: 'Test Published Post 1',
          slug: expect.objectContaining({
            _type: 'slug',
            current: expect.stringMatching(/test-published-post-1-\d+/)
          }),
          body: expect.any(Array),
          publishedAt: expect.any(String),
          author: {
            _type: 'reference',
            _ref: 'author-123'
          },
          categories: [
            { _type: 'reference', _ref: 'cat-1' },
            { _type: 'reference', _ref: 'cat-2' }
          ]
        })
      );
    });
  });

  describe('createTestPost', () => {
    it('should create a single test post successfully', async () => {
      const mockCreatedPost = {
        _id: 'test-post-1',
        _createdAt: '2024-01-01T00:00:00Z',
        title: 'Test Post'
      };

      mockClient.create.mockResolvedValue(mockCreatedPost);

      const result = await generator.createTestPost({
        title: 'Test Post',
        slug: 'test-post',
        content: 'Test content',
        status: 'published',
        publishedAt: '2024-01-01T00:00:00Z'
      });

      expect(result).toEqual({
        _id: 'test-post-1',
        title: 'Test Post',
        slug: { current: 'test-post' },
        publishedAt: '2024-01-01T00:00:00Z',
        status: 'published',
        _createdAt: '2024-01-01T00:00:00Z'
      });
    });

    it('should return null when creation fails', async () => {
      mockClient.create.mockRejectedValue(new Error('Creation failed'));

      const result = await generator.createTestPost({
        title: 'Test Post',
        slug: 'test-post',
        content: 'Test content',
        status: 'draft'
      });

      expect(result).toBeNull();
    });

    it('should create draft post without publishedAt', async () => {
      const mockCreatedPost = {
        _id: 'test-post-1',
        _createdAt: '2024-01-01T00:00:00Z',
        title: 'Test Draft'
      };

      mockClient.create.mockResolvedValue(mockCreatedPost);

      await generator.createTestPost({
        title: 'Test Draft',
        slug: 'test-draft',
        content: 'Draft content',
        status: 'draft'
      });

      expect(mockClient.create).toHaveBeenCalledWith(
        expect.not.objectContaining({
          publishedAt: expect.anything()
        })
      );
    });
  });

  describe('createImmediateScheduledPost', () => {
    it('should create a post scheduled for near future', async () => {
      const mockCreatedPost = {
        _id: 'immediate-post-1',
        _createdAt: '2024-01-01T00:00:00Z',
        title: 'Immediate Test Post'
      };

      mockClient.create.mockResolvedValue(mockCreatedPost);

      const result = await generator.createImmediateScheduledPost(5);

      expect(result).toBeTruthy();
      expect(result?.status).toBe('scheduled');
      expect(result?.publishedAt).toBeTruthy();
      
      // Verify the scheduled time is approximately 5 minutes from now
      if (result?.publishedAt) {
        const scheduledTime = new Date(result.publishedAt);
        const now = new Date();
        const diffMinutes = (scheduledTime.getTime() - now.getTime()) / (1000 * 60);
        expect(diffMinutes).toBeGreaterThan(4);
        expect(diffMinutes).toBeLessThan(6);
      }
    });
  });

  describe('createPostsWithScheduleTimes', () => {
    it('should create posts with specific schedule times', async () => {
      const mockCreatedPost = {
        _id: 'scheduled-post-1',
        _createdAt: '2024-01-01T00:00:00Z',
        title: 'Scheduled Test Post'
      };

      mockClient.create.mockResolvedValue(mockCreatedPost);

      const scheduleTimes = [
        new Date('2024-01-01T10:00:00Z'),
        new Date('2024-01-01T11:00:00Z')
      ];

      const result = await generator.createPostsWithScheduleTimes(scheduleTimes);

      expect(result.error).toBeNull();
      expect(result.posts).toHaveLength(2);
      expect(mockClient.create).toHaveBeenCalledTimes(2);
    });

    it('should handle errors when creating scheduled posts', async () => {
      mockClient.create.mockRejectedValue(new Error('Creation failed'));

      const scheduleTimes = [new Date('2024-01-01T10:00:00Z')];
      const result = await generator.createPostsWithScheduleTimes(scheduleTimes);

      expect(result.error).toBe('Creation failed');
      expect(result.posts).toHaveLength(0);
    });
  });

  describe('cleanupTestPosts', () => {
    it('should delete all test posts', async () => {
      const mockTestPosts = [
        { _id: 'post-1', title: 'Test Post 1' },
        { _id: 'post-2', title: 'Test Post 2' },
        { _id: 'post-3', title: 'Immediate Test Post' }
      ];

      mockClient.fetch.mockResolvedValue(mockTestPosts);
      mockClient.delete.mockResolvedValue(true);

      const result = await generator.cleanupTestPosts();

      expect(result.error).toBeNull();
      expect(result.deletedCount).toBe(3);
      expect(mockClient.delete).toHaveBeenCalledTimes(3);
      expect(mockClient.delete).toHaveBeenCalledWith('post-1');
      expect(mockClient.delete).toHaveBeenCalledWith('post-2');
      expect(mockClient.delete).toHaveBeenCalledWith('post-3');
    });

    it('should handle deletion errors gracefully', async () => {
      const mockTestPosts = [
        { _id: 'post-1', title: 'Test Post 1' }
      ];

      mockClient.fetch.mockResolvedValue(mockTestPosts);
      mockClient.delete.mockRejectedValue(new Error('Deletion failed'));

      const result = await generator.cleanupTestPosts();

      expect(result.error).toBeNull();
      expect(result.deletedCount).toBe(0); // No posts successfully deleted
    });

    it('should handle fetch errors', async () => {
      mockClient.fetch.mockRejectedValue(new Error('Fetch failed'));

      const result = await generator.cleanupTestPosts();

      expect(result.error).toBe('Fetch failed');
      expect(result.deletedCount).toBe(0);
    });
  });

  describe('getTestPostsStatus', () => {
    it('should return test posts with their current status', async () => {
      const mockPosts = [
        {
          _id: 'post-1',
          title: 'Test Published Post',
          publishedAt: '2024-01-01T00:00:00Z',
          _createdAt: '2024-01-01T00:00:00Z',
          status: 'published'
        },
        {
          _id: 'post-2',
          title: 'Test Scheduled Post',
          publishedAt: '2024-12-31T23:59:59Z',
          _createdAt: '2024-01-01T00:00:00Z',
          status: 'scheduled'
        },
        {
          _id: 'post-3',
          title: 'Test Draft Post',
          _createdAt: '2024-01-01T00:00:00Z',
          status: 'draft'
        }
      ];

      mockClient.fetch.mockResolvedValue(mockPosts);

      const result = await generator.getTestPostsStatus();

      expect(result.error).toBeNull();
      expect(result.posts).toHaveLength(3);
      expect(result.posts[0].status).toBe('published');
      expect(result.posts[1].status).toBe('scheduled');
      expect(result.posts[2].status).toBe('draft');
    });

    it('should handle fetch errors', async () => {
      mockClient.fetch.mockRejectedValue(new Error('Fetch failed'));

      const result = await generator.getTestPostsStatus();

      expect(result.error).toBe('Fetch failed');
      expect(result.posts).toHaveLength(0);
    });
  });

  describe('createComprehensiveTestDataset', () => {
    it('should create a comprehensive test dataset', async () => {
      const mockCreatedPost = {
        _id: 'test-post-1',
        _createdAt: '2024-01-01T00:00:00Z',
        title: 'Test Post'
      };

      mockClient.create.mockResolvedValue(mockCreatedPost);

      const result = await generator.createComprehensiveTestDataset();

      expect(result.error).toBeNull();
      expect(result.summary.totalPosts).toBe(8); // 3 published + 3 scheduled + 2 drafts
      expect(result.summary.published).toBe(3);
      expect(result.summary.scheduled).toBe(3);
      expect(result.summary.drafts).toBe(2);
      expect(result.posts).toHaveLength(8);
    });

    it('should handle errors in comprehensive dataset creation', async () => {
      mockClient.create.mockRejectedValue(new Error('Creation failed'));

      const result = await generator.createComprehensiveTestDataset();

      expect(result.error).toBe('Creation failed');
      expect(result.summary.totalPosts).toBe(0);
      expect(result.posts).toHaveLength(0);
    });
  });

  describe('content generation', () => {
    it('should generate different content for different post types', async () => {
      const mockCreatedPost = {
        _id: 'test-post-1',
        _createdAt: '2024-01-01T00:00:00Z',
        title: 'Test Post'
      };

      mockClient.create.mockResolvedValue(mockCreatedPost);

      await generator.createTestPost({
        title: 'Published Post',
        slug: 'published-post',
        content: 'Published content',
        status: 'published'
      });

      await generator.createTestPost({
        title: 'Scheduled Post',
        slug: 'scheduled-post',
        content: 'Scheduled content',
        status: 'scheduled'
      });

      await generator.createTestPost({
        title: 'Draft Post',
        slug: 'draft-post',
        content: 'Draft content',
        status: 'draft'
      });

      // Verify that different content was generated for each type
      const calls = mockClient.create.mock.calls;
      expect(calls).toHaveLength(3);
      
      // Each call should have different body content
      const bodies = calls.map(call => call[0].body);
      expect(bodies[0]).not.toEqual(bodies[1]);
      expect(bodies[1]).not.toEqual(bodies[2]);
      expect(bodies[0]).not.toEqual(bodies[2]);
    });

    it('should convert content to proper Sanity block format', async () => {
      const mockCreatedPost = {
        _id: 'test-post-1',
        _createdAt: '2024-01-01T00:00:00Z',
        title: 'Test Post'
      };

      mockClient.create.mockResolvedValue(mockCreatedPost);

      await generator.createTestPost({
        title: 'Test Post',
        slug: 'test-post',
        content: 'Paragraph 1\n\nParagraph 2',
        status: 'published'
      });

      const createCall = mockClient.create.mock.calls[0][0];
      expect(createCall.body).toEqual([
        expect.objectContaining({
          _type: 'block',
          _key: expect.any(String),
          style: 'normal',
          markDefs: [],
          children: [
            expect.objectContaining({
              _type: 'span',
              _key: expect.any(String),
              text: 'Paragraph 1',
              marks: []
            })
          ]
        }),
        expect.objectContaining({
          _type: 'block',
          _key: expect.any(String),
          style: 'normal',
          markDefs: [],
          children: [
            expect.objectContaining({
              _type: 'span',
              _key: expect.any(String),
              text: 'Paragraph 2',
              marks: []
            })
          ]
        })
      ]);
    });
  });
});
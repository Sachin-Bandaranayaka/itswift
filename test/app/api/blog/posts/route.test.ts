import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '@/app/api/blog/posts/route';
import { BlogPublicDataService } from '@/lib/services/blog-public-data';

// Mock the BlogPublicDataService
vi.mock('@/lib/services/blog-public-data');

const mockBlogPosts = [
  {
    _id: '1',
    title: 'Test Post 1',
    slug: { current: 'test-post-1' },
    author: { name: 'John Doe' },
    mainImage: { asset: { url: 'https://example.com/image1.jpg' }, alt: 'Test image 1' },
    categories: [{ title: 'Technology' }],
    publishedAt: '2024-01-15T10:00:00Z',
    excerpt: 'This is a test post excerpt',
    _createdAt: '2024-01-10T10:00:00Z',
    _updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    _id: '2',
    title: 'Test Post 2',
    slug: { current: 'test-post-2' },
    author: { name: 'Jane Smith' },
    categories: [{ title: 'Design' }],
    publishedAt: '2024-01-20T10:00:00Z',
    excerpt: 'Another test post excerpt',
    _createdAt: '2024-01-18T10:00:00Z',
    _updatedAt: '2024-01-20T10:00:00Z'
  }
];

const mockPaginatedResult = {
  posts: mockBlogPosts,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPosts: 2,
    postsPerPage: 9,
    hasNext: false,
    hasPrev: false
  }
};

describe('/api/blog/posts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return published posts with default parameters', async () => {
      vi.mocked(BlogPublicDataService.getFilteredPaginatedPosts).mockResolvedValue(mockPaginatedResult);

      const request = new NextRequest('http://localhost:3000/api/blog/posts');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.posts).toHaveLength(2);
      expect(data.data.pagination.currentPage).toBe(1);
      expect(data.meta.filters.status).toBe('published');
    });

    it('should handle pagination parameters', async () => {
      vi.mocked(BlogPublicDataService.getFilteredPaginatedPosts).mockResolvedValue({
        ...mockPaginatedResult,
        pagination: {
          ...mockPaginatedResult.pagination,
          currentPage: 2,
          postsPerPage: 5
        }
      });

      const request = new NextRequest('http://localhost:3000/api/blog/posts?page=2&limit=5');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.meta.filters.page).toBe(2);
      expect(data.meta.filters.limit).toBe(5);
      expect(BlogPublicDataService.getFilteredPaginatedPosts).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'published',
          sortBy: 'publishedAt',
          order: 'desc'
        }),
        2,
        5
      );
    });

    it('should handle search parameter', async () => {
      vi.mocked(BlogPublicDataService.getFilteredPaginatedPosts).mockResolvedValue(mockPaginatedResult);

      const request = new NextRequest('http://localhost:3000/api/blog/posts?search=test');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.meta.filters.search).toBe('test');
      expect(BlogPublicDataService.getFilteredPaginatedPosts).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'test'
        }),
        1,
        9
      );
    });

    it('should handle category parameter', async () => {
      vi.mocked(BlogPublicDataService.getFilteredPaginatedPosts).mockResolvedValue(mockPaginatedResult);

      const request = new NextRequest('http://localhost:3000/api/blog/posts?category=Technology');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.meta.filters.category).toBe('Technology');
      expect(BlogPublicDataService.getFilteredPaginatedPosts).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 'Technology'
        }),
        1,
        9
      );
    });

    it('should handle sorting parameters', async () => {
      vi.mocked(BlogPublicDataService.getFilteredPaginatedPosts).mockResolvedValue(mockPaginatedResult);

      const request = new NextRequest('http://localhost:3000/api/blog/posts?sortBy=title&order=asc');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.meta.filters.sortBy).toBe('title');
      expect(data.meta.filters.order).toBe('asc');
      expect(BlogPublicDataService.getFilteredPaginatedPosts).toHaveBeenCalledWith(
        expect.objectContaining({
          sortBy: 'title',
          order: 'asc'
        }),
        1,
        9
      );
    });

    it('should handle date range parameters', async () => {
      vi.mocked(BlogPublicDataService.getFilteredPaginatedPosts).mockResolvedValue(mockPaginatedResult);

      const request = new NextRequest('http://localhost:3000/api/blog/posts?dateFrom=2024-01-01&dateTo=2024-01-31');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.meta.filters.dateFrom).toBe('2024-01-01');
      expect(data.meta.filters.dateTo).toBe('2024-01-31');
      expect(BlogPublicDataService.getFilteredPaginatedPosts).toHaveBeenCalledWith(
        expect.objectContaining({
          dateFrom: '2024-01-01',
          dateTo: '2024-01-31'
        }),
        1,
        9
      );
    });

    it('should validate page parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/blog/posts?page=0');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Page number must be greater than 0');
    });

    it('should validate limit parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/blog/posts?limit=101');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Limit must be between 1 and 100');
    });

    it('should validate sortBy parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/blog/posts?sortBy=invalid');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid sortBy parameter. Must be one of: publishedAt, title, _createdAt');
    });

    it('should validate order parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/blog/posts?order=invalid');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid order parameter. Must be either asc or desc');
    });

    it('should validate dateFrom parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/blog/posts?dateFrom=invalid-date');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid dateFrom parameter. Must be a valid ISO date string');
    });

    it('should validate dateTo parameter', async () => {
      const request = new NextRequest('http://localhost:3000/api/blog/posts?dateTo=invalid-date');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid dateTo parameter. Must be a valid ISO date string');
    });

    it('should reject non-published status', async () => {
      const request = new NextRequest('http://localhost:3000/api/blog/posts?status=draft');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Only published posts are available through public API');
    });

    it('should handle service errors', async () => {
      vi.mocked(BlogPublicDataService.getFilteredPaginatedPosts).mockRejectedValue(
        new Error('Database connection failed')
      );

      const request = new NextRequest('http://localhost:3000/api/blog/posts');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Failed to fetch blog posts');
      expect(data.message).toBe('Database connection failed');
    });

    it('should include proper cache headers', async () => {
      vi.mocked(BlogPublicDataService.getFilteredPaginatedPosts).mockResolvedValue(mockPaginatedResult);

      const request = new NextRequest('http://localhost:3000/api/blog/posts');
      const response = await GET(request);

      expect(response.headers.get('Cache-Control')).toBe('public, s-maxage=300, stale-while-revalidate=600');
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('should include timestamp in response metadata', async () => {
      vi.mocked(BlogPublicDataService.getFilteredPaginatedPosts).mockResolvedValue(mockPaginatedResult);

      const request = new NextRequest('http://localhost:3000/api/blog/posts');
      const response = await GET(request);
      const data = await response.json();

      expect(data.meta.timestamp).toBeDefined();
      expect(new Date(data.meta.timestamp)).toBeInstanceOf(Date);
    });
  });
});
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/blog/categories/route';
import { BlogPublicDataService } from '@/lib/services/blog-public-data';

// Mock the BlogPublicDataService
vi.mock('@/lib/services/blog-public-data');

const mockCategories = ['Technology', 'Design', 'Business', 'Development'];

describe('/api/blog/categories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET', () => {
    it('should return available categories', async () => {
      vi.mocked(BlogPublicDataService.getAvailableCategories).mockResolvedValue(mockCategories);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.categories).toEqual(mockCategories);
      expect(data.data.count).toBe(4);
      expect(data.meta.timestamp).toBeDefined();
    });

    it('should handle empty categories', async () => {
      vi.mocked(BlogPublicDataService.getAvailableCategories).mockResolvedValue([]);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.categories).toEqual([]);
      expect(data.data.count).toBe(0);
    });

    it('should handle service errors', async () => {
      vi.mocked(BlogPublicDataService.getAvailableCategories).mockRejectedValue(
        new Error('Failed to fetch categories')
      );

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Failed to fetch blog categories');
      expect(data.message).toBe('Failed to fetch categories');
    });

    it('should include proper cache headers', async () => {
      vi.mocked(BlogPublicDataService.getAvailableCategories).mockResolvedValue(mockCategories);

      const response = await GET();

      expect(response.headers.get('Cache-Control')).toBe('public, s-maxage=600, stale-while-revalidate=1200');
      expect(response.headers.get('Content-Type')).toBe('application/json');
    });

    it('should include timestamp in response metadata', async () => {
      vi.mocked(BlogPublicDataService.getAvailableCategories).mockResolvedValue(mockCategories);

      const response = await GET();
      const data = await response.json();

      expect(data.meta.timestamp).toBeDefined();
      expect(new Date(data.meta.timestamp)).toBeInstanceOf(Date);
    });
  });
});
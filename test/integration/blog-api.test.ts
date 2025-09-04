import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

// Integration test to verify the blog API endpoints work correctly
describe('Blog API Integration Tests', () => {
  let app: any;
  let server: any;
  let baseUrl: string;

  beforeAll(async () => {
    // Skip integration tests in CI or if not explicitly enabled
    if (!process.env.RUN_INTEGRATION_TESTS) {
      return;
    }

    const dev = process.env.NODE_ENV !== 'production';
    app = next({ dev, dir: process.cwd() });
    const handle = app.getRequestHandler();

    await app.prepare();

    server = createServer((req, res) => {
      const parsedUrl = parse(req.url!, true);
      handle(req, res, parsedUrl);
    });

    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        const port = server.address()?.port;
        baseUrl = `http://localhost:${port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
    if (app) {
      await app.close();
    }
  });

  it('should fetch blog posts from API endpoint', async () => {
    if (!process.env.RUN_INTEGRATION_TESTS) {
      return;
    }

    const response = await fetch(`${baseUrl}/api/blog/posts`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(data.data.posts).toBeDefined();
    expect(data.data.pagination).toBeDefined();
    expect(data.meta).toBeDefined();
    expect(data.meta.timestamp).toBeDefined();
  });

  it('should fetch blog categories from API endpoint', async () => {
    if (!process.env.RUN_INTEGRATION_TESTS) {
      return;
    }

    const response = await fetch(`${baseUrl}/api/blog/categories`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(data.data.categories).toBeDefined();
    expect(Array.isArray(data.data.categories)).toBe(true);
    expect(data.data.count).toBeDefined();
  });

  it('should handle pagination parameters', async () => {
    if (!process.env.RUN_INTEGRATION_TESTS) {
      return;
    }

    const response = await fetch(`${baseUrl}/api/blog/posts?page=1&limit=5`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.meta.filters.page).toBe(1);
    expect(data.meta.filters.limit).toBe(5);
  });

  it('should validate invalid parameters', async () => {
    if (!process.env.RUN_INTEGRATION_TESTS) {
      return;
    }

    const response = await fetch(`${baseUrl}/api/blog/posts?page=0`);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Page number must be greater than 0');
  });
});
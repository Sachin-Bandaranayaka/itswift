# Blog API Endpoints

This document describes the public blog API endpoints that provide access to published blog posts and categories.

## Base URL

All endpoints are relative to your application's base URL: `/api/blog`

## Authentication

These are public endpoints and do not require authentication. Only published posts are accessible through these endpoints.

## Endpoints

### GET /api/blog/posts

Retrieves published blog posts with filtering, sorting, and pagination support.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (must be > 0) |
| `limit` | integer | 9 | Number of posts per page (1-100) |
| `sortBy` | string | 'publishedAt' | Sort field: 'publishedAt', 'title', '_createdAt' |
| `order` | string | 'desc' | Sort order: 'asc' or 'desc' |
| `category` | string | - | Filter by category name (case-insensitive) |
| `search` | string | - | Search in title and excerpt |
| `dateFrom` | string | - | Filter posts from this date (ISO format) |
| `dateTo` | string | - | Filter posts until this date (ISO format) |
| `status` | string | 'published' | Only 'published' is allowed for public API |

#### Example Requests

```bash
# Get first page of posts
GET /api/blog/posts

# Get posts with pagination
GET /api/blog/posts?page=2&limit=5

# Search for posts
GET /api/blog/posts?search=technology

# Filter by category
GET /api/blog/posts?category=Technology

# Sort by title ascending
GET /api/blog/posts?sortBy=title&order=asc

# Filter by date range
GET /api/blog/posts?dateFrom=2024-01-01&dateTo=2024-01-31

# Combine multiple filters
GET /api/blog/posts?category=Technology&search=AI&sortBy=publishedAt&order=desc
```

#### Response Format

```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "_id": "post-id",
        "title": "Post Title",
        "slug": { "current": "post-slug" },
        "author": {
          "name": "Author Name",
          "image": { "asset": { "url": "author-image-url" } }
        },
        "mainImage": {
          "asset": { "url": "image-url" },
          "alt": "Image description"
        },
        "categories": [
          { "title": "Category Name" }
        ],
        "publishedAt": "2024-01-15T10:00:00Z",
        "excerpt": "Post excerpt...",
        "_createdAt": "2024-01-10T10:00:00Z",
        "_updatedAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalPosts": 42,
      "postsPerPage": 9,
      "hasNext": true,
      "hasPrev": false
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "filters": {
      "page": 1,
      "limit": 9,
      "sortBy": "publishedAt",
      "order": "desc",
      "category": null,
      "search": null,
      "status": "published",
      "dateFrom": null,
      "dateTo": null
    }
  }
}
```

#### Error Responses

```json
{
  "error": "Page number must be greater than 0"
}
```

```json
{
  "success": false,
  "error": "Failed to fetch blog posts",
  "message": "Database connection failed"
}
```

### GET /api/blog/categories

Retrieves all available categories from published blog posts.

#### Example Request

```bash
GET /api/blog/categories
```

#### Response Format

```json
{
  "success": true,
  "data": {
    "categories": [
      "Design",
      "Development",
      "Technology"
    ],
    "count": 3
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### Error Response

```json
{
  "success": false,
  "error": "Failed to fetch blog categories",
  "message": "Database connection failed"
}
```

## HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request (invalid parameters) |
| 500 | Internal Server Error |

## Caching

- Blog posts endpoint: `Cache-Control: public, s-maxage=300, stale-while-revalidate=600` (5 minutes)
- Categories endpoint: `Cache-Control: public, s-maxage=600, stale-while-revalidate=1200` (10 minutes)

## Rate Limiting

These endpoints may be subject to rate limiting. Implement appropriate retry logic with exponential backoff in your client applications.

## Data Validation

- All date parameters must be valid ISO 8601 date strings
- Page numbers must be positive integers
- Limit must be between 1 and 100
- Sort fields are restricted to allowed values
- Only published posts are returned through the public API

## Usage Examples

### JavaScript/TypeScript

```typescript
// Fetch blog posts
async function fetchBlogPosts(page = 1, category?: string) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '10'
  });
  
  if (category) {
    params.append('category', category);
  }
  
  const response = await fetch(`/api/blog/posts?${params}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch posts');
  }
  
  return data.data;
}

// Fetch categories
async function fetchCategories() {
  const response = await fetch('/api/blog/categories');
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch categories');
  }
  
  return data.data.categories;
}
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react';

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  excerpt?: string;
  // ... other fields
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function useBlogPosts(page = 1, category?: string) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams({
          page: page.toString()
        });
        
        if (category) {
          params.append('category', category);
        }
        
        const response = await fetch(`/api/blog/posts?${params}`);
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch posts');
        }
        
        setPosts(data.data.posts);
        setPagination(data.data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [page, category]);

  return { posts, pagination, loading, error };
}
```
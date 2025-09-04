import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BlogPublicDataService } from '@/lib/services/blog-public-data'
import { client } from '@/lib/sanity.client'

// Mock the Sanity client
vi.mock('@/lib/sanity.client', () => ({
    client: {
        fetch: vi.fn()
    }
}))

const mockClient = vi.mocked(client)

describe('BlogPublicDataService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    const mockPosts = [
        {
            _id: '1',
            title: 'Test Post 1',
            slug: { current: 'test-post-1' },
            author: { name: 'John Doe' },
            mainImage: { asset: { url: 'https://example.com/image1.jpg' }, alt: 'Test image' },
            categories: [{ title: 'Technology' }],
            publishedAt: '2023-12-01T10:00:00Z',
            excerpt: 'This is a test post excerpt',
            _createdAt: '2023-11-01T10:00:00Z',
            _updatedAt: '2023-12-01T10:00:00Z'
        },
        {
            _id: '2',
            title: 'Test Post 2',
            slug: { current: 'test-post-2' },
            author: { name: 'Jane Smith' },
            categories: [{ title: 'Education' }],
            publishedAt: '2023-12-02T10:00:00Z',
            excerpt: 'Another test post excerpt',
            _createdAt: '2023-11-02T10:00:00Z',
            _updatedAt: '2023-12-02T10:00:00Z'
        }
    ]

    describe('getAllPublishedPosts', () => {
        it('should fetch all published posts successfully', async () => {
            mockClient.fetch.mockResolvedValueOnce(mockPosts)

            const result = await BlogPublicDataService.getAllPublishedPosts()

            expect(result).toEqual(mockPosts)
            expect(mockClient.fetch).toHaveBeenCalledTimes(1)
        })

        it('should return empty array when no posts exist', async () => {
            mockClient.fetch.mockResolvedValueOnce([])

            const result = await BlogPublicDataService.getAllPublishedPosts()

            expect(result).toEqual([])
        })

        it('should handle null response from Sanity', async () => {
            mockClient.fetch.mockResolvedValueOnce(null)

            const result = await BlogPublicDataService.getAllPublishedPosts()

            expect(result).toEqual([])
        })

        it('should throw error when fetch fails', async () => {
            mockClient.fetch.mockRejectedValueOnce(new Error('Sanity fetch failed'))

            await expect(BlogPublicDataService.getAllPublishedPosts()).rejects.toThrow('Failed to fetch blog posts')
        })
    })

    describe('getPaginatedPublishedPosts', () => {
        it('should fetch paginated posts with correct pagination info', async () => {
            mockClient.fetch
                .mockResolvedValueOnce(mockPosts.slice(0, 1)) // First page with 1 post
                .mockResolvedValueOnce(2) // Total count

            const result = await BlogPublicDataService.getPaginatedPublishedPosts(1, 1)

            expect(result.posts).toHaveLength(1)
            expect(result.posts[0]).toEqual(mockPosts[0])
            expect(result.pagination).toEqual({
                currentPage: 1,
                totalPages: 2,
                totalPosts: 2,
                postsPerPage: 1,
                hasNext: true,
                hasPrev: false
            })
        })

        it('should handle second page correctly', async () => {
            mockClient.fetch
                .mockResolvedValueOnce(mockPosts.slice(1, 2)) // Second page with 1 post
                .mockResolvedValueOnce(2) // Total count

            const result = await BlogPublicDataService.getPaginatedPublishedPosts(2, 1)

            expect(result.posts).toHaveLength(1)
            expect(result.posts[0]).toEqual(mockPosts[1])
            expect(result.pagination).toEqual({
                currentPage: 2,
                totalPages: 2,
                totalPosts: 2,
                postsPerPage: 1,
                hasNext: false,
                hasPrev: true
            })
        })

        it('should use default values for page and postsPerPage', async () => {
            mockClient.fetch
                .mockResolvedValueOnce(mockPosts)
                .mockResolvedValueOnce(2)

            const result = await BlogPublicDataService.getPaginatedPublishedPosts()

            expect(result.pagination.currentPage).toBe(1)
            expect(result.pagination.postsPerPage).toBe(9)
        })
    })

    describe('getSortedPublishedPosts', () => {
        it('should sort posts by publishedAt in descending order by default', async () => {
            mockClient.fetch.mockResolvedValueOnce([...mockPosts].reverse()) // Reverse order

            const result = await BlogPublicDataService.getSortedPublishedPosts()

            expect(result[0].title).toBe('Test Post 2') // More recent post first
            expect(result[1].title).toBe('Test Post 1')
        })

        it('should sort posts by title in ascending order', async () => {
            mockClient.fetch.mockResolvedValueOnce([...mockPosts].reverse())

            const result = await BlogPublicDataService.getSortedPublishedPosts('title', 'asc')

            expect(result[0].title).toBe('Test Post 1')
            expect(result[1].title).toBe('Test Post 2')
        })
    })

    describe('getPostsByCategory', () => {
        it('should filter posts by category', async () => {
            mockClient.fetch.mockResolvedValueOnce(mockPosts)

            const result = await BlogPublicDataService.getPostsByCategory('Technology')

            expect(result).toHaveLength(1)
            expect(result[0].title).toBe('Test Post 1')
        })

        it('should return empty array for non-existent category', async () => {
            mockClient.fetch.mockResolvedValueOnce(mockPosts)

            const result = await BlogPublicDataService.getPostsByCategory('NonExistent')

            expect(result).toHaveLength(0)
        })

        it('should be case insensitive', async () => {
            mockClient.fetch.mockResolvedValueOnce(mockPosts)

            const result = await BlogPublicDataService.getPostsByCategory('technology')

            expect(result).toHaveLength(1)
            expect(result[0].title).toBe('Test Post 1')
        })
    })

    describe('searchPosts', () => {
        it('should search posts by title', async () => {
            mockClient.fetch.mockResolvedValueOnce(mockPosts)

            const result = await BlogPublicDataService.searchPosts('Test Post 1')

            expect(result).toHaveLength(1)
            expect(result[0].title).toBe('Test Post 1')
        })

        it('should search posts by excerpt', async () => {
            mockClient.fetch.mockResolvedValueOnce(mockPosts)

            const result = await BlogPublicDataService.searchPosts('This is a test')

            expect(result).toHaveLength(1)
            expect(result[0].title).toBe('Test Post 1')
        })

        it('should be case insensitive', async () => {
            mockClient.fetch.mockResolvedValueOnce(mockPosts)

            const result = await BlogPublicDataService.searchPosts('TEST POST')

            expect(result).toHaveLength(2)
        })

        it('should return empty array for no matches', async () => {
            mockClient.fetch.mockResolvedValueOnce(mockPosts)

            const result = await BlogPublicDataService.searchPosts('nonexistent')

            expect(result).toHaveLength(0)
        })
    })

    describe('getAvailableCategories', () => {
        it('should return unique categories sorted alphabetically', async () => {
            const postsWithDuplicateCategories = [
                ...mockPosts,
                {
                    ...mockPosts[0],
                    _id: '3',
                    categories: [{ title: 'Technology' }, { title: 'AI' }]
                }
            ]

            mockClient.fetch.mockResolvedValueOnce(postsWithDuplicateCategories)

            const result = await BlogPublicDataService.getAvailableCategories()

            expect(result).toEqual(['AI', 'Education', 'Technology'])
        })

        it('should handle posts without categories', async () => {
            const postsWithoutCategories = [
                { ...mockPosts[0], categories: undefined },
                mockPosts[1]
            ]

            mockClient.fetch.mockResolvedValueOnce(postsWithoutCategories)

            const result = await BlogPublicDataService.getAvailableCategories()

            expect(result).toEqual(['Education'])
        })
    })

    describe('getFilteredPosts', () => {
        beforeEach(() => {
            mockClient.fetch.mockResolvedValue(mockPosts)
        })

        it('should filter posts by category', async () => {
            const result = await BlogPublicDataService.getFilteredPosts({
                status: 'published',
                category: 'Technology'
            })

            expect(result).toHaveLength(1)
            expect(result[0].categories?.[0].title).toBe('Technology')
        })

        it('should filter posts by search term', async () => {
            const result = await BlogPublicDataService.getFilteredPosts({
                status: 'published',
                search: 'Test Post 1'
            })

            expect(result).toHaveLength(1)
            expect(result[0].title).toBe('Test Post 1')
        })

        it('should filter posts by date range', async () => {
            const result = await BlogPublicDataService.getFilteredPosts({
                status: 'published',
                dateFrom: '2023-12-02T00:00:00Z',
                dateTo: '2023-12-03T00:00:00Z'
            })

            expect(result).toHaveLength(1)
            expect(result[0]._id).toBe('2')
        })

        it('should sort posts by title ascending', async () => {
            const result = await BlogPublicDataService.getFilteredPosts({
                status: 'published',
                sortBy: 'title',
                order: 'asc'
            })

            expect(result[0].title).toBe('Test Post 1')
            expect(result[1].title).toBe('Test Post 2')
        })

        it('should sort posts by publishedAt descending (default)', async () => {
            const result = await BlogPublicDataService.getFilteredPosts({
                status: 'published'
            })

            // Should be sorted by publishedAt desc: Test Post 2, Test Post 1
            expect(result[0]._id).toBe('2')
            expect(result[1]._id).toBe('1')
        })

        it('should reject non-published status', async () => {
            await expect(BlogPublicDataService.getFilteredPosts({
                status: 'draft'
            })).rejects.toThrow('Failed to filter blog posts')
        })

        it('should combine multiple filters', async () => {
            const result = await BlogPublicDataService.getFilteredPosts({
                status: 'published',
                category: 'Technology',
                search: 'Test Post 1',
                sortBy: 'title',
                order: 'asc'
            })

            expect(result).toHaveLength(1)
            expect(result[0]._id).toBe('1')
        })
    })

    describe('isPostPublished', () => {
        it('should return true for published posts', () => {
            const publishedPost = {
                ...mockPosts[0],
                publishedAt: '2023-12-01T10:00:00Z'
            }

            const result = BlogPublicDataService.isPostPublished(publishedPost)
            expect(result).toBe(true)
        })

        it('should return false for posts without publishedAt', () => {
            const draftPost = {
                ...mockPosts[0],
                publishedAt: undefined
            }

            const result = BlogPublicDataService.isPostPublished(draftPost)
            expect(result).toBe(false)
        })

        it('should return false for future posts', () => {
            const futurePost = {
                ...mockPosts[0],
                publishedAt: '2025-12-31T10:00:00Z'
            }

            const result = BlogPublicDataService.isPostPublished(futurePost)
            expect(result).toBe(false)
        })
    })

    describe('getFilteredPaginatedPosts', () => {
        beforeEach(() => {
            mockClient.fetch.mockResolvedValue(mockPosts)
        })

        it('should return paginated filtered results', async () => {
            const result = await BlogPublicDataService.getFilteredPaginatedPosts(
                { status: 'published', category: 'Technology' },
                1,
                1
            )

            expect(result.posts).toHaveLength(1)
            expect(result.pagination.totalPosts).toBe(1)
            expect(result.pagination.totalPages).toBe(1)
            expect(result.pagination.currentPage).toBe(1)
            expect(result.pagination.hasNext).toBe(false)
            expect(result.pagination.hasPrev).toBe(false)
        })

        it('should handle second page correctly', async () => {
            const result = await BlogPublicDataService.getFilteredPaginatedPosts(
                { status: 'published' },
                2,
                1
            )

            expect(result.posts).toHaveLength(1)
            expect(result.pagination.currentPage).toBe(2)
            expect(result.pagination.hasNext).toBe(false)
            expect(result.pagination.hasPrev).toBe(true)
        })

        it('should handle empty results', async () => {
            const result = await BlogPublicDataService.getFilteredPaginatedPosts(
                { status: 'published', category: 'NonExistent' },
                1,
                10
            )

            expect(result.posts).toHaveLength(0)
            expect(result.pagination.totalPosts).toBe(0)
            expect(result.pagination.totalPages).toBe(0)
        })
    })})

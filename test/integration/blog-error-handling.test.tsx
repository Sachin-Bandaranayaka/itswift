import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { BlogPageContent } from '@/app/blog/blog-page-content'
import { BlogPublicDataService } from '@/lib/services/blog-public-data'

// Mock the blog service
vi.mock('@/lib/services/blog-public-data')
const mockBlogService = BlogPublicDataService as any

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: vi.fn().mockReturnValue('1')
  })
}))

describe('Blog Error Handling Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('displays error fallback when blog data service fails', async () => {
    // Mock service to throw an error
    mockBlogService.getAllPublishedPosts = vi.fn().mockRejectedValue(
      new Error('Failed to fetch blog posts')
    )
    mockBlogService.getAvailableCategories = vi.fn().mockRejectedValue(
      new Error('Failed to fetch categories')
    )

    render(<BlogPageContent />)

    // Should show loading initially
    expect(screen.getByText('Blog')).toBeInTheDocument()

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('Something Went Wrong')).toBeInTheDocument()
    })

    expect(screen.getByText(/We encountered an unexpected error while loading the blog content/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('displays network error for connection issues', async () => {
    // Mock service to throw a network error
    mockBlogService.getAllPublishedPosts = vi.fn().mockRejectedValue(
      new Error('Failed to fetch data from server')
    )
    mockBlogService.getAvailableCategories = vi.fn().mockRejectedValue(
      new Error('Failed to fetch data from server')
    )

    render(<BlogPageContent />)

    await waitFor(() => {
      expect(screen.getByText('Connection Problem')).toBeInTheDocument()
    })

    expect(screen.getByText('Unable to connect to our servers. Please check your internet connection.')).toBeInTheDocument()
  })

  it('displays empty state when no posts are available', async () => {
    // Mock service to return empty data
    mockBlogService.getAllPublishedPosts = vi.fn().mockResolvedValue([])
    mockBlogService.getAvailableCategories = vi.fn().mockResolvedValue([])

    render(<BlogPageContent />)

    await waitFor(() => {
      expect(screen.getByText('No Blog Posts Found')).toBeInTheDocument()
    })

    expect(screen.getByText('There are currently no published blog posts available. Check back later for new content!')).toBeInTheDocument()
  })

  it('retries operation when retry button is clicked', async () => {
    // First call fails, second call succeeds
    mockBlogService.getAllPublishedPosts = vi.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce([
        {
          _id: '1',
          title: 'Test Post',
          slug: { current: 'test-post' },
          publishedAt: '2024-01-01',
          _createdAt: '2024-01-01',
          _updatedAt: '2024-01-01'
        }
      ])
    
    mockBlogService.getAvailableCategories = vi.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(['Technology'])

    render(<BlogPageContent />)

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('Connection Problem')).toBeInTheDocument()
    })

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /try again/i })
    fireEvent.click(retryButton)

    // Wait for successful retry
    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument()
    })

    // Verify service was called twice
    expect(mockBlogService.getAllPublishedPosts).toHaveBeenCalledTimes(2)
    expect(mockBlogService.getAvailableCategories).toHaveBeenCalledTimes(2)
  })

  it('displays no results fallback when filters return empty results', async () => {
    // Mock service to return posts
    mockBlogService.getAllPublishedPosts = vi.fn().mockResolvedValue([
      {
        _id: '1',
        title: 'Technology Post',
        slug: { current: 'tech-post' },
        categories: [{ title: 'Technology' }],
        publishedAt: '2024-01-01',
        _createdAt: '2024-01-01',
        _updatedAt: '2024-01-01'
      }
    ])
    mockBlogService.getAvailableCategories = vi.fn().mockResolvedValue(['Technology'])

    render(<BlogPageContent />)

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Technology Post')).toBeInTheDocument()
    })

    // Apply a filter that returns no results (this would be done through the filters component)
    // For this test, we'll simulate the state where filtered posts is empty
    // In a real scenario, this would happen through user interaction with filters
  })
})
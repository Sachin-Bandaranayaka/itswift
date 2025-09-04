import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { 
  BlogErrorFallback, 
  BlogEmptyFallback, 
  BlogNoResultsFallback 
} from '@/components/blog/blog-error-fallback'

describe('BlogErrorFallback', () => {
  it('renders nothing when no error is provided', () => {
    const { container } = render(<BlogErrorFallback error={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders network error UI for connection issues', () => {
    render(
      <BlogErrorFallback 
        error="Failed to fetch data from server" 
        onRetry={vi.fn()}
      />
    )

    expect(screen.getByText('Connection Problem')).toBeInTheDocument()
    expect(screen.getByText('Unable to connect to our servers. Please check your internet connection.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('renders server error UI for 500 errors', () => {
    render(
      <BlogErrorFallback 
        error="Internal server error occurred" 
        onRetry={vi.fn()}
      />
    )

    expect(screen.getByText('Server Error')).toBeInTheDocument()
    expect(screen.getByText('Our servers are experiencing issues. This is temporary.')).toBeInTheDocument()
  })

  it('renders timeout error UI for timeout issues', () => {
    render(
      <BlogErrorFallback 
        error="Request timeout occurred" 
        onRetry={vi.fn()}
      />
    )

    expect(screen.getByText('Request Timeout')).toBeInTheDocument()
    expect(screen.getByText('The request took too long to complete.')).toBeInTheDocument()
  })

  it('renders not found error UI for 404 errors', () => {
    render(
      <BlogErrorFallback 
        error="Content not found" 
        onRetry={vi.fn()}
      />
    )

    expect(screen.getByText('Content Not Found')).toBeInTheDocument()
    expect(screen.getByText('The requested blog content could not be found.')).toBeInTheDocument()
  })

  it('renders generic error UI for unknown errors', () => {
    render(
      <BlogErrorFallback 
        error="Unknown error occurred" 
        onRetry={vi.fn()}
      />
    )

    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument()
    expect(screen.getByText('We encountered an unexpected error while loading the blog content.')).toBeInTheDocument()
  })

  it('calls onRetry when try again button is clicked', () => {
    const onRetry = vi.fn()
    
    render(
      <BlogErrorFallback 
        error="Test error" 
        onRetry={onRetry}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /try again/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('hides retry button when showRetry is false', () => {
    render(
      <BlogErrorFallback 
        error="Test error" 
        onRetry={vi.fn()}
        showRetry={false}
      />
    )

    expect(screen.queryByRole('button', { name: /try again/i })).not.toBeInTheDocument()
  })

  it('handles Error objects correctly', () => {
    const error = new Error('Test error message')
    
    render(
      <BlogErrorFallback 
        error={error} 
        onRetry={vi.fn()}
      />
    )

    expect(screen.getByText('Something Went Wrong')).toBeInTheDocument()
  })
})

describe('BlogEmptyFallback', () => {
  it('renders default empty state', () => {
    render(<BlogEmptyFallback />)

    expect(screen.getByText('No Blog Posts Found')).toBeInTheDocument()
    expect(screen.getByText('There are currently no published blog posts available. Check back later for new content!')).toBeInTheDocument()
  })

  it('renders custom title and description', () => {
    render(
      <BlogEmptyFallback 
        title="Custom Title"
        description="Custom description text"
      />
    )

    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom description text')).toBeInTheDocument()
  })

  it('shows create button when showCreateButton is true', () => {
    const onCreatePost = vi.fn()
    
    render(
      <BlogEmptyFallback 
        showCreateButton={true}
        onCreatePost={onCreatePost}
      />
    )

    const createButton = screen.getByRole('button', { name: /create first post/i })
    expect(createButton).toBeInTheDocument()
    
    fireEvent.click(createButton)
    expect(onCreatePost).toHaveBeenCalledTimes(1)
  })

  it('hides create button by default', () => {
    render(<BlogEmptyFallback />)
    expect(screen.queryByRole('button', { name: /create first post/i })).not.toBeInTheDocument()
  })
})

describe('BlogNoResultsFallback', () => {
  it('renders no results message', () => {
    render(<BlogNoResultsFallback />)

    expect(screen.getByText('No Posts Match Your Filters')).toBeInTheDocument()
    expect(screen.getByText('Try adjusting your search terms or category selection to find more posts.')).toBeInTheDocument()
  })

  it('shows search term when provided', () => {
    render(<BlogNoResultsFallback searchTerm="test search" />)

    expect(screen.getByText('No posts found for "test search"')).toBeInTheDocument()
  })

  it('shows category when provided', () => {
    render(<BlogNoResultsFallback category="Technology" />)

    expect(screen.getByText('No posts found in category "Technology"')).toBeInTheDocument()
  })

  it('shows both search term and category', () => {
    render(
      <BlogNoResultsFallback 
        searchTerm="test search" 
        category="Technology" 
      />
    )

    expect(screen.getByText('No posts found for "test search"')).toBeInTheDocument()
    expect(screen.getByText('No posts found in category "Technology"')).toBeInTheDocument()
  })

  it('calls onClearFilters when clear filters button is clicked', () => {
    const onClearFilters = vi.fn()
    
    render(<BlogNoResultsFallback onClearFilters={onClearFilters} />)

    fireEvent.click(screen.getByRole('button', { name: /clear filters/i }))
    expect(onClearFilters).toHaveBeenCalledTimes(1)
  })

  it('hides clear filters button when onClearFilters is not provided', () => {
    render(<BlogNoResultsFallback />)
    expect(screen.queryByRole('button', { name: /clear filters/i })).not.toBeInTheDocument()
  })
})
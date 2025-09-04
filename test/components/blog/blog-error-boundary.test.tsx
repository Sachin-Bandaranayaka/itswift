import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { BlogErrorBoundary, BlogComponentErrorBoundary } from '@/components/blog/blog-error-boundary'

// Mock component that throws an error
const ThrowError = ({ shouldThrow = true }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('BlogErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error
  beforeAll(() => {
    console.error = vi.fn()
  })
  afterAll(() => {
    console.error = originalError
  })

  it('renders children when there is no error', () => {
    render(
      <BlogErrorBoundary>
        <ThrowError shouldThrow={false} />
      </BlogErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders error UI when child component throws', () => {
    render(
      <BlogErrorBoundary>
        <ThrowError />
      </BlogErrorBoundary>
    )

    expect(screen.getByText('Blog Content Error')).toBeInTheDocument()
    expect(screen.getByText(/We encountered an error while loading the blog content/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('shows back to blog button when showBackToBlog is true', () => {
    render(
      <BlogErrorBoundary showBackToBlog={true}>
        <ThrowError />
      </BlogErrorBoundary>
    )

    expect(screen.getByRole('link', { name: /back to blog/i })).toBeInTheDocument()
  })

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn()
    
    render(
      <BlogErrorBoundary onError={onError}>
        <ThrowError />
      </BlogErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    )
  })

  it('resets error state when try again is clicked', () => {
    const { rerender } = render(
      <BlogErrorBoundary>
        <ThrowError />
      </BlogErrorBoundary>
    )

    expect(screen.getByText('Blog Content Error')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /try again/i }))

    // Re-render with non-throwing component
    rerender(
      <BlogErrorBoundary>
        <ThrowError shouldThrow={false} />
      </BlogErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>

    render(
      <BlogErrorBoundary fallback={customFallback}>
        <ThrowError />
      </BlogErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('Blog Content Error')).not.toBeInTheDocument()
  })
})

describe('BlogComponentErrorBoundary', () => {
  const originalError = console.error
  beforeAll(() => {
    console.error = vi.fn()
  })
  afterAll(() => {
    console.error = originalError
  })

  it('renders children when there is no error', () => {
    render(
      <BlogComponentErrorBoundary componentName="Test Component">
        <ThrowError shouldThrow={false} />
      </BlogComponentErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders lightweight error UI when child component throws', () => {
    render(
      <BlogComponentErrorBoundary componentName="Test Component">
        <ThrowError />
      </BlogComponentErrorBoundary>
    )

    expect(screen.getByText('Component Error')).toBeInTheDocument()
    expect(screen.getByText('Unable to load Test Component. Please refresh the page.')).toBeInTheDocument()
  })

  it('uses generic component name when not provided', () => {
    render(
      <BlogComponentErrorBoundary>
        <ThrowError />
      </BlogComponentErrorBoundary>
    )

    expect(screen.getByText('Unable to load this component. Please refresh the page.')).toBeInTheDocument()
  })
})
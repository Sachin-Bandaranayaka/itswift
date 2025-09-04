import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BlogPostCard } from '@/components/blog/blog-post-card'
import { BlogPost } from '@/lib/services/blog-public-data'

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  )
}))

// Mock the Sanity image utility
vi.mock('@/lib/sanity.image', () => ({
  urlForImage: (source: any) => ({
    width: () => ({ height: () => ({ url: () => 'https://example.com/test-image.jpg' }) })
  })
}))

describe('BlogPostCard', () => {
  const mockPost: BlogPost = {
    _id: '1',
    title: 'Test Blog Post',
    slug: { current: 'test-blog-post' },
    author: { name: 'John Doe' },
    mainImage: { 
      asset: { url: 'https://example.com/image.jpg' }, 
      alt: 'Test image' 
    },
    categories: [
      { title: 'Technology' },
      { title: 'Education' }
    ],
    publishedAt: '2023-12-01T10:00:00Z',
    excerpt: 'This is a test blog post excerpt that should be displayed in the card.',
    _createdAt: '2023-11-01T10:00:00Z',
    _updatedAt: '2023-12-01T10:00:00Z'
  }

  it('should render blog post card with all information', () => {
    render(<BlogPostCard post={mockPost} />)

    // Check title
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
    
    // Check excerpt
    expect(screen.getByText(/This is a test blog post excerpt/)).toBeInTheDocument()
    
    // Check author
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    
    // Check categories
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('Education')).toBeInTheDocument()
    
    // Check published date
    expect(screen.getByText('December 1, 2023')).toBeInTheDocument()
    
    // Check read more button
    expect(screen.getByText('Read More')).toBeInTheDocument()
    
    // Check image
    expect(screen.getByAltText('Test image')).toBeInTheDocument()
  })

  it('should render without image when mainImage is not provided', () => {
    const postWithoutImage = { ...mockPost, mainImage: undefined }
    
    render(<BlogPostCard post={postWithoutImage} />)
    
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('should render without excerpt when not provided', () => {
    const postWithoutExcerpt = { ...mockPost, excerpt: undefined }
    
    render(<BlogPostCard post={postWithoutExcerpt} />)
    
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
    expect(screen.queryByText(/This is a test blog post excerpt/)).not.toBeInTheDocument()
  })

  it('should render without categories when not provided', () => {
    const postWithoutCategories = { ...mockPost, categories: undefined }
    
    render(<BlogPostCard post={postWithoutCategories} />)
    
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
    expect(screen.queryByText('Technology')).not.toBeInTheDocument()
    expect(screen.queryByText('Education')).not.toBeInTheDocument()
  })

  it('should render without author when not provided', () => {
    const postWithoutAuthor = { ...mockPost, author: undefined }
    
    render(<BlogPostCard post={postWithoutAuthor} />)
    
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
  })

  it('should use createdAt when publishedAt is not available', () => {
    const postWithoutPublishedAt = { ...mockPost, publishedAt: undefined }
    
    render(<BlogPostCard post={postWithoutPublishedAt} />)
    
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
    // Should not show any date when publishedAt is not available
    expect(screen.queryByText('December 1, 2023')).not.toBeInTheDocument()
  })

  it('should have correct link to blog post', () => {
    render(<BlogPostCard post={mockPost} />)
    
    const titleLink = screen.getByText('Test Blog Post').closest('a')
    const readMoreLink = screen.getByText('Read More').closest('a')
    
    expect(titleLink).toHaveAttribute('href', '/blog/test-blog-post')
    expect(readMoreLink).toHaveAttribute('href', '/blog/test-blog-post')
  })
})
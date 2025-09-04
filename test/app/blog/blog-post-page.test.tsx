import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import BlogPost, { generateMetadata } from '@/app/blog/[slug]/page'

// Mock the Sanity client
vi.mock('@/lib/sanity.client', () => ({
  client: {
    fetch: vi.fn()
  }
}))

// Mock the image URL builder
vi.mock('@/lib/sanity.image', () => ({
  urlForImage: vi.fn(() => ({
    url: () => 'https://example.com/image.jpg',
    width: () => ({ height: () => ({ url: () => 'https://example.com/image.jpg' }) })
  }))
}))

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn()
}))

// Mock the social share buttons component
vi.mock('@/components/blog/social-share-buttons', () => ({
  SocialShareButtons: ({ url, title }: { url: string; title: string }) => (
    <div data-testid="social-share-buttons">
      Share: {title} - {url}
    </div>
  )
}))

const mockPost = {
  _id: '1',
  title: 'Test Blog Post',
  slug: { current: 'test-blog-post' },
  mainImage: {
    asset: { url: 'https://example.com/image.jpg' },
    alt: 'Test image'
  },
  body: [
    {
      _type: 'block',
      children: [
        { text: 'This is a test blog post content. It has multiple words to test reading time calculation.' }
      ]
    }
  ],
  excerpt: 'This is a test excerpt for the blog post.',
  publishedAt: '2024-01-15T10:00:00Z',
  author: {
    name: 'John Doe',
    image: { asset: { url: 'https://example.com/author.jpg' } },
    bio: [{ _type: 'block', children: [{ text: 'Author bio' }] }]
  },
  categories: [
    { title: 'eLearning' },
    { title: 'Technology' }
  ]
}

describe('BlogPost Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Set up environment variable
    process.env.NEXT_PUBLIC_SITE_URL = 'https://swiftsolution.com'
  })

  describe('generateMetadata', () => {
    it('should generate proper metadata for a blog post', async () => {
      const { client } = await import('@/lib/sanity.client')
      vi.mocked(client.fetch).mockResolvedValue(mockPost)

      const metadata = await generateMetadata({ params: { slug: 'test-blog-post' } })

      expect(metadata.title).toBe('Test Blog Post | Swift Solution Blog')
      expect(metadata.description).toBe('This is a test excerpt for the blog post.')
      expect(metadata.keywords).toContain('eLearning, Technology')
      expect(metadata.openGraph?.title).toBe('Test Blog Post')
      expect(metadata.openGraph?.type).toBe('article')
      expect(metadata.twitter?.card).toBe('summary_large_image')
    })

    it('should handle missing post gracefully', async () => {
      const { client } = await import('@/lib/sanity.client')
      vi.mocked(client.fetch).mockResolvedValue(null)

      const metadata = await generateMetadata({ params: { slug: 'non-existent' } })

      expect(metadata.title).toBe('Post Not Found')
      expect(metadata.description).toBe('The requested blog post could not be found.')
    })

    it('should generate description from body when excerpt is missing', async () => {
      const { client } = await import('@/lib/sanity.client')
      const postWithoutExcerpt = { ...mockPost, excerpt: undefined }
      vi.mocked(client.fetch).mockResolvedValue(postWithoutExcerpt)

      const metadata = await generateMetadata({ params: { slug: 'test-blog-post' } })

      expect(metadata.description).toContain('This is a test blog post content')
    })
  })

  describe('BlogPost Component', () => {
    it('should render blog post with all elements', async () => {
      const { client } = await import('@/lib/sanity.client')
      vi.mocked(client.fetch).mockResolvedValue(mockPost)

      const BlogPostComponent = await BlogPost({ params: { slug: 'test-blog-post' } })
      render(BlogPostComponent as React.ReactElement)

      // Check if main elements are rendered
      expect(screen.getByRole('heading', { name: 'Test Blog Post' })).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('January 15, 2024')).toBeInTheDocument()
      expect(screen.getByText(/min read/)).toBeInTheDocument()
      expect(screen.getByText('eLearning')).toBeInTheDocument()
      expect(screen.getByText('Technology')).toBeInTheDocument()
      expect(screen.getAllByTestId('social-share-buttons')).toHaveLength(2) // Header and footer
    })

    it('should render breadcrumb navigation', async () => {
      const { client } = await import('@/lib/sanity.client')
      vi.mocked(client.fetch).mockResolvedValue(mockPost)

      const BlogPostComponent = await BlogPost({ params: { slug: 'test-blog-post' } })
      render(BlogPostComponent as React.ReactElement)

      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Blog')).toBeInTheDocument()
    })

    it('should call notFound when post does not exist', async () => {
      const { client } = await import('@/lib/sanity.client')
      const { notFound } = await import('next/navigation')
      vi.mocked(client.fetch).mockResolvedValue(null)

      await BlogPost({ params: { slug: 'non-existent' } })

      expect(notFound).toHaveBeenCalled()
    })

    it('should render fallback content on error', async () => {
      const { client } = await import('@/lib/sanity.client')
      vi.mocked(client.fetch).mockRejectedValue(new Error('Sanity error'))

      const BlogPostComponent = await BlogPost({ params: { slug: 'test-blog-post' } })
      render(BlogPostComponent as React.ReactElement)

      expect(screen.getByText('Blog Coming Soon')).toBeInTheDocument()
      expect(screen.getByText('This blog is currently under construction. Please check back later.')).toBeInTheDocument()
    })
  })

  describe('Reading Time Calculation', () => {
    it('should calculate reading time correctly', async () => {
      const { client } = await import('@/lib/sanity.client')
      const longPost = {
        ...mockPost,
        body: [
          {
            _type: 'block',
            children: [
              { text: 'This is a very long blog post. '.repeat(100) } // ~500 words
            ]
          }
        ]
      }
      vi.mocked(client.fetch).mockResolvedValue(longPost)

      const BlogPostComponent = await BlogPost({ params: { slug: 'test-blog-post' } })
      render(BlogPostComponent as React.ReactElement)

      // Should show approximately 4 min read (500 words / 200 words per minute, rounded up)
      expect(screen.getByText(/4 min read/)).toBeInTheDocument()
    })
  })
})
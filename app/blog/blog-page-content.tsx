'use client'

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { BlogPostCard } from "@/components/blog/blog-post-card"
import { BlogPagination } from "@/components/blog/blog-pagination"
import { BlogLoadingSkeleton } from "@/components/blog/blog-loading-skeleton"
import { BlogFiltersComponent, BlogFilters } from "@/components/blog/blog-filters"
import { BlogErrorFallback, BlogEmptyFallback, BlogNoResultsFallback } from "@/components/blog/blog-error-fallback"
import { BlogComponentErrorBoundary } from "@/components/blog/blog-error-boundary"
import { useBlogDataErrorHandling } from "@/hooks/use-blog-error-handling"
import { BlogSupabaseService, BlogPost } from '@/lib/services/blog-supabase-service'

export function BlogPageContent() {
  const searchParams = useSearchParams()
  const [blogData, setBlogData] = useState<{ posts: BlogPost[], pagination: any } | null>(null)
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  
  const {
    error,
    isRetrying,
    canRetry,
    retry,
    clearError,
    fetchWithErrorHandling
  } = useBlogDataErrorHandling()
  
  const [filters, setFilters] = useState<BlogFilters>({
    search: '',
    category: '',
    sortBy: 'publishedAt',
    sortOrder: 'desc'
  })

  const currentPage = parseInt(searchParams?.get('page') || '1', 10)
  const postsPerPage = 9

  // Load initial data
  useEffect(() => {
    loadBlogData()
  }, [])

  // Handle filtering and sorting
  useEffect(() => {
    if (allPosts.length > 0) {
      applyFilters()
    }
  }, [allPosts, filters])

  // Handle pagination when filtered posts change
  useEffect(() => {
    if (filteredPosts.length > 0) {
      updatePaginatedData()
    }
  }, [filteredPosts, currentPage])

  const loadBlogData = async () => {
    setLoading(true)
    clearError()

    const result = await fetchWithErrorHandling(async () => {
      const blogService = new BlogSupabaseService()
      const [postsData, availableCategories] = await Promise.all([
        blogService.getPosts({ status: 'published' }, { limit: 100 }), // Get all posts for client-side filtering
        blogService.getCategories()
      ])

      return { 
        posts: postsData.posts, 
        availableCategories: availableCategories.map((cat: any) => cat.name)
      }
    })

    if (result) {
      setAllPosts(result.posts)
      setCategories(result.availableCategories)
    }
    
    setLoading(false)
  }

  const applyFilters = () => {
    let filtered = [...allPosts]

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchTerm))
      )
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(post =>
        post.category?.name === filters.category
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      
      if (filters.sortBy === 'publishedAt') {
        const dateA = new Date(a.published_at || a.created_at)
        const dateB = new Date(b.published_at || b.created_at)
        comparison = dateA.getTime() - dateB.getTime()
      } else if (filters.sortBy === 'title') {
        comparison = a.title.localeCompare(b.title)
      }
      
      return filters.sortOrder === 'desc' ? -comparison : comparison
    })

    setFilteredPosts(filtered)
  }

  const updatePaginatedData = () => {
    const totalPosts = filteredPosts.length
    const totalPages = Math.ceil(totalPosts / postsPerPage)
    const startIndex = (currentPage - 1) * postsPerPage
    const endIndex = startIndex + postsPerPage
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

    const pagination = {
      currentPage,
      totalPages,
      totalPosts,
      postsPerPage,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1
    }

    setBlogData({
      posts: paginatedPosts,
      pagination
    })
  }

  const handleRetry = () => {
    retry(loadBlogData)
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      sortBy: 'publishedAt',
      sortOrder: 'desc'
    })
  }

  const handleFiltersChange = (newFilters: BlogFilters) => {
    setFilters(newFilters)
  }

  if (loading || isRetrying) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <BlogLoadingSkeleton />
        {isRetrying && (
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">Retrying...</p>
          </div>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <BlogErrorFallback
          error={error}
          onRetry={canRetry ? handleRetry : undefined}
          showRetry={canRetry}
          className="mb-8"
        />
      </div>
    )
  }

  if (!blogData || allPosts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <BlogEmptyFallback />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground">
          Discover insights, trends, and best practices in eLearning and corporate training.
        </p>
      </div>

      <BlogFiltersComponent
        filters={filters}
        categories={categories}
        onFiltersChange={handleFiltersChange}
        isLoading={loading}
      />

      {filteredPosts.length === 0 && (filters.search || filters.category) ? (
        <BlogNoResultsFallback
          searchTerm={filters.search}
          category={filters.category}
          onClearFilters={handleClearFilters}
        />
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogData.posts.map((post: BlogPost) => (
              <BlogComponentErrorBoundary key={post.id} componentName="Blog Post Card">
                <BlogPostCard post={post} />
              </BlogComponentErrorBoundary>
            ))}
          </div>

          <BlogComponentErrorBoundary componentName="Blog Pagination">
            <BlogPagination pagination={blogData.pagination} />
          </BlogComponentErrorBoundary>
        </>
      )}
    </div>
  )
}
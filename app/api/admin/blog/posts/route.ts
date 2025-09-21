import { NextRequest, NextResponse } from 'next/server'
import { blogService } from '@/lib/services/blog.service'
import { BlogPostFormData, BlogPostFilters } from '@/lib/types/blog'

export const dynamic = 'force-dynamic'

// GET /api/admin/blog/posts - Get all posts with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Parse pagination
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    
    // Parse filters
    const filters: BlogPostFilters = {}
    
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status') as 'draft' | 'published' | 'archived'
    }
    if (searchParams.get('category_id')) {
      filters.category_id = searchParams.get('category_id')!
    }
    if (searchParams.get('author_id')) {
      filters.author_id = searchParams.get('author_id')!
    }
    if (searchParams.get('is_featured')) {
      filters.is_featured = searchParams.get('is_featured') === 'true'
    }
    if (searchParams.get('search')) {
      filters.search = searchParams.get('search')!
    }
    if (searchParams.get('date_from')) {
      filters.date_from = searchParams.get('date_from')!
    }
    if (searchParams.get('date_to')) {
      filters.date_to = searchParams.get('date_to')!
    }

    const result = await blogService.getPosts(filters, page, limit)

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        filters,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: result.totalPages
        }
      }
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog posts',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST /api/admin/blog/posts - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'slug', 'content', 'author_id', 'status']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: `Missing required field: ${field}`
          },
          { status: 400 }
        )
      }
    }

    const postData: BlogPostFormData = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      featured_image_url: body.featured_image_url,
      author_id: body.author_id,
      category_id: body.category_id,
      status: body.status,
      is_featured: body.is_featured || false,
      meta_title: body.meta_title,
      meta_description: body.meta_description,
      meta_keywords: body.meta_keywords
    }

    const post = await blogService.createPost(postData)

    return NextResponse.json({
      success: true,
      data: post,
      meta: {
        timestamp: new Date().toISOString()
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create blog post',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
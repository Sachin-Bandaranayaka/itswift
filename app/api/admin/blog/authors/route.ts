import { NextRequest, NextResponse } from 'next/server'
import { blogService } from '@/lib/services/blog.service'
import { BlogAuthorFormData } from '@/lib/types/blog'

export const dynamic = 'force-dynamic'

// GET /api/admin/blog/authors - Get all authors
export async function GET(request: NextRequest) {
  try {
    const authors = await blogService.getAuthors()

    return NextResponse.json({
      success: true,
      data: authors,
      meta: {
        timestamp: new Date().toISOString(),
        total: authors.length
      }
    })
  } catch (error) {
    console.error('Error fetching blog authors:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog authors',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST /api/admin/blog/authors - Create a new author
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'slug', 'email']
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

    const authorData: BlogAuthorFormData = {
      name: body.name,
      slug: body.slug,
      email: body.email,
      bio: body.bio,
      avatar_url: body.avatar_url,
      social_links: body.social_links
    }

    const author = await blogService.createAuthor(authorData)

    return NextResponse.json({
      success: true,
      data: author,
      meta: {
        timestamp: new Date().toISOString()
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog author:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create blog author',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
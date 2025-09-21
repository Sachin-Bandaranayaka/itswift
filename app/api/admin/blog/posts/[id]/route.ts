import { NextRequest, NextResponse } from 'next/server'
import { blogService } from '@/lib/services/blog.service'
import { BlogPostFormData } from '@/lib/types/blog'

export const dynamic = 'force-dynamic'

// GET /api/admin/blog/posts/[id] - Get a specific blog post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await blogService.getPostById(params.id)

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog post not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: post,
      meta: {
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog post',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT /api/admin/blog/posts/[id] - Update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const postData: Partial<BlogPostFormData> = {
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      featured_image_url: body.featured_image_url,
      author_id: body.author_id,
      category_id: body.category_id,
      status: body.status,
      is_featured: body.is_featured,
      meta_title: body.meta_title,
      meta_description: body.meta_description,
      meta_keywords: body.meta_keywords
    }

    // Remove undefined values
    Object.keys(postData).forEach(key => {
      if (postData[key as keyof BlogPostFormData] === undefined) {
        delete postData[key as keyof BlogPostFormData]
      }
    })

    const updatedPost = await blogService.updatePost(params.id, postData)

    if (!updatedPost) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog post not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedPost,
      meta: {
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update blog post',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/blog/posts/[id] - Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await blogService.deletePost(params.id)

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog post not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
      meta: {
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete blog post',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { blogService } from '@/lib/services/blog.service'
import { BlogAuthorFormData } from '@/lib/types/blog'

export const dynamic = 'force-dynamic'

// PUT /api/admin/blog/authors/[id] - Update an author
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const authorData: Partial<BlogAuthorFormData> = {
      name: body.name,
      slug: body.slug,
      email: body.email,
      bio: body.bio,
      avatar_url: body.avatar_url,
      social_links: body.social_links
    }

    // Remove undefined values
    Object.keys(authorData).forEach(key => {
      if (authorData[key as keyof BlogAuthorFormData] === undefined) {
        delete authorData[key as keyof BlogAuthorFormData]
      }
    })

    const updatedAuthor = await blogService.updateAuthor(params.id, authorData)

    if (!updatedAuthor) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog author not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedAuthor,
      meta: {
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error updating blog author:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update blog author',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/blog/authors/[id] - Delete an author
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await blogService.deleteAuthor(params.id)

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog author not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Blog author deleted successfully',
      meta: {
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error deleting blog author:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete blog author',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
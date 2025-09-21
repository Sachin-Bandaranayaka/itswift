import { NextRequest, NextResponse } from 'next/server'
import { blogService } from '@/lib/services/blog.service'
import { BlogCategoryFormData } from '@/lib/types/blog'

export const dynamic = 'force-dynamic'

// PUT /api/admin/blog/categories/[id] - Update a category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const categoryData: Partial<BlogCategoryFormData> = {
      name: body.name,
      slug: body.slug,
      description: body.description,
      color: body.color
    }

    // Remove undefined values
    Object.keys(categoryData).forEach(key => {
      if (categoryData[key as keyof BlogCategoryFormData] === undefined) {
        delete categoryData[key as keyof BlogCategoryFormData]
      }
    })

    const updatedCategory = await blogService.updateCategory(params.id, categoryData)

    if (!updatedCategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog category not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      meta: {
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error updating blog category:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update blog category',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/blog/categories/[id] - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await blogService.deleteCategory(params.id)

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Blog category not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Blog category deleted successfully',
      meta: {
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error deleting blog category:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete blog category',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
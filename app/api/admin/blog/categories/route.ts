import { NextRequest, NextResponse } from 'next/server'
import { blogService } from '@/lib/services/blog.service'
import { BlogCategoryFormData } from '@/lib/types/blog'

export const dynamic = 'force-dynamic'

// GET /api/admin/blog/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const categories = await blogService.getCategories()

    return NextResponse.json({
      success: true,
      data: categories,
      meta: {
        timestamp: new Date().toISOString(),
        total: categories.length
      }
    })
  } catch (error) {
    console.error('Error fetching blog categories:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch blog categories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST /api/admin/blog/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'slug']
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

    const categoryData: BlogCategoryFormData = {
      name: body.name,
      slug: body.slug,
      description: body.description,
      color: body.color
    }

    const category = await blogService.createCategory(categoryData)

    return NextResponse.json({
      success: true,
      data: category,
      meta: {
        timestamp: new Date().toISOString()
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog category:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create blog category',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'
import { blogService } from '@/lib/services/blog.service'

export async function GET() {
  try {
    const categories = await blogService.getCategories()

    return NextResponse.json({
      success: true,
      data: categories,
      meta: {
        timestamp: new Date().toISOString(),
        total: categories.length
      }
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
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
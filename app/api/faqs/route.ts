import { NextRequest, NextResponse } from 'next/server'
import { FAQService } from '@/lib/database/services/faq-service'

export const dynamic = 'force-dynamic'

// GET /api/faqs - Get FAQs for a specific page
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pageSlug = searchParams.get('page')
    
    if (!pageSlug) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameter: page'
        },
        { 
          status: 400,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      )
    }

    const faqs = await FAQService.getFAQsByPage(pageSlug)

    return NextResponse.json({
      success: true,
      data: faqs,
      meta: {
        timestamp: new Date().toISOString(),
        page: pageSlug,
        count: faqs.length
      }
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch FAQs',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    )
  }
}
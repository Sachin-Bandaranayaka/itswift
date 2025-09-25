import { NextRequest, NextResponse } from 'next/server'
import { FAQService, FAQFilters } from '@/lib/database/services/faq-service'
import { withAdminAuth } from '@/lib/auth/middleware'
import { invalidateFAQCache } from '@/lib/utils/cache-invalidation'

export const dynamic = 'force-dynamic'

// GET /api/admin/faqs - Get all FAQs with filters and pagination
async function handleGetFAQs(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    // Parse pagination
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    
    // Parse filters
    const filters: FAQFilters = {}
    
    if (searchParams.get('page_slug')) {
      filters.page_slug = searchParams.get('page_slug')!
    }
    if (searchParams.get('category')) {
      filters.category = searchParams.get('category')!
    }
    if (searchParams.get('is_active')) {
      filters.is_active = searchParams.get('is_active') === 'true'
    }
    
    // Get search term
    const search = searchParams.get('search') || ''
    
    // Get all FAQs first
    const allFaqs = await FAQService.getFAQs(filters)
    
    // Apply search filter if provided
    let filteredFaqs = allFaqs
    if (search) {
      filteredFaqs = allFaqs.filter(faq => 
        faq.question.toLowerCase().includes(search.toLowerCase()) ||
        faq.answer.toLowerCase().includes(search.toLowerCase()) ||
        (faq.category && faq.category.toLowerCase().includes(search.toLowerCase()))
      )
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedFaqs = filteredFaqs.slice(startIndex, endIndex)

    // Calculate pagination info
    const total = filteredFaqs.length
    const totalPages = Math.ceil(total / limit)

    // Build available filters from all FAQs so UI can stay in sync with data
    const availablePageSlugs = Array.from(new Set(allFaqs.map(faq => faq.page_slug))).sort()
    const availableCategories = Array.from(
      new Set(allFaqs.map(faq => faq.category).filter((category): category is string => Boolean(category)))
    ).sort()

    return NextResponse.json({
      success: true,
      data: {
        faqs: paginatedFaqs
      },
      meta: {
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters: {
          ...filters,
          search
        },
        availableFilters: {
          pageSlugs: availablePageSlugs,
          categories: availableCategories
        },
        timestamp: new Date().toISOString()
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
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
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    )
  }
}

// POST /api/admin/faqs - Create a new FAQ
async function handleCreateFAQ(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['question', 'answer', 'page_slug']
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

    const faqData = {
      question: body.question,
      answer: body.answer,
      page_slug: body.page_slug,
      category: body.category,
      display_order: body.display_order || 0,
      is_active: body.is_active !== undefined ? body.is_active : true
    }

    const faq = await FAQService.createFAQ(faqData)

    // Invalidate FAQ cache after successful creation
    invalidateFAQCache()

    return NextResponse.json({
      success: true,
      data: faq,
      meta: {
        timestamp: new Date().toISOString()
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating FAQ:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create FAQ',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Export auth-protected handlers
export const GET = withAdminAuth(handleGetFAQs)
export const POST = withAdminAuth(handleCreateFAQ)

import { NextRequest, NextResponse } from 'next/server'
import { FAQService, UpdateFAQData } from '@/lib/database/services/faq-service'
import { withAdminAuth } from '@/lib/auth/middleware'
import { invalidateFAQCache } from '@/lib/utils/cache-invalidation'

export const dynamic = 'force-dynamic'

// GET /api/admin/faqs/[id] - Get a specific FAQ
async function handleGetFAQ(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const faq = await FAQService.getFAQById(params.id)

    if (!faq) {
      return NextResponse.json(
        {
          success: false,
          error: 'FAQ not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: faq,
      meta: {
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error fetching FAQ:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch FAQ',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT /api/admin/faqs/[id] - Update a FAQ
async function handleUpdateFAQ(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Remove undefined values
    const updateData: UpdateFAQData = {}
    if (body.question !== undefined) updateData.question = body.question
    if (body.answer !== undefined) updateData.answer = body.answer
    if (body.page_slug !== undefined) updateData.page_slug = body.page_slug
    if (body.category !== undefined) updateData.category = body.category
    if (body.display_order !== undefined) updateData.display_order = body.display_order
    if (body.is_active !== undefined) updateData.is_active = body.is_active

    const updatedFAQ = await FAQService.updateFAQ(params.id, updateData)

    if (!updatedFAQ) {
      return NextResponse.json(
        {
          success: false,
          error: 'FAQ not found'
        },
        { status: 404 }
      )
    }

    // Invalidate FAQ cache after successful update
    invalidateFAQCache()

    return NextResponse.json({
      success: true,
      data: updatedFAQ,
      meta: {
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error updating FAQ:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update FAQ',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/faqs/[id] - Delete a FAQ
async function handleDeleteFAQ(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await FAQService.deleteFAQ(params.id)
    
    // Invalidate FAQ cache after successful deletion
    invalidateFAQCache()

    return NextResponse.json({
      success: true,
      message: 'FAQ deleted successfully',
      meta: {
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete FAQ',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Export auth-protected handlers
export const GET = withAdminAuth(handleGetFAQ)
export const PUT = withAdminAuth(handleUpdateFAQ)
export const DELETE = withAdminAuth(handleDeleteFAQ)
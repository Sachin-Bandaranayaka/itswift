import { NextRequest, NextResponse } from 'next/server'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'

export const dynamic = 'force-dynamic';

/**
 * GET /api/newsletter/subscriber-by-token
 * Get subscriber information by unsubscribe token
 * Used for resubscribe functionality
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Missing token parameter' },
        { status: 400 }
      )
    }

    // Get subscriber by token
    const result = await NewsletterSubscribersService.getByUnsubscribeToken(token)

    if (!result.data) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 404 }
      )
    }

    // Return subscriber info (excluding sensitive data)
    const subscriberInfo = {
      email: result.data.email,
      first_name: result.data.first_name,
      last_name: result.data.last_name,
      status: result.data.status
    }

    return NextResponse.json({
      success: true,
      subscriber: subscriberInfo
    })
  } catch (error) {
    console.error('Error in GET /api/newsletter/subscriber-by-token:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
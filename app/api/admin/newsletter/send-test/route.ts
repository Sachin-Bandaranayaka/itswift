import { NextRequest, NextResponse } from 'next/server'
import { NewsletterService } from '@/lib/services/newsletter'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaignId, testEmail } = body

    if (!campaignId || !testEmail) {
      return NextResponse.json(
        { error: 'Campaign ID and test email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(testEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const newsletterService = new NewsletterService()
    const result = await newsletterService.sendCampaign({
      campaignId,
      testEmail
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.errors.join(', ') || 'Failed to send test email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Test email sent successfully',
      messageId: result.messageIds[0]
    })
  } catch (error) {
    console.error('Error sending test email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { NewsletterService } from '@/lib/services/newsletter'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaignId, scheduleAt } = body

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      )
    }

    const newsletterService = new NewsletterService()
    const result = await newsletterService.sendCampaign({
      campaignId,
      scheduleAt: scheduleAt ? new Date(scheduleAt) : undefined
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.errors.join(', ') || 'Failed to send newsletter' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: scheduleAt ? 'Newsletter scheduled successfully' : 'Newsletter sent successfully',
      recipientCount: result.recipientCount,
      messageIds: result.messageIds
    })
  } catch (error) {
    console.error('Error sending newsletter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
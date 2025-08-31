import { NextRequest, NextResponse } from 'next/server'
import { NewsletterService } from '@/lib/services/newsletter'

export async function POST(request: NextRequest) {
  try {
    const newsletterService = new NewsletterService()
    const result = await newsletterService.processScheduledCampaigns()

    return NextResponse.json({
      message: 'Scheduled campaigns processed',
      processed: result.processed,
      successful: result.successful,
      failed: result.failed,
      errors: result.errors
    })
  } catch (error) {
    console.error('Error processing scheduled campaigns:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Allow GET for health checks
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Newsletter processing endpoint is healthy',
    timestamp: new Date().toISOString()
  })
}
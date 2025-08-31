// API endpoint for triggering analytics data collection

import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsCollector } from '../../../../../lib/services/analytics-collector'

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'social', 'newsletter', 'blog', or 'all'

    let result

    switch (type) {
      case 'social':
        result = await AnalyticsCollector.collectSocialAnalytics()
        break
      case 'newsletter':
        result = await AnalyticsCollector.collectNewsletterAnalytics()
        break
      case 'blog':
        result = await AnalyticsCollector.collectBlogAnalytics()
        break
      case 'all':
      default:
        result = await AnalyticsCollector.collectAllAnalytics()
        break
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Analytics collection completed'
    })
  } catch (error) {
    console.error('Error in analytics collection API:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to collect analytics data'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get collection status or recent collection results
    return NextResponse.json({
      success: true,
      message: 'Analytics collection endpoint is available',
      endpoints: {
        'POST /api/admin/analytics/collect': 'Trigger analytics collection',
        'POST /api/admin/analytics/collect?type=social': 'Collect social media analytics',
        'POST /api/admin/analytics/collect?type=newsletter': 'Collect newsletter analytics',
        'POST /api/admin/analytics/collect?type=blog': 'Collect blog analytics',
        'POST /api/admin/analytics/collect?type=all': 'Collect all analytics'
      }
    })
  } catch (error) {
    console.error('Error in analytics collection API:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
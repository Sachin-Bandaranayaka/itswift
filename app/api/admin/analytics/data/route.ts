// API endpoint for retrieving analytics data

import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsTracker } from '../../../../../lib/services/analytics-tracker'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'summary', 'comparison', 'platform', 'top'
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const contentType = searchParams.get('contentType') as 'blog' | 'social' | 'newsletter' | undefined
    const metric = searchParams.get('metric') as 'views' | 'likes' | 'shares' | 'comments' | 'clicks' | undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10

    let result

    switch (type) {
      case 'summary':
        result = await AnalyticsTracker.getAnalyticsSummary(dateFrom || undefined, dateTo || undefined)
        break

      case 'comparison':
        result = await AnalyticsTracker.getContentTypeComparison(dateFrom || undefined, dateTo || undefined)
        break

      case 'platform':
        result = await AnalyticsTracker.getPlatformComparison(dateFrom || undefined, dateTo || undefined)
        break

      case 'top':
        result = await AnalyticsTracker.getTopPerformingContent(
          metric || 'views',
          limit,
          contentType
        )
        break

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid type parameter. Use: summary, comparison, platform, or top'
          },
          { status: 400 }
        )
    }

    if (result.error) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          message: 'Failed to retrieve analytics data'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Analytics data retrieved successfully'
    })
  } catch (error) {
    console.error('Error in analytics data API:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to retrieve analytics data'
      },
      { status: 500 }
    )
  }
}
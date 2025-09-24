// API endpoint for retrieving analytics data

import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsTracker } from '../../../../../lib/services/analytics-tracker'
import {
  getFallbackAnalyticsSummary,
  getFallbackContentTypeComparison,
  getFallbackPlatformComparison,
  getFallbackTopPerforming
} from '../../../../../lib/services/analytics-fallback'

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

    let data: unknown = null
    let error: string | null = null
    let fallbackData: unknown = null

    switch (type) {
      case 'summary': {
        const result = await AnalyticsTracker.getAnalyticsSummary(dateFrom || undefined, dateTo || undefined)
        data = result.data
        error = result.error
        fallbackData = getFallbackAnalyticsSummary()
        break
      }

      case 'comparison': {
        const result = await AnalyticsTracker.getContentTypeComparison(dateFrom || undefined, dateTo || undefined)
        data = result.data
        error = result.error
        fallbackData = getFallbackContentTypeComparison()
        break
      }

      case 'platform': {
        const result = await AnalyticsTracker.getPlatformComparison(dateFrom || undefined, dateTo || undefined)
        data = result.data
        error = result.error
        fallbackData = getFallbackPlatformComparison()
        break
      }

      case 'top': {
        const safeMetric = metric || 'views'
        const result = await AnalyticsTracker.getTopPerformingContent(
          safeMetric,
          limit,
          contentType
        )
        data = result.data
        error = result.error
        fallbackData = getFallbackTopPerforming(safeMetric, limit, contentType)
        break
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid type parameter. Use: summary, comparison, platform, or top'
          },
          { status: 400 }
        )
    }

    if (error) {
      console.warn(
        `[analytics] using fallback data for ${type} analytics: ${error}`
      )

      return NextResponse.json(
        {
          success: true,
          data: fallbackData,
          fallback: true,
          message: 'Analytics data retrieved from fallback dataset'
        },
        {
          status: 200,
          headers: {
            'x-analytics-fallback': 'true'
          }
        }
      )
    }

    return NextResponse.json({
      success: true,
      data,
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

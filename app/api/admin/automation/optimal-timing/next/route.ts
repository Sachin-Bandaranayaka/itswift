// API route for getting the next optimal posting time

import { NextRequest, NextResponse } from 'next/server'
import { OptimalTimingAnalyzer } from '@/lib/services/optimal-timing-analyzer'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform') as 'linkedin' | 'twitter' | null
    const fromDateParam = searchParams.get('from_date')

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform parameter is required (linkedin or twitter)' },
        { status: 400 }
      )
    }

    if (platform !== 'linkedin' && platform !== 'twitter') {
      return NextResponse.json(
        { error: 'Invalid platform. Must be "linkedin" or "twitter"' },
        { status: 400 }
      )
    }

    const fromDate = fromDateParam ? new Date(fromDateParam) : new Date()

    // Validate date
    if (isNaN(fromDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid from_date format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)' },
        { status: 400 }
      )
    }

    const nextOptimalTime = await OptimalTimingAnalyzer.getNextOptimalTime(platform, fromDate)

    if (!nextOptimalTime) {
      return NextResponse.json(
        { error: 'No optimal times found for the specified platform' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      data: nextOptimalTime, 
      success: true,
      platform,
      from_date: fromDate.toISOString()
    })
  } catch (error) {
    console.error('Error in GET /api/admin/automation/optimal-timing/next:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
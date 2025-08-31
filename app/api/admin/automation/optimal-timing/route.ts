// API route for optimal timing analysis and suggestions

import { NextRequest, NextResponse } from 'next/server'
import { OptimalTimingAnalyzer } from '@/lib/services/optimal-timing-analyzer'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform') as 'linkedin' | 'twitter' | null
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 5

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

    const recommendations = await OptimalTimingAnalyzer.getOptimalTimes(platform, limit)

    return NextResponse.json({ 
      data: recommendations, 
      success: true,
      platform,
      count: recommendations.length
    })
  } catch (error) {
    console.error('Error in GET /api/admin/automation/optimal-timing:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platform, days_back } = body

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform is required' },
        { status: 400 }
      )
    }

    if (platform !== 'linkedin' && platform !== 'twitter' && platform !== 'all') {
      return NextResponse.json(
        { error: 'Invalid platform. Must be "linkedin", "twitter", or "all"' },
        { status: 400 }
      )
    }

    let result

    if (platform === 'all') {
      // Analyze all platforms
      result = await OptimalTimingAnalyzer.analyzeAllPlatforms()
    } else {
      // Analyze specific platform
      result = await OptimalTimingAnalyzer.analyzeEngagementPatterns(
        platform as 'linkedin' | 'twitter',
        days_back || 30
      )
    }

    return NextResponse.json({ 
      data: result, 
      success: true,
      message: 'Optimal timing analysis completed successfully'
    })
  } catch (error) {
    console.error('Error in POST /api/admin/automation/optimal-timing:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
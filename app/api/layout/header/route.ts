import { NextResponse } from 'next/server'
import { fetchHeaderConfig } from '@/lib/services/site-layout'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { config } = await fetchHeaderConfig()

    return NextResponse.json({
      success: true,
      data: config,
    })
  } catch (error) {
    console.error('Failed to fetch header configuration:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch header configuration',
      },
      { status: 500 },
    )
  }
}

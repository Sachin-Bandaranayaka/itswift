import { NextResponse } from 'next/server'
import { fetchFooterConfig } from '@/lib/services/site-layout'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { config } = await fetchFooterConfig()

    return NextResponse.json({
      success: true,
      data: config,
    })
  } catch (error) {
    console.error('Failed to fetch footer configuration:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch footer configuration',
      },
      { status: 500 },
    )
  }
}

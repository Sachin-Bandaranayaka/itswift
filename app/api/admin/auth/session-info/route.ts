import { NextRequest, NextResponse } from 'next/server'
import { getSessionInfo } from '@/lib/auth/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const sessionInfo = await getSessionInfo()

    if (!sessionInfo) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      )
    }

    return NextResponse.json(sessionInfo, { status: 200 })
  } catch (error) {
    console.error('Error getting session info:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
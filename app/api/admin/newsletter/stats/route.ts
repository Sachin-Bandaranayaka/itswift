import { NextRequest, NextResponse } from 'next/server'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'

export async function GET(request: NextRequest) {
  try {
    // Get all subscribers to calculate stats
    const allResult = await NewsletterSubscribersService.getAll()
    if (allResult.error) {
      return NextResponse.json(
        { error: allResult.error },
        { status: 500 }
      )
    }

    const subscribers = allResult.data
    const total = subscribers.length
    const active = subscribers.filter(s => s.status === 'active').length
    const unsubscribed = subscribers.filter(s => s.status === 'unsubscribed').length
    const bounced = subscribers.filter(s => s.status === 'bounced').length

    // Calculate recent growth (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentGrowth = subscribers.filter(s => 
      new Date(s.subscribed_at) >= thirtyDaysAgo
    ).length

    const stats = {
      total,
      active,
      unsubscribed,
      bounced,
      recentGrowth
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Error fetching newsletter stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
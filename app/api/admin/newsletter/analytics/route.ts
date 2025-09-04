import { NextRequest, NextResponse } from 'next/server'
import { NewsletterCampaignsService } from '@/lib/database/services/newsletter-campaigns'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    
    switch (range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(endDate.getDate() - 30)
    }

    // Get all campaigns
    const allCampaignsResult = await NewsletterCampaignsService.getAll()
    if (allCampaignsResult.error) {
      return NextResponse.json(
        { error: allCampaignsResult.error },
        { status: 500 }
      )
    }

    const allCampaigns = allCampaignsResult.data

    // Filter campaigns by date range
    const campaignsInRange = allCampaigns.filter(campaign => {
      const campaignDate = new Date(campaign.created_at)
      return campaignDate >= startDate && campaignDate <= endDate
    })

    // Get sent campaigns for analytics
    const sentCampaigns = campaignsInRange.filter(c => c.status === 'sent')

    // Get subscriber stats
    const subscribersResult = await NewsletterSubscribersService.getAll()
    if (subscribersResult.error) {
      return NextResponse.json(
        { error: subscribersResult.error },
        { status: 500 }
      )
    }

    const allSubscribers = subscribersResult.data
    const activeSubscribers = allSubscribers.filter(s => s.status === 'active')

    // Calculate subscriber stats by source
    const subscribersBySource = allSubscribers.reduce((acc, subscriber) => {
      const source = subscriber.source || 'unknown'
      if (!acc[source]) {
        acc[source] = { total: 0, active: 0, unsubscribed: 0 }
      }
      acc[source].total++
      if (subscriber.status === 'active') {
        acc[source].active++
      } else if (subscriber.status === 'unsubscribed') {
        acc[source].unsubscribed++
      }
      return acc
    }, {} as Record<string, { total: number; active: number; unsubscribed: number }>)

    // Calculate metrics
    const totalCampaigns = campaignsInRange.length
    const totalSent = sentCampaigns.length

    // Calculate average rates (mock data for now - in real implementation, this would come from email service)
    let totalOpenRate = 0
    let totalClickRate = 0
    let totalUnsubscribes = 0
    let totalBounces = 0

    const recentCampaigns = sentCampaigns.slice(0, 10).map(campaign => {
      // Mock analytics data - in real implementation, fetch from email service
      const openRate = Math.random() * 0.4 + 0.1 // 10-50%
      const clickRate = Math.random() * 0.08 + 0.01 // 1-9%
      const unsubscribeCount = Math.floor(Math.random() * 5)
      const bounceCount = Math.floor(Math.random() * 10)

      totalOpenRate += openRate
      totalClickRate += clickRate
      totalUnsubscribes += unsubscribeCount
      totalBounces += bounceCount

      // Extract source analytics from campaign analytics if available
      const sourceAnalytics = campaign.analytics?.recipientsBySource || {}

      return {
        id: campaign.id,
        subject: campaign.subject,
        sentAt: campaign.sent_at || campaign.created_at,
        recipientCount: campaign.recipient_count,
        openRate,
        clickRate,
        unsubscribeCount,
        bounceCount,
        status: campaign.status,
        recipientsBySource: sourceAnalytics
      }
    })

    const averageOpenRate = totalSent > 0 ? totalOpenRate / totalSent : 0
    const averageClickRate = totalSent > 0 ? totalClickRate / totalSent : 0
    const unsubscribeRate = totalSent > 0 ? totalUnsubscribes / (totalSent * 100) : 0
    const bounceRate = totalSent > 0 ? totalBounces / (totalSent * 100) : 0

    // Generate subscriber growth data
    const subscriberGrowth = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      // Mock growth data - in real implementation, calculate from actual subscriber data
      const newSubscribers = Math.floor(Math.random() * 20) + 5
      const unsubscribes = Math.floor(Math.random() * 5)
      
      subscriberGrowth.push({
        date: date.toISOString().split('T')[0],
        subscribers: activeSubscribers.length + Math.floor(Math.random() * 100),
        newSubscribers,
        unsubscribes
      })
    }

    // Top performing campaigns (sorted by engagement rate)
    const topPerformingCampaigns = recentCampaigns
      .sort((a, b) => (b.openRate + b.clickRate) - (a.openRate + a.clickRate))
      .slice(0, 5)

    const analytics = {
      totalCampaigns,
      totalSent,
      totalSubscribers: activeSubscribers.length,
      averageOpenRate,
      averageClickRate,
      unsubscribeRate,
      bounceRate,
      recentCampaigns,
      subscriberGrowth,
      topPerformingCampaigns,
      subscribersBySource
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error('Error fetching newsletter analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
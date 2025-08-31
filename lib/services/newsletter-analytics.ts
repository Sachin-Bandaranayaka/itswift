// Newsletter analytics service for tracking email performance

import { NewsletterCampaignsService } from '@/lib/database/services/newsletter-campaigns'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'
import { getBrevoService } from '@/lib/integrations/brevo'

interface CampaignMetrics {
  campaignId: string
  messageIds: string[]
  delivered: number
  opens: number
  clicks: number
  bounces: number
  spam: number
  unsubscribes: number
  openRate: number
  clickRate: number
  bounceRate: number
  unsubscribeRate: number
}

interface AnalyticsTimeframe {
  startDate: Date
  endDate: Date
  campaigns: number
  totalSent: number
  totalDelivered: number
  totalOpens: number
  totalClicks: number
  totalBounces: number
  totalUnsubscribes: number
  averageOpenRate: number
  averageClickRate: number
  averageBounceRate: number
  averageUnsubscribeRate: number
}

export class NewsletterAnalyticsService {
  private brevoService = getBrevoService()

  /**
   * Update campaign metrics from email service
   */
  async updateCampaignMetrics(campaignId: string, messageIds: string[]): Promise<CampaignMetrics | null> {
    try {
      const campaign = await NewsletterCampaignsService.getById(campaignId)
      if (campaign.error || !campaign.data) {
        console.error('Campaign not found:', campaignId)
        return null
      }

      let totalDelivered = 0
      let totalOpens = 0
      let totalClicks = 0
      let totalBounces = 0
      let totalSpam = 0
      let totalUnsubscribes = 0

      // Aggregate stats from all message IDs
      for (const messageId of messageIds) {
        const statsResult = await this.brevoService.getEmailStats(messageId)
        if (statsResult.stats) {
          const stats = statsResult.stats
          totalDelivered += stats.delivered
          totalOpens += stats.opens
          totalClicks += stats.clicks
          totalBounces += stats.bounces
          totalSpam += stats.spam
          totalUnsubscribes += stats.unsubscribes
        }
      }

      const recipientCount = campaign.data.recipient_count || 1
      const openRate = recipientCount > 0 ? totalOpens / recipientCount : 0
      const clickRate = recipientCount > 0 ? totalClicks / recipientCount : 0
      const bounceRate = recipientCount > 0 ? totalBounces / recipientCount : 0
      const unsubscribeRate = recipientCount > 0 ? totalUnsubscribes / recipientCount : 0

      // Update campaign with analytics
      await NewsletterCampaignsService.update(campaignId, {
        open_rate: openRate,
        click_rate: clickRate
      })

      return {
        campaignId,
        messageIds,
        delivered: totalDelivered,
        opens: totalOpens,
        clicks: totalClicks,
        bounces: totalBounces,
        spam: totalSpam,
        unsubscribes: totalUnsubscribes,
        openRate,
        clickRate,
        bounceRate,
        unsubscribeRate
      }
    } catch (error) {
      console.error('Error updating campaign metrics:', error)
      return null
    }
  }

  /**
   * Get analytics for a specific timeframe
   */
  async getAnalyticsForTimeframe(startDate: Date, endDate: Date): Promise<AnalyticsTimeframe> {
    try {
      // Get campaigns in timeframe
      const campaignsResult = await NewsletterCampaignsService.getAll()
      if (campaignsResult.error) {
        throw new Error(campaignsResult.error)
      }

      const campaigns = campaignsResult.data.filter(campaign => {
        const campaignDate = new Date(campaign.created_at)
        return campaignDate >= startDate && campaignDate <= endDate && campaign.status === 'sent'
      })

      let totalSent = 0
      let totalDelivered = 0
      let totalOpens = 0
      let totalClicks = 0
      let totalBounces = 0
      let totalUnsubscribes = 0

      for (const campaign of campaigns) {
        totalSent += campaign.recipient_count
        
        // Use stored rates or calculate from actual data
        if (campaign.open_rate !== null && campaign.click_rate !== null) {
          totalOpens += Math.round(campaign.recipient_count * campaign.open_rate)
          totalClicks += Math.round(campaign.recipient_count * campaign.click_rate)
        }
      }

      const averageOpenRate = totalSent > 0 ? totalOpens / totalSent : 0
      const averageClickRate = totalSent > 0 ? totalClicks / totalSent : 0
      const averageBounceRate = totalSent > 0 ? totalBounces / totalSent : 0
      const averageUnsubscribeRate = totalSent > 0 ? totalUnsubscribes / totalSent : 0

      return {
        startDate,
        endDate,
        campaigns: campaigns.length,
        totalSent,
        totalDelivered,
        totalOpens,
        totalClicks,
        totalBounces,
        totalUnsubscribes,
        averageOpenRate,
        averageClickRate,
        averageBounceRate,
        averageUnsubscribeRate
      }
    } catch (error) {
      console.error('Error getting analytics for timeframe:', error)
      throw error
    }
  }

  /**
   * Get subscriber growth data
   */
  async getSubscriberGrowth(days: number = 30): Promise<Array<{
    date: string
    totalSubscribers: number
    newSubscribers: number
    unsubscribes: number
    netGrowth: number
  }>> {
    try {
      const subscribersResult = await NewsletterSubscribersService.getAll()
      if (subscribersResult.error) {
        throw new Error(subscribersResult.error)
      }

      const subscribers = subscribersResult.data
      const growthData = []

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateString = date.toISOString().split('T')[0]

        // Count subscribers up to this date
        const totalSubscribers = subscribers.filter(s => 
          new Date(s.subscribed_at) <= date && s.status === 'active'
        ).length

        // Count new subscribers on this date
        const newSubscribers = subscribers.filter(s => {
          const subDate = new Date(s.subscribed_at)
          return subDate.toISOString().split('T')[0] === dateString
        }).length

        // Count unsubscribes on this date
        const unsubscribes = subscribers.filter(s => {
          if (!s.unsubscribed_at) return false
          const unsubDate = new Date(s.unsubscribed_at)
          return unsubDate.toISOString().split('T')[0] === dateString
        }).length

        const netGrowth = newSubscribers - unsubscribes

        growthData.push({
          date: dateString,
          totalSubscribers,
          newSubscribers,
          unsubscribes,
          netGrowth
        })
      }

      return growthData
    } catch (error) {
      console.error('Error getting subscriber growth:', error)
      return []
    }
  }

  /**
   * Get top performing campaigns
   */
  async getTopPerformingCampaigns(limit: number = 5): Promise<Array<{
    id: string
    subject: string
    sentAt: string
    recipientCount: number
    openRate: number
    clickRate: number
    engagementScore: number
  }>> {
    try {
      const campaignsResult = await NewsletterCampaignsService.getByStatus('sent')
      if (campaignsResult.error) {
        throw new Error(campaignsResult.error)
      }

      const campaigns = campaignsResult.data
        .filter(c => c.open_rate !== null && c.click_rate !== null)
        .map(c => ({
          id: c.id,
          subject: c.subject,
          sentAt: c.sent_at || c.created_at,
          recipientCount: c.recipient_count,
          openRate: c.open_rate || 0,
          clickRate: c.click_rate || 0,
          engagementScore: (c.open_rate || 0) + (c.click_rate || 0) * 2 // Weight clicks more heavily
        }))
        .sort((a, b) => b.engagementScore - a.engagementScore)
        .slice(0, limit)

      return campaigns
    } catch (error) {
      console.error('Error getting top performing campaigns:', error)
      return []
    }
  }

  /**
   * Update all campaign analytics
   */
  async updateAllCampaignAnalytics(): Promise<{
    updated: number
    failed: number
    errors: string[]
  }> {
    try {
      const campaignsResult = await NewsletterCampaignsService.getByStatus('sent')
      if (campaignsResult.error) {
        throw new Error(campaignsResult.error)
      }

      const campaigns = campaignsResult.data.filter(c => 
        c.open_rate === null || c.click_rate === null
      )

      const results = {
        updated: 0,
        failed: 0,
        errors: [] as string[]
      }

      for (const campaign of campaigns) {
        try {
          // In a real implementation, you would store message IDs when sending
          // For now, we'll skip campaigns without stored message IDs
          console.log(`Skipping analytics update for campaign ${campaign.id} - no message IDs stored`)
          continue
        } catch (error) {
          results.failed++
          results.errors.push(`Campaign ${campaign.id}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }

      return results
    } catch (error) {
      console.error('Error updating all campaign analytics:', error)
      return {
        updated: 0,
        failed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }
    }
  }

  /**
   * Generate analytics report
   */
  async generateAnalyticsReport(timeframe: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<{
    period: string
    summary: AnalyticsTimeframe
    topCampaigns: Array<any>
    subscriberGrowth: Array<any>
    recommendations: string[]
  }> {
    try {
      const endDate = new Date()
      const startDate = new Date()

      switch (timeframe) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1)
          break
        case 'quarter':
          startDate.setMonth(endDate.getMonth() - 3)
          break
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1)
          break
      }

      const [summary, topCampaigns, subscriberGrowth] = await Promise.all([
        this.getAnalyticsForTimeframe(startDate, endDate),
        this.getTopPerformingCampaigns(5),
        this.getSubscriberGrowth(timeframe === 'week' ? 7 : 30)
      ])

      // Generate recommendations based on performance
      const recommendations = []
      
      if (summary.averageOpenRate < 0.20) {
        recommendations.push('Consider improving subject lines to increase open rates (current: ' + 
          (summary.averageOpenRate * 100).toFixed(1) + '%, target: 20%+)')
      }
      
      if (summary.averageClickRate < 0.025) {
        recommendations.push('Focus on more engaging content and clear call-to-actions to improve click rates')
      }
      
      if (summary.averageBounceRate > 0.05) {
        recommendations.push('Review and clean your subscriber list to reduce bounce rates')
      }

      const recentGrowth = subscriberGrowth.slice(-7).reduce((sum, day) => sum + day.netGrowth, 0)
      if (recentGrowth < 0) {
        recommendations.push('Subscriber growth is negative - consider improving content quality and reducing send frequency')
      }

      return {
        period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
        summary,
        topCampaigns,
        subscriberGrowth,
        recommendations
      }
    } catch (error) {
      console.error('Error generating analytics report:', error)
      throw error
    }
  }
}
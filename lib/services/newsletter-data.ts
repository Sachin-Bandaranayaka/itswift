/**
 * Newsletter Data Service - Fetches newsletter data from Supabase and Brevo
 */

import { getSupabaseAdmin } from '@/lib/supabase';
import { getBrevoService } from '@/lib/integrations/brevo';
import { NewsletterStats, ActivityItem, PerformingContentItem, ScheduledItem } from '@/lib/types/dashboard';
import { isThisMonth, isLastMonth, calculateGrowth } from '@/lib/utils/dashboard-utils';

export class NewsletterDataService {
  /**
   * Fetch newsletter subscriber statistics from Supabase
   */
  async getNewsletterStats(): Promise<NewsletterStats> {
    try {
      // Fetch all active subscribers
      const { data: subscribers, error } = await getSupabaseAdmin()
        .from('newsletter_subscribers')
        .select('*')
        .eq('status', 'active');

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (!subscribers) {
        return {
          totalSubscribers: 0,
          newSubscribersThisMonth: 0,
          growthPercentage: 0
        };
      }

      // Filter subscribers for this month
      const thisMonthSubscribers = subscribers.filter(subscriber => {
        const subscribedDate = new Date(subscriber.subscribed_at);
        return isThisMonth(subscribedDate);
      });

      // Filter subscribers for last month
      const lastMonthSubscribers = subscribers.filter(subscriber => {
        const subscribedDate = new Date(subscriber.subscribed_at);
        return isLastMonth(subscribedDate);
      });

      const thisMonthCount = thisMonthSubscribers.length;
      const lastMonthCount = lastMonthSubscribers.length;
      const growthPercentage = calculateGrowth(thisMonthCount, lastMonthCount);

      return {
        totalSubscribers: subscribers.length,
        newSubscribersThisMonth: thisMonthCount,
        growthPercentage
      };
    } catch (error) {
      console.error('Error fetching newsletter stats:', error);
      throw new Error('Failed to fetch newsletter statistics');
    }
  }

  /**
   * Fetch recent newsletter activity including sent campaigns and new subscribers
   */
  async getRecentNewsletterActivity(): Promise<ActivityItem[]> {
    try {
      // Get recent sent campaigns
      const { data: campaigns, error: campaignError } = await getSupabaseAdmin()
        .from('newsletter_campaigns')
        .select('*')
        .eq('status', 'sent')
        .order('sent_at', { ascending: false })
        .limit(3);

      if (campaignError) {
        console.error('Supabase campaign error:', campaignError);
      }

      // Get recent new subscribers
      const { data: subscribers, error: subscriberError } = await getSupabaseAdmin()
        .from('newsletter_subscribers')
        .select('*')
        .eq('status', 'active')
        .order('subscribed_at', { ascending: false })
        .limit(3);

      if (subscriberError) {
        console.error('Supabase subscriber error:', subscriberError);
      }

      const activities: ActivityItem[] = [];

      // Add campaign activities
      if (campaigns) {
        campaigns.forEach(campaign => {
          const openRate = campaign.open_rate ? `${campaign.open_rate}% open rate` : '';
          const description = openRate
            ? `Newsletter sent to ${campaign.recipient_count} subscribers • ${openRate}`
            : `Newsletter sent to ${campaign.recipient_count} subscribers`;

          activities.push({
            id: campaign.id,
            type: 'newsletter' as const,
            title: campaign.subject || 'Untitled Newsletter',
            description,
            timestamp: new Date(campaign.sent_at || campaign.created_at),
            status: 'sent' as const,
            platform: 'email'
          });
        });
      }

      // Add subscriber activities (grouped by day to avoid spam)
      if (subscribers) {
        const subscribersByDay: { [key: string]: number } = {};
        subscribers.forEach(subscriber => {
          const day = new Date(subscriber.subscribed_at).toDateString();
          subscribersByDay[day] = (subscribersByDay[day] || 0) + 1;
        });

        Object.entries(subscribersByDay).forEach(([day, count]) => {
          activities.push({
            id: `subscribers-${day}`,
            type: 'newsletter' as const,
            title: `${count} New Subscriber${count > 1 ? 's' : ''}`,
            description: `${count} new subscriber${count > 1 ? 's' : ''} joined the newsletter`,
            timestamp: new Date(day),
            status: 'published' as const,
            platform: 'email'
          });
        });
      }

      // Sort by timestamp and return top 5
      return activities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 5);
    } catch (error) {
      console.error('Error fetching recent newsletter activity:', error);
      return [];
    }
  }

  /**
   * Get top performing newsletter campaigns with enhanced metrics
   */
  async getTopPerformingNewsletterCampaigns(): Promise<PerformingContentItem[]> {
    try {
      // First try to sync recent campaigns from Brevo for up-to-date data
      await this.syncAllRecentCampaignsFromBrevo(7); // Sync last 7 days

      const { data: campaigns, error } = await getSupabaseAdmin()
        .from('newsletter_campaigns')
        .select('*')
        .eq('status', 'sent')
        .not('open_rate', 'is', null)
        .order('open_rate', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Supabase error:', error);
        return [];
      }

      if (!campaigns) {
        return [];
      }

      return campaigns.map(campaign => {
        const opens = campaign.open_rate
          ? Math.round(campaign.recipient_count * (campaign.open_rate / 100))
          : 0;

        const clicks = campaign.click_rate
          ? Math.round(campaign.recipient_count * (campaign.click_rate / 100))
          : 0;

        return {
          id: campaign.id,
          title: campaign.subject || 'Untitled Newsletter',
          type: 'newsletter' as const,
          platform: 'email',
          metrics: {
            opens,
            clicks,
            // Add additional context in views field for sorting/display
            views: campaign.recipient_count
          }
        };
      });
    } catch (error) {
      console.error('Error fetching top performing newsletter campaigns:', error);
      return [];
    }
  }

  /**
   * Get newsletter campaign performance stats for a specific campaign
   */
  async getCampaignPerformanceStats(campaignId: string): Promise<{
    campaign: any;
    performance: {
      openRate: number;
      clickRate: number;
      opens: number;
      clicks: number;
      recipientCount: number;
      sentAt: Date;
      isRealtimeData: boolean;
    } | null;
  }> {
    try {
      // Get campaign data
      const { data: campaign, error } = await getSupabaseAdmin()
        .from('newsletter_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error || !campaign) {
        return {
          campaign: null,
          performance: null
        };
      }

      // Try to sync latest data from Brevo if available
      if (campaign.brevo_message_id) {
        await this.syncCampaignEngagementFromBrevo(campaignId);

        // Refetch updated data
        const { data: updatedCampaign } = await getSupabaseAdmin()
          .from('newsletter_campaigns')
          .select('*')
          .eq('id', campaignId)
          .single();

        if (updatedCampaign) {
          campaign.open_rate = updatedCampaign.open_rate;
          campaign.click_rate = updatedCampaign.click_rate;
          campaign.last_synced_at = updatedCampaign.last_synced_at;
        }
      }

      const opens = campaign.open_rate
        ? Math.round(campaign.recipient_count * (campaign.open_rate / 100))
        : 0;

      const clicks = campaign.click_rate
        ? Math.round(campaign.recipient_count * (campaign.click_rate / 100))
        : 0;

      const isRealtimeData = campaign.last_synced_at &&
        (new Date().getTime() - new Date(campaign.last_synced_at).getTime()) < 3600000; // Within 1 hour

      return {
        campaign,
        performance: {
          openRate: campaign.open_rate || 0,
          clickRate: campaign.click_rate || 0,
          opens,
          clicks,
          recipientCount: campaign.recipient_count || 0,
          sentAt: new Date(campaign.sent_at || campaign.created_at),
          isRealtimeData: Boolean(isRealtimeData)
        }
      };
    } catch (error) {
      console.error('Error fetching campaign performance stats:', error);
      return {
        campaign: null,
        performance: null
      };
    }
  }

  /**
   * Get scheduled newsletter campaigns
   */
  async getScheduledNewsletterCampaigns(): Promise<ScheduledItem[]> {
    try {
      const now = new Date().toISOString();

      const { data: campaigns, error } = await getSupabaseAdmin()
        .from('newsletter_campaigns')
        .select('*')
        .eq('status', 'scheduled')
        .gte('scheduled_at', now)
        .order('scheduled_at', { ascending: true })
        .limit(5);

      if (error) {
        console.error('Supabase error:', error);
        return [];
      }

      if (!campaigns) {
        return [];
      }

      return campaigns
        .filter(campaign => campaign.scheduled_at || campaign.created_at) // Filter out campaigns without dates
        .map(campaign => ({
          id: campaign.id,
          title: campaign.subject || 'Untitled Newsletter',
          type: 'newsletter' as const,
          platform: 'email',
          scheduledAt: new Date(campaign.scheduled_at || campaign.created_at)
        }))
        .filter(item => !isNaN(item.scheduledAt.getTime())); // Filter out invalid dates
    } catch (error) {
      console.error('Error fetching scheduled newsletter campaigns:', error);
      return [];
    }
  }

  /**
   * Get newsletter engagement metrics for a specific time period
   */
  async getNewsletterEngagementMetrics(days: number = 30): Promise<{
    totalSent: number;
    totalOpens: number;
    totalClicks: number;
    averageOpenRate: number;
    averageClickRate: number;
  }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const { data: campaigns, error } = await getSupabaseAdmin()
        .from('newsletter_campaigns')
        .select('*')
        .eq('status', 'sent')
        .gte('sent_at', cutoffDate.toISOString());

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (!campaigns || campaigns.length === 0) {
        return {
          totalSent: 0,
          totalOpens: 0,
          totalClicks: 0,
          averageOpenRate: 0,
          averageClickRate: 0
        };
      }

      const metrics = campaigns.reduce(
        (acc, campaign) => {
          const opens = campaign.open_rate
            ? Math.round(campaign.recipient_count * (campaign.open_rate / 100))
            : 0;
          const clicks = campaign.click_rate
            ? Math.round(campaign.recipient_count * (campaign.click_rate / 100))
            : 0;

          return {
            totalSent: acc.totalSent + campaign.recipient_count,
            totalOpens: acc.totalOpens + opens,
            totalClicks: acc.totalClicks + clicks,
            totalOpenRate: acc.totalOpenRate + (campaign.open_rate || 0),
            totalClickRate: acc.totalClickRate + (campaign.click_rate || 0)
          };
        },
        { totalSent: 0, totalOpens: 0, totalClicks: 0, totalOpenRate: 0, totalClickRate: 0 }
      );

      return {
        totalSent: metrics.totalSent,
        totalOpens: metrics.totalOpens,
        totalClicks: metrics.totalClicks,
        averageOpenRate: Math.round(metrics.totalOpenRate / campaigns.length),
        averageClickRate: Math.round(metrics.totalClickRate / campaigns.length)
      };
    } catch (error) {
      console.error('Error fetching newsletter engagement metrics:', error);
      return {
        totalSent: 0,
        totalOpens: 0,
        totalClicks: 0,
        averageOpenRate: 0,
        averageClickRate: 0
      };
    }
  }

  /**
   * Get subscriber growth over time
   */
  async getSubscriberGrowth(months: number = 6): Promise<Array<{
    month: string;
    subscribers: number;
    newSubscribers: number;
  }>> {
    try {
      const { data: subscribers, error } = await getSupabaseAdmin()
        .from('newsletter_subscribers')
        .select('subscribed_at, status')
        .eq('status', 'active')
        .order('subscribed_at', { ascending: true });

      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }

      if (!subscribers) {
        return [];
      }

      // Group subscribers by month
      const monthlyData: { [key: string]: number } = {};
      const now = new Date();

      // Initialize months
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toISOString().substring(0, 7); // YYYY-MM format
        monthlyData[monthKey] = 0;
      }

      // Count new subscribers per month
      subscribers.forEach(subscriber => {
        const subscribedDate = new Date(subscriber.subscribed_at);
        const monthKey = subscribedDate.toISOString().substring(0, 7);
        if (monthlyData.hasOwnProperty(monthKey)) {
          monthlyData[monthKey]++;
        }
      });

      // Convert to array format with cumulative totals
      let cumulativeTotal = 0;
      return Object.entries(monthlyData).map(([month, newSubscribers]) => {
        cumulativeTotal += newSubscribers;
        return {
          month,
          subscribers: cumulativeTotal,
          newSubscribers
        };
      });
    } catch (error) {
      console.error('Error fetching subscriber growth:', error);
      return [];
    }
  }

  /**
   * Sync campaign engagement data from Brevo API
   * This method fetches real-time engagement data from Brevo and updates local database
   */
  async syncCampaignEngagementFromBrevo(campaignId: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // Get campaign from database to get the Brevo message ID
      const { data: campaign, error: dbError } = await getSupabaseAdmin()
        .from('newsletter_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (dbError || !campaign) {
        return {
          success: false,
          error: 'Campaign not found in database'
        };
      }

      // If campaign doesn't have a Brevo message ID, skip sync
      if (!campaign.brevo_message_id) {
        return {
          success: false,
          error: 'Campaign does not have Brevo message ID'
        };
      }

      // Get real-time stats from Brevo
      const brevoService = getBrevoService();
      const { stats, error: brevoError } = await brevoService.getEmailStats(campaign.brevo_message_id);

      if (brevoError || !stats) {
        return {
          success: false,
          error: brevoError || 'Failed to fetch stats from Brevo'
        };
      }

      // Calculate rates based on recipient count
      const openRate = campaign.recipient_count > 0
        ? Math.round((stats.opens / campaign.recipient_count) * 100 * 100) / 100
        : 0;

      const clickRate = campaign.recipient_count > 0
        ? Math.round((stats.clicks / campaign.recipient_count) * 100 * 100) / 100
        : 0;

      // Update campaign with real-time engagement data
      const { error: updateError } = await getSupabaseAdmin()
        .from('newsletter_campaigns')
        .update({
          open_rate: openRate,
          click_rate: clickRate,
          brevo_stats: stats,
          last_synced_at: new Date().toISOString()
        })
        .eq('id', campaignId);

      if (updateError) {
        return {
          success: false,
          error: `Failed to update campaign: ${updateError.message}`
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Error syncing campaign engagement from Brevo:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get real-time engagement data for all recent campaigns from Brevo
   */
  async syncAllRecentCampaignsFromBrevo(days: number = 30): Promise<{
    synced: number;
    errors: string[];
  }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      // Get recent sent campaigns that have Brevo message IDs
      const { data: campaigns, error } = await getSupabaseAdmin()
        .from('newsletter_campaigns')
        .select('id, brevo_message_id')
        .eq('status', 'sent')
        .gte('sent_at', cutoffDate.toISOString())
        .not('brevo_message_id', 'is', null);

      if (error) {
        return {
          synced: 0,
          errors: [`Database error: ${error.message}`]
        };
      }

      if (!campaigns || campaigns.length === 0) {
        return {
          synced: 0,
          errors: []
        };
      }

      const results = {
        synced: 0,
        errors: [] as string[]
      };

      // Sync each campaign
      for (const campaign of campaigns) {
        const result = await this.syncCampaignEngagementFromBrevo(campaign.id);
        if (result.success) {
          results.synced++;
        } else {
          results.errors.push(`Campaign ${campaign.id}: ${result.error}`);
        }

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return results;
    } catch (error) {
      console.error('Error syncing all campaigns from Brevo:', error);
      return {
        synced: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * Get newsletter performance analytics for dashboard
   */
  async getNewsletterPerformanceAnalytics(days: number = 30): Promise<{
    totalCampaigns: number;
    totalRecipients: number;
    totalOpens: number;
    totalClicks: number;
    averageOpenRate: number;
    averageClickRate: number;
    topPerformingSubjects: string[];
    engagementTrend: Array<{
      date: string;
      opens: number;
      clicks: number;
    }>;
  }> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      // Sync recent campaigns first
      await this.syncAllRecentCampaignsFromBrevo(days);

      const { data: campaigns, error } = await getSupabaseAdmin()
        .from('newsletter_campaigns')
        .select('*')
        .eq('status', 'sent')
        .gte('sent_at', cutoffDate.toISOString())
        .order('sent_at', { ascending: true });

      if (error || !campaigns) {
        return {
          totalCampaigns: 0,
          totalRecipients: 0,
          totalOpens: 0,
          totalClicks: 0,
          averageOpenRate: 0,
          averageClickRate: 0,
          topPerformingSubjects: [],
          engagementTrend: []
        };
      }

      // Calculate totals
      const totals = campaigns.reduce(
        (acc, campaign) => {
          const opens = campaign.open_rate
            ? Math.round(campaign.recipient_count * (campaign.open_rate / 100))
            : 0;
          const clicks = campaign.click_rate
            ? Math.round(campaign.recipient_count * (campaign.click_rate / 100))
            : 0;

          return {
            campaigns: acc.campaigns + 1,
            recipients: acc.recipients + (campaign.recipient_count || 0),
            opens: acc.opens + opens,
            clicks: acc.clicks + clicks,
            openRateSum: acc.openRateSum + (campaign.open_rate || 0),
            clickRateSum: acc.clickRateSum + (campaign.click_rate || 0)
          };
        },
        { campaigns: 0, recipients: 0, opens: 0, clicks: 0, openRateSum: 0, clickRateSum: 0 }
      );

      // Get top performing subjects
      const topPerforming = campaigns
        .filter(c => c.open_rate && c.open_rate > 0)
        .sort((a, b) => (b.open_rate || 0) - (a.open_rate || 0))
        .slice(0, 3)
        .map(c => c.subject || 'Untitled');

      // Create engagement trend (group by day)
      const trendData: { [key: string]: { opens: number; clicks: number } } = {};
      campaigns.forEach(campaign => {
        const date = new Date(campaign.sent_at || campaign.created_at).toISOString().split('T')[0];
        const opens = campaign.open_rate
          ? Math.round(campaign.recipient_count * (campaign.open_rate / 100))
          : 0;
        const clicks = campaign.click_rate
          ? Math.round(campaign.recipient_count * (campaign.click_rate / 100))
          : 0;

        if (!trendData[date]) {
          trendData[date] = { opens: 0, clicks: 0 };
        }
        trendData[date].opens += opens;
        trendData[date].clicks += clicks;
      });

      const engagementTrend = Object.entries(trendData)
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        totalCampaigns: totals.campaigns,
        totalRecipients: totals.recipients,
        totalOpens: totals.opens,
        totalClicks: totals.clicks,
        averageOpenRate: totals.campaigns > 0
          ? Math.round(totals.openRateSum / totals.campaigns * 100) / 100
          : 0,
        averageClickRate: totals.campaigns > 0
          ? Math.round(totals.clickRateSum / totals.campaigns * 100) / 100
          : 0,
        topPerformingSubjects: topPerforming,
        engagementTrend
      };
    } catch (error) {
      console.error('Error fetching newsletter performance analytics:', error);
      return {
        totalCampaigns: 0,
        totalRecipients: 0,
        totalOpens: 0,
        totalClicks: 0,
        averageOpenRate: 0,
        averageClickRate: 0,
        topPerformingSubjects: [],
        engagementTrend: []
      };
    }
  }

  /**
   * Get enhanced newsletter statistics with real-time Brevo data
   */
  async getEnhancedNewsletterStats(): Promise<NewsletterStats & {
    totalCampaignsSent: number;
    averageOpenRate: number;
    averageClickRate: number;
    lastSyncedAt?: Date;
  }> {
    try {
      // Get basic newsletter stats
      const basicStats = await this.getNewsletterStats();

      // Get campaign statistics
      const { data: campaigns, error } = await getSupabaseAdmin()
        .from('newsletter_campaigns')
        .select('open_rate, click_rate, last_synced_at')
        .eq('status', 'sent')
        .not('open_rate', 'is', null);

      if (error) {
        console.error('Error fetching campaign stats:', error);
        return {
          ...basicStats,
          totalCampaignsSent: 0,
          averageOpenRate: 0,
          averageClickRate: 0
        };
      }

      const totalCampaigns = campaigns?.length || 0;
      const averageOpenRate = totalCampaigns > 0
        ? Math.round(campaigns.reduce((sum, c) => sum + (c.open_rate || 0), 0) / totalCampaigns * 100) / 100
        : 0;

      const averageClickRate = totalCampaigns > 0
        ? Math.round(campaigns.reduce((sum, c) => sum + (c.click_rate || 0), 0) / totalCampaigns * 100) / 100
        : 0;

      // Get most recent sync time
      const lastSyncedAt = campaigns?.length > 0
        ? campaigns
          .filter(c => c.last_synced_at)
          .sort((a, b) => new Date(b.last_synced_at).getTime() - new Date(a.last_synced_at).getTime())[0]?.last_synced_at
        : undefined;

      return {
        ...basicStats,
        totalCampaignsSent: totalCampaigns,
        averageOpenRate,
        averageClickRate,
        lastSyncedAt: lastSyncedAt ? new Date(lastSyncedAt) : undefined
      };
    } catch (error) {
      console.error('Error fetching enhanced newsletter stats:', error);
      const basicStats = await this.getNewsletterStats();
      return {
        ...basicStats,
        totalCampaignsSent: 0,
        averageOpenRate: 0,
        averageClickRate: 0
      };
    }
  }
}
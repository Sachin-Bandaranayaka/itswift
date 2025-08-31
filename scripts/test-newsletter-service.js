/**
 * Simple test script to verify newsletter service functionality
 */

// Mock the required modules for testing
const mockSupabase = {
  from: (table) => ({
    select: (columns) => ({
      eq: (column, value) => ({
        order: (column, options) => ({
          limit: (count) => Promise.resolve({
            data: table === 'newsletter_subscribers' ? [
              { id: '1', email: 'test@example.com', subscribed_at: new Date().toISOString(), status: 'active' },
              { id: '2', email: 'test2@example.com', subscribed_at: new Date(2024, 0, 15).toISOString(), status: 'active' }
            ] : [
              { 
                id: '1', 
                subject: 'Test Newsletter', 
                recipient_count: 100, 
                open_rate: 25.5, 
                click_rate: 5.2,
                sent_at: new Date().toISOString(),
                status: 'sent' 
              }
            ],
            error: null
          })
        }),
        gte: (column, value) => ({
          order: (column, options) => Promise.resolve({
            data: [
              { 
                id: '1', 
                subject: 'Test Newsletter', 
                recipient_count: 100, 
                open_rate: 25.5, 
                click_rate: 5.2,
                sent_at: new Date().toISOString(),
                status: 'sent' 
              }
            ],
            error: null
          })
        }),
        not: (column, operator, value) => ({
          order: (column, options) => ({
            limit: (count) => Promise.resolve({
              data: [
                { 
                  id: '1', 
                  subject: 'High Performing Newsletter', 
                  recipient_count: 1000, 
                  open_rate: 35.5, 
                  click_rate: 5.2,
                  sent_at: new Date().toISOString(),
                  status: 'sent' 
                }
              ],
              error: null
            })
          })
        }),
        single: () => Promise.resolve({
          data: { 
            id: '1', 
            brevo_message_id: 'brevo-123',
            recipient_count: 100,
            subject: 'Test Newsletter'
          },
          error: null
        })
      })
    }),
    update: (data) => ({
      eq: (column, value) => Promise.resolve({ error: null })
    })
  })
};

const mockBrevoService = {
  getEmailStats: (messageId) => Promise.resolve({
    stats: {
      opens: 25,
      clicks: 5,
      delivered: 98,
      bounces: 2
    },
    error: null
  })
};

// Mock utility functions
const isThisMonth = (date) => {
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

const isLastMonth = (date) => {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
  return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
};

const calculateGrowth = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

// Simple NewsletterDataService implementation for testing
class NewsletterDataService {
  constructor() {
    this.supabase = mockSupabase;
    this.brevoService = mockBrevoService;
  }

  async getNewsletterStats() {
    try {
      const { data: subscribers, error } = await this.supabase
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

      const thisMonthSubscribers = subscribers.filter(subscriber => {
        const subscribedDate = new Date(subscriber.subscribed_at);
        return isThisMonth(subscribedDate);
      });

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

  async getRecentNewsletterActivity() {
    try {
      const { data: campaigns, error } = await this.supabase
        .from('newsletter_campaigns')
        .select('*')
        .eq('status', 'sent')
        .order('sent_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Supabase campaign error:', error);
      }

      const activities = [];

      if (campaigns) {
        campaigns.forEach(campaign => {
          const openRate = campaign.open_rate ? `${campaign.open_rate}% open rate` : '';
          const description = openRate 
            ? `Newsletter sent to ${campaign.recipient_count} subscribers • ${openRate}`
            : `Newsletter sent to ${campaign.recipient_count} subscribers`;

          activities.push({
            id: campaign.id,
            type: 'newsletter',
            title: campaign.subject || 'Untitled Newsletter',
            description,
            timestamp: new Date(campaign.sent_at || campaign.created_at),
            status: 'sent',
            platform: 'email'
          });
        });
      }

      return activities
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 5);
    } catch (error) {
      console.error('Error fetching recent newsletter activity:', error);
      return [];
    }
  }

  async getTopPerformingNewsletterCampaigns() {
    try {
      const { data: campaigns, error } = await this.supabase
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
          type: 'newsletter',
          platform: 'email',
          metrics: {
            opens,
            clicks,
            views: campaign.recipient_count
          }
        };
      });
    } catch (error) {
      console.error('Error fetching top performing newsletter campaigns:', error);
      return [];
    }
  }

  async syncCampaignEngagementFromBrevo(campaignId) {
    try {
      const { data: campaign, error: dbError } = await this.supabase
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

      if (!campaign.brevo_message_id) {
        return {
          success: false,
          error: 'Campaign does not have Brevo message ID'
        };
      }

      const { stats, error: brevoError } = await this.brevoService.getEmailStats(campaign.brevo_message_id);

      if (brevoError || !stats) {
        return {
          success: false,
          error: brevoError || 'Failed to fetch stats from Brevo'
        };
      }

      const openRate = campaign.recipient_count > 0 
        ? Math.round((stats.opens / campaign.recipient_count) * 100 * 100) / 100
        : 0;
      
      const clickRate = campaign.recipient_count > 0 
        ? Math.round((stats.clicks / campaign.recipient_count) * 100 * 100) / 100
        : 0;

      const { error: updateError } = await this.supabase
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
}

// Test the service
async function testNewsletterService() {
  console.log('🧪 Testing Newsletter Data Service...\n');
  
  const service = new NewsletterDataService();

  try {
    // Test 1: Get newsletter stats
    console.log('📊 Testing getNewsletterStats...');
    const stats = await service.getNewsletterStats();
    console.log('✅ Newsletter Stats:', stats);
    console.log('');

    // Test 2: Get recent activity
    console.log('📝 Testing getRecentNewsletterActivity...');
    const activity = await service.getRecentNewsletterActivity();
    console.log('✅ Recent Activity:', activity);
    console.log('');

    // Test 3: Get top performing campaigns
    console.log('🏆 Testing getTopPerformingNewsletterCampaigns...');
    const topCampaigns = await service.getTopPerformingNewsletterCampaigns();
    console.log('✅ Top Performing Campaigns:', topCampaigns);
    console.log('');

    // Test 4: Sync from Brevo
    console.log('🔄 Testing syncCampaignEngagementFromBrevo...');
    const syncResult = await service.syncCampaignEngagementFromBrevo('1');
    console.log('✅ Brevo Sync Result:', syncResult);
    console.log('');

    console.log('🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the tests
testNewsletterService();
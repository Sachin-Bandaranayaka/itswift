#!/usr/bin/env node

// Script to populate sample analytics data for testing

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample data generators
function generateRandomMetrics() {
  const views = Math.floor(Math.random() * 5000) + 100
  const likes = Math.floor(Math.random() * Math.min(views * 0.1, 500)) + 5
  const shares = Math.floor(Math.random() * Math.min(likes * 0.3, 100)) + 1
  const comments = Math.floor(Math.random() * Math.min(likes * 0.2, 50)) + 1
  const clicks = Math.floor(Math.random() * Math.min(views * 0.05, 200)) + 3

  return { views, likes, shares, comments, clicks }
}

function generateSampleSocialPosts() {
  const platforms = ['linkedin', 'twitter']
  const posts = []

  for (let i = 0; i < 20; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)]
    const metrics = generateRandomMetrics()
    const publishedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Last 30 days

    posts.push({
      platform,
      content: `Sample ${platform} post #${i + 1} - This is a test post for analytics demonstration.`,
      status: 'published',
      published_at: publishedAt.toISOString(),
      engagement_metrics: metrics
    })
  }

  return posts
}

function generateSampleNewsletterCampaigns() {
  const campaigns = []

  for (let i = 0; i < 10; i++) {
    const recipientCount = Math.floor(Math.random() * 1000) + 100
    const openRate = Math.random() * 30 + 15 // 15-45%
    const clickRate = Math.random() * 5 + 2  // 2-7%
    const sentAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Last 30 days

    campaigns.push({
      subject: `Newsletter Campaign #${i + 1}`,
      content: `<h1>Sample Newsletter Content</h1><p>This is a test newsletter for analytics demonstration.</p>`,
      status: 'sent',
      sent_at: sentAt.toISOString(),
      recipient_count: recipientCount,
      open_rate: Math.round(openRate * 100) / 100,
      click_rate: Math.round(clickRate * 100) / 100
    })
  }

  return campaigns
}

function generateSampleAnalytics(socialPosts, newsletters) {
  const analytics = []

  // Analytics for social posts
  socialPosts.forEach((post, index) => {
    if (post.engagement_metrics) {
      analytics.push({
        content_type: 'social',
        content_id: `social-post-${index + 1}`,
        platform: post.platform,
        views: post.engagement_metrics.views,
        likes: post.engagement_metrics.likes,
        shares: post.engagement_metrics.shares,
        comments: post.engagement_metrics.comments,
        clicks: post.engagement_metrics.clicks,
        recorded_at: post.published_at
      })
    }
  })

  // Analytics for newsletters
  newsletters.forEach((campaign, index) => {
    const views = Math.floor((campaign.recipient_count * campaign.open_rate) / 100)
    const clicks = Math.floor((campaign.recipient_count * campaign.click_rate) / 100)

    analytics.push({
      content_type: 'newsletter',
      content_id: `newsletter-${index + 1}`,
      platform: null,
      views: views,
      likes: 0,
      shares: 0,
      comments: 0,
      clicks: clicks,
      recorded_at: campaign.sent_at
    })
  })

  // Analytics for blog posts (simulated)
  for (let i = 0; i < 15; i++) {
    const metrics = generateRandomMetrics()
    const publishedAt = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000) // Last 60 days

    analytics.push({
      content_type: 'blog',
      content_id: `blog-post-${i + 1}`,
      platform: null,
      views: metrics.views,
      likes: metrics.likes,
      shares: metrics.shares,
      comments: metrics.comments,
      clicks: metrics.clicks,
      recorded_at: publishedAt.toISOString()
    })
  }

  return analytics
}

async function populateSampleData() {
  try {
    console.log('🚀 Starting sample data population...')

    // Generate sample data
    const sampleSocialPosts = generateSampleSocialPosts()
    const sampleNewsletters = generateSampleNewsletterCampaigns()
    const sampleAnalytics = generateSampleAnalytics(sampleSocialPosts, sampleNewsletters)

    // Insert social posts
    console.log('📱 Inserting sample social posts...')
    const { data: socialData, error: socialError } = await supabase
      .from('social_posts')
      .insert(sampleSocialPosts)
      .select()

    if (socialError) {
      console.error('Error inserting social posts:', socialError)
    } else {
      console.log(`✅ Inserted ${socialData.length} social posts`)
    }

    // Insert newsletter campaigns
    console.log('📧 Inserting sample newsletter campaigns...')
    const { data: newsletterData, error: newsletterError } = await supabase
      .from('newsletter_campaigns')
      .insert(sampleNewsletters)
      .select()

    if (newsletterError) {
      console.error('Error inserting newsletter campaigns:', newsletterError)
    } else {
      console.log(`✅ Inserted ${newsletterData.length} newsletter campaigns`)
    }

    // Insert analytics data
    console.log('📊 Inserting sample analytics data...')
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('content_analytics')
      .insert(sampleAnalytics)
      .select()

    if (analyticsError) {
      console.error('Error inserting analytics data:', analyticsError)
    } else {
      console.log(`✅ Inserted ${analyticsData.length} analytics records`)
    }

    console.log('🎉 Sample data population completed successfully!')
    console.log('\nSummary:')
    console.log(`- Social posts: ${socialData?.length || 0}`)
    console.log(`- Newsletter campaigns: ${newsletterData?.length || 0}`)
    console.log(`- Analytics records: ${analyticsData?.length || 0}`)

  } catch (error) {
    console.error('❌ Error populating sample data:', error)
    process.exit(1)
  }
}

async function clearExistingData() {
  try {
    console.log('🧹 Clearing existing sample data...')

    // Clear analytics data
    await supabase.from('content_analytics').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // Clear social posts
    await supabase.from('social_posts').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    // Clear newsletter campaigns
    await supabase.from('newsletter_campaigns').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    console.log('✅ Existing data cleared')
  } catch (error) {
    console.error('❌ Error clearing data:', error)
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  if (command === 'clear') {
    await clearExistingData()
  } else if (command === 'populate') {
    await populateSampleData()
  } else if (command === 'reset') {
    await clearExistingData()
    await populateSampleData()
  } else {
    console.log('Usage:')
    console.log('  node scripts/populate-sample-analytics.js populate  - Add sample data')
    console.log('  node scripts/populate-sample-analytics.js clear     - Clear existing data')
    console.log('  node scripts/populate-sample-analytics.js reset     - Clear and repopulate')
  }
}

main().catch(console.error)
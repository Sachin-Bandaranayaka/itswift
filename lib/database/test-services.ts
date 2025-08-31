// Test script for database services - run this to verify all operations work

import { 
  SocialPostsService,
  NewsletterSubscribersService,
  NewsletterCampaignsService,
  ContentAnalyticsService,
  AIContentLogService
} from './services'

/**
 * Test all database services
 */
export async function testDatabaseServices(): Promise<{
  success: boolean
  results: Record<string, any>
  errors: string[]
}> {
  const results: Record<string, any> = {}
  const errors: string[] = []

  console.log('🧪 Testing database services...')

  try {
    // Test Social Posts Service
    console.log('Testing Social Posts Service...')
    const socialPostResult = await SocialPostsService.create({
      platform: 'linkedin',
      content: 'Test social post content',
      status: 'draft'
    })

    if (socialPostResult.error) {
      errors.push(`Social Posts Service: ${socialPostResult.error}`)
    } else {
      results.socialPost = socialPostResult.data
      console.log('✅ Social Posts Service: Create successful')

      // Test update
      if (socialPostResult.data) {
        const updateResult = await SocialPostsService.update(socialPostResult.data.id, {
          content: 'Updated test content'
        })
        if (updateResult.error) {
          errors.push(`Social Posts Service Update: ${updateResult.error}`)
        } else {
          console.log('✅ Social Posts Service: Update successful')
        }
      }
    }

    // Test Newsletter Subscribers Service
    console.log('Testing Newsletter Subscribers Service...')
    const subscriberResult = await NewsletterSubscribersService.create({
      email: `test-${Date.now()}@example.com`,
      first_name: 'Test',
      last_name: 'User',
      status: 'active'
    })

    if (subscriberResult.error) {
      errors.push(`Newsletter Subscribers Service: ${subscriberResult.error}`)
    } else {
      results.subscriber = subscriberResult.data
      console.log('✅ Newsletter Subscribers Service: Create successful')
    }

    // Test Newsletter Campaigns Service
    console.log('Testing Newsletter Campaigns Service...')
    const campaignResult = await NewsletterCampaignsService.create({
      subject: 'Test Newsletter Campaign',
      content: '<h1>Test Content</h1><p>This is a test newsletter.</p>',
      status: 'draft',
      recipient_count: 1
    })

    if (campaignResult.error) {
      errors.push(`Newsletter Campaigns Service: ${campaignResult.error}`)
    } else {
      results.campaign = campaignResult.data
      console.log('✅ Newsletter Campaigns Service: Create successful')
    }

    // Test Content Analytics Service
    console.log('Testing Content Analytics Service...')
    const analyticsResult = await ContentAnalyticsService.create({
      content_type: 'blog',
      content_id: 'test-blog-post-123',
      platform: 'website',
      views: 100,
      likes: 5,
      shares: 2,
      comments: 3,
      clicks: 10
    })

    if (analyticsResult.error) {
      errors.push(`Content Analytics Service: ${analyticsResult.error}`)
    } else {
      results.analytics = analyticsResult.data
      console.log('✅ Content Analytics Service: Create successful')
    }

    // Test AI Content Log Service
    console.log('Testing AI Content Log Service...')
    const aiLogResult = await AIContentLogService.create({
      prompt: 'Generate a test blog post about database services',
      generated_content: 'This is a test generated content about database services...',
      content_type: 'blog',
      tokens_used: 150
    })

    if (aiLogResult.error) {
      errors.push(`AI Content Log Service: ${aiLogResult.error}`)
    } else {
      results.aiLog = aiLogResult.data
      console.log('✅ AI Content Log Service: Create successful')
    }

    // Test query operations
    console.log('Testing query operations...')
    
    const socialPostsQuery = await SocialPostsService.getAll({ limit: 5 })
    if (socialPostsQuery.error) {
      errors.push(`Social Posts Query: ${socialPostsQuery.error}`)
    } else {
      results.socialPostsCount = socialPostsQuery.data.length
      console.log(`✅ Social Posts Query: Found ${socialPostsQuery.data.length} posts`)
    }

    const subscribersQuery = await NewsletterSubscribersService.getAll({ limit: 5 })
    if (subscribersQuery.error) {
      errors.push(`Subscribers Query: ${subscribersQuery.error}`)
    } else {
      results.subscribersCount = subscribersQuery.data.length
      console.log(`✅ Subscribers Query: Found ${subscribersQuery.data.length} subscribers`)
    }

    // Test validation
    console.log('Testing validation...')
    const invalidSocialPost = await SocialPostsService.create({
      platform: 'invalid' as any,
      content: '',
      status: 'draft'
    })

    if (invalidSocialPost.error) {
      console.log('✅ Validation: Correctly rejected invalid social post')
      results.validationWorking = true
    } else {
      errors.push('Validation: Should have rejected invalid social post')
    }

    const invalidEmail = await NewsletterSubscribersService.create({
      email: 'invalid-email',
      status: 'active'
    })

    if (invalidEmail.error) {
      console.log('✅ Validation: Correctly rejected invalid email')
    } else {
      errors.push('Validation: Should have rejected invalid email')
    }

  } catch (error) {
    errors.push(`General error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }

  const success = errors.length === 0
  
  if (success) {
    console.log('🎉 All database service tests passed!')
  } else {
    console.log('❌ Some tests failed:')
    errors.forEach(error => console.log(`  - ${error}`))
  }

  return {
    success,
    results,
    errors
  }
}

/**
 * Clean up test data
 */
export async function cleanupTestData(testResults: Record<string, any>): Promise<void> {
  console.log('🧹 Cleaning up test data...')

  try {
    if (testResults.socialPost?.id) {
      await SocialPostsService.delete(testResults.socialPost.id)
      console.log('✅ Cleaned up test social post')
    }

    if (testResults.subscriber?.id) {
      await NewsletterSubscribersService.delete(testResults.subscriber.id)
      console.log('✅ Cleaned up test subscriber')
    }

    if (testResults.campaign?.id) {
      await NewsletterCampaignsService.delete(testResults.campaign.id)
      console.log('✅ Cleaned up test campaign')
    }

    if (testResults.analytics?.id) {
      await ContentAnalyticsService.delete(testResults.analytics.id)
      console.log('✅ Cleaned up test analytics')
    }

    if (testResults.aiLog?.id) {
      await AIContentLogService.delete(testResults.aiLog.id)
      console.log('✅ Cleaned up test AI log')
    }

    console.log('🎉 Test data cleanup completed!')
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testDatabaseServices()
    .then(async (result) => {
      if (result.success) {
        await cleanupTestData(result.results)
      }
      process.exit(result.success ? 0 : 1)
    })
    .catch((error) => {
      console.error('❌ Test execution failed:', error)
      process.exit(1)
    })
}
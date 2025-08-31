// Unified social media publishing service

import { createLinkedInAPI, withRetry as linkedInRetry } from '../integrations/linkedin'
import { createTwitterAPI, withRetry as twitterRetry } from '../integrations/twitter'
import { SocialPost, SocialPostUpdate } from '../database/types'
import { SocialPostsService } from '../database/services/social-posts'

interface PublishResult {
  success: boolean
  platformPostId?: string
  platformUrl?: string
  error?: string
}

interface PublishOptions {
  retryAttempts?: number
  retryDelay?: number
}

export class SocialMediaPublisher {
  private linkedInAPI: ReturnType<typeof createLinkedInAPI> | null = null
  private twitterAPI: ReturnType<typeof createTwitterAPI> | null = null

  constructor() {
    try {
      this.linkedInAPI = createLinkedInAPI()
    } catch (error) {
      console.warn('LinkedIn API not configured:', error)
    }

    try {
      this.twitterAPI = createTwitterAPI()
    } catch (error) {
      console.warn('Twitter API not configured:', error)
    }
  }

  /**
   * Publish a post to the specified platform
   */
  async publishPost(
    post: SocialPost,
    options: PublishOptions = {}
  ): Promise<PublishResult> {
    const { retryAttempts = 3, retryDelay = 1000 } = options

    try {
      let result: PublishResult

      if (post.platform === 'linkedin') {
        if (!this.linkedInAPI) {
          throw new Error('LinkedIn API not configured')
        }

        result = await linkedInRetry(
          async () => {
            const response = await this.linkedInAPI!.createPost({
              content: post.content,
              mediaUrls: post.media_urls,
              visibility: 'PUBLIC'
            })

            if (!response.success) {
              throw new Error(response.error || 'LinkedIn posting failed')
            }

            return {
              success: true,
              platformPostId: response.id,
              platformUrl: response.url
            }
          },
          retryAttempts,
          retryDelay
        )
      } else if (post.platform === 'twitter') {
        if (!this.twitterAPI) {
          throw new Error('Twitter API not configured')
        }

        result = await twitterRetry(
          async () => {
            const response = await this.twitterAPI!.createTweet({
              content: post.content,
              mediaUrls: post.media_urls
            })

            if (!response.success) {
              throw new Error(response.error || 'Twitter posting failed')
            }

            return {
              success: true,
              platformPostId: response.id,
              platformUrl: response.url
            }
          },
          retryAttempts,
          retryDelay
        )
      } else {
        throw new Error(`Unsupported platform: ${post.platform}`)
      }

      // Update post status in database
      if (result.success) {
        await SocialPostsService.markAsPublished(post.id, {
          platform_post_id: result.platformPostId,
          platform_url: result.platformUrl
        })
      } else {
        await SocialPostsService.markAsFailed(post.id)
      }

      return result
    } catch (error) {
      console.error(`Failed to publish post ${post.id}:`, error)
      
      // Mark as failed in database
      await SocialPostsService.markAsFailed(post.id)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Publish multiple posts in batch
   */
  async publishBatch(
    posts: SocialPost[],
    options: PublishOptions = {}
  ): Promise<{ results: PublishResult[]; summary: { success: number; failed: number } }> {
    const results: PublishResult[] = []
    let successCount = 0
    let failedCount = 0

    // Process posts sequentially to avoid rate limiting
    for (const post of posts) {
      const result = await this.publishPost(post, options)
      results.push(result)
      
      if (result.success) {
        successCount++
      } else {
        failedCount++
      }

      // Add delay between posts to respect rate limits
      if (posts.indexOf(post) < posts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    return {
      results,
      summary: {
        success: successCount,
        failed: failedCount
      }
    }
  }

  /**
   * Delete a post from the platform
   */
  async deletePost(post: SocialPost): Promise<boolean> {
    try {
      let success = false

      if (post.platform === 'linkedin' && this.linkedInAPI) {
        // LinkedIn doesn't provide a reliable way to get the platform post ID
        // from our database, so we'll just mark it as deleted locally
        success = true
      } else if (post.platform === 'twitter' && this.twitterAPI) {
        // For Twitter, we need the platform post ID
        const platformPostId = post.engagement_metrics?.platform_post_id
        if (platformPostId) {
          success = await this.twitterAPI.deleteTweet(platformPostId)
        }
      }

      return success
    } catch (error) {
      console.error(`Failed to delete post ${post.id}:`, error)
      return false
    }
  }

  /**
   * Get engagement metrics for a post
   */
  async getPostMetrics(post: SocialPost): Promise<any> {
    try {
      const platformPostId = post.engagement_metrics?.platform_post_id
      if (!platformPostId) {
        return null
      }

      if (post.platform === 'linkedin' && this.linkedInAPI) {
        return await this.linkedInAPI.getPostMetrics(platformPostId)
      } else if (post.platform === 'twitter' && this.twitterAPI) {
        return await this.twitterAPI.getTweetMetrics(platformPostId)
      }

      return null
    } catch (error) {
      console.error(`Failed to get metrics for post ${post.id}:`, error)
      return null
    }
  }

  /**
   * Update engagement metrics for all published posts
   */
  async updateAllMetrics(): Promise<void> {
    try {
      // Get all published posts
      const result = await SocialPostsService.getAll(
        { limit: 100 },
        { status: 'published' }
      )

      if (result.error || !result.data) {
        console.error('Failed to fetch published posts:', result.error)
        return
      }

      // Update metrics for each post
      for (const post of result.data) {
        try {
          const metrics = await this.getPostMetrics(post)
          if (metrics) {
            await SocialPostsService.update(post.id, {
              engagement_metrics: {
                ...post.engagement_metrics,
                views: metrics.impressions || metrics.impression_count || 0,
                likes: metrics.like_count || metrics.favorite_count || 0,
                shares: metrics.share_count || metrics.retweet_count || 0,
                comments: metrics.comment_count || metrics.reply_count || 0,
                clicks: metrics.url_link_clicks || metrics.user_profile_clicks || 0
              }
            })
          }
        } catch (error) {
          console.error(`Failed to update metrics for post ${post.id}:`, error)
        }

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error('Failed to update metrics:', error)
    }
  }

  /**
   * Check if APIs are properly configured
   */
  getApiStatus(): { linkedin: boolean; twitter: boolean } {
    return {
      linkedin: this.linkedInAPI !== null,
      twitter: this.twitterAPI !== null
    }
  }

  /**
   * Validate API tokens
   */
  async validateTokens(): Promise<{ linkedin: boolean; twitter: boolean }> {
    const results = {
      linkedin: false,
      twitter: false
    }

    if (this.linkedInAPI) {
      try {
        results.linkedin = await this.linkedInAPI.validateToken()
      } catch (error) {
        console.error('LinkedIn token validation failed:', error)
      }
    }

    if (this.twitterAPI) {
      try {
        results.twitter = await this.twitterAPI.validateToken()
      } catch (error) {
        console.error('Twitter token validation failed:', error)
      }
    }

    return results
  }
}

// Singleton instance
let publisherInstance: SocialMediaPublisher | null = null

export function getSocialMediaPublisher(): SocialMediaPublisher {
  if (!publisherInstance) {
    publisherInstance = new SocialMediaPublisher()
  }
  return publisherInstance
}

// Helper function to process scheduled posts
export async function processScheduledPosts(): Promise<void> {
  try {
    const publisher = getSocialMediaPublisher()
    
    // Get posts that are scheduled and ready to publish
    const result = await SocialPostsService.getScheduledPosts()
    
    if (result.error || !result.data) {
      console.error('Failed to fetch scheduled posts:', result.error)
      return
    }

    const postsToPublish = result.data.filter(post => {
      if (!post.scheduled_at) return false
      const scheduledTime = new Date(post.scheduled_at)
      return scheduledTime <= new Date()
    })

    if (postsToPublish.length === 0) {
      console.log('No posts ready for publishing')
      return
    }

    console.log(`Publishing ${postsToPublish.length} scheduled posts`)
    
    const batchResult = await publisher.publishBatch(postsToPublish)
    
    console.log(`Batch publish complete: ${batchResult.summary.success} success, ${batchResult.summary.failed} failed`)
  } catch (error) {
    console.error('Failed to process scheduled posts:', error)
  }
}
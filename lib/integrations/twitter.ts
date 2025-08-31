// Twitter/X API integration for posting content

interface TwitterConfig {
  apiKey: string
  apiSecret: string
  accessToken: string
  accessTokenSecret: string
  bearerToken?: string
}

interface TwitterPost {
  content: string
  mediaUrls?: string[]
  replyToTweetId?: string
  quoteTweetId?: string
}

interface TwitterPostResponse {
  id: string
  success: boolean
  error?: string
  url?: string
}

interface TwitterMediaUploadResponse {
  media_id_string: string
  media_id: number
  size: number
  expires_after_secs: number
}

export class TwitterAPI {
  private config: TwitterConfig
  private baseUrl = 'https://api.twitter.com/2'
  private uploadUrl = 'https://upload.twitter.com/1.1'

  constructor(config: TwitterConfig) {
    this.config = config
  }

  /**
   * Generate OAuth 1.0a signature for Twitter API v1.1
   */
  private generateOAuthSignature(
    method: string,
    url: string,
    params: Record<string, string>
  ): string {
    // This is a simplified version - in production, use a proper OAuth library
    // like 'oauth-1.0a' or similar
    const crypto = require('crypto')
    
    const oauthParams = {
      oauth_consumer_key: this.config.apiKey,
      oauth_token: this.config.accessToken,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
      oauth_nonce: crypto.randomBytes(16).toString('hex'),
      oauth_version: '1.0'
    }

    const allParams = { ...params, ...oauthParams }
    const sortedParams = Object.keys(allParams)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key])}`)
      .join('&')

    const signatureBaseString = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`
    const signingKey = `${encodeURIComponent(this.config.apiSecret)}&${encodeURIComponent(this.config.accessTokenSecret)}`
    
    const signature = crypto
      .createHmac('sha1', signingKey)
      .update(signatureBaseString)
      .digest('base64')

    return signature
  }

  /**
   * Generate OAuth 1.0a authorization header
   */
  private generateOAuthHeader(method: string, url: string, params: Record<string, string> = {}): string {
    const crypto = require('crypto')
    
    const oauthParams = {
      oauth_consumer_key: this.config.apiKey,
      oauth_token: this.config.accessToken,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
      oauth_nonce: crypto.randomBytes(16).toString('hex'),
      oauth_version: '1.0'
    }

    const signature = this.generateOAuthSignature(method, url, { ...params, ...oauthParams })
    oauthParams['oauth_signature'] = signature

    const authHeader = 'OAuth ' + Object.keys(oauthParams)
      .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
      .join(', ')

    return authHeader
  }

  /**
   * Upload media to Twitter
   */
  async uploadMedia(mediaUrl: string): Promise<string> {
    try {
      // First, download the media
      const mediaResponse = await fetch(mediaUrl)
      if (!mediaResponse.ok) {
        throw new Error('Failed to download media')
      }

      const mediaBuffer = await mediaResponse.arrayBuffer()
      const mediaBase64 = Buffer.from(mediaBuffer).toString('base64')

      // Upload to Twitter
      const uploadUrl = `${this.uploadUrl}/media/upload.json`
      const params = {
        media_data: mediaBase64
      }

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': this.generateOAuthHeader('POST', uploadUrl),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(params)
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Media upload failed: ${error}`)
      }

      const result: TwitterMediaUploadResponse = await response.json()
      return result.media_id_string
    } catch (error) {
      console.error('Twitter media upload error:', error)
      throw error
    }
  }

  /**
   * Post a tweet using Twitter API v2
   */
  async createTweet(post: TwitterPost): Promise<TwitterPostResponse> {
    try {
      // Upload media if provided
      let mediaIds: string[] = []
      if (post.mediaUrls && post.mediaUrls.length > 0) {
        for (const mediaUrl of post.mediaUrls) {
          const mediaId = await this.uploadMedia(mediaUrl)
          mediaIds.push(mediaId)
        }
      }

      // Prepare tweet data
      const tweetData: any = {
        text: post.content
      }

      if (mediaIds.length > 0) {
        tweetData.media = {
          media_ids: mediaIds
        }
      }

      if (post.replyToTweetId) {
        tweetData.reply = {
          in_reply_to_tweet_id: post.replyToTweetId
        }
      }

      if (post.quoteTweetId) {
        tweetData.quote_tweet_id = post.quoteTweetId
      }

      // Use Bearer Token for API v2
      const response = await fetch(`${this.baseUrl}/tweets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tweetData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Twitter posting error: ${JSON.stringify(error)}`)
      }

      const result = await response.json()
      
      return {
        id: result.data.id,
        success: true,
        url: `https://twitter.com/i/web/status/${result.data.id}`
      }
    } catch (error) {
      console.error('Twitter posting error:', error)
      return {
        id: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Delete a tweet
   */
  async deleteTweet(tweetId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/tweets/${tweetId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`
        }
      })

      return response.ok
    } catch (error) {
      console.error('Twitter delete error:', error)
      return false
    }
  }

  /**
   * Get tweet metrics
   */
  async getTweetMetrics(tweetId: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/tweets/${tweetId}?tweet.fields=public_metrics,created_at`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.bearerToken}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch tweet metrics')
      }

      const result = await response.json()
      return result.data
    } catch (error) {
      console.error('Twitter metrics error:', error)
      return null
    }
  }

  /**
   * Get user information
   */
  async getUserInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/users/me`, {
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user info')
      }

      return response.json()
    } catch (error) {
      console.error('Twitter user info error:', error)
      return null
    }
  }

  /**
   * Validate access token
   */
  async validateToken(): Promise<boolean> {
    try {
      await this.getUserInfo()
      return true
    } catch {
      return false
    }
  }

  /**
   * Search tweets (for analytics/research)
   */
  async searchTweets(query: string, maxResults: number = 10): Promise<any> {
    try {
      const params = new URLSearchParams({
        query,
        max_results: maxResults.toString(),
        'tweet.fields': 'public_metrics,created_at,author_id'
      })

      const response = await fetch(`${this.baseUrl}/tweets/search/recent?${params}`, {
        headers: {
          'Authorization': `Bearer ${this.config.bearerToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to search tweets')
      }

      return response.json()
    } catch (error) {
      console.error('Twitter search error:', error)
      return null
    }
  }
}

// Helper function to create Twitter API instance
export function createTwitterAPI(): TwitterAPI {
  const config: TwitterConfig = {
    apiKey: process.env.TWITTER_API_KEY || '',
    apiSecret: process.env.TWITTER_API_SECRET || '',
    accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || '',
    bearerToken: process.env.TWITTER_BEARER_TOKEN || ''
  }

  if (!config.apiKey || !config.apiSecret || !config.accessToken || !config.accessTokenSecret) {
    throw new Error('Twitter API credentials not configured')
  }

  return new TwitterAPI(config)
}

// Retry wrapper for API calls (reused from LinkedIn)
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error')
      
      if (attempt === maxRetries) {
        throw lastError
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
    }
  }

  throw lastError!
}
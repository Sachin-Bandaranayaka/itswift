// LinkedIn API integration for posting content

interface LinkedInConfig {
  clientId: string
  clientSecret: string
  accessToken?: string
  redirectUri?: string
}

interface LinkedInPost {
  content: string
  mediaUrls?: string[]
  visibility?: 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN_MEMBERS'
}

interface LinkedInPostResponse {
  id: string
  success: boolean
  error?: string
  url?: string
}

interface LinkedInAuthResponse {
  access_token: string
  expires_in: number
  scope: string
  token_type: string
}

export class LinkedInAPI {
  private config: LinkedInConfig
  private baseUrl = 'https://api.linkedin.com/v2'

  constructor(config: LinkedInConfig) {
    this.config = config
  }

  /**
   * Get LinkedIn OAuth authorization URL
   */
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri || '',
      scope: 'w_member_social,r_liteprofile,r_emailaddress',
      state: state || ''
    })

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(code: string): Promise<LinkedInAuthResponse> {
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        redirect_uri: this.config.redirectUri || ''
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`LinkedIn auth error: ${error}`)
    }

    return response.json()
  }

  /**
   * Get user profile information
   */
  async getUserProfile(): Promise<any> {
    if (!this.config.accessToken) {
      throw new Error('Access token required')
    }

    const response = await fetch(`${this.baseUrl}/people/~`, {
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`LinkedIn API error: ${error}`)
    }

    return response.json()
  }

  /**
   * Post content to LinkedIn
   */
  async createPost(post: LinkedInPost): Promise<LinkedInPostResponse> {
    if (!this.config.accessToken) {
      throw new Error('Access token required')
    }

    try {
      // Get user profile to get person URN
      const profile = await this.getUserProfile()
      const personUrn = profile.id

      // Prepare post data
      const postData = {
        author: `urn:li:person:${personUrn}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: post.content
            },
            shareMediaCategory: post.mediaUrls && post.mediaUrls.length > 0 ? 'ARTICLE' : 'NONE',
            ...(post.mediaUrls && post.mediaUrls.length > 0 && {
              media: post.mediaUrls.map(url => ({
                status: 'READY',
                description: {
                  text: 'Shared content'
                },
                media: url,
                title: {
                  text: 'Shared Media'
                }
              }))
            })
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': post.visibility || 'PUBLIC'
        }
      }

      const response = await fetch(`${this.baseUrl}/ugcPosts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(postData)
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`LinkedIn posting error: ${error}`)
      }

      const result = await response.json()
      
      return {
        id: result.id,
        success: true,
        url: `https://www.linkedin.com/feed/update/${result.id}`
      }
    } catch (error) {
      console.error('LinkedIn posting error:', error)
      return {
        id: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Delete a LinkedIn post
   */
  async deletePost(postId: string): Promise<boolean> {
    if (!this.config.accessToken) {
      throw new Error('Access token required')
    }

    try {
      const response = await fetch(`${this.baseUrl}/ugcPosts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0'
        }
      })

      return response.ok
    } catch (error) {
      console.error('LinkedIn delete error:', error)
      return false
    }
  }

  /**
   * Get post analytics/engagement metrics
   */
  async getPostMetrics(postId: string): Promise<any> {
    if (!this.config.accessToken) {
      throw new Error('Access token required')
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/socialActions/${postId}/(comments,likes)`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0'
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch post metrics')
      }

      return response.json()
    } catch (error) {
      console.error('LinkedIn metrics error:', error)
      return null
    }
  }

  /**
   * Validate access token
   */
  async validateToken(): Promise<boolean> {
    try {
      await this.getUserProfile()
      return true
    } catch {
      return false
    }
  }
}

// Helper function to create LinkedIn API instance
export function createLinkedInAPI(): LinkedInAPI {
  const config: LinkedInConfig = {
    clientId: process.env.LINKEDIN_CLIENT_ID || '',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    accessToken: process.env.LINKEDIN_ACCESS_TOKEN || '',
    redirectUri: process.env.LINKEDIN_REDIRECT_URI || ''
  }

  if (!config.clientId || !config.clientSecret) {
    throw new Error('LinkedIn API credentials not configured')
  }

  return new LinkedInAPI(config)
}

// Simplified interface for publishing posts
interface PublishToLinkedInParams {
  content: string
  accessToken: string
  mediaUrls?: string[]
  visibility?: 'PUBLIC' | 'CONNECTIONS' | 'LOGGED_IN_MEMBERS'
}

interface PublishToLinkedInResponse {
  success: boolean
  postId?: string
  url?: string
  error?: string
}

/**
 * Publish a post to LinkedIn (simplified interface for tests)
 */
export async function publishToLinkedIn(params: PublishToLinkedInParams): Promise<PublishToLinkedInResponse> {
  try {
    const api = new LinkedInAPI({
      clientId: process.env.LINKEDIN_CLIENT_ID || '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
      accessToken: params.accessToken
    })

    const result = await api.createPost({
      content: params.content,
      mediaUrls: params.mediaUrls,
      visibility: params.visibility
    })

    return {
      success: result.success,
      postId: result.id,
      url: result.url,
      error: result.error
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get LinkedIn profile information (simplified interface for tests)
 */
export async function getLinkedInProfile(accessToken: string): Promise<any> {
  const api = new LinkedInAPI({
    clientId: process.env.LINKEDIN_CLIENT_ID || '',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    accessToken
  })

  return api.getUserProfile()
}

// Retry wrapper for API calls
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
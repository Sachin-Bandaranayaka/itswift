interface PostData {
  post: string
  platforms: string[]
  mediaUrls?: string[]
  scheduleDate?: Date
}

interface PostResponse {
  status: string
  id: string
  postIds?: Record<string, string>
  scheduleDate?: string
}

interface PostHistory {
  posts: Array<{
    id: string
    content: string
    status: string
    platforms?: string[]
    createdAt?: string
    scheduledFor?: string
  }>
  total: number
}

interface UserProfile {
  user: string
  platforms: string[]
  quotas: Record<string, number>
}

interface ConnectionTest {
  status: string
  platforms: string[]
}

export class AyrshareAPI {
  private static instance: AyrshareAPI
  private apiKey: string
  private baseUrl = 'https://app.ayrshare.com/api'

  private constructor() {
    this.apiKey = process.env.AYRSHARE_API_KEY || ''
    if (!this.apiKey) {
      throw new Error('AYRSHARE_API_KEY environment variable is required')
    }
  }

  static getInstance(): AyrshareAPI {
    if (!AyrshareAPI.instance) {
      AyrshareAPI.instance = new AyrshareAPI()
    }
    return AyrshareAPI.instance
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers
      }
    })

    if (!response.ok) {
      throw new Error(`Ayrshare API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async post(data: PostData): Promise<PostResponse> {
    const payload = {
      post: data.post,
      platforms: data.platforms,
      ...(data.mediaUrls && data.mediaUrls.length > 0 && { mediaUrls: data.mediaUrls })
    }

    return this.makeRequest('/post', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  async schedulePost(data: PostData): Promise<PostResponse> {
    if (!data.scheduleDate) {
      throw new Error('Schedule date is required for scheduled posts')
    }

    const payload = {
      post: data.post,
      platforms: data.platforms,
      scheduleDate: data.scheduleDate.toISOString(),
      ...(data.mediaUrls && data.mediaUrls.length > 0 && { mediaUrls: data.mediaUrls })
    }

    return this.makeRequest('/post', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }

  async getPostHistory(limit = 10, offset = 0): Promise<PostHistory> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    })

    return this.makeRequest(`/history?${params}`)
  }

  async getUserProfile(): Promise<UserProfile> {
    return this.makeRequest('/user')
  }

  async deletePost(postId: string): Promise<{ status: string; deleted: boolean }> {
    return this.makeRequest(`/delete/${postId}`, {
      method: 'DELETE'
    })
  }

  async testConnection(): Promise<ConnectionTest> {
    return this.makeRequest('/user')
      .then(profile => ({
        status: 'connected',
        platforms: profile.platforms || []
      }))
      .catch(() => ({
        status: 'disconnected',
        platforms: []
      }))
  }

  async uploadMedia(file: File): Promise<{ mediaUrl: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Media upload failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getAnalytics(postId?: string): Promise<any> {
    const endpoint = postId ? `/analytics/post/${postId}` : '/analytics'
    return this.makeRequest(endpoint)
  }
}
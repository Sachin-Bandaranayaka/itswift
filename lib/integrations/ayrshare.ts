/**
 * Ayrshare API Integration
 * Simple social media posting API designed for developers
 */

interface AyrsharePost {
  post: string;
  platforms: string[];
  scheduleDate?: string; // ISO 8601 format
  mediaUrls?: string[];
  profileKeys?: string[]; // For multiple accounts per platform
}

interface AyrshareResponse {
  status: string;
  id?: string;
  postIds?: { [platform: string]: string };
  errors?: { [platform: string]: string };
  refId?: string;
}

export class AyrshareAPI {
  private apiKey: string;
  private baseUrl = 'https://api.ayrshare.com/api';

  constructor() {
    this.apiKey = process.env.AYRSHARE_API_KEY!;
    if (!this.apiKey) {
      throw new Error('AYRSHARE_API_KEY environment variable is required');
    }
  }

  /**
   * Post to social media platforms
   */
  async createPost(postData: {
    content: string;
    platforms: ('linkedin' | 'twitter' | 'facebook' | 'instagram')[];
    scheduledAt?: Date;
    mediaUrls?: string[];
  }): Promise<AyrshareResponse> {
    const payload: AyrsharePost = {
      post: postData.content,
      platforms: postData.platforms,
    };

    if (postData.scheduledAt) {
      payload.scheduleDate = postData.scheduledAt.toISOString();
    }

    if (postData.mediaUrls && postData.mediaUrls.length > 0) {
      payload.mediaUrls = postData.mediaUrls;
    }

    const response = await fetch(`${this.baseUrl}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ayrshare API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Get post analytics
   */
  async getAnalytics(postId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/analytics/post/${postId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get analytics: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get user profile information and connected accounts
   */
  async getUser(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/user`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get user info: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Delete a scheduled post
   */
  async deletePost(postId: string): Promise<{ status: string }> {
    const response = await fetch(`${this.baseUrl}/delete/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete post: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Get post history
   */
  async getHistory(lastRecords = 50): Promise<any> {
    const response = await fetch(`${this.baseUrl}/history?lastRecords=${lastRecords}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get history: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<{ success: boolean; connectedPlatforms: string[] }> {
    try {
      const user = await this.getUser();
      return {
        success: true,
        connectedPlatforms: user.platforms || []
      };
    } catch (error) {
      return {
        success: false,
        connectedPlatforms: []
      };
    }
  }

  /**
   * Upload media file (for images/videos)
   */
  async uploadMedia(file: File | Buffer, fileName: string): Promise<{ url: string }> {
    const formData = new FormData();
    
    if (file instanceof Buffer) {
      formData.append('file', new Blob([file]), fileName);
    } else {
      formData.append('file', file);
    }

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload media: ${response.status}`);
    }

    return response.json();
  }
}

// Usage examples:
/*
const ayrshare = new AyrshareAPI();

// Simple post
const result = await ayrshare.createPost({
  content: "Hello from my CMS!",
  platforms: ['linkedin', 'twitter']
});

// Scheduled post with image
const scheduledResult = await ayrshare.createPost({
  content: "Check out this awesome content!",
  platforms: ['linkedin', 'twitter', 'facebook'],
  scheduledAt: new Date('2024-12-25T10:00:00Z'),
  mediaUrls: ['https://example.com/image.jpg']
});

// Test connection
const connectionTest = await ayrshare.testConnection();
console.log('Connected platforms:', connectionTest.connectedPlatforms);
*/
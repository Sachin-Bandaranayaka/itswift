/**
 * Simplified Social Media Integration
 * Cleaner version of your existing custom implementation
 */

interface SocialPost {
  content: string;
  scheduledAt?: Date;
  platforms: ('linkedin' | 'twitter')[];
  mediaUrls?: string[];
}

interface PostResult {
  platform: string;
  success: boolean;
  postId?: string;
  error?: string;
}

export class SimplifiedSocialMedia {
  private linkedinToken: string;
  private twitterTokens: {
    apiKey: string;
    apiSecret: string;
    accessToken: string;
    accessTokenSecret: string;
  };

  constructor() {
    this.linkedinToken = process.env.LINKEDIN_ACCESS_TOKEN!;
    this.twitterTokens = {
      apiKey: process.env.TWITTER_API_KEY!,
      apiSecret: process.env.TWITTER_API_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
    };
  }

  async publishPost(post: SocialPost): Promise<PostResult[]> {
    const results: PostResult[] = [];

    for (const platform of post.platforms) {
      try {
        let result: PostResult;
        
        if (platform === 'linkedin') {
          result = await this.publishToLinkedIn(post);
        } else if (platform === 'twitter') {
          result = await this.publishToTwitter(post);
        } else {
          result = {
            platform,
            success: false,
            error: 'Unsupported platform'
          };
        }
        
        results.push(result);
      } catch (error) {
        results.push({
          platform,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  private async publishToLinkedIn(post: SocialPost): Promise<PostResult> {
    // Simplified LinkedIn posting
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.linkedinToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify({
        author: `urn:li:person:${await this.getLinkedInPersonId()}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: post.content
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      platform: 'linkedin',
      success: true,
      postId: data.id
    };
  }

  private async publishToTwitter(post: SocialPost): Promise<PostResult> {
    // Use Twitter API v2 (simpler than v1.1)
    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: post.content
      })
    });

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      platform: 'twitter',
      success: true,
      postId: data.data.id
    };
  }

  private async getLinkedInPersonId(): Promise<string> {
    // Cache this value, don't call every time
    const response = await fetch('https://api.linkedin.com/v2/people/~', {
      headers: {
        'Authorization': `Bearer ${this.linkedinToken}`
      }
    });
    
    const data = await response.json();
    return data.id;
  }

  // Test connection to both platforms
  async testConnections(): Promise<{ linkedin: boolean; twitter: boolean }> {
    const results = { linkedin: false, twitter: false };

    try {
      await this.getLinkedInPersonId();
      results.linkedin = true;
    } catch (error) {
      console.error('LinkedIn connection failed:', error);
    }

    try {
      const response = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
        }
      });
      results.twitter = response.ok;
    } catch (error) {
      console.error('Twitter connection failed:', error);
    }

    return results;
  }
}

// Usage example:
// const socialMedia = new SimplifiedSocialMedia();
// const results = await socialMedia.publishPost({
//   content: "Hello world!",
//   platforms: ['linkedin', 'twitter']
// });
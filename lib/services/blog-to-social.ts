import { getOpenAI } from '@/lib/integrations/openai'
import { SocialPostsService } from '@/lib/database/services/social-posts'

interface BlogPost {
  title: string
  content: string
  excerpt?: string
  categories?: string[]
  publishedAt?: string
}

interface SocialPostVariation {
  platform: 'linkedin' | 'twitter'
  content: string
  hashtags: string[]
  scheduledAt?: string
}

export class BlogToSocialService {
  /**
   * Generate social media posts from blog content
   */
  static async generateSocialPosts(
    blogPost: BlogPost,
    options: {
      platforms?: ('linkedin' | 'twitter')[]
      autoSchedule?: boolean
      scheduleDelay?: number // minutes after blog publication
    } = {}
  ): Promise<{ success: boolean; posts: SocialPostVariation[]; error?: string }> {
    try {
      const { platforms = ['linkedin', 'twitter'], autoSchedule = false, scheduleDelay = 30 } = options
      const posts: SocialPostVariation[] = []

      // Generate posts for each platform
      for (const platform of platforms) {
        const socialPost = await this.generatePlatformPost(blogPost, platform)
        if (socialPost) {
          // Calculate schedule time if auto-scheduling
          let scheduledAt: string | undefined
          if (autoSchedule && blogPost.publishedAt) {
            const publishTime = new Date(blogPost.publishedAt)
            publishTime.setMinutes(publishTime.getMinutes() + scheduleDelay)
            scheduledAt = publishTime.toISOString()
          }

          posts.push({
            ...socialPost,
            scheduledAt
          })
        }
      }

      return { success: true, posts }
    } catch (error) {
      console.error('Error generating social posts:', error)
      return { 
        success: false, 
        posts: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Generate a social media post for a specific platform
   */
  private static async generatePlatformPost(
    blogPost: BlogPost,
    platform: 'linkedin' | 'twitter'
  ): Promise<SocialPostVariation | null> {
    try {
      const prompt = this.createPrompt(blogPost, platform)
      
      const response = await getOpenAI().chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(platform)
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: platform === 'twitter' ? 300 : 500,
        temperature: 0.7,
      })

      const content = response.choices[0]?.message?.content?.trim()
      if (!content) {
        throw new Error(`Failed to generate ${platform} content`)
      }

      // Extract hashtags from the generated content
      const hashtags = this.extractHashtags(content)

      return {
        platform,
        content,
        hashtags
      }
    } catch (error) {
      console.error(`Error generating ${platform} post:`, error)
      return null
    }
  }

  /**
   * Create platform-specific prompt
   */
  private static createPrompt(blogPost: BlogPost, platform: 'linkedin' | 'twitter'): string {
    const baseInfo = `
      Blog Post Title: ${blogPost.title}
      ${blogPost.excerpt ? `Excerpt: ${blogPost.excerpt}` : ''}
      Content Preview: ${blogPost.content.substring(0, 500)}...
      ${blogPost.categories ? `Categories: ${blogPost.categories.join(', ')}` : ''}
    `

    if (platform === 'linkedin') {
      return `${baseInfo}
      
      Create a professional LinkedIn post that:
      - Summarizes the key insights from this blog post
      - Uses a professional, engaging tone
      - Includes relevant hashtags (3-5)
      - Encourages professional discussion
      - Includes a call-to-action to read the full article
      - Stays under 1300 characters
      - Formats well for LinkedIn's audience`
    } else {
      return `${baseInfo}
      
      Create an engaging Twitter/X post that:
      - Captures the main point of the blog post
      - Uses an engaging, conversational tone
      - Includes relevant hashtags (2-3)
      - Encourages engagement (likes, retweets, replies)
      - Includes a call-to-action to read the full article
      - Stays under 280 characters
      - Is optimized for Twitter's fast-paced environment`
    }
  }

  /**
   * Get system prompt for each platform
   */
  private static getSystemPrompt(platform: 'linkedin' | 'twitter'): string {
    if (platform === 'linkedin') {
      return `You are a professional social media manager specializing in LinkedIn content. 
      Create engaging, professional posts that drive meaningful business discussions and 
      encourage professionals to read the full blog post. Focus on insights, value, and 
      professional growth.`
    } else {
      return `You are a social media expert specializing in Twitter/X content. 
      Create concise, engaging posts that capture attention in a fast-paced social feed. 
      Focus on hooks, value, and encouraging clicks to the full blog post.`
    }
  }

  /**
   * Extract hashtags from generated content
   */
  private static extractHashtags(content: string): string[] {
    const hashtagRegex = /#[\w]+/g
    const matches = content.match(hashtagRegex)
    return matches ? matches.map(tag => tag.substring(1)) : []
  }

  /**
   * Save generated social posts to database
   */
  static async saveSocialPosts(
    posts: SocialPostVariation[],
    blogPostId?: string
  ): Promise<{ success: boolean; savedPosts: any[]; error?: string }> {
    try {
      const savedPosts = []

      for (const post of posts) {
        const result = await SocialPostsService.create({
          platform: post.platform,
          content: post.content,
          status: post.scheduledAt ? 'scheduled' : 'draft',
          scheduled_at: post.scheduledAt,
          metadata: {
            source: 'blog_post',
            blogPostId,
            hashtags: post.hashtags,
            generatedAt: new Date().toISOString()
          }
        })

        if (result.data) {
          savedPosts.push(result.data)
        }
      }

      return { success: true, savedPosts }
    } catch (error) {
      console.error('Error saving social posts:', error)
      return { 
        success: false, 
        savedPosts: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Generate and save social posts from blog post
   */
  static async processNewBlogPost(
    blogPost: BlogPost,
    blogPostId: string,
    options: {
      platforms?: ('linkedin' | 'twitter')[]
      autoSchedule?: boolean
      scheduleDelay?: number
    } = {}
  ): Promise<{ success: boolean; posts: any[]; error?: string }> {
    try {
      // Generate social posts
      const generateResult = await this.generateSocialPosts(blogPost, options)
      if (!generateResult.success) {
        return generateResult
      }

      // Save to database
      const saveResult = await this.saveSocialPosts(generateResult.posts, blogPostId)
      if (!saveResult.success) {
        return saveResult
      }

      return {
        success: true,
        posts: saveResult.savedPosts
      }
    } catch (error) {
      console.error('Error processing blog post for social media:', error)
      return {
        success: false,
        posts: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get optimal posting times based on platform
   */
  static getOptimalPostingTimes(platform: 'linkedin' | 'twitter'): string[] {
    const now = new Date()
    const times: string[] = []

    if (platform === 'linkedin') {
      // LinkedIn optimal times: Tuesday-Thursday, 8-10 AM and 12-2 PM
      const optimalHours = [8, 9, 12, 13]
      const optimalDays = [2, 3, 4] // Tuesday, Wednesday, Thursday

      for (let i = 1; i <= 7; i++) {
        const date = new Date(now)
        date.setDate(date.getDate() + i)
        
        if (optimalDays.includes(date.getDay())) {
          optimalHours.forEach(hour => {
            const time = new Date(date)
            time.setHours(hour, 0, 0, 0)
            times.push(time.toISOString())
          })
        }
      }
    } else {
      // Twitter optimal times: Monday-Friday, 9 AM, 1 PM, 3 PM
      const optimalHours = [9, 13, 15]
      
      for (let i = 1; i <= 7; i++) {
        const date = new Date(now)
        date.setDate(date.getDate() + i)
        
        // Monday to Friday
        if (date.getDay() >= 1 && date.getDay() <= 5) {
          optimalHours.forEach(hour => {
            const time = new Date(date)
            time.setHours(hour, 0, 0, 0)
            times.push(time.toISOString())
          })
        }
      }
    }

    return times.slice(0, 10) // Return top 10 suggestions
  }
}
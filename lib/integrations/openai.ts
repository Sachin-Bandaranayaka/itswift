import OpenAI from 'openai'
// import { AIContentLogService } from '../database/services/ai-content-log'

// Lazy initialization of OpenAI client
let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.')
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openaiClient
}

// Export a getter function instead of initializing at module level
export function getOpenAI(): OpenAI {
  return getOpenAIClient()
}

// Export OpenAI service class for compatibility
export class OpenAIService {
  static async generateContent(prompt: string, contentType: 'blog' | 'social' | 'newsletter'): Promise<AIContentResponse> {
    const request: AIContentRequest = {
      prompt,
      contentType,
      tone: 'professional',
      maxLength: contentType === 'blog' ? 3000 : contentType === 'social' ? 500 : 2000
    }
    return generateContent(request)
  }
}

export interface AIContentRequest {
  prompt: string
  contentType: 'blog' | 'social' | 'newsletter'
  platform?: 'linkedin' | 'twitter'
  tone?: 'professional' | 'casual' | 'engaging'
  maxLength?: number
  keywords?: string[]
  targetAudience?: string
}

export interface AIContentResponse {
  content: string
  suggestions: string[]
  seoKeywords?: string[]
  tokensUsed: number
  title?: string
  hashtags?: string[]
}

export interface BlogPostRequest {
  topic: string
  keywords?: string[]
  tone?: 'professional' | 'casual' | 'engaging'
  targetAudience?: string
  wordCount?: number
}

export interface SocialPostRequest {
  topic: string
  platform: 'linkedin' | 'twitter'
  tone?: 'professional' | 'casual' | 'engaging'
  includeHashtags?: boolean
  callToAction?: string
}

export interface NewsletterRequest {
  topic: string
  sections?: string[]
  tone?: 'professional' | 'casual' | 'engaging'
  targetAudience?: string
}

/**
 * Generate content using OpenAI with enhanced error handling
 */
export async function generateContent(request: AIContentRequest): Promise<AIContentResponse> {
  try {
    const systemPrompt = buildSystemPrompt(request)
    const userPrompt = buildUserPrompt(request)
    
    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: request.maxLength || 1000,
      temperature: 0.7,
    })

    const content = completion.choices[0]?.message?.content || ''
    const tokensUsed = completion.usage?.total_tokens || 0

    // Parse structured response if available
    const parsedResponse = parseAIResponse(content, request.contentType)

    // Log the AI content generation (temporarily disabled)
    // try {
    //   await AIContentLogService.create({
    //     prompt: request.prompt,
    //     generated_content: parsedResponse.content,
    //     content_type: request.contentType,
    //     tokens_used: tokensUsed
    //   })
    // } catch (logError) {
    //   console.warn('Failed to log AI content generation:', logError)
    //   // Don't throw error for logging failures
    // }

    return {
      content: parsedResponse.content,
      suggestions: parsedResponse.suggestions,
      seoKeywords: parsedResponse.seoKeywords,
      tokensUsed,
      title: parsedResponse.title,
      hashtags: parsedResponse.hashtags
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        throw new Error('Invalid OpenAI API key')
      } else if (error.status === 429) {
        throw new Error('OpenAI API rate limit exceeded. Please try again later.')
      } else if (error.status === 500) {
        throw new Error('OpenAI service is temporarily unavailable')
      }
    }
    
    throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate blog post content
 */
export async function generateBlogPost(request: BlogPostRequest): Promise<AIContentResponse> {
  const aiRequest: AIContentRequest = {
    prompt: request.topic,
    contentType: 'blog',
    tone: request.tone,
    maxLength: request.wordCount ? request.wordCount * 6 : 3000, // Approximate tokens
    keywords: request.keywords,
    targetAudience: request.targetAudience
  }

  return generateContent(aiRequest)
}

/**
 * Generate social media post content
 */
export async function generateSocialPost(request: SocialPostRequest): Promise<AIContentResponse> {
  const maxLength = request.platform === 'twitter' ? 280 : 3000
  
  const aiRequest: AIContentRequest = {
    prompt: request.topic,
    contentType: 'social',
    platform: request.platform,
    tone: request.tone,
    maxLength: maxLength
  }

  return generateContent(aiRequest)
}

/**
 * Generate newsletter content
 */
export async function generateNewsletter(request: NewsletterRequest): Promise<AIContentResponse> {
  const aiRequest: AIContentRequest = {
    prompt: request.topic,
    contentType: 'newsletter',
    tone: request.tone,
    maxLength: 4000,
    targetAudience: request.targetAudience
  }

  return generateContent(aiRequest)
}

/**
 * Prompt templates for different content types
 */
const PROMPT_TEMPLATES = {
  blog: {
    system: `You are an expert content writer specializing in creating engaging, SEO-optimized blog posts. 
    Your content should be informative, well-structured, and provide real value to readers.
    Always include a compelling title, clear headings, and actionable insights.
    Format your response as JSON with the following structure:
    {
      "title": "Blog post title",
      "content": "Full blog post content with markdown formatting",
      "seoKeywords": ["keyword1", "keyword2", "keyword3"],
      "suggestions": ["improvement suggestion 1", "improvement suggestion 2"]
    }`,
    user: (request: AIContentRequest) => {
      let prompt = `Write a comprehensive blog post about: ${request.prompt}`
      
      if (request.keywords?.length) {
        prompt += `\n\nTarget keywords: ${request.keywords.join(', ')}`
      }
      
      if (request.targetAudience) {
        prompt += `\n\nTarget audience: ${request.targetAudience}`
      }
      
      if (request.tone) {
        prompt += `\n\nTone: ${request.tone}`
      }
      
      return prompt
    }
  },
  
  social: {
    system: (platform?: string) => {
      const basePrompt = `You are a social media expert specializing in creating engaging content.`
      
      let platformSpecific = ''
      if (platform === 'linkedin') {
        platformSpecific = `Focus on professional LinkedIn content that encourages networking and engagement. 
        Use a professional yet approachable tone. Include relevant hashtags and a call-to-action.`
      } else if (platform === 'twitter') {
        platformSpecific = `Create concise, engaging Twitter content. Be conversational, use relevant hashtags, 
        and keep within character limits. Make it shareable and engaging.`
      }
      
      return `${basePrompt} ${platformSpecific}
      Format your response as JSON with the following structure:
      {
        "content": "Social media post content",
        "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
        "suggestions": ["engagement tip 1", "engagement tip 2"]
      }`
    },
    user: (request: AIContentRequest) => {
      let prompt = `Create a ${request.platform || 'social media'} post about: ${request.prompt}`
      
      if (request.tone) {
        prompt += `\n\nTone: ${request.tone}`
      }
      
      return prompt
    }
  },
  
  newsletter: {
    system: `You are a newsletter specialist who creates compelling email content that drives engagement.
    Your newsletters should be well-structured, provide value, and encourage reader interaction.
    Format your response as JSON with the following structure:
    {
      "title": "Newsletter subject line",
      "content": "Newsletter content with HTML formatting",
      "suggestions": ["engagement tip 1", "engagement tip 2"]
    }`,
    user: (request: AIContentRequest) => {
      let prompt = `Create a newsletter about: ${request.prompt}`
      
      if (request.targetAudience) {
        prompt += `\n\nTarget audience: ${request.targetAudience}`
      }
      
      if (request.tone) {
        prompt += `\n\nTone: ${request.tone}`
      }
      
      return prompt
    }
  }
}

/**
 * Build system prompt based on content type and requirements
 */
function buildSystemPrompt(request: AIContentRequest): string {
  const template = PROMPT_TEMPLATES[request.contentType]
  
  if (request.contentType === 'social' && typeof template.system === 'function') {
    return template.system(request.platform)
  }
  
  return typeof template.system === 'string' ? template.system : template.system()
}

/**
 * Build user prompt based on content type and requirements
 */
function buildUserPrompt(request: AIContentRequest): string {
  const template = PROMPT_TEMPLATES[request.contentType]
  return template.user(request)
}

/**
 * Parse AI response to extract structured data
 */
function parseAIResponse(content: string, _contentType: string) {
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(content)
    return {
      content: parsed.content || content,
      title: parsed.title,
      suggestions: parsed.suggestions || [],
      seoKeywords: parsed.seoKeywords || [],
      hashtags: parsed.hashtags || []
    }
  } catch {
    // If not JSON, return as plain content
    return {
      content,
      suggestions: [],
      seoKeywords: [],
      hashtags: []
    }
  }
}

/**
 * Validate API key is configured (removed - validation now happens in getOpenAIClient)
 */

/**
 * Generate content ideas and research for a given topic
 */
export async function generateContentIdeas(topic: string, contentType: 'blog' | 'social' | 'newsletter'): Promise<string[]> {
  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a content strategist. Generate 5 creative and engaging ${contentType} content ideas for the given topic. Return only a JSON array of strings.`
        },
        {
          role: 'user',
          content: `Generate content ideas for: ${topic}`
        }
      ],
      max_tokens: 500,
      temperature: 0.8,
    })

    const content = completion.choices[0]?.message?.content || '[]'
    
    try {
      return JSON.parse(content)
    } catch {
      // If parsing fails, split by lines and clean up
      return content.split('\n').filter(line => line.trim()).slice(0, 5)
    }
  } catch (error) {
    console.error('Failed to generate content ideas:', error)
    throw new Error('Failed to generate content ideas')
  }
}

/**
 * Optimize existing content for SEO and engagement
 */
export async function optimizeContent(content: string, contentType: 'blog' | 'social' | 'newsletter'): Promise<{
  optimizedContent: string
  suggestions: string[]
  seoKeywords: string[]
}> {
  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a content optimization expert. Analyze and improve the given ${contentType} content for better SEO, readability, and engagement. 
          Format your response as JSON with the following structure:
          {
            "optimizedContent": "Improved version of the content",
            "suggestions": ["specific improvement suggestions"],
            "seoKeywords": ["relevant SEO keywords"]
          }`
        },
        {
          role: 'user',
          content: `Optimize this ${contentType} content:\n\n${content}`
        }
      ],
      max_tokens: 1500,
      temperature: 0.3,
    })

    const response = completion.choices[0]?.message?.content || '{}'
    
    try {
      const parsed = JSON.parse(response)
      return {
        optimizedContent: parsed.optimizedContent || content,
        suggestions: parsed.suggestions || [],
        seoKeywords: parsed.seoKeywords || []
      }
    } catch {
      return {
        optimizedContent: content,
        suggestions: ['Unable to parse optimization suggestions'],
        seoKeywords: []
      }
    }
  } catch (error) {
    console.error('Failed to optimize content:', error)
    throw new Error('Failed to optimize content')
  }
}

/**
 * Generate SEO keywords for a given topic
 */
export async function generateSEOKeywords(topic: string, targetAudience?: string): Promise<string[]> {
  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO expert. Generate relevant SEO keywords for the given topic. Return only a JSON array of strings with 10-15 keywords.'
        },
        {
          role: 'user',
          content: `Generate SEO keywords for: ${topic}${targetAudience ? ` (Target audience: ${targetAudience})` : ''}`
        }
      ],
      max_tokens: 300,
      temperature: 0.3,
    })

    const content = completion.choices[0]?.message?.content || '[]'
    
    try {
      return JSON.parse(content)
    } catch {
      // Fallback parsing
      return content.split('\n')
        .map(line => line.replace(/^[-*]\s*/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 15)
    }
  } catch (error) {
    console.error('Failed to generate SEO keywords:', error)
    throw new Error('Failed to generate SEO keywords')
  }
}

/**
 * Research a topic and provide insights
 */
export async function researchTopic(topic: string): Promise<{
  insights: string[]
  keyPoints: string[]
  relatedTopics: string[]
}> {
  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a research expert. Research the given topic and provide comprehensive insights.
          Format your response as JSON with the following structure:
          {
            "insights": ["insight 1", "insight 2", "insight 3"],
            "keyPoints": ["key point 1", "key point 2", "key point 3"],
            "relatedTopics": ["related topic 1", "related topic 2", "related topic 3"]
          }`
        },
        {
          role: 'user',
          content: `Research this topic: ${topic}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    })

    const content = completion.choices[0]?.message?.content || '{}'
    
    try {
      const parsed = JSON.parse(content)
      return {
        insights: parsed.insights || [],
        keyPoints: parsed.keyPoints || [],
        relatedTopics: parsed.relatedTopics || []
      }
    } catch {
      return {
        insights: ['Unable to parse research insights'],
        keyPoints: [],
        relatedTopics: []
      }
    }
  } catch (error) {
    console.error('Failed to research topic:', error)
    throw new Error('Failed to research topic')
  }
}

/**
 * Generate SEO suggestions for content
 */
export async function generateSEOSuggestions(content: string, title?: string): Promise<{
  keywords: string[]
  metaDescription: string
  suggestions: string[]
}> {
  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an SEO expert. Analyze the given content and provide SEO optimization suggestions.
          Format your response as JSON with the following structure:
          {
            "keywords": ["keyword1", "keyword2", "keyword3"],
            "metaDescription": "SEO-optimized meta description",
            "suggestions": ["SEO suggestion 1", "SEO suggestion 2", "SEO suggestion 3"]
          }`
        },
        {
          role: 'user',
          content: `Analyze this content for SEO optimization:
          ${title ? `Title: ${title}\n\n` : ''}Content: ${content}`
        }
      ],
      max_tokens: 800,
      temperature: 0.3,
    })

    const response = completion.choices[0]?.message?.content || '{}'
    
    try {
      const parsed = JSON.parse(response)
      return {
        keywords: parsed.keywords || [],
        metaDescription: parsed.metaDescription || '',
        suggestions: parsed.suggestions || []
      }
    } catch {
      return {
        keywords: [],
        metaDescription: '',
        suggestions: ['Unable to parse SEO suggestions']
      }
    }
  } catch (error) {
    console.error('Failed to generate SEO suggestions:', error)
    throw new Error('Failed to generate SEO suggestions')
  }
}

/**
 * Test OpenAI connection with enhanced error reporting
 */
export async function testOpenAIConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Test connection' }],
      max_tokens: 5,
    })

    const hasResponse = !!completion.choices[0]?.message?.content
    
    return {
      connected: hasResponse,
      error: hasResponse ? undefined : 'No response received from OpenAI'
    }
  } catch (error) {
    console.error('OpenAI connection test failed:', error)
    
    let errorMessage = 'Unknown error'
    if (error instanceof OpenAI.APIError) {
      errorMessage = `API Error (${error.status}): ${error.message}`
    } else if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return {
      connected: false,
      error: errorMessage
    }
  }
}
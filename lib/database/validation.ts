// Validation functions for database operations

import { 
  SocialPostInput, 
  NewsletterSubscriberInput, 
  NewsletterCampaignInput,
  ContentAnalyticsInput,
  AIContentLogInput,
  ValidationResult 
} from './types'

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sanitize text content to prevent XSS
 */
export function sanitizeText(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

/**
 * Validate social post input
 */
export function validateSocialPost(input: SocialPostInput): ValidationResult {
  const errors: string[] = []

  // Required fields
  if (!input.content || input.content.trim().length === 0) {
    errors.push('Content is required')
  }

  if (!input.platform) {
    errors.push('Platform is required')
  }

  // Platform validation
  if (input.platform && !['linkedin', 'twitter'].includes(input.platform)) {
    errors.push('Platform must be either "linkedin" or "twitter"')
  }

  // Content length validation
  if (input.content) {
    const contentLength = input.content.trim().length
    if (input.platform === 'twitter' && contentLength > 280) {
      errors.push('Twitter posts cannot exceed 280 characters')
    }
    if (input.platform === 'linkedin' && contentLength > 3000) {
      errors.push('LinkedIn posts cannot exceed 3000 characters')
    }
  }

  // Status validation
  if (input.status && !['draft', 'scheduled', 'published', 'failed'].includes(input.status)) {
    errors.push('Status must be one of: draft, scheduled, published, failed')
  }

  // Media URLs validation
  if (input.media_urls) {
    for (const url of input.media_urls) {
      try {
        new URL(url)
      } catch {
        errors.push(`Invalid media URL: ${url}`)
      }
    }
  }

  // Scheduled date validation
  if (input.scheduled_at) {
    const scheduledDate = new Date(input.scheduled_at)
    if (isNaN(scheduledDate.getTime())) {
      errors.push('Invalid scheduled date format')
    } else {
      // Allow a 1-minute buffer to account for processing time
      const now = new Date()
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000)
      if (scheduledDate < oneMinuteAgo) {
        errors.push('Scheduled date cannot be in the past')
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate newsletter subscriber input
 */
export function validateNewsletterSubscriber(input: NewsletterSubscriberInput): ValidationResult {
  const errors: string[] = []

  // Required fields
  if (!input.email || input.email.trim().length === 0) {
    errors.push('Email is required')
  }

  // Email format validation
  if (input.email && !isValidEmail(input.email)) {
    errors.push('Invalid email format')
  }

  // Status validation
  if (input.status && !['active', 'unsubscribed', 'bounced'].includes(input.status)) {
    errors.push('Status must be one of: active, unsubscribed, bounced')
  }

  // Name validation
  if (input.first_name && input.first_name.length > 100) {
    errors.push('First name cannot exceed 100 characters')
  }

  if (input.last_name && input.last_name.length > 100) {
    errors.push('Last name cannot exceed 100 characters')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate newsletter campaign input
 */
export function validateNewsletterCampaign(input: NewsletterCampaignInput): ValidationResult {
  const errors: string[] = []

  // Required fields
  if (!input.subject || input.subject.trim().length === 0) {
    errors.push('Subject is required')
  }

  if (!input.content || input.content.trim().length === 0) {
    errors.push('Content is required')
  }

  // Length validation
  if (input.subject && input.subject.length > 255) {
    errors.push('Subject cannot exceed 255 characters')
  }

  // Status validation
  if (input.status && !['draft', 'scheduled', 'sent', 'failed'].includes(input.status)) {
    errors.push('Status must be one of: draft, scheduled, sent, failed')
  }

  // Scheduled date validation
  if (input.scheduled_at) {
    const scheduledDate = new Date(input.scheduled_at)
    if (isNaN(scheduledDate.getTime())) {
      errors.push('Invalid scheduled date format')
    } else {
      // Allow a 1-minute buffer to account for processing time
      const now = new Date()
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000)
      if (scheduledDate < oneMinuteAgo) {
        errors.push('Scheduled date cannot be in the past')
      }
    }
  }

  // Recipient count validation
  if (input.recipient_count !== undefined && input.recipient_count < 0) {
    errors.push('Recipient count cannot be negative')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate content analytics input
 */
export function validateContentAnalytics(input: ContentAnalyticsInput): ValidationResult {
  const errors: string[] = []

  // Required fields
  if (!input.content_type) {
    errors.push('Content type is required')
  }

  if (!input.content_id || input.content_id.trim().length === 0) {
    errors.push('Content ID is required')
  }

  // Content type validation
  if (input.content_type && !['blog', 'social', 'newsletter'].includes(input.content_type)) {
    errors.push('Content type must be one of: blog, social, newsletter')
  }

  // Numeric validation
  const numericFields = ['views', 'likes', 'shares', 'comments', 'clicks']
  for (const field of numericFields) {
    const value = input[field as keyof ContentAnalyticsInput] as number
    if (value !== undefined && (value < 0 || !Number.isInteger(value))) {
      errors.push(`${field} must be a non-negative integer`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate AI content log input
 */
export function validateAIContentLog(input: AIContentLogInput): ValidationResult {
  const errors: string[] = []

  // Required fields
  if (!input.prompt || input.prompt.trim().length === 0) {
    errors.push('Prompt is required')
  }

  if (!input.generated_content || input.generated_content.trim().length === 0) {
    errors.push('Generated content is required')
  }

  if (!input.content_type || input.content_type.trim().length === 0) {
    errors.push('Content type is required')
  }

  // Tokens used validation
  if (input.tokens_used !== undefined && (input.tokens_used < 0 || !Number.isInteger(input.tokens_used))) {
    errors.push('Tokens used must be a non-negative integer')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitize input data before database operations
 */
export function sanitizeSocialPostInput(input: SocialPostInput): SocialPostInput {
  return {
    ...input,
    content: sanitizeText(input.content),
    media_urls: input.media_urls?.map(url => url.trim())
  }
}

export function sanitizeNewsletterSubscriberInput(input: NewsletterSubscriberInput): NewsletterSubscriberInput {
  return {
    ...input,
    email: input.email.toLowerCase().trim(),
    first_name: input.first_name ? sanitizeText(input.first_name) : undefined,
    last_name: input.last_name ? sanitizeText(input.last_name) : undefined
  }
}

export function sanitizeNewsletterCampaignInput(input: NewsletterCampaignInput): NewsletterCampaignInput {
  return {
    ...input,
    subject: sanitizeText(input.subject),
    content: input.content.trim(), // Don't sanitize HTML content for newsletters
    template_id: input.template_id?.trim()
  }
}

export function sanitizeContentAnalyticsInput(input: ContentAnalyticsInput): ContentAnalyticsInput {
  return {
    ...input,
    content_id: input.content_id.trim(),
    platform: input.platform?.trim()
  }
}

export function sanitizeAIContentLogInput(input: AIContentLogInput): AIContentLogInput {
  return {
    ...input,
    prompt: input.prompt.trim(),
    generated_content: input.generated_content.trim(),
    content_type: input.content_type.trim()
  }
}
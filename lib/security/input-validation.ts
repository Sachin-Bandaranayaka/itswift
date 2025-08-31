import DOMPurify from 'isomorphic-dompurify'
import validator from 'validator'

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target'],
    ALLOW_DATA_ATTR: false,
  })
}

/**
 * Sanitize plain text input
 */
export function sanitizeText(text: string): string {
  return validator.escape(text.trim())
}

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  return validator.isEmail(email)
}

/**
 * Validate URL
 */
export function validateUrl(url: string): boolean {
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true,
  })
}

/**
 * Validate social media content length
 */
export function validateSocialContent(content: string, platform: 'twitter' | 'linkedin'): {
  valid: boolean
  error?: string
} {
  const limits = {
    twitter: 280,
    linkedin: 3000,
  }

  const limit = limits[platform]
  
  if (content.length === 0) {
    return { valid: false, error: 'Content cannot be empty' }
  }

  if (content.length > limit) {
    return { valid: false, error: `Content exceeds ${limit} character limit for ${platform}` }
  }

  return { valid: true }
}

/**
 * Validate newsletter subject line
 */
export function validateNewsletterSubject(subject: string): {
  valid: boolean
  error?: string
} {
  if (subject.length === 0) {
    return { valid: false, error: 'Subject line cannot be empty' }
  }

  if (subject.length > 100) {
    return { valid: false, error: 'Subject line cannot exceed 100 characters' }
  }

  // Check for spam-like patterns
  const spamPatterns = [
    /FREE/gi,
    /URGENT/gi,
    /CLICK HERE/gi,
    /LIMITED TIME/gi,
    /ACT NOW/gi,
  ]

  for (const pattern of spamPatterns) {
    if (pattern.test(subject)) {
      return { valid: false, error: 'Subject line contains potentially spam-like content' }
    }
  }

  return { valid: true }
}

/**
 * Validate file upload
 */
export function validateFileUpload(file: File, allowedTypes: string[], maxSize: number): {
  valid: boolean
  error?: string
} {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} is not allowed` }
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024)
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` }
  }

  // Check for potentially dangerous file names
  const dangerousPatterns = [
    /\.(exe|bat|cmd|scr|pif|com)$/i,
    /\.\./,
    /[<>:"|?*]/,
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(file.name)) {
      return { valid: false, error: 'File name contains invalid characters or extension' }
    }
  }

  return { valid: true }
}

/**
 * Validate JSON input
 */
export function validateJson(jsonString: string): {
  valid: boolean
  data?: any
  error?: string
} {
  try {
    const data = JSON.parse(jsonString)
    return { valid: true, data }
  } catch (error) {
    return { valid: false, error: 'Invalid JSON format' }
  }
}

/**
 * Validate date input
 */
export function validateDate(dateString: string): {
  valid: boolean
  date?: Date
  error?: string
} {
  if (!validator.isISO8601(dateString)) {
    return { valid: false, error: 'Invalid date format' }
  }

  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date' }
  }

  // Check if date is in the past (for scheduling)
  if (date < new Date()) {
    return { valid: false, error: 'Date cannot be in the past' }
  }

  return { valid: true, date }
}

/**
 * Validate and sanitize search query
 */
export function validateSearchQuery(query: string): {
  valid: boolean
  sanitizedQuery?: string
  error?: string
} {
  if (query.length === 0) {
    return { valid: false, error: 'Search query cannot be empty' }
  }

  if (query.length > 100) {
    return { valid: false, error: 'Search query too long' }
  }

  // Remove potentially dangerous characters
  const sanitizedQuery = query.replace(/[<>'"&]/g, '').trim()

  if (sanitizedQuery.length === 0) {
    return { valid: false, error: 'Search query contains only invalid characters' }
  }

  return { valid: true, sanitizedQuery }
}

/**
 * Sanitize input (alias for sanitizeHtml for backward compatibility)
 */
export function sanitizeInput(input: string): string {
  if (!input) return ''
  return sanitizeHtml(input)
}

/**
 * Validate social post content
 */
export function validateSocialPostContent(content: string, platform: 'linkedin' | 'twitter'): {
  isValid: boolean
  error?: string
} {
  if (!content || content.trim().length === 0) {
    return { isValid: false, error: 'Content cannot be empty' }
  }

  const result = validateSocialContent(content, platform)
  return {
    isValid: result.valid,
    error: result.error
  }
}

/**
 * Validate newsletter content
 */
export function validateNewsletterContent(newsletter: {
  subject: string
  content: string
  recipients: string[]
}): {
  isValid: boolean
  error?: string
} {
  if (!newsletter.subject || newsletter.subject.trim().length === 0) {
    return { isValid: false, error: 'Subject is required' }
  }

  if (!newsletter.content || newsletter.content.trim().length === 0) {
    return { isValid: false, error: 'Content is required' }
  }

  if (!newsletter.recipients || newsletter.recipients.length === 0) {
    return { isValid: false, error: 'Recipients are required' }
  }

  // Validate all email addresses
  for (const email of newsletter.recipients) {
    if (!validateEmail(email)) {
      return { isValid: false, error: `Invalid email address: ${email}` }
    }
  }

  return { isValid: true }
}

/**
 * Check if URL is valid (alias for validateUrl)
 */
export function isValidUrl(url: string): boolean {
  return validateUrl(url)
}

/**
 * Validate API key format
 */
export function validateApiKey(apiKey: string, keyType: string): {
  valid: boolean
  error?: string
} {
  if (!apiKey || apiKey.length === 0) {
    return { valid: false, error: `${keyType} API key cannot be empty` }
  }

  // Basic format validation based on key type
  const patterns = {
    openai: /^sk-[a-zA-Z0-9]{48}$/,
    brevo: /^xkeysib-[a-f0-9]{64}-[a-zA-Z0-9]{16}$/i,
    linkedin: /^[a-zA-Z0-9]{16}$/,
    twitter: /^[a-zA-Z0-9]{25}$/,
  }

  const pattern = patterns[keyType as keyof typeof patterns]
  
  if (pattern && !pattern.test(apiKey)) {
    return { valid: false, error: `Invalid ${keyType} API key format` }
  }

  return { valid: true }
}
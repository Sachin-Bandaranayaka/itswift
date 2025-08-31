import { describe, it, expect } from 'vitest'
import { 
  validateEmail, 
  sanitizeInput, 
  validateSocialPostContent,
  validateNewsletterContent,
  isValidUrl 
} from '@/lib/security/input-validation'

describe('Input Validation', () => {
  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('user@example.com')).toBe(true)
      expect(validateEmail('test.email+tag@domain.co.uk')).toBe(true)
      expect(validateEmail('user123@test-domain.org')).toBe(true)
    })

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('user..double.dot@domain.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('sanitizeInput', () => {
    it('removes HTML tags from input', () => {
      const input = '<script>alert("xss")</script>Hello World'
      const result = sanitizeInput(input)
      expect(result).toBe('Hello World')
    })

    it('removes dangerous attributes', () => {
      const input = '<div onclick="malicious()">Content</div>'
      const result = sanitizeInput(input)
      expect(result).toBe('<div>Content</div>')
    })

    it('preserves safe HTML tags', () => {
      const input = '<p>This is <strong>bold</strong> and <em>italic</em> text.</p>'
      const result = sanitizeInput(input)
      expect(result).toBe('<p>This is <strong>bold</strong> and <em>italic</em> text.</p>')
    })

    it('handles empty input', () => {
      expect(sanitizeInput('')).toBe('')
      expect(sanitizeInput(null as any)).toBe('')
      expect(sanitizeInput(undefined as any)).toBe('')
    })
  })

  describe('validateSocialPostContent', () => {
    it('validates LinkedIn post content', () => {
      const validContent = 'This is a valid LinkedIn post with professional content.'
      const result = validateSocialPostContent(validContent, 'linkedin')
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('validates Twitter post content', () => {
      const validContent = 'Valid Twitter post #hashtag'
      const result = validateSocialPostContent(validContent, 'twitter')
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('rejects Twitter posts exceeding character limit', () => {
      const longContent = 'a'.repeat(281) // Over Twitter's 280 character limit
      const result = validateSocialPostContent(longContent, 'twitter')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Content exceeds Twitter character limit (280)')
    })

    it('rejects LinkedIn posts exceeding character limit', () => {
      const longContent = 'a'.repeat(3001) // Over LinkedIn's 3000 character limit
      const result = validateSocialPostContent(longContent, 'linkedin')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Content exceeds LinkedIn character limit (3000)')
    })

    it('rejects empty content', () => {
      const result = validateSocialPostContent('', 'linkedin')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Content cannot be empty')
    })

    it('rejects content with only whitespace', () => {
      const result = validateSocialPostContent('   \n\t   ', 'twitter')
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Content cannot be empty')
    })
  })

  describe('validateNewsletterContent', () => {
    it('validates newsletter with subject and content', () => {
      const newsletter = {
        subject: 'Monthly Newsletter',
        content: '<p>This is the newsletter content.</p>',
        recipients: ['user1@example.com', 'user2@example.com']
      }
      
      const result = validateNewsletterContent(newsletter)
      
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('rejects newsletter without subject', () => {
      const newsletter = {
        subject: '',
        content: '<p>Content</p>',
        recipients: ['user@example.com']
      }
      
      const result = validateNewsletterContent(newsletter)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Subject is required')
    })

    it('rejects newsletter without content', () => {
      const newsletter = {
        subject: 'Subject',
        content: '',
        recipients: ['user@example.com']
      }
      
      const result = validateNewsletterContent(newsletter)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Content is required')
    })

    it('rejects newsletter without recipients', () => {
      const newsletter = {
        subject: 'Subject',
        content: '<p>Content</p>',
        recipients: []
      }
      
      const result = validateNewsletterContent(newsletter)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('At least one recipient is required')
    })

    it('rejects newsletter with invalid email recipients', () => {
      const newsletter = {
        subject: 'Subject',
        content: '<p>Content</p>',
        recipients: ['valid@example.com', 'invalid-email']
      }
      
      const result = validateNewsletterContent(newsletter)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Invalid email address: invalid-email')
    })
  })

  describe('isValidUrl', () => {
    it('validates correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://test.org/path?param=value')).toBe(true)
      expect(isValidUrl('https://subdomain.example.com/path')).toBe(true)
    })

    it('rejects invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('ftp://example.com')).toBe(false) // Only http/https allowed
      expect(isValidUrl('javascript:alert(1)')).toBe(false)
      expect(isValidUrl('')).toBe(false)
    })
  })
})
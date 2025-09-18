// Brevo (formerly Sendinblue) email service integration

import { NewsletterSubscriber } from '../database/types'
import { getSubscriberByEmailForBrevo } from './brevo-helpers'
import { NewsletterErrorHandler } from '../utils/newsletter-error-handler'
import { BrevoServiceError } from '../utils/error-handler'
import { logger } from '../utils/logger'

interface BrevoConfig {
  apiKey: string
  apiUrl?: string
  retryAttempts?: number
  retryDelay?: number
}

interface EmailRecipient {
  email: string
  name?: string
}

interface EmailTemplate {
  id?: number
  subject?: string
  htmlContent?: string
  textContent?: string
}

interface SendEmailRequest {
  to: EmailRecipient[]
  subject?: string
  htmlContent?: string
  textContent?: string
  templateId?: number
  params?: Record<string, any>
  sender?: EmailRecipient
  replyTo?: EmailRecipient
  scheduledAt?: string
}

interface SendEmailResponse {
  messageId: string
  success: boolean
  error?: string
}

interface EmailStats {
  delivered: number
  opens: number
  clicks: number
  bounces: number
  spam: number
  unsubscribes: number
}

interface BrevoContact {
  id?: number
  email: string
  attributes?: {
    FIRSTNAME?: string
    LASTNAME?: string
    [key: string]: any
  }
  listIds?: number[]
  updateEnabled?: boolean
}

interface BrevoContactResponse {
  id: number
  email: string
  attributes: Record<string, any>
  listIds: number[]
}

interface SyncResult {
  success: boolean
  brevo_contact_id?: string
  error?: string
  retry_after?: number
  fallback_used?: boolean
}

export class BrevoService {
  private config: BrevoConfig
  private baseUrl: string
  private defaultListId: number

  constructor(config: BrevoConfig) {
    this.config = {
      retryAttempts: 3,
      retryDelay: 1000,
      ...config
    }
    this.baseUrl = config.apiUrl || 'https://api.brevo.com/v3'
    this.defaultListId = parseInt(process.env.BREVO_DEFAULT_LIST_ID || '1')
  }

  /**
   * Retry mechanism for API calls with exponential backoff
   */
  private async retryApiCall<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = this.config.retryAttempts || 3
  ): Promise<T> {
    let lastError: Error
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        
        if (attempt === maxRetries) {
          throw lastError
        }
        
        // Exponential backoff: wait longer between each retry
        const delay = (this.config.retryDelay || 1000) * Math.pow(2, attempt)
        await new Promise(resolve => setTimeout(resolve, delay))
        
        console.warn(`Brevo API call failed (attempt ${attempt + 1}/${maxRetries + 1}), retrying in ${delay}ms:`, lastError.message)
      }
    }
    
    throw lastError!
  }

  /**
   * Sync a subscriber with Brevo contacts with enhanced error handling and fallback
   */
  async syncSubscriber(subscriber: NewsletterSubscriber, enableFallback: boolean = true): Promise<SyncResult> {
    const startTime = Date.now()
    
    try {
      const result = await this.retryApiCall(async () => {
        // Prepare contact data
        const contactData: BrevoContact = {
          email: subscriber.email,
          attributes: {},
          listIds: [this.defaultListId],
          updateEnabled: true
        }

        // Add name attributes if available
        if (subscriber.first_name) {
          contactData.attributes!.FIRSTNAME = subscriber.first_name
        }
        if (subscriber.last_name) {
          contactData.attributes!.LASTNAME = subscriber.last_name
        }

        // Add subscription source
        if (subscriber.source) {
          contactData.attributes!.SOURCE = subscriber.source
        }

        // Add subscription date
        contactData.attributes!.SUBSCRIBED_AT = subscriber.subscribed_at

        // Log API call attempt
        logger.debug('Attempting Brevo contact sync', 'BREVO_SYNC', {
          subscriberId: subscriber.id,
          email: subscriber.email.split('@')[0].substring(0, 2) + '***@' + subscriber.email.split('@')[1],
          listId: this.defaultListId
        })

        const response = await fetch(`${this.baseUrl}/contacts`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': this.config.apiKey
          },
          body: JSON.stringify(contactData)
        })

        const data = await response.json()

        // Log API response
        logger.debug('Brevo contact sync response', 'BREVO_SYNC', {
          subscriberId: subscriber.id,
          statusCode: response.status,
          success: response.ok,
          duration: Date.now() - startTime
        })

        if (!response.ok) {
          // Handle duplicate contact (contact already exists)
          if (response.status === 400 && data.code === 'duplicate_parameter') {
            logger.info('Brevo contact already exists, updating instead', 'BREVO_SYNC', {
              subscriberId: subscriber.id,
              email: subscriber.email.split('@')[0].substring(0, 2) + '***@' + subscriber.email.split('@')[1]
            })
            // Try to update existing contact instead
            return await this.updateExistingContact(subscriber)
          }
          
          // Handle rate limiting
          if (response.status === 429) {
            const retryAfter = parseInt(response.headers.get('retry-after') || '300')
            throw new BrevoServiceError(
              'Brevo API rate limit exceeded',
              { statusCode: response.status, retryAfter },
              retryAfter
            )
          }

          // Handle authentication errors
          if (response.status === 401 || response.status === 403) {
            throw new BrevoServiceError(
              'Brevo API authentication failed',
              { statusCode: response.status, message: data.message }
            )
          }

          throw new BrevoServiceError(
            data.message || `HTTP ${response.status}: Failed to sync subscriber`,
            { statusCode: response.status, responseData: data }
          )
        }

        return {
          success: true,
          brevo_contact_id: data.id?.toString(),
          error: undefined
        }
      })

      // Log successful sync
      logger.info('Brevo contact sync successful', 'BREVO_SYNC', {
        subscriberId: subscriber.id,
        brevoContactId: result.brevo_contact_id,
        duration: Date.now() - startTime
      })

      return result
    } catch (error) {
      // Enhanced error handling with fallback mechanism
      const handledError = NewsletterErrorHandler.handleBrevoError(
        error, 
        'sync_subscriber', 
        enableFallback
      )

      const syncResult: SyncResult = {
        success: false,
        error: handledError.message,
        retry_after: handledError.retryAfter
      }

      // If fallback is enabled and this is a critical error, still return success
      // but mark for later retry
      if (enableFallback && this.isCriticalError(error)) {
        logger.warn('Brevo sync failed but fallback enabled - marking for retry', 'BREVO_FALLBACK', {
          subscriberId: subscriber.id,
          error: handledError.message,
          retryAfter: syncResult.retry_after
        })
        
        // Return partial success to allow local subscription to proceed
        return {
          success: true,
          error: 'Brevo sync deferred - will retry later',
          retry_after: syncResult.retry_after,
          fallback_used: true
        }
      }

      return syncResult
    }
  }

  /**
   * Update existing contact in Brevo
   */
  private async updateExistingContact(subscriber: NewsletterSubscriber): Promise<SyncResult> {
    const contactData: Partial<BrevoContact> = {
      attributes: {},
      listIds: [this.defaultListId]
    }

    // Add name attributes if available
    if (subscriber.first_name) {
      contactData.attributes!.FIRSTNAME = subscriber.first_name
    }
    if (subscriber.last_name) {
      contactData.attributes!.LASTNAME = subscriber.last_name
    }

    // Add subscription source
    if (subscriber.source) {
      contactData.attributes!.SOURCE = subscriber.source
    }

    // Add subscription date
    contactData.attributes!.SUBSCRIBED_AT = subscriber.subscribed_at

    const response = await fetch(`${this.baseUrl}/contacts/${encodeURIComponent(subscriber.email)}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': this.config.apiKey
      },
      body: JSON.stringify(contactData)
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || `HTTP ${response.status}: Failed to update existing contact`)
    }

    // Get the contact ID after update
    const contactInfo = await this.getContactByEmail(subscriber.email)
    
    return {
      success: true,
      brevo_contact_id: contactInfo?.id?.toString(),
      error: undefined
    }
  }

  /**
   * Get contact information by email
   */
  private async getContactByEmail(email: string): Promise<BrevoContactResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'api-key': this.config.apiKey
        }
      })

      if (!response.ok) {
        return null
      }

      return await response.json()
    } catch (error) {
      console.error('Error getting contact by email:', error)
      return null
    }
  }

  /**
   * Sync unsubscribe status with Brevo with enhanced error handling
   */
  async syncUnsubscribe(email: string, enableFallback: boolean = true): Promise<SyncResult> {
    const startTime = Date.now()
    
    try {
      const result = await this.retryApiCall(async () => {
        // Log unsubscribe sync attempt
        logger.debug('Attempting Brevo unsubscribe sync', 'BREVO_UNSUBSCRIBE', {
          email: email.split('@')[0].substring(0, 2) + '***@' + email.split('@')[1],
          listId: this.defaultListId
        })

        // Remove contact from all lists (effectively unsubscribing them)
        const response = await fetch(`${this.baseUrl}/contacts/${encodeURIComponent(email)}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'api-key': this.config.apiKey
          },
          body: JSON.stringify({
            listIds: [], // Remove from all lists
            unlinkListIds: [this.defaultListId], // Explicitly unlink from default list
            attributes: {
              UNSUBSCRIBED_AT: new Date().toISOString()
            }
          })
        })

        // Log API response
        logger.debug('Brevo unsubscribe sync response', 'BREVO_UNSUBSCRIBE', {
          email: email.split('@')[0].substring(0, 2) + '***@' + email.split('@')[1],
          statusCode: response.status,
          success: response.ok,
          duration: Date.now() - startTime
        })

        if (!response.ok) {
          const data = await response.json()
          
          // Handle contact not found (already unsubscribed or never existed)
          if (response.status === 404) {
            logger.info('Brevo contact not found for unsubscribe - treating as success', 'BREVO_UNSUBSCRIBE', {
              email: email.split('@')[0].substring(0, 2) + '***@' + email.split('@')[1]
            })
            return {
              success: true,
              error: undefined
            }
          }

          // Handle rate limiting
          if (response.status === 429) {
            const retryAfter = parseInt(response.headers.get('retry-after') || '300')
            throw new BrevoServiceError(
              'Brevo API rate limit exceeded',
              { statusCode: response.status, retryAfter },
              retryAfter
            )
          }

          // Handle authentication errors
          if (response.status === 401 || response.status === 403) {
            throw new BrevoServiceError(
              'Brevo API authentication failed',
              { statusCode: response.status, message: data.message }
            )
          }

          throw new BrevoServiceError(
            data.message || `HTTP ${response.status}: Failed to sync unsubscribe`,
            { statusCode: response.status, responseData: data }
          )
        }

        return {
          success: true,
          error: undefined
        }
      })

      // Log successful unsubscribe sync
      logger.info('Brevo unsubscribe sync successful', 'BREVO_UNSUBSCRIBE', {
        email: email.split('@')[0].substring(0, 2) + '***@' + email.split('@')[1],
        duration: Date.now() - startTime
      })

      return result
    } catch (error) {
      // Enhanced error handling with fallback mechanism
      const handledError = NewsletterErrorHandler.handleBrevoError(
        error, 
        'sync_unsubscribe', 
        enableFallback
      )

      const syncResult: SyncResult = {
        success: false,
        error: handledError.message,
        retry_after: handledError.retryAfter
      }

      // If fallback is enabled, still allow local unsubscribe to succeed
      if (enableFallback) {
        logger.warn('Brevo unsubscribe sync failed but fallback enabled', 'BREVO_FALLBACK', {
          email: email.split('@')[0].substring(0, 2) + '***@' + email.split('@')[1],
          error: handledError.message,
          retryAfter: syncResult.retry_after
        })
        
        // Return partial success to allow local unsubscribe to proceed
        return {
          success: true,
          error: 'Brevo unsubscribe sync deferred - will retry later',
          retry_after: syncResult.retry_after,
          fallback_used: true
        }
      }

      return syncResult
    }
  }

  /**
   * Create unsubscribe link for email campaigns
   */
  async createUnsubscribeLink(email: string, campaignId?: string): Promise<string> {
    try {
      // Generate base unsubscribe URL
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.itswift.com'
      
      // Get subscriber to get their unsubscribe token
      const subscriber = await this.getSubscriberByEmail(email)
      if (!subscriber?.unsubscribe_token) {
        throw new Error('Subscriber not found or missing unsubscribe token')
      }

      // Create unsubscribe link with token
      let unsubscribeUrl = `${baseUrl}/unsubscribe?token=${subscriber.unsubscribe_token}`
      
      // Add campaign ID if provided for tracking
      if (campaignId) {
        unsubscribeUrl += `&campaign=${encodeURIComponent(campaignId)}`
      }

      return unsubscribeUrl
    } catch (error) {
      console.error('Error creating unsubscribe link:', error)
      // Fallback to generic unsubscribe link
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.itswift.com'
      return `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`
    }
  }

  /**
   * Get subscriber by email (helper method for unsubscribe link creation)
   */
  private async getSubscriberByEmail(email: string): Promise<NewsletterSubscriber | null> {
    return await getSubscriberByEmailForBrevo(email)
  }

  /**
   * Check if error indicates we should retry later (rate limiting, temporary issues)
   */
  private shouldRetryLater(error: any): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      return message.includes('rate limit') || 
             message.includes('too many requests') ||
             message.includes('temporary') ||
             message.includes('503') ||
             message.includes('502')
    }
    return false
  }

  /**
   * Generate plain text content from HTML content
   */
  private generateTextFromHtml(htmlContent: string, subject: string): string {
    // Simple HTML to text conversion
    let textContent = htmlContent
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Convert HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim()

    // Add basic structure if content exists
    if (textContent) {
      return `${subject}

${textContent}

---
© 2024 Swift Solution. All rights reserved.`
    }

    // Fallback minimal text content
    return `${subject}

Please view this email in a web browser for the best experience.

---
© 2024 Swift Solution. All rights reserved.`
  }

  /**
   * Send a transactional email
   */
  async sendEmail(request: SendEmailRequest): Promise<SendEmailResponse> {
    try {
      // Generate textContent if not provided but htmlContent exists
      let textContent = request.textContent
      if (!textContent && request.htmlContent) {
        textContent = this.generateTextFromHtml(request.htmlContent, request.subject || 'Newsletter')
      }

      const payload = {
        to: request.to,
        subject: request.subject,
        htmlContent: request.htmlContent,
        textContent: textContent,
        templateId: request.templateId,
        params: request.params,
        sender: request.sender || {
          email: 'itswiftin@gmail.com',
          name: 'Swift Solution'
        },
        replyTo: request.replyTo,
        scheduledAt: request.scheduledAt
      }

      const response = await fetch(`${this.baseUrl}/smtp/email`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.config.apiKey
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Brevo API error:', data)
        return {
          messageId: '',
          success: false,
          error: data.message || 'Failed to send email'
        }
      }

      return {
        messageId: data.messageId,
        success: true
      }
    } catch (error) {
      console.error('Error sending email via Brevo:', error)
      return {
        messageId: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Send bulk emails (newsletter)
   */
  async sendBulkEmail(
    recipients: EmailRecipient[],
    subject: string,
    htmlContent: string,
    textContent?: string,
    templateId?: number
  ): Promise<{ success: boolean; messageIds: string[]; errors: string[] }> {
    const results = {
      success: true,
      messageIds: [] as string[],
      errors: [] as string[]
    }

    // Brevo allows up to 50 recipients per request for transactional emails
    // For larger lists, we'll batch the requests
    const batchSize = 50
    const batches = []

    for (let i = 0; i < recipients.length; i += batchSize) {
      batches.push(recipients.slice(i, i + batchSize))
    }

    for (const batch of batches) {
      try {
        const response = await this.sendEmail({
          to: batch,
          subject,
          htmlContent,
          textContent,
          templateId
        })

        if (response.success) {
          results.messageIds.push(response.messageId)
        } else {
          results.success = false
          results.errors.push(response.error || 'Unknown error')
        }
      } catch (error) {
        results.success = false
        results.errors.push(error instanceof Error ? error.message : 'Unknown error')
      }
    }

    return results
  }

  /**
   * Send bulk emails with personalized unsubscribe links
   */
  async sendBulkEmailWithUnsubscribe(
    recipients: Array<EmailRecipient & { unsubscribeUrl?: string; source?: string }>,
    subject: string,
    htmlContent: string,
    textContent?: string,
    templateId?: number
  ): Promise<{ success: boolean; messageIds: string[]; errors: string[]; recipientsBySource: Record<string, number> }> {
    const results = {
      success: true,
      messageIds: [] as string[],
      errors: [] as string[],
      recipientsBySource: {} as Record<string, number>
    }

    // Track recipients by source for analytics
    recipients.forEach(recipient => {
      const source = recipient.source || 'unknown'
      results.recipientsBySource[source] = (results.recipientsBySource[source] || 0) + 1
    })

    // Send individual emails to personalize unsubscribe links
    for (const recipient of recipients) {
      try {
        // Personalize content with unsubscribe link
        let personalizedHtmlContent = htmlContent
        let personalizedTextContent = textContent || ''

        if (recipient.unsubscribeUrl) {
          personalizedHtmlContent = personalizedHtmlContent.replace(
            /\{\{unsubscribe_url\}\}/g, 
            recipient.unsubscribeUrl
          )
          personalizedTextContent = personalizedTextContent.replace(
            /\{\{unsubscribe_url\}\}/g, 
            recipient.unsubscribeUrl
          )
        }

        const response = await this.sendEmail({
          to: [{ email: recipient.email, name: recipient.name }],
          subject,
          htmlContent: personalizedHtmlContent,
          textContent: personalizedTextContent || textContent,
          templateId
        })

        if (response.success) {
          results.messageIds.push(response.messageId)
        } else {
          results.success = false
          results.errors.push(`${recipient.email}: ${response.error || 'Unknown error'}`)
        }
      } catch (error) {
        results.success = false
        results.errors.push(`${recipient.email}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return results
  }

  /**
   * Create an email template
   */
  async createTemplate(
    name: string,
    subject: string,
    htmlContent: string,
    textContent?: string
  ): Promise<{ templateId: number | null; error: string | null }> {
    try {
      const payload = {
        templateName: name,
        subject,
        htmlContent,
        textContent,
        isActive: true
      }

      const response = await fetch(`${this.baseUrl}/smtp/templates`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.config.apiKey
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Brevo template creation error:', data)
        return {
          templateId: null,
          error: data.message || 'Failed to create template'
        }
      }

      return {
        templateId: data.id,
        error: null
      }
    } catch (error) {
      console.error('Error creating Brevo template:', error)
      return {
        templateId: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get email templates
   */
  async getTemplates(): Promise<{ templates: EmailTemplate[]; error: string | null }> {
    try {
      const response = await fetch(`${this.baseUrl}/smtp/templates`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'api-key': this.config.apiKey
        }
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Brevo get templates error:', data)
        return {
          templates: [],
          error: data.message || 'Failed to get templates'
        }
      }

      return {
        templates: data.templates || [],
        error: null
      }
    } catch (error) {
      console.error('Error getting Brevo templates:', error)
      return {
        templates: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get email statistics
   */
  async getEmailStats(
    messageId: string
  ): Promise<{ stats: EmailStats | null; error: string | null }> {
    try {
      const response = await fetch(`${this.baseUrl}/smtp/statistics/events?messageId=${messageId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'api-key': this.config.apiKey
        }
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Brevo stats error:', data)
        return {
          stats: null,
          error: data.message || 'Failed to get email stats'
        }
      }

      // Process the events to calculate stats
      const events = data.events || []
      const stats: EmailStats = {
        delivered: 0,
        opens: 0,
        clicks: 0,
        bounces: 0,
        spam: 0,
        unsubscribes: 0
      }

      events.forEach((event: any) => {
        switch (event.event) {
          case 'delivered':
            stats.delivered++
            break
          case 'opened':
            stats.opens++
            break
          case 'clicked':
            stats.clicks++
            break
          case 'bounced':
            stats.bounces++
            break
          case 'spam':
            stats.spam++
            break
          case 'unsubscribed':
            stats.unsubscribes++
            break
        }
      })

      return {
        stats,
        error: null
      }
    } catch (error) {
      console.error('Error getting email stats from Brevo:', error)
      return {
        stats: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Test the API connection
   */
  async testConnection(): Promise<{ success: boolean; error: string | null }> {
    try {
      const response = await fetch(`${this.baseUrl}/account`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'api-key': this.config.apiKey
        }
      })

      if (!response.ok) {
        const data = await response.json()
        return {
          success: false,
          error: data.message || 'API connection failed'
        }
      }

      return {
        success: true,
        error: null
      }
    } catch (error) {
      console.error('Error testing Brevo connection:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      }
    }
  }
}

// Create a singleton instance
let brevoService: BrevoService | null = null

export function getBrevoService(): BrevoService {
  if (!brevoService) {
    const apiKey = process.env.BREVO_API_KEY
    if (!apiKey) {
      throw new Error('BREVO_API_KEY environment variable is required')
    }

    brevoService = new BrevoService({ 
      apiKey,
      retryAttempts: parseInt(process.env.BREVO_RETRY_ATTEMPTS || '3'),
      retryDelay: parseInt(process.env.BREVO_RETRY_DELAY || '1000')
    })
  }

  return brevoService
}

// Export types for use in other modules
export type { SyncResult, BrevoContact, BrevoContactResponse }
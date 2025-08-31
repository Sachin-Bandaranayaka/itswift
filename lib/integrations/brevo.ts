// Brevo (formerly Sendinblue) email service integration

interface BrevoConfig {
  apiKey: string
  apiUrl?: string
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

export class BrevoService {
  private config: BrevoConfig
  private baseUrl: string

  constructor(config: BrevoConfig) {
    this.config = config
    this.baseUrl = config.apiUrl || 'https://api.brevo.com/v3'
  }

  /**
   * Send a transactional email
   */
  async sendEmail(request: SendEmailRequest): Promise<SendEmailResponse> {
    try {
      const payload = {
        to: request.to,
        subject: request.subject,
        htmlContent: request.htmlContent,
        textContent: request.textContent,
        templateId: request.templateId,
        params: request.params,
        sender: request.sender || {
          email: 'noreply@swiftsolution.com',
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

    brevoService = new BrevoService({ apiKey })
  }

  return brevoService
}
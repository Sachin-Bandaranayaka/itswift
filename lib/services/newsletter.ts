// Newsletter service that combines campaign management and email sending

import { NewsletterCampaignsService } from '@/lib/database/services/newsletter-campaigns'
import { NewsletterSubscribersService } from '@/lib/database/services/newsletter-subscribers'
import { getBrevoService } from '@/lib/integrations/brevo'
import { NewsletterCampaign, NewsletterSubscriber } from '@/lib/database/types'

interface NewsletterTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent?: string
  previewText?: string
}

interface SendNewsletterOptions {
  campaignId: string
  testEmail?: string
  scheduleAt?: Date
}

interface NewsletterSendResult {
  success: boolean
  messageIds: string[]
  recipientCount: number
  errors: string[]
}

export class NewsletterService {
  private brevoService = getBrevoService()

  /**
   * Get default newsletter templates
   */
  static getDefaultTemplates(): NewsletterTemplate[] {
    return [
      {
        id: 'basic',
        name: 'Basic Newsletter',
        subject: 'Newsletter - {{date}}',
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #ffffff; padding: 30px; border: 1px solid #e9ecef; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-radius: 0 0 8px 8px; }
        .logo { font-size: 24px; font-weight: bold; color: #007bff; }
        h1 { color: #007bff; margin-bottom: 20px; }
        .unsubscribe { margin-top: 20px; }
        .unsubscribe a { color: #6c757d; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Swift Solution</div>
        </div>
        <div class="content">
            <h1>{{subject}}</h1>
            {{content}}
        </div>
        <div class="footer">
            <p>© 2024 Swift Solution. All rights reserved.</p>
            <div class="unsubscribe">
                <a href="{{unsubscribe_url}}">Unsubscribe</a> | 
                <a href="{{view_online_url}}">View Online</a>
            </div>
        </div>
    </div>
</body>
</html>`,
        textContent: `{{subject}}\n\n{{content}}\n\n---\n© 2024 Swift Solution. All rights reserved.\nUnsubscribe: {{unsubscribe_url}}`,
        previewText: 'Your latest newsletter from Swift Solution'
      },
      {
        id: 'announcement',
        name: 'Announcement',
        subject: 'Important Update - {{title}}',
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #007bff, #0056b3); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #ffffff; padding: 30px; border: 1px solid #e9ecef; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-radius: 0 0 8px 8px; }
        .logo { font-size: 24px; font-weight: bold; }
        .announcement-badge { background-color: #ffc107; color: #000; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 20px; display: inline-block; }
        h1 { color: #007bff; margin-bottom: 20px; }
        .cta-button { background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .unsubscribe { margin-top: 20px; }
        .unsubscribe a { color: #6c757d; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Swift Solution</div>
            <div class="announcement-badge">ANNOUNCEMENT</div>
        </div>
        <div class="content">
            <h1>{{title}}</h1>
            {{content}}
            {{#if cta_url}}
            <a href="{{cta_url}}" class="cta-button">{{cta_text}}</a>
            {{/if}}
        </div>
        <div class="footer">
            <p>© 2024 Swift Solution. All rights reserved.</p>
            <div class="unsubscribe">
                <a href="{{unsubscribe_url}}">Unsubscribe</a> | 
                <a href="{{view_online_url}}">View Online</a>
            </div>
        </div>
    </div>
</body>
</html>`,
        textContent: `ANNOUNCEMENT: {{title}}\n\n{{content}}\n\n{{#if cta_url}}{{cta_text}}: {{cta_url}}{{/if}}\n\n---\n© 2024 Swift Solution. All rights reserved.\nUnsubscribe: {{unsubscribe_url}}`,
        previewText: 'Important announcement from Swift Solution'
      },
      {
        id: 'blog-digest',
        name: 'Blog Digest',
        subject: 'Latest Blog Posts - {{date}}',
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{subject}}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #ffffff; padding: 30px; border: 1px solid #e9ecef; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; border-radius: 0 0 8px 8px; }
        .logo { font-size: 24px; font-weight: bold; color: #007bff; }
        .blog-post { border-bottom: 1px solid #e9ecef; padding: 20px 0; }
        .blog-post:last-child { border-bottom: none; }
        .blog-title { font-size: 18px; font-weight: bold; color: #007bff; margin-bottom: 10px; }
        .blog-excerpt { color: #6c757d; margin-bottom: 10px; }
        .read-more { color: #007bff; text-decoration: none; font-weight: bold; }
        .unsubscribe { margin-top: 20px; }
        .unsubscribe a { color: #6c757d; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">Swift Solution</div>
            <p>Latest from our blog</p>
        </div>
        <div class="content">
            <h1>Recent Blog Posts</h1>
            {{#each posts}}
            <div class="blog-post">
                <div class="blog-title">{{title}}</div>
                <div class="blog-excerpt">{{excerpt}}</div>
                <a href="{{url}}" class="read-more">Read More →</a>
            </div>
            {{/each}}
        </div>
        <div class="footer">
            <p>© 2024 Swift Solution. All rights reserved.</p>
            <div class="unsubscribe">
                <a href="{{unsubscribe_url}}">Unsubscribe</a> | 
                <a href="{{view_online_url}}">View Online</a>
            </div>
        </div>
    </div>
</body>
</html>`,
        textContent: `Latest Blog Posts\n\n{{#each posts}}{{title}}\n{{excerpt}}\nRead more: {{url}}\n\n{{/each}}---\n© 2024 Swift Solution. All rights reserved.\nUnsubscribe: {{unsubscribe_url}}`,
        previewText: 'Check out our latest blog posts'
      }
    ]
  }

  /**
   * Send a newsletter campaign
   */
  async sendCampaign(options: SendNewsletterOptions): Promise<NewsletterSendResult> {
    try {
      // Get the campaign
      const campaignResult = await NewsletterCampaignsService.getById(options.campaignId)
      if (campaignResult.error || !campaignResult.data) {
        return {
          success: false,
          messageIds: [],
          recipientCount: 0,
          errors: [campaignResult.error || 'Campaign not found']
        }
      }

      const campaign = campaignResult.data

      // If this is a test email
      if (options.testEmail) {
        const testResult = await this.brevoService.sendEmail({
          to: [{ email: options.testEmail }],
          subject: `[TEST] ${campaign.subject}`,
          htmlContent: campaign.content
        })

        return {
          success: testResult.success,
          messageIds: testResult.success ? [testResult.messageId] : [],
          recipientCount: testResult.success ? 1 : 0,
          errors: testResult.error ? [testResult.error] : []
        }
      }

      // Get active subscribers
      const subscribersResult = await NewsletterSubscribersService.getByStatus('active')
      if (subscribersResult.error) {
        return {
          success: false,
          messageIds: [],
          recipientCount: 0,
          errors: [subscribersResult.error]
        }
      }

      const subscribers = subscribersResult.data
      if (subscribers.length === 0) {
        return {
          success: false,
          messageIds: [],
          recipientCount: 0,
          errors: ['No active subscribers found']
        }
      }

      // Prepare recipients with unsubscribe links
      const recipients = await Promise.all(subscribers.map(async subscriber => {
        // Generate unsubscribe link for each subscriber
        let unsubscribeUrl = ''
        try {
          unsubscribeUrl = await this.brevoService.createUnsubscribeLink(subscriber.email, options.campaignId)
        } catch (error) {
          console.warn(`Failed to create unsubscribe link for ${subscriber.email}:`, error)
          // Fallback to generic unsubscribe link
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://swiftsolution.com'
          unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`
        }

        return {
          email: subscriber.email,
          name: subscriber.first_name && subscriber.last_name 
            ? `${subscriber.first_name} ${subscriber.last_name}`
            : subscriber.first_name || subscriber.email,
          unsubscribeUrl,
          source: subscriber.source || 'unknown'
        }
      }))

      // If scheduled, update campaign status
      if (options.scheduleAt) {
        await NewsletterCampaignsService.update(options.campaignId, {
          status: 'scheduled',
          scheduled_at: options.scheduleAt.toISOString()
        })

        return {
          success: true,
          messageIds: [],
          recipientCount: recipients.length,
          errors: []
        }
      }

      // Prepare email content with unsubscribe links
      const emailContent = this.addUnsubscribeLinksToContent(campaign.content, recipients)
      
      // Generate text content from HTML content
      const textContent = this.generateTextContent(emailContent, campaign.subject)

      // Send the newsletter
      const sendResult = await this.brevoService.sendBulkEmailWithUnsubscribe(
        recipients,
        campaign.subject,
        emailContent,
        textContent
      )

      // Update campaign status with source analytics
      if (sendResult.success) {
        await NewsletterCampaignsService.markAsSentWithAnalytics(
          options.campaignId, 
          recipients.length,
          sendResult.recipientsBySource
        )
      } else {
        await NewsletterCampaignsService.markAsFailed(options.campaignId)
      }

      return {
        success: sendResult.success,
        messageIds: sendResult.messageIds,
        recipientCount: recipients.length,
        errors: sendResult.errors,
        recipientsBySource: sendResult.recipientsBySource
      }
    } catch (error) {
      console.error('Error sending newsletter campaign:', error)
      return {
        success: false,
        messageIds: [],
        recipientCount: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }
    }
  }

  /**
   * Process scheduled campaigns
   */
  async processScheduledCampaigns(): Promise<{
    processed: number
    successful: number
    failed: number
    errors: string[]
  }> {
    try {
      const scheduledResult = await NewsletterCampaignsService.getScheduledCampaigns()
      if (scheduledResult.error) {
        return {
          processed: 0,
          successful: 0,
          failed: 0,
          errors: [scheduledResult.error]
        }
      }

      const campaigns = scheduledResult.data
      const results = {
        processed: campaigns.length,
        successful: 0,
        failed: 0,
        errors: [] as string[]
      }

      for (const campaign of campaigns) {
        try {
          const sendResult = await this.sendCampaign({ campaignId: campaign.id })
          if (sendResult.success) {
            results.successful++
          } else {
            results.failed++
            results.errors.push(...sendResult.errors)
          }
        } catch (error) {
          results.failed++
          results.errors.push(error instanceof Error ? error.message : 'Unknown error')
        }
      }

      return results
    } catch (error) {
      console.error('Error processing scheduled campaigns:', error)
      return {
        processed: 0,
        successful: 0,
        failed: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      }
    }
  }

  /**
   * Preview newsletter with template
   */
  static previewNewsletter(
    templateId: string,
    subject: string,
    content: string,
    variables: Record<string, any> = {}
  ): { htmlContent: string; textContent: string; error: string | null } {
    try {
      const templates = NewsletterService.getDefaultTemplates()
      const template = templates.find(t => t.id === templateId)

      if (!template) {
        return {
          htmlContent: '',
          textContent: '',
          error: 'Template not found'
        }
      }

      // Simple template variable replacement
      const defaultVariables = {
        subject,
        content,
        date: new Date().toLocaleDateString(),
        unsubscribe_url: '{{unsubscribe_url}}',
        view_online_url: '{{view_online_url}}',
        ...variables
      }

      let htmlContent = template.htmlContent
      let textContent = template.textContent || ''

      // Replace variables
      Object.entries(defaultVariables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g')
        htmlContent = htmlContent.replace(regex, String(value))
        textContent = textContent.replace(regex, String(value))
      })

      return {
        htmlContent,
        textContent,
        error: null
      }
    } catch (error) {
      console.error('Error previewing newsletter:', error)
      return {
        htmlContent: '',
        textContent: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Add unsubscribe links to email content
   */
  private addUnsubscribeLinksToContent(content: string, recipients: any[]): string {
    // Replace placeholder unsubscribe URLs with actual links
    // This is a simple implementation - in production you might want more sophisticated templating
    let updatedContent = content

    // Ensure unsubscribe links are present in the content
    if (!updatedContent.includes('{{unsubscribe_url}}') && !updatedContent.includes('unsubscribe')) {
      // Add unsubscribe link to the bottom of the email if not present
      const unsubscribeFooter = `
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center; font-size: 12px; color: #6c757d;">
          <p>© 2024 Swift Solution. All rights reserved.</p>
          <p><a href="{{unsubscribe_url}}" style="color: #6c757d; text-decoration: none;">Unsubscribe</a> from our newsletter</p>
        </div>
      `
      updatedContent += unsubscribeFooter
    }

    return updatedContent
  }

  /**
   * Generate plain text content from HTML content
   */
  private generateTextContent(htmlContent: string, subject: string): string {
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

    // Add basic structure
    const textVersion = `${subject}

${textContent}

---
© 2024 Swift Solution. All rights reserved.
Unsubscribe: {{unsubscribe_url}}`

    return textVersion
  }

  /**
   * Test Brevo connection
   */
  async testEmailService(): Promise<{ success: boolean; error: string | null }> {
    try {
      return await this.brevoService.testConnection()
    } catch (error) {
      console.error('Error testing email service:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}
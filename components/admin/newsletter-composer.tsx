'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Eye, 
  Send, 
  Save, 
  Calendar, 
  TestTube,
  Loader2,
  Mail,
  Clock
} from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { NewsletterCampaign } from '@/lib/database/types'

interface NewsletterTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent?: string
  previewText?: string
}

interface NewsletterComposerProps {
  campaign?: NewsletterCampaign
  onSave?: (campaign: NewsletterCampaign) => void
  onSend?: (campaign: NewsletterCampaign) => void
}

export function NewsletterComposer({ campaign, onSave, onSend }: NewsletterComposerProps) {
  const [subject, setSubject] = useState(campaign?.subject || '')
  const [content, setContent] = useState(campaign?.content || '')
  const [templateId, setTemplateId] = useState('basic')
  const [templates, setTemplates] = useState<NewsletterTemplate[]>([])
  const [previewHtml, setPreviewHtml] = useState('')
  const [previewText, setPreviewText] = useState('')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false)
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [])

  useEffect(() => {
    if (subject || content) {
      generatePreview()
    }
  }, [subject, content, templateId])

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/admin/newsletter/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Error loading templates:', error)
    }
  }

  const generatePreview = async () => {
    if (!subject && !content) return

    try {
      const response = await fetch('/api/admin/newsletter/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          subject,
          content
        })
      })

      if (response.ok) {
        const data = await response.json()
        setPreviewHtml(data.htmlContent)
        setPreviewText(data.textContent)
      }
    } catch (error) {
      console.error('Error generating preview:', error)
    }
  }

  const handleSave = async (status: 'draft' | 'scheduled' = 'draft') => {
    if (!subject.trim() || !content.trim()) {
      toast({
        title: 'Error',
        description: 'Subject and content are required',
        variant: 'destructive'
      })
      return
    }

    try {
      setSaving(true)
      
      const campaignData = {
        subject: subject.trim(),
        content: previewHtml,
        template_id: templateId,
        status,
        ...(status === 'scheduled' && scheduledDate && scheduledTime ? {
          scheduled_at: new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
        } : {})
      }

      const url = campaign 
        ? `/api/admin/newsletter/campaigns/${campaign.id}`
        : '/api/admin/newsletter/campaigns'
      
      const method = campaign ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save campaign')
      }

      const data = await response.json()
      
      toast({
        title: 'Success',
        description: status === 'scheduled' ? 'Newsletter scheduled successfully' : 'Newsletter saved successfully'
      })

      if (onSave) {
        onSave(data.campaign)
      }

      if (status === 'scheduled') {
        setIsScheduleDialogOpen(false)
      }
    } catch (error) {
      console.error('Error saving campaign:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save newsletter',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleSendTest = async () => {
    if (!testEmail.trim()) {
      toast({
        title: 'Error',
        description: 'Test email address is required',
        variant: 'destructive'
      })
      return
    }

    if (!subject.trim() || !content.trim()) {
      toast({
        title: 'Error',
        description: 'Subject and content are required',
        variant: 'destructive'
      })
      return
    }

    try {
      setLoading(true)

      // First save as draft if not already saved
      let campaignId = campaign?.id
      if (!campaignId) {
        const saveResponse = await fetch('/api/admin/newsletter/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: subject.trim(),
            content: previewHtml,
            template_id: templateId,
            status: 'draft'
          })
        })

        if (!saveResponse.ok) {
          throw new Error('Failed to save campaign')
        }

        const saveData = await saveResponse.json()
        campaignId = saveData.campaign.id
      }

      // Send test email
      const response = await fetch('/api/admin/newsletter/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          testEmail: testEmail.trim()
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to send test email')
      }

      toast({
        title: 'Success',
        description: `Test email sent to ${testEmail}`
      })

      setIsTestDialogOpen(false)
      setTestEmail('')
    } catch (error) {
      console.error('Error sending test email:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send test email',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSendNow = async () => {
    if (!confirm('Are you sure you want to send this newsletter to all active subscribers?')) {
      return
    }

    try {
      setLoading(true)

      // First save the campaign
      let campaignId = campaign?.id
      if (!campaignId) {
        const saveResponse = await fetch('/api/admin/newsletter/campaigns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: subject.trim(),
            content: previewHtml,
            template_id: templateId,
            status: 'draft'
          })
        })

        if (!saveResponse.ok) {
          throw new Error('Failed to save campaign')
        }

        const saveData = await saveResponse.json()
        campaignId = saveData.campaign.id
      }

      // Send newsletter
      const response = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to send newsletter')
      }

      const data = await response.json()

      toast({
        title: 'Success',
        description: `Newsletter sent to ${data.recipientCount} subscribers`
      })

      if (onSend && campaign) {
        onSend({ ...campaign, status: 'sent' })
      }
    } catch (error) {
      console.error('Error sending newsletter:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send newsletter',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSchedule = () => {
    if (!scheduledDate || !scheduledTime) {
      toast({
        title: 'Error',
        description: 'Please select both date and time',
        variant: 'destructive'
      })
      return
    }

    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`)
    if (scheduledDateTime <= new Date()) {
      toast({
        title: 'Error',
        description: 'Scheduled time must be in the future',
        variant: 'destructive'
      })
      return
    }

    handleSave('scheduled')
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Newsletter Composer</CardTitle>
              <CardDescription>
                Create and send newsletters to your subscribers
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Newsletter Preview</DialogTitle>
                    <DialogDescription>
                      Preview how your newsletter will look to subscribers
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="html" className="w-full">
                    <TabsList>
                      <TabsTrigger value="html">HTML Preview</TabsTrigger>
                      <TabsTrigger value="text">Text Version</TabsTrigger>
                    </TabsList>
                    <TabsContent value="html" className="mt-4">
                      <div 
                        className="border rounded-lg p-4 bg-white"
                        dangerouslySetInnerHTML={{ __html: previewHtml }}
                      />
                    </TabsContent>
                    <TabsContent value="text" className="mt-4">
                      <pre className="whitespace-pre-wrap border rounded-lg p-4 bg-gray-50 text-sm">
                        {previewText}
                      </pre>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="sm" onClick={() => handleSave('draft')} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save Draft
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic Newsletter</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="blog-digest">Blog Digest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subject Line */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject Line</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter newsletter subject..."
              className="text-lg"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your newsletter content here..."
              className="min-h-[300px] resize-y"
            />
            <p className="text-sm text-muted-foreground">
              You can use HTML tags for formatting. The content will be inserted into the selected template.
            </p>
          </div>

          {/* Campaign Status */}
          {campaign && (
            <div className="flex items-center gap-2">
              <Label>Status:</Label>
              <Badge variant={
                campaign.status === 'sent' ? 'default' :
                campaign.status === 'scheduled' ? 'secondary' :
                campaign.status === 'failed' ? 'destructive' : 'outline'
              }>
                {campaign.status}
              </Badge>
              {campaign.scheduled_at && (
                <span className="text-sm text-muted-foreground">
                  Scheduled for {new Date(campaign.scheduled_at).toLocaleString()}
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <TestTube className="h-4 w-4 mr-2" />
                  Send Test
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Test Email</DialogTitle>
                  <DialogDescription>
                    Send a test version of this newsletter to verify how it looks
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="testEmail">Test Email Address</Label>
                    <Input
                      id="testEmail"
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="test@example.com"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsTestDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSendTest} disabled={loading}>
                      {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
                      Send Test
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Schedule Newsletter</DialogTitle>
                  <DialogDescription>
                    Choose when to send this newsletter to all active subscribers
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="scheduledDate">Date</Label>
                      <Input
                        id="scheduledDate"
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label htmlFor="scheduledTime">Time</Label>
                      <Input
                        id="scheduledTime"
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSchedule} disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Clock className="h-4 w-4 mr-2" />}
                      Schedule
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={handleSendNow} disabled={loading || !subject.trim() || !content.trim()}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Send Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
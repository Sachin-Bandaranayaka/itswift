'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Send, 
  Calendar, 
  Image, 
  X, 
  AlertCircle, 
  CheckCircle,
  Linkedin,
  Twitter,
  Eye,
  Edit
} from "lucide-react"
import { SocialPostInput } from '@/lib/database/types'
import { SocialPostPreview } from './social-post-preview'
import { MediaUpload } from './media-upload'

interface SocialPostComposerProps {
  onSave?: (post: SocialPostInput) => void
  onSchedule?: (post: SocialPostInput) => void
  initialData?: Partial<SocialPostInput>
  isLoading?: boolean
}

interface PlatformLimits {
  maxLength: number
  name: string
  icon: React.ReactNode
  color: string
}

const PLATFORM_LIMITS: Record<'linkedin' | 'twitter', PlatformLimits> = {
  linkedin: {
    maxLength: 3000,
    name: 'LinkedIn',
    icon: <Linkedin className="h-4 w-4" />,
    color: 'bg-blue-600'
  },
  twitter: {
    maxLength: 280,
    name: 'Twitter/X',
    icon: <Twitter className="h-4 w-4" />,
    color: 'bg-black'
  }
}

export function SocialPostComposer({ 
  onSave, 
  onSchedule, 
  initialData,
  isLoading = false 
}: SocialPostComposerProps) {
  const [platform, setPlatform] = useState<'linkedin' | 'twitter'>(
    initialData?.platform || 'linkedin'
  )
  const [content, setContent] = useState(initialData?.content || '')
  const [mediaUrls, setMediaUrls] = useState<string[]>(initialData?.media_urls || [])
  const [newMediaUrl, setNewMediaUrl] = useState('')
  const [scheduledAt, setScheduledAt] = useState(initialData?.scheduled_at || '')
  const [errors, setErrors] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'compose' | 'preview'>('compose')

  const currentPlatform = PLATFORM_LIMITS[platform]
  const characterCount = content.length
  const isOverLimit = characterCount > currentPlatform.maxLength
  const remainingChars = currentPlatform.maxLength - characterCount

  // Validate form
  const validateForm = (): string[] => {
    const newErrors: string[] = []
    
    if (!content.trim()) {
      newErrors.push('Content is required')
    }
    
    if (isOverLimit) {
      newErrors.push(`Content exceeds ${currentPlatform.name} character limit`)
    }
    
    // Validate media URLs
    mediaUrls.forEach((url, index) => {
      try {
        new URL(url)
      } catch {
        newErrors.push(`Media URL ${index + 1} is not valid`)
      }
    })
    
    return newErrors
  }

  // Update errors when form changes
  useEffect(() => {
    setErrors(validateForm())
  }, [content, platform, mediaUrls])

  const handleAddMediaUrl = () => {
    if (newMediaUrl.trim()) {
      try {
        new URL(newMediaUrl)
        setMediaUrls([...mediaUrls, newMediaUrl.trim()])
        setNewMediaUrl('')
      } catch {
        setErrors(['Invalid media URL'])
      }
    }
  }

  const handleRemoveMediaUrl = (index: number) => {
    setMediaUrls(mediaUrls.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    const formErrors = validateForm()
    if (formErrors.length > 0) {
      setErrors(formErrors)
      return
    }

    const postData: SocialPostInput = {
      platform,
      content: content.trim(),
      media_urls: mediaUrls.length > 0 ? mediaUrls : undefined,
      status: 'draft'
    }

    onSave?.(postData)
  }

  const handleSchedule = async () => {
    const formErrors = validateForm()
    if (formErrors.length > 0) {
      setErrors(formErrors)
      return
    }

    if (!scheduledAt) {
      setErrors(['Scheduled date and time is required'])
      return
    }

    try {
      const response = await fetch('/api/social/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          platforms: [platform],
          scheduledAt: scheduledAt,
          mediaUrls: mediaUrls.filter(url => url.trim() !== ''),
          action: 'schedule'
        }),
      })

      const result = await response.json()

      if (result.success) {
        const postData: SocialPostInput = {
          platform,
          content: content.trim(),
          media_urls: mediaUrls.length > 0 ? mediaUrls : undefined,
          scheduled_at: scheduledAt,
          status: 'scheduled'
        }
        onSchedule?.(postData)
      } else {
        setErrors([result.error || 'Failed to schedule post'])
      }
    } catch (error) {
      console.error('Schedule error:', error)
      setErrors(['Failed to schedule post'])
    }
  }

  const handlePublishNow = async () => {
    const formErrors = validateForm()
    if (formErrors.length > 0) {
      setErrors(formErrors)
      return
    }

    try {
      const response = await fetch('/api/social/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          platforms: [platform],
          mediaUrls: mediaUrls.filter(url => url.trim() !== ''),
          action: 'publish'
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Reset form
        setContent('')
        setMediaUrls([])
        setScheduledAt('')
      } else {
        setErrors([result.error || 'Failed to publish post'])
      }
    } catch (error) {
      console.error('Publish error:', error)
      setErrors(['Failed to publish post'])
    }
  }

  const getPlatformSpecificPlaceholder = () => {
    switch (platform) {
      case 'linkedin':
        return 'Share your professional insights, industry updates, or company news...'
      case 'twitter':
        return 'What\'s happening? Share a quick update, thought, or link...'
      default:
        return 'Write your post content here...'
    }
  }

  const getPlatformSpecificTips = () => {
    switch (platform) {
      case 'linkedin':
        return [
          'Use professional tone and industry-relevant hashtags',
          'Include questions to encourage engagement',
          'Share valuable insights or experiences',
          'Tag relevant people or companies with @mentions'
        ]
      case 'twitter':
        return [
          'Keep it concise and engaging',
          'Use relevant hashtags (2-3 max)',
          'Include emojis for personality',
          'Consider threading for longer thoughts'
        ]
      default:
        return []
    }
  }

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Social Media Post Composer
        </CardTitle>
        <CardDescription>
          Create and schedule posts for your social media platforms
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Compose/Preview Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'compose' | 'preview')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compose" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Compose
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="compose" className="space-y-6 mt-6">
        {/* Platform Selection */}
        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <Tabs value={platform} onValueChange={(value) => setPlatform(value as 'linkedin' | 'twitter')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </TabsTrigger>
              <TabsTrigger value="twitter" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" />
                Twitter/X
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="content">Content</Label>
            <div className="flex items-center gap-2">
              <Badge 
                variant={isOverLimit ? "destructive" : remainingChars < 50 ? "secondary" : "outline"}
                className="text-xs"
              >
                {characterCount}/{currentPlatform.maxLength}
              </Badge>
              {remainingChars >= 0 && (
                <span className="text-xs text-muted-foreground">
                  {remainingChars} remaining
                </span>
              )}
            </div>
          </div>
          <Textarea
            id="content"
            placeholder={getPlatformSpecificPlaceholder()}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`min-h-[120px] resize-none ${isOverLimit ? 'border-red-500' : ''}`}
            disabled={isLoading}
          />
          
          {/* Platform-specific tips */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium">Tips for {currentPlatform.name}:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              {getPlatformSpecificTips().map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Media */}
        <div className="space-y-2">
          <Label>Media (optional)</Label>
          <MediaUpload
             onUpload={(url: string) => {
               setMediaUrls([...mediaUrls, url])
             }}
             maxFiles={5 - mediaUrls.length}
           />
          
          {mediaUrls.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Added media:</p>
              {mediaUrls.map((url, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <Image className="h-4 w-4" />
                  <span className="text-sm flex-1 truncate">{url}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMediaUrl(index)}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <Input
              placeholder="Or add media URL manually"
              value={newMediaUrl}
              onChange={(e) => setNewMediaUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddMediaUrl()}
              disabled={isLoading}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddMediaUrl}
              disabled={!newMediaUrl.trim() || isLoading}
            >
              <Image className="h-4 w-4 mr-2" />
              Add URL
            </Button>
          </div>
        </div>

        {/* Scheduling */}
        <div className="space-y-2">
          <Label htmlFor="scheduled-at">Schedule for later (optional)</Label>
          <Input
            id="scheduled-at"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Leave empty to save as draft. Set a future date to schedule the post.
          </p>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Separator />

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={errors.length > 0 || isLoading}
              >
                Save Draft
              </Button>
              <Button
                variant="outline"
                onClick={handlePublishNow}
                disabled={errors.length > 0 || isLoading}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Publish Now
              </Button>
              <Button
                onClick={handleSchedule}
                disabled={errors.length > 0 || isLoading}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                {scheduledAt ? 'Schedule Post' : 'Save & Schedule'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Platform Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  {currentPlatform.icon}
                  {currentPlatform.name} Preview
                </h3>
                <SocialPostPreview
                  platform={platform}
                  content={content}
                  mediaUrls={mediaUrls}
                  scheduledAt={scheduledAt}
                />
              </div>

              {/* Other Platform Preview */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  {platform === 'linkedin' ? (
                    <>
                      <Twitter className="h-4 w-4" />
                      Twitter/X Preview
                    </>
                  ) : (
                    <>
                      <Linkedin className="h-4 w-4" />
                      LinkedIn Preview
                    </>
                  )}
                </h3>
                <SocialPostPreview
                  platform={platform === 'linkedin' ? 'twitter' : 'linkedin'}
                  content={content}
                  mediaUrls={mediaUrls}
                  scheduledAt={scheduledAt}
                />
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> This is how your content would look on {platform === 'linkedin' ? 'Twitter/X' : 'LinkedIn'}. 
                    Character limits and formatting may differ.
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setActiveTab('compose')}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Post
              </Button>
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={errors.length > 0 || isLoading}
              >
                Save Draft
              </Button>
              <Button
                variant="outline"
                onClick={handlePublishNow}
                disabled={errors.length > 0 || isLoading}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Publish Now
              </Button>
              <Button
                onClick={handleSchedule}
                disabled={errors.length > 0 || isLoading}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                {scheduledAt ? 'Schedule Post' : 'Save & Schedule'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
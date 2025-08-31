'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Upload,
  Download,
  Zap,
  AlertCircle,
  CheckCircle,
  Linkedin,
  Twitter
} from "lucide-react"
import { SocialPostInput } from '@/lib/database/types'
import { format, addDays, addHours } from 'date-fns'

interface BulkSchedulerProps {
  onSchedulePosts?: (posts: SocialPostInput[]) => Promise<void>
  isLoading?: boolean
  className?: string
}

interface BulkPost {
  id: string
  content: string
  platform: 'linkedin' | 'twitter'
  scheduledAt: string
  mediaUrls: string[]
  errors: string[]
}

interface SchedulingPattern {
  type: 'daily' | 'weekly' | 'custom'
  interval: number
  startDate: string
  startTime: string
  days?: number[] // For weekly pattern (0 = Sunday, 1 = Monday, etc.)
}

export function BulkScheduler({ 
  onSchedulePosts, 
  isLoading = false,
  className 
}: BulkSchedulerProps) {
  const [posts, setPosts] = useState<BulkPost[]>([])
  const [schedulingPattern, setSchedulingPattern] = useState<SchedulingPattern>({
    type: 'daily',
    interval: 1,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    days: [1, 2, 3, 4, 5] // Weekdays by default
  })
  const [useOptimalTiming, setUseOptimalTiming] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const addPost = () => {
    const newPost: BulkPost = {
      id: Date.now().toString(),
      content: '',
      platform: 'linkedin',
      scheduledAt: '',
      mediaUrls: [],
      errors: []
    }
    setPosts([...posts, newPost])
  }

  const removePost = (id: string) => {
    setPosts(posts.filter(post => post.id !== id))
  }

  const updatePost = (id: string, updates: Partial<BulkPost>) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, ...updates } : post
    ))
  }

  const validatePost = (post: BulkPost): string[] => {
    const errors: string[] = []
    
    if (!post.content.trim()) {
      errors.push('Content is required')
    }
    
    if (post.platform === 'twitter' && post.content.length > 280) {
      errors.push('Twitter posts cannot exceed 280 characters')
    }
    
    if (post.platform === 'linkedin' && post.content.length > 3000) {
      errors.push('LinkedIn posts cannot exceed 3000 characters')
    }
    
    post.mediaUrls.forEach((url, index) => {
      try {
        new URL(url)
      } catch {
        errors.push(`Media URL ${index + 1} is not valid`)
      }
    })
    
    return errors
  }

  const generateScheduleTimes = (): Date[] => {
    const times: Date[] = []
    const startDateTime = new Date(`${schedulingPattern.startDate}T${schedulingPattern.startTime}`)
    
    if (useOptimalTiming) {
      // Use predefined optimal times
      const optimalTimes = schedulingPattern.type === 'daily' 
        ? ['09:00', '12:00', '15:00', '18:00']
        : ['09:00', '12:00', '17:00']
      
      for (let i = 0; i < posts.length; i++) {
        const dayOffset = Math.floor(i / optimalTimes.length) * schedulingPattern.interval
        const timeIndex = i % optimalTimes.length
        const scheduleDate = addDays(startDateTime, dayOffset)
        const [hours, minutes] = optimalTimes[timeIndex].split(':').map(Number)
        scheduleDate.setHours(hours, minutes, 0, 0)
        times.push(scheduleDate)
      }
    } else {
      // Use custom pattern
      for (let i = 0; i < posts.length; i++) {
        let scheduleDate: Date
        
        if (schedulingPattern.type === 'daily') {
          scheduleDate = addDays(startDateTime, i * schedulingPattern.interval)
        } else if (schedulingPattern.type === 'weekly') {
          const weekOffset = Math.floor(i / (schedulingPattern.days?.length || 1))
          const dayIndex = i % (schedulingPattern.days?.length || 1)
          const targetDay = schedulingPattern.days?.[dayIndex] || 1
          
          scheduleDate = addDays(startDateTime, weekOffset * 7)
          const currentDay = scheduleDate.getDay()
          const daysToAdd = (targetDay - currentDay + 7) % 7
          scheduleDate = addDays(scheduleDate, daysToAdd)
        } else {
          // Custom interval in hours
          scheduleDate = addHours(startDateTime, i * schedulingPattern.interval)
        }
        
        times.push(scheduleDate)
      }
    }
    
    return times
  }

  const applyScheduling = () => {
    const scheduleTimes = generateScheduleTimes()
    const updatedPosts = posts.map((post, index) => ({
      ...post,
      scheduledAt: scheduleTimes[index]?.toISOString().slice(0, 16) || '',
      errors: validatePost(post)
    }))
    
    setPosts(updatedPosts)
    
    // Check for global errors
    const globalErrors: string[] = []
    if (posts.length === 0) {
      globalErrors.push('Add at least one post to schedule')
    }
    
    setErrors(globalErrors)
  }

  const handleScheduleAll = async () => {
    // Validate all posts
    const validatedPosts = posts.map(post => ({
      ...post,
      errors: validatePost(post)
    }))
    
    setPosts(validatedPosts)
    
    const hasErrors = validatedPosts.some(post => post.errors.length > 0)
    if (hasErrors || errors.length > 0) {
      return
    }
    
    // Convert to SocialPostInput format
    const socialPosts: SocialPostInput[] = validatedPosts.map(post => ({
      platform: post.platform,
      content: post.content,
      media_urls: post.mediaUrls.length > 0 ? post.mediaUrls : undefined,
      scheduled_at: post.scheduledAt,
      status: 'scheduled'
    }))
    
    try {
      await onSchedulePosts?.(socialPosts)
      // Clear posts after successful scheduling
      setPosts([])
      setErrors([])
    } catch (error) {
      setErrors(['Failed to schedule posts. Please try again.'])
    }
  }

  const importFromCSV = () => {
    // Placeholder for CSV import functionality
    alert('CSV import functionality would be implemented here')
  }

  const exportTemplate = () => {
    // Create a CSV template
    const csvContent = 'platform,content,media_urls\nlinkedin,"Your post content here",""\ntwitter,"Your tweet here",""'
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bulk-posts-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getPlatformIcon = (platform: 'linkedin' | 'twitter') => {
    return platform === 'linkedin' ? (
      <Linkedin className="h-4 w-4 text-blue-600" />
    ) : (
      <Twitter className="h-4 w-4 text-black dark:text-white" />
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Bulk Scheduler
        </CardTitle>
        <CardDescription>
          Schedule multiple posts at once with automated timing patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Import/Export */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={importFromCSV}>
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" size="sm" onClick={exportTemplate}>
            <Download className="h-4 w-4 mr-2" />
            Export Template
          </Button>
        </div>

        {/* Scheduling Pattern */}
        <div className="space-y-4">
          <h4 className="font-medium">Scheduling Pattern</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pattern Type</Label>
              <Select 
                value={schedulingPattern.type} 
                onValueChange={(value) => setSchedulingPattern({
                  ...schedulingPattern, 
                  type: value as 'daily' | 'weekly' | 'custom'
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="custom">Custom Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Interval</Label>
              <Input
                type="number"
                min="1"
                value={schedulingPattern.interval}
                onChange={(e) => setSchedulingPattern({
                  ...schedulingPattern,
                  interval: parseInt(e.target.value) || 1
                })}
                placeholder={schedulingPattern.type === 'custom' ? 'Hours' : 'Days'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={schedulingPattern.startDate}
                onChange={(e) => setSchedulingPattern({
                  ...schedulingPattern,
                  startDate: e.target.value
                })}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={schedulingPattern.startTime}
                onChange={(e) => setSchedulingPattern({
                  ...schedulingPattern,
                  startTime: e.target.value
                })}
              />
            </div>
          </div>

          {schedulingPattern.type === 'weekly' && (
            <div className="space-y-2">
              <Label>Days of Week</Label>
              <div className="flex gap-2 flex-wrap">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${index}`}
                      checked={schedulingPattern.days?.includes(index)}
                      onCheckedChange={(checked) => {
                        const days = schedulingPattern.days || []
                        if (checked) {
                          setSchedulingPattern({
                            ...schedulingPattern,
                            days: [...days, index].sort()
                          })
                        } else {
                          setSchedulingPattern({
                            ...schedulingPattern,
                            days: days.filter(d => d !== index)
                          })
                        }
                      }}
                    />
                    <Label htmlFor={`day-${index}`} className="text-sm">{day}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="optimal-timing"
              checked={useOptimalTiming}
              onCheckedChange={setUseOptimalTiming}
            />
            <Label htmlFor="optimal-timing" className="text-sm">
              Use optimal timing suggestions
            </Label>
          </div>
        </div>

        <Separator />

        {/* Posts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Posts ({posts.length})</h4>
            <Button onClick={addPost} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Post
            </Button>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No posts added yet</p>
              <p className="text-sm">Add posts to schedule them in bulk</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post, index) => (
                <Card key={post.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Post {index + 1}</span>
                        {post.scheduledAt && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {format(new Date(post.scheduledAt), 'MMM d, h:mm a')}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePost(post.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Platform</Label>
                        <Select 
                          value={post.platform} 
                          onValueChange={(value) => updatePost(post.id, { 
                            platform: value as 'linkedin' | 'twitter' 
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="linkedin">
                              <div className="flex items-center gap-2">
                                <Linkedin className="h-4 w-4 text-blue-600" />
                                LinkedIn
                              </div>
                            </SelectItem>
                            <SelectItem value="twitter">
                              <div className="flex items-center gap-2">
                                <Twitter className="h-4 w-4" />
                                Twitter/X
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Content</Label>
                          <span className="text-xs text-muted-foreground">
                            {post.content.length}/{post.platform === 'twitter' ? 280 : 3000}
                          </span>
                        </div>
                        <Textarea
                          value={post.content}
                          onChange={(e) => updatePost(post.id, { content: e.target.value })}
                          placeholder={`Write your ${post.platform} post here...`}
                          className="min-h-[80px]"
                        />
                      </div>
                    </div>

                    {post.errors.length > 0 && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <ul className="list-disc list-inside space-y-1">
                            {post.errors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

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
            onClick={applyScheduling}
            disabled={posts.length === 0}
          >
            <Zap className="h-4 w-4 mr-2" />
            Apply Scheduling
          </Button>
          <Button
            onClick={handleScheduleAll}
            disabled={posts.length === 0 || isLoading}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Schedule All Posts
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
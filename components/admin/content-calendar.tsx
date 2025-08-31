'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Linkedin, 
  Twitter, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Mail,
  FileText,
  GripVertical,
  Save,
  X
} from "lucide-react"
import { SocialPost, NewsletterCampaign } from '@/lib/database/types'
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns'

// Blog post interface (from Sanity)
interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  publishedAt?: string
  _updatedAt: string
  status?: 'draft' | 'published'
}

interface ContentCalendarProps {
  posts: SocialPost[]
  newsletters?: NewsletterCampaign[]
  blogPosts?: BlogPost[]
  isLoading?: boolean
  onEditPost?: (post: SocialPost) => void
  onDeletePost?: (postId: string) => void
  onViewPost?: (post: SocialPost) => void
  onEditNewsletter?: (newsletter: NewsletterCampaign) => void
  onDeleteNewsletter?: (newsletterId: string) => void
  onViewNewsletter?: (newsletter: NewsletterCampaign) => void
  onEditBlogPost?: (blogPost: BlogPost) => void
  onViewBlogPost?: (blogPost: BlogPost) => void
  onRescheduleContent?: (contentId: string, contentType: 'social' | 'newsletter' | 'blog', newDate: Date) => void
  onRefresh?: () => void
}

interface CalendarEvent {
  id: string
  title: string
  contentType: 'social' | 'newsletter' | 'blog'
  platform?: 'linkedin' | 'twitter' | 'email' | 'blog'
  status: string
  scheduledAt: Date
  content: string
  originalData: SocialPost | NewsletterCampaign | BlogPost
}

export function ContentCalendar({ 
  posts, 
  newsletters = [],
  blogPosts = [],
  isLoading = false, 
  onEditPost, 
  onDeletePost, 
  onViewPost,
  onEditNewsletter,
  onDeleteNewsletter,
  onViewNewsletter,
  onEditBlogPost,
  onViewBlogPost,
  onRescheduleContent,
  onRefresh 
}: ContentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month')
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all')
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([])
  const [isDayDialogOpen, setIsDayDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null)

  // Convert all content to calendar events
  const calendarEvents: CalendarEvent[] = [
    // Social posts
    ...posts
      .filter(post => post.scheduled_at)
      .map(post => ({
        id: post.id,
        title: post.content.substring(0, 50) + (post.content.length > 50 ? '...' : ''),
        contentType: 'social' as const,
        platform: post.platform,
        status: post.status,
        scheduledAt: parseISO(post.scheduled_at!),
        content: post.content,
        originalData: post
      })),
    
    // Newsletter campaigns
    ...newsletters
      .filter(newsletter => newsletter.scheduled_at)
      .map(newsletter => ({
        id: newsletter.id,
        title: newsletter.subject,
        contentType: 'newsletter' as const,
        platform: 'email' as const,
        status: newsletter.status,
        scheduledAt: parseISO(newsletter.scheduled_at!),
        content: newsletter.subject,
        originalData: newsletter
      })),
    
    // Blog posts
    ...blogPosts
      .filter(blog => blog.publishedAt)
      .map(blog => ({
        id: blog._id,
        title: blog.title,
        contentType: 'blog' as const,
        platform: 'blog' as const,
        status: blog.status || 'published',
        scheduledAt: parseISO(blog.publishedAt!),
        content: blog.title,
        originalData: blog
      }))
  ]
  .filter(event => contentTypeFilter === 'all' || event.contentType === contentTypeFilter)
  .filter(event => platformFilter === 'all' || event.platform === platformFilter)
  .filter(event => statusFilter === 'all' || event.status === statusFilter)

  // Get events for a specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return calendarEvents.filter(event => isSameDay(event.scheduledAt, date))
  }

  // Get dates that have events
  const getDatesWithEvents = (): Date[] => {
    return calendarEvents.map(event => event.scheduledAt)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return
    
    setSelectedDate(date)
    const dayEvents = getEventsForDate(date)
    setSelectedDayEvents(dayEvents)
    
    if (dayEvents.length > 0) {
      setIsDayDialogOpen(true)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className="h-3 w-3 text-blue-600" />
      case 'twitter':
        return <Twitter className="h-3 w-3 text-black dark:text-white" />
      case 'email':
        return <Mail className="h-3 w-3 text-green-600" />
      case 'blog':
        return <FileText className="h-3 w-3 text-purple-600" />
      default:
        return <FileText className="h-3 w-3 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      draft: { variant: 'secondary', label: 'Draft' },
      scheduled: { variant: 'default', label: 'Scheduled' },
      published: { variant: 'outline', label: 'Published' },
      sent: { variant: 'outline', label: 'Sent' },
      failed: { variant: 'destructive', label: 'Failed' }
    }

    const config = statusConfig[status] || { variant: 'secondary', label: status }
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    )
  }

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a')
  }

  // Handle drag and drop
  const handleDragStart = (event: CalendarEvent) => {
    setDraggedEvent(event)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (date: Date) => {
    if (draggedEvent && onRescheduleContent) {
      onRescheduleContent(draggedEvent.id, draggedEvent.contentType, date)
      setDraggedEvent(null)
    }
  }

  // Handle event editing
  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingEvent) return

    // Call appropriate edit handler based on content type
    switch (editingEvent.contentType) {
      case 'social':
        onEditPost?.(editingEvent.originalData as SocialPost)
        break
      case 'newsletter':
        onEditNewsletter?.(editingEvent.originalData as NewsletterCampaign)
        break
      case 'blog':
        onEditBlogPost?.(editingEvent.originalData as BlogPost)
        break
    }

    setIsEditDialogOpen(false)
    setEditingEvent(null)
  }

  // Custom day content to show event indicators
  const renderDayContent = (date: Date) => {
    const dayEvents = getEventsForDate(date)
    const hasEvents = dayEvents.length > 0
    
    return (
      <div 
        className="relative w-full h-full flex items-center justify-center"
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(date)}
      >
        <span>{date.getDate()}</span>
        {hasEvents && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5">
            {dayEvents.slice(0, 3).map((event, index) => {
              let colorClass = 'bg-gray-400'
              switch (event.platform) {
                case 'linkedin':
                  colorClass = 'bg-blue-600'
                  break
                case 'twitter':
                  colorClass = 'bg-black dark:bg-white'
                  break
                case 'email':
                  colorClass = 'bg-green-600'
                  break
                case 'blog':
                  colorClass = 'bg-purple-600'
                  break
              }
              
              return (
                <div
                  key={index}
                  className={`w-1 h-1 rounded-full ${colorClass}`}
                />
              )
            })}
            {dayEvents.length > 3 && (
              <div className="w-1 h-1 rounded-full bg-gray-400" />
            )}
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Content Calendar
          </CardTitle>
          <CardDescription>Loading calendar...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Content Calendar
              </CardTitle>
              <CardDescription>
                View and manage your scheduled content across platforms
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Content</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="newsletter">Newsletters</SelectItem>
                <SelectItem value="blog">Blog Posts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Calendar */}
          <div className="border rounded-lg p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              modifiers={{
                hasEvents: getDatesWithEvents()
              }}
              modifiersStyles={{
                hasEvents: { fontWeight: 'bold' }
              }}
              components={{
                DayContent: ({ date }) => renderDayContent(date)
              }}
              className="w-full"
            />
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600" />
              <span>LinkedIn</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-black dark:bg-white" />
              <span>Twitter/X</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600" />
              <span>Email</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-600" />
              <span>Blog</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>More content</span>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {calendarEvents.filter(e => e.platform === 'linkedin').length}
              </div>
              <div className="text-sm text-muted-foreground">LinkedIn</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-black dark:text-white">
                {calendarEvents.filter(e => e.platform === 'twitter').length}
              </div>
              <div className="text-sm text-muted-foreground">Twitter</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {calendarEvents.filter(e => e.platform === 'email').length}
              </div>
              <div className="text-sm text-muted-foreground">Newsletters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {calendarEvents.filter(e => e.platform === 'blog').length}
              </div>
              <div className="text-sm text-muted-foreground">Blog Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {calendarEvents.filter(e => e.status === 'scheduled').length}
              </div>
              <div className="text-sm text-muted-foreground">Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {calendarEvents.filter(e => ['published', 'sent'].includes(e.status)).length}
              </div>
              <div className="text-sm text-muted-foreground">Published</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Events Dialog */}
      <Dialog open={isDayDialogOpen} onOpenChange={setIsDayDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4">
              {selectedDayEvents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No content scheduled for this day
                </p>
              ) : (
                selectedDayEvents.map((event) => (
                  <Card 
                    key={event.id} 
                    className="p-4 cursor-move hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={() => handleDragStart(event)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground mt-1" />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            {getPlatformIcon(event.platform!)}
                            <span className="font-medium capitalize">{event.contentType}</span>
                            <span className="text-sm text-muted-foreground">({event.platform})</span>
                            {getStatusBadge(event.status)}
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatTime(event.scheduledAt)}
                            </div>
                          </div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {event.content}
                          </p>
                          {event.contentType === 'social' && (event.originalData as SocialPost).media_urls && (event.originalData as SocialPost).media_urls!.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {(event.originalData as SocialPost).media_urls!.length} media file{(event.originalData as SocialPost).media_urls!.length > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            switch (event.contentType) {
                              case 'social':
                                onViewPost?.(event.originalData as SocialPost)
                                break
                              case 'newsletter':
                                onViewNewsletter?.(event.originalData as NewsletterCampaign)
                                break
                              case 'blog':
                                onViewBlogPost?.(event.originalData as BlogPost)
                                break
                            }
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {event.contentType !== 'blog' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (event.contentType === 'social') {
                                onDeletePost?.(event.id)
                              } else if (event.contentType === 'newsletter') {
                                onDeleteNewsletter?.(event.id)
                              }
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit {editingEvent?.contentType} Content
            </DialogTitle>
          </DialogHeader>
          {editingEvent && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getPlatformIcon(editingEvent.platform!)}
                  <span className="font-medium capitalize">{editingEvent.contentType}</span>
                  <span className="text-sm text-muted-foreground">({editingEvent.platform})</span>
                  {getStatusBadge(editingEvent.status)}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({
                      ...editingEvent,
                      title: e.target.value
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-content">Content</Label>
                  <Textarea
                    id="edit-content"
                    value={editingEvent.content}
                    onChange={(e) => setEditingEvent({
                      ...editingEvent,
                      content: e.target.value
                    })}
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-scheduled-at">Scheduled Date & Time</Label>
                  <Input
                    id="edit-scheduled-at"
                    type="datetime-local"
                    value={format(editingEvent.scheduledAt, "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) => setEditingEvent({
                      ...editingEvent,
                      scheduledAt: new Date(e.target.value)
                    })}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
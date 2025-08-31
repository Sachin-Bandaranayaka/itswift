'use client'

import { useState } from 'react'
import { ContentCalendar } from '@/components/admin/content-calendar'
import { useContentCalendar } from '@/hooks/use-content-calendar'
import { SocialPost, NewsletterCampaign } from '@/lib/database/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar as CalendarIcon, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  publishedAt?: string
  _updatedAt: string
  status?: 'draft' | 'published'
}

export default function CalendarPage() {
  const { toast } = useToast()
  const [filters, setFilters] = useState({
    contentType: 'all',
    platform: 'all',
    status: 'all'
  })

  const {
    socialPosts,
    newsletters,
    blogPosts,
    isLoading,
    error,
    refetch,
    rescheduleContent
  } = useContentCalendar(filters)

  const handleEditPost = (post: SocialPost) => {
    // Navigate to social post editor
    window.location.href = `/admin/social?edit=${post.id}`
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const response = await fetch(`/api/admin/social/posts/${postId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      toast({
        title: "Success",
        description: "Post deleted successfully"
      })

      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive"
      })
    }
  }

  const handleViewPost = (post: SocialPost) => {
    // Open post in a modal or navigate to view page
    console.log('View post:', post)
  }

  const handleEditNewsletter = (newsletter: NewsletterCampaign) => {
    // Navigate to newsletter editor
    window.location.href = `/admin/newsletter?edit=${newsletter.id}`
  }

  const handleDeleteNewsletter = async (newsletterId: string) => {
    if (!confirm('Are you sure you want to delete this newsletter?')) return

    try {
      const response = await fetch(`/api/admin/newsletter/campaigns/${newsletterId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete newsletter')
      }

      toast({
        title: "Success",
        description: "Newsletter deleted successfully"
      })

      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete newsletter",
        variant: "destructive"
      })
    }
  }

  const handleViewNewsletter = (newsletter: NewsletterCampaign) => {
    // Open newsletter in a modal or navigate to view page
    console.log('View newsletter:', newsletter)
  }

  const handleEditBlogPost = (blogPost: BlogPost) => {
    // Navigate to Sanity Studio for blog editing
    window.open(`/studio/desk/post;${blogPost._id}`, '_blank')
  }

  const handleViewBlogPost = (blogPost: BlogPost) => {
    // Navigate to blog post page
    window.open(`/blog/${blogPost.slug.current}`, '_blank')
  }

  const handleRescheduleContent = async (
    contentId: string, 
    contentType: 'social' | 'newsletter' | 'blog', 
    newDate: Date
  ) => {
    const success = await rescheduleContent(contentId, contentType, newDate)
    
    if (success) {
      toast({
        title: "Success",
        description: "Content rescheduled successfully"
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to reschedule content",
        variant: "destructive"
      })
    }
  }

  const handleRefresh = async () => {
    await refetch()
    toast({
      title: "Refreshed",
      description: "Calendar data has been updated"
    })
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading calendar: {error}
          </AlertDescription>
        </Alert>
        <Button onClick={refetch} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
          <p className="text-muted-foreground">
            Manage and schedule all your content across platforms
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <ContentCalendar
        posts={socialPosts}
        newsletters={newsletters}
        blogPosts={blogPosts}
        isLoading={isLoading}
        onEditPost={handleEditPost}
        onDeletePost={handleDeletePost}
        onViewPost={handleViewPost}
        onEditNewsletter={handleEditNewsletter}
        onDeleteNewsletter={handleDeleteNewsletter}
        onViewNewsletter={handleViewNewsletter}
        onEditBlogPost={handleEditBlogPost}
        onViewBlogPost={handleViewBlogPost}
        onRescheduleContent={handleRescheduleContent}
        onRefresh={handleRefresh}
      />
    </div>
  )
}
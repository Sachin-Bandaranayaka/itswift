'use client'

import { SchedulerMonitor } from '@/components/admin/scheduler-monitor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ContentCalendar } from '@/components/admin/content-calendar'
import { useContentCalendar } from '@/hooks/use-content-calendar'
import { SocialPost, NewsletterCampaign } from '@/lib/database/types'
import { useToast } from "@/hooks/use-toast"

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  publishedAt?: string
  _updatedAt: string
  status?: 'draft' | 'published'
}

export default function SchedulerPage() {
  const { toast } = useToast()
  
  const {
    socialPosts,
    newsletters,
    blogPosts,
    isLoading,
    error,
    refetch,
    rescheduleContent
  } = useContentCalendar()

  const handleEditPost = (post: SocialPost) => {
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
    console.log('View post:', post)
  }

  const handleEditNewsletter = (newsletter: NewsletterCampaign) => {
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
    console.log('View newsletter:', newsletter)
  }

  const handleEditBlogPost = (blogPost: BlogPost) => {
    window.open(`/studio/desk/post;${blogPost._id}`, '_blank')
  }

  const handleViewBlogPost = (blogPost: BlogPost) => {
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

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Content Scheduler</h1>
        <p className="text-muted-foreground">
          Monitor, manage, and schedule all your content across platforms
        </p>
      </div>

      <Tabs defaultValue="monitor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="monitor">Scheduler Monitor</TabsTrigger>
          <TabsTrigger value="calendar">Content Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monitor" className="space-y-6">
          <SchedulerMonitor />
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-6">
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
            onRefresh={refetch}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Plus, Calendar, Clock, Zap, Settings } from "lucide-react"
import { SocialPostComposer } from "@/components/admin/social-post-composer"
import { SocialPostList } from "@/components/admin/social-post-list"
import { ContentCalendar } from "@/components/admin/content-calendar"
import { OptimalTimingSuggestions } from "@/components/admin/optimal-timing-suggestions"
import { BulkScheduler } from "@/components/admin/bulk-scheduler"
import { SocialApiStatus } from "@/components/admin/social-api-status"
import { SocialPost, SocialPostInput } from '@/lib/database/types'

export default function SocialMediaManagement() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [isBulkSchedulerOpen, setIsBulkSchedulerOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')
  const { toast } = useToast()

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/social/posts')
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch posts')
      }

      setPosts(result.data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast({
        title: "Error",
        description: "Failed to load social media posts",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePost = async (postData: SocialPostInput) => {
    try {
      setIsSubmitting(true)
      
      let response
      if (editingPost) {
        // Update existing post
        response = await fetch(`/api/admin/social/posts/${editingPost.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })
      } else {
        // Create new post
        response = await fetch('/api/admin/social/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save post')
      }

      toast({
        title: "Success",
        description: editingPost ? "Post updated successfully" : "Post created successfully",
      })

      // Refresh posts list
      await fetchPosts()
      
      // Close dialog and reset state
      setIsComposerOpen(false)
      setEditingPost(null)
    } catch (error) {
      console.error('Error saving post:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save post",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSchedulePost = async (postData: SocialPostInput) => {
    // For now, scheduling is the same as saving with scheduled status
    await handleSavePost(postData)
  }

  const handleEditPost = (post: SocialPost) => {
    setEditingPost(post)
    setIsComposerOpen(true)
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/social/posts/${postId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete post')
      }

      toast({
        title: "Success",
        description: "Post deleted successfully",
      })

      // Refresh posts list
      await fetchPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete post",
        variant: "destructive",
      })
    }
  }

  const handleViewPost = (post: SocialPost) => {
    // For now, just edit the post when viewing
    handleEditPost(post)
  }

  const handleNewPost = () => {
    setEditingPost(null)
    setIsComposerOpen(true)
  }

  const handleBulkSchedule = async (bulkPosts: SocialPostInput[]) => {
    try {
      setIsSubmitting(true)
      
      // Schedule all posts
      const promises = bulkPosts.map(postData => 
        fetch('/api/admin/social/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })
      )
      
      const responses = await Promise.all(promises)
      const results = await Promise.all(responses.map(r => r.json()))
      
      const failedPosts = results.filter((result, index) => !responses[index].ok)
      
      if (failedPosts.length > 0) {
        throw new Error(`Failed to schedule ${failedPosts.length} posts`)
      }
      
      toast({
        title: "Success",
        description: `Successfully scheduled ${bulkPosts.length} posts`,
      })
      
      // Refresh posts list and close dialog
      await fetchPosts()
      setIsBulkSchedulerOpen(false)
    } catch (error) {
      console.error('Error bulk scheduling posts:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to schedule posts",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePublishPost = async (postId: string) => {
    try {
      setIsSubmitting(true)
      
      const response = await fetch('/api/admin/social/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to publish post')
      }

      toast({
        title: "Success",
        description: "Post published successfully",
      })

      // Refresh posts list
      await fetchPosts()
    } catch (error) {
      console.error('Error publishing post:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to publish post",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOptimalTimeSelect = (dateTime: string) => {
    // This would be used to set the scheduled time in the composer
    // For now, we'll just show a toast
    toast({
      title: "Optimal Time Selected",
      description: `Selected time: ${new Date(dateTime).toLocaleString()}`,
    })
  }

  const handleCloseComposer = () => {
    setIsComposerOpen(false)
    setEditingPost(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Social Media
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your social media posts and scheduling
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isBulkSchedulerOpen} onOpenChange={setIsBulkSchedulerOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Zap className="h-4 w-4 mr-2" />
                Bulk Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Bulk Schedule Posts</DialogTitle>
              </DialogHeader>
              <BulkScheduler
                onSchedulePosts={handleBulkSchedule}
                isLoading={isSubmitting}
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isComposerOpen} onOpenChange={setIsComposerOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewPost} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPost ? 'Edit Social Media Post' : 'Create New Social Media Post'}
                </DialogTitle>
              </DialogHeader>
              <SocialPostComposer
                onSave={handleSavePost}
                onSchedule={handleSchedulePost}
                initialData={editingPost || undefined}
                isLoading={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="posts" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Posts
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="timing" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Optimal Timing
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Bulk Actions
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          <SocialPostList
            posts={posts}
            isLoading={isLoading}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
            onView={handleViewPost}
            onPublish={handlePublishPost}
          />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <ContentCalendar
            posts={posts}
            isLoading={isLoading}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
            onViewPost={handleViewPost}
            onRefresh={fetchPosts}
          />
        </TabsContent>

        <TabsContent value="timing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OptimalTimingSuggestions
              platform="linkedin"
              onSelectTime={handleOptimalTimeSelect}
            />
            <OptimalTimingSuggestions
              platform="twitter"
              onSelectTime={handleOptimalTimeSelect}
            />
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <BulkScheduler
            onSchedulePosts={handleBulkSchedule}
            isLoading={isSubmitting}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SocialApiStatus />
        </TabsContent>
      </Tabs>
    </div>
  )
}
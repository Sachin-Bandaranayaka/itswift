'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  CheckCircle,
  Clock,
  AlertCircle,
  Archive,
  MoreHorizontal,
  Calendar,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Edit
} from "lucide-react"
import { toast } from "sonner"

export type BlogPostStatus = 'draft' | 'scheduled' | 'published' | 'archived'

interface BlogPost {
  id: string
  title: string
  slug: string
  author?: { name: string, id: string }
  featured_image?: string
  categories?: Array<{ name: string, id: string }>
  published_at?: string
  excerpt?: string
  content?: string
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  created_at: string
  updated_at: string
}

interface BlogStatusManagerProps {
  posts: BlogPost[]
  selectedPosts: string[]
  onSelectionChange: (postIds: string[]) => void
  onStatusChange: (postIds: string[], newStatus: BlogPostStatus, publishedAt?: string) => void
  onDeletePosts: (postIds: string[]) => void
  onDuplicatePost: (postId: string) => void
  onEditPost: (post: BlogPost) => void
  onRefresh: () => void
}

export function BlogStatusManager({
  posts,
  selectedPosts,
  onSelectionChange,
  onStatusChange,
  onDeletePosts,
  onDuplicatePost,
  onEditPost,
  onRefresh
}: BlogStatusManagerProps) {
  const [bulkAction, setBulkAction] = useState<string>('')

  const getPostStatus = (post: BlogPost): { status: BlogPostStatus, label: string, variant: 'default' | 'secondary' | 'outline' | 'destructive' } => {
    switch (post.status) {
      case 'published':
        return { status: 'published', label: 'Published', variant: 'default' }
      case 'scheduled':
        return { status: 'scheduled', label: 'Scheduled', variant: 'secondary' }
      case 'archived':
        return { status: 'archived', label: 'Archived', variant: 'destructive' }
      case 'draft':
      default:
        return { status: 'draft', label: 'Draft', variant: 'outline' }
    }
  }

  const getStatusIcon = (status: BlogPostStatus) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-3 w-3" />
      case 'scheduled':
        return <Clock className="h-3 w-3" />
      case 'draft':
        return <AlertCircle className="h-3 w-3" />
      case 'archived':
        return <Archive className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  const handleSelectAll = (checked: boolean) => {
    const postsArray = Array.isArray(posts) ? posts : []
    if (checked) {
      onSelectionChange(postsArray.map(post => post.id))
    } else {
      onSelectionChange([])
    }
  }

  const handleSelectPost = (postId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedPosts, postId])
    } else {
      onSelectionChange(selectedPosts.filter(id => id !== postId))
    }
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedPosts.length === 0) return

    try {
      switch (bulkAction) {
        case 'publish':
          await onStatusChange(selectedPosts, 'published', new Date().toISOString())
          toast.success(`Published ${selectedPosts.length} posts`)
          break
        case 'draft':
          await onStatusChange(selectedPosts, 'draft')
          toast.success(`Moved ${selectedPosts.length} posts to draft`)
          break
        case 'archive':
          await onStatusChange(selectedPosts, 'archived')
          toast.success(`Archived ${selectedPosts.length} posts`)
          break
        case 'delete':
          if (confirm(`Are you sure you want to delete ${selectedPosts.length} posts? This action cannot be undone.`)) {
            await onDeletePosts(selectedPosts)
            toast.success(`Deleted ${selectedPosts.length} posts`)
          }
          break
        case 'schedule':
          // For bulk scheduling, we'll set it for tomorrow at 9 AM
          const tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)
          tomorrow.setHours(9, 0, 0, 0)
          await onStatusChange(selectedPosts, 'scheduled', tomorrow.toISOString())
          toast.success(`Scheduled ${selectedPosts.length} posts for tomorrow`)
          break
      }
      
      setBulkAction('')
      onSelectionChange([])
      onRefresh()
    } catch (error) {
      console.error('Bulk action error:', error)
      toast.error('Failed to perform bulk action')
    }
  }

  const handleSingleStatusChange = async (postId: string, newStatus: BlogPostStatus) => {
    try {
      let publishedAt: string | undefined

      switch (newStatus) {
        case 'published':
          publishedAt = new Date().toISOString()
          break
        case 'scheduled':
          // Default to tomorrow 9 AM for quick scheduling
          const tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)
          tomorrow.setHours(9, 0, 0, 0)
          publishedAt = tomorrow.toISOString()
          break
        case 'draft':
        case 'archived':
          publishedAt = undefined
          break
      }

      await onStatusChange([postId], newStatus, publishedAt)
      toast.success(`Post status updated to ${newStatus}`)
      onRefresh()
    } catch (error) {
      console.error('Status change error:', error)
      toast.error('Failed to update post status')
    }
  }

  const postsArray = Array.isArray(posts) ? posts : []
  const isAllSelected = postsArray.length > 0 && selectedPosts.length === postsArray.length
  const isPartiallySelected = selectedPosts.length > 0 && selectedPosts.length < postsArray.length

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {postsArray.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={isAllSelected}
              ref={(el) => {
                if (el) {
                  const checkbox = el.querySelector('input[type="checkbox"]') as HTMLInputElement
                  if (checkbox) checkbox.indeterminate = isPartiallySelected
                }
              }}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedPosts.length > 0 
                ? `${selectedPosts.length} of ${postsArray.length} selected`
                : `Select all ${postsArray.length} posts`
              }
            </span>
          </div>

          {selectedPosts.length > 0 && (
            <div className="flex items-center gap-2">
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Bulk actions..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publish">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Publish Now
                    </div>
                  </SelectItem>
                  <SelectItem value="schedule">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule for Tomorrow
                    </div>
                  </SelectItem>
                  <SelectItem value="draft">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Move to Draft
                    </div>
                  </SelectItem>
                  <SelectItem value="archive">
                    <div className="flex items-center">
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </div>
                  </SelectItem>
                  <SelectItem value="delete">
                    <div className="flex items-center text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleBulkAction}
                disabled={!bulkAction}
                variant={bulkAction === 'delete' ? 'destructive' : 'default'}
              >
                Apply
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Posts List with Status Management */}
      <div className="space-y-2">
        {Array.isArray(posts) && posts.map((post) => {
          const status = getPostStatus(post)
          const isSelected = selectedPosts.includes(post.id)

          return (
            <div
              key={post.id}
              className={`flex items-center gap-4 p-4 border rounded-lg transition-colors ${
                isSelected 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => handleSelectPost(post.id, checked as boolean)}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {post.title}
                  </h3>
                  <Badge variant={status.variant} className="flex items-center gap-1">
                    {getStatusIcon(status.status)}
                    {status.label}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {post.author && (
                    <span>by {post.author.name}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.published_at
                    ? new Date(post.published_at).toLocaleDateString()
                    : new Date(post.created_at).toLocaleDateString()
                  }
                  </span>
                  {post.categories && post.categories.length > 0 && (
                    <div className="flex gap-1">
                      {post.categories.slice(0, 2).map((category, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {category.name}
                        </Badge>
                      ))}
                      {post.categories.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Change Dropdown */}
              <div className="flex items-center gap-2">
                <Select
                  value={status.status}
                  onValueChange={(newStatus: BlogPostStatus) => 
                    handleSingleStatusChange(post.id, newStatus)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Draft
                      </div>
                    </SelectItem>
                    <SelectItem value="scheduled">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Scheduled
                      </div>
                    </SelectItem>
                    <SelectItem value="published">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Published
                      </div>
                    </SelectItem>
                    <SelectItem value="archived">
                      <div className="flex items-center">
                        <Archive className="h-4 w-4 mr-2" />
                        Archived
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditPost(post)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDuplicatePost(post.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    {post.published_at && (
                        <DropdownMenuItem 
                          onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                        >
                        <Eye className="h-4 w-4 mr-2" />
                        View Published
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem 
                      onClick={() => handleSingleStatusChange(post.id, 'archived')}
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this post?')) {
                          onDeletePosts([post.id])
                        }
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
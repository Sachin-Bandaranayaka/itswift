'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Edit, 
  Share2, 
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  author?: { name: string }
  mainImage?: { asset: { url: string }, alt?: string }
  categories?: Array<{ title: string }>
  publishedAt?: string
  excerpt?: string
  body?: any[]
  _createdAt: string
  _updatedAt: string
}

interface BlogPostListProps {
  posts: BlogPost[]
  onEditPost: (post: BlogPost) => void
  onGenerateSocial: (post: BlogPost) => void
}

export function BlogPostList({ posts, onEditPost, onGenerateSocial }: BlogPostListProps) {
  const getPostStatus = (post: BlogPost) => {
    if (post.publishedAt) {
      const publishDate = new Date(post.publishedAt)
      const now = new Date()
      if (publishDate <= now) {
        return { status: 'published', label: 'Published', variant: 'default' as const }
      } else {
        return { status: 'scheduled', label: 'Scheduled', variant: 'secondary' as const }
      }
    }
    return { status: 'draft', label: 'Draft', variant: 'outline' as const }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const status = getPostStatus(post)
        return (
          <div
            key={post._id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white truncate">
                  {post.title}
                </h3>
                <Badge variant={status.variant}>
                  {status.status === 'published' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {status.status === 'scheduled' && <Clock className="h-3 w-3 mr-1" />}
                  {status.status === 'draft' && <AlertCircle className="h-3 w-3 mr-1" />}
                  {status.label}
                </Badge>
              </div>
              
              {post.excerpt && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {post.author && (
                  <span>by {post.author.name}</span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {post.publishedAt 
                    ? formatDate(post.publishedAt)
                    : formatDate(post._createdAt)
                  }
                </span>
                {post.categories && post.categories.length > 0 && (
                  <div className="flex gap-1">
                    {post.categories.slice(0, 2).map((category, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {category.title}
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
            
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditPost(post)}
                title="Edit post"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onGenerateSocial(post)}
                title="Generate social media posts"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
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
                  <DropdownMenuItem onClick={() => onGenerateSocial(post)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Generate Social Posts
                  </DropdownMenuItem>
                  {post.publishedAt && (
                    <DropdownMenuItem 
                      onClick={() => window.open(`/blog/${post.slug.current}`, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Published
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )
      })}
    </div>
  )
}
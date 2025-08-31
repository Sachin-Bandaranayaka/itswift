'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  FileText, 
  Search, 
  Calendar, 
  Eye, 
  Edit, 
  Share2, 
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { BlogPostList } from "@/components/admin/blog-post-list"
import { BlogPostEditor } from "@/components/admin/blog-post-editor"
import { AIContentAssistant } from "@/components/admin/ai-content-assistant"

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

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      // Fetch posts from Sanity
      const response = await fetch('/api/admin/blog/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  const handleCreateNew = () => {
    setSelectedPost(null)
    setIsEditing(true)
    setShowAIAssistant(true)
  }

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post)
    setIsEditing(true)
    setShowAIAssistant(true)
  }

  const handleCloseEditor = () => {
    setIsEditing(false)
    setSelectedPost(null)
    setShowAIAssistant(false)
    fetchPosts() // Refresh the list
  }

  if (isEditing) {
    return (
      <div className="flex h-screen">
        <div className="flex-1">
          <BlogPostEditor 
            post={selectedPost}
            onClose={handleCloseEditor}
            onSave={handleCloseEditor}
          />
        </div>
        {showAIAssistant && (
          <div className="w-96 border-l bg-gray-50 dark:bg-gray-900">
            <AIContentAssistant 
              contentType="blog"
              onContentGenerated={(content) => {
                // This will be handled by the BlogPostEditor
              }}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Blog Posts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your blog content and publications
          </p>
        </div>
        <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Blog Post
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Posts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Blog Posts
          </CardTitle>
          <CardDescription>
            Manage and edit your blog posts with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading posts...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No blog posts found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? 'No posts match your search criteria.' : 'Get started by creating your first blog post.'}
              </p>
              {!searchTerm && (
                <Button onClick={handleCreateNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => {
                const status = getPostStatus(post)
                return (
                  <div
                    key={post._id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {post.title}
                        </h3>
                        <Badge variant={status.variant}>
                          {status.status === 'published' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {status.status === 'scheduled' && <Clock className="h-3 w-3 mr-1" />}
                          {status.status === 'draft' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        {post.author && (
                          <span>by {post.author.name}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.publishedAt 
                            ? new Date(post.publishedAt).toLocaleDateString()
                            : new Date(post._createdAt).toLocaleDateString()
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
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPost(post)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Generate social media posts from this blog post
                          // This will be implemented in the social media generation
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
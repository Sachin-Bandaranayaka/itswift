'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  FileText, 
  Loader2,
  Settings,
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import { BlogPostEditor } from "@/components/admin/blog-post-editor"
import { AIContentAssistant } from "@/components/admin/ai-content-assistant"
import { BlogStatusManager, BlogPostStatus } from "@/components/admin/blog-status-manager"
import { BlogPostFilters, SortOption } from "@/components/admin/blog-post-filters"
import { BlogAutomationManager } from "@/components/admin/blog-automation-manager"
import { toast } from "sonner"

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
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<BlogPostStatus>('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [authorFilter, setAuthorFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [dateRange, setDateRange] = useState<{ start?: string, end?: string }>({})
  
  // Available filter options
  const [availableAuthors, setAvailableAuthors] = useState<string[]>([])
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [stats, setStats] = useState({ total: 0, published: 0, scheduled: 0, draft: 0, archived: 0 })

  useEffect(() => {
    fetchPosts()
  }, [statusFilter, authorFilter, categoryFilter, dateRange, searchTerm, sortBy])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      
      // Build query parameters
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (authorFilter && authorFilter !== 'all') params.append('author', authorFilter)
      if (categoryFilter && categoryFilter !== 'all') params.append('category', categoryFilter)
      if (dateRange.start) params.append('startDate', dateRange.start)
      if (dateRange.end) params.append('endDate', dateRange.end)
      if (searchTerm) params.append('search', searchTerm)
      if (sortBy) params.append('sortBy', sortBy)

      const response = await fetch(`/api/admin/blog/status?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
        setFilteredPosts(data.posts || [])
        setStats(data.stats || { total: 0, published: 0, scheduled: 0, draft: 0, archived: 0 })
        setAvailableAuthors(data.filters?.authors || [])
        setAvailableCategories(data.filters?.categories || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast.error('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (postIds: string[], newStatus: BlogPostStatus, publishedAt?: string) => {
    try {
      const response = await fetch('/api/admin/blog/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postIds, status: newStatus, publishedAt })
      })

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      await fetchPosts() // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error)
      throw error
    }
  }

  const handleDeletePosts = async (postIds: string[]) => {
    try {
      const response = await fetch('/api/admin/blog/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', postIds })
      })

      if (!response.ok) {
        throw new Error('Failed to delete posts')
      }

      await fetchPosts() // Refresh the list
      setSelectedPosts([]) // Clear selection
    } catch (error) {
      console.error('Error deleting posts:', error)
      throw error
    }
  }

  const handleDuplicatePost = async (postId: string) => {
    try {
      const response = await fetch('/api/admin/blog/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'duplicate', duplicatePostId: postId })
      })

      if (!response.ok) {
        throw new Error('Failed to duplicate post')
      }

      const data = await response.json()
      toast.success('Post duplicated successfully')
      await fetchPosts() // Refresh the list
    } catch (error) {
      console.error('Error duplicating post:', error)
      toast.error('Failed to duplicate post')
    }
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setAuthorFilter('all')
    setCategoryFilter('all')
    setDateRange({})
    setSortBy('newest')
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
            Manage your blog content and publications with advanced status management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchPosts} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Settings className="h-4 w-4" />}
          </Button>
          <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Blog Post
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Drafts</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Archived</p>
                <p className="text-2xl font-bold text-gray-600">{stats.archived}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <BlogPostFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        authorFilter={authorFilter}
        onAuthorFilterChange={setAuthorFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        availableAuthors={availableAuthors}
        availableCategories={availableCategories}
        totalPosts={stats.total}
        filteredCount={filteredPosts.length}
        onClearFilters={handleClearFilters}
      />

      {/* Main Content Tabs */}
      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts">Posts Management</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {/* Posts Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Blog Posts Management
              </CardTitle>
              <CardDescription>
                Select posts to perform bulk operations or manage individual post status
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
                    {searchTerm || statusFilter !== 'all' || (authorFilter && authorFilter !== 'all') || (categoryFilter && categoryFilter !== 'all') 
                      ? 'No posts match your current filters.' 
                      : 'Get started by creating your first blog post.'
                    }
                  </p>
                  {!searchTerm && statusFilter === 'all' && (!authorFilter || authorFilter === 'all') && (!categoryFilter || categoryFilter === 'all') && (
                    <Button onClick={handleCreateNew}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Post
                    </Button>
                  )}
                </div>
              ) : (
                <BlogStatusManager
                  posts={filteredPosts}
                  selectedPosts={selectedPosts}
                  onSelectionChange={setSelectedPosts}
                  onStatusChange={handleStatusChange}
                  onDeletePosts={handleDeletePosts}
                  onDuplicatePost={handleDuplicatePost}
                  onRefresh={fetchPosts}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <BlogAutomationManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
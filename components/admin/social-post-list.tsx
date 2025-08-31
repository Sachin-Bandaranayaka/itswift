'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Calendar,
  Eye,
  Linkedin,
  Twitter,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Send
} from "lucide-react"
import { SocialPost } from '@/lib/database/types'
import { formatDistanceToNow, format } from 'date-fns'

interface SocialPostListProps {
  posts: SocialPost[]
  isLoading?: boolean
  onEdit?: (post: SocialPost) => void
  onDelete?: (postId: string) => void
  onView?: (post: SocialPost) => void
  onPublish?: (postId: string) => void
}

export function SocialPostList({ 
  posts, 
  isLoading = false, 
  onEdit, 
  onDelete, 
  onView,
  onPublish 
}: SocialPostListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [platformFilter, setPlatformFilter] = useState<string>('all')

  // Filter posts based on search and filters
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    const matchesPlatform = platformFilter === 'all' || post.platform === platformFilter
    
    return matchesSearch && matchesStatus && matchesPlatform
  })

  const getStatusBadge = (status: SocialPost['status']) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, icon: FileText, label: 'Draft' },
      scheduled: { variant: 'default' as const, icon: Clock, label: 'Scheduled' },
      published: { variant: 'default' as const, icon: CheckCircle, label: 'Published' },
      failed: { variant: 'destructive' as const, icon: XCircle, label: 'Failed' }
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getPlatformIcon = (platform: 'linkedin' | 'twitter') => {
    return platform === 'linkedin' ? (
      <Linkedin className="h-4 w-4 text-blue-600" />
    ) : (
      <Twitter className="h-4 w-4 text-black dark:text-white" />
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, 'MMM d, yyyy h:mm a')
  }

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  }

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Media Posts</CardTitle>
          <CardDescription>Loading posts...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Posts</CardTitle>
        <CardDescription>
          Manage your social media posts across platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
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
            </SelectContent>
          </Select>
        </div>

        {/* Posts Table */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {posts.length === 0 ? (
              <div>
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No social media posts yet</p>
                <p className="text-sm">Create your first post to get started</p>
              </div>
            ) : (
              <div>
                <p>No posts match your current filters</p>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(post.platform)}
                        <span className="capitalize">{post.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm">{truncateContent(post.content)}</p>
                        {post.media_urls && post.media_urls.length > 0 && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {post.media_urls.length} media file{post.media_urls.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(post.status)}
                    </TableCell>
                    <TableCell>
                      {post.scheduled_at ? (
                        <div className="text-sm">
                          <p>{formatDate(post.scheduled_at)}</p>
                          <p className="text-muted-foreground text-xs">
                            {getRelativeTime(post.scheduled_at)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Not scheduled</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(post.created_at)}</p>
                        <p className="text-muted-foreground text-xs">
                          {getRelativeTime(post.created_at)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView?.(post)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit?.(post)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {(post.status === 'draft' || post.status === 'scheduled') && onPublish && (
                            <DropdownMenuItem onClick={() => onPublish(post.id)}>
                              <Send className="mr-2 h-4 w-4" />
                              Publish Now
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => onDelete?.(post.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
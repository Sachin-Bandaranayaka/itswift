'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  PlusCircle, 
  BarChart3, 
  Calendar, 
  Settings,
  Linkedin,
  Twitter,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp
} from "lucide-react"
import { SocialPostComposer } from './social-post-composer'
import { SocialAnalyticsDashboard } from './social-analytics-dashboard'
import { toast } from "sonner"

interface DashboardStats {
  totalPosts: number
  scheduledPosts: number
  publishedToday: number
  totalEngagement: number
  connectedPlatforms: string[]
}

interface ScheduledPost {
  id: string
  content: string
  platforms: string[]
  scheduledFor: string
  status: 'pending' | 'published' | 'failed'
}

export function SocialMediaDashboard() {
  const [activeTab, setActiveTab] = useState('compose')
  const [stats] = useState<DashboardStats>({
    totalPosts: 24,
    scheduledPosts: 5,
    publishedToday: 3,
    totalEngagement: 1247,
    connectedPlatforms: ['linkedin', 'twitter']
  })
  
  const [scheduledPosts] = useState<ScheduledPost[]>([
    {
      id: '1',
      content: 'Excited to share our latest product update! 🚀',
      platforms: ['linkedin', 'twitter'],
      scheduledFor: '2024-01-15T10:00:00Z',
      status: 'pending'
    },
    {
      id: '2',
      content: 'Join us for our upcoming webinar on digital transformation.',
      platforms: ['linkedin'],
      scheduledFor: '2024-01-16T14:30:00Z',
      status: 'pending'
    },
    {
      id: '3',
      content: 'Thank you to everyone who attended our conference!',
      platforms: ['twitter'],
      scheduledFor: '2024-01-14T09:00:00Z',
      status: 'published'
    }
  ])

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />
      case 'twitter':
        return <Twitter className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSave = (post: any) => {
    toast.success('Post saved as draft!')
    // Refresh stats or scheduled posts if needed
  }

  const handleSchedule = (post: any) => {
    toast.success('Post scheduled successfully!')
    // Refresh scheduled posts
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Social Media Dashboard</h1>
          <p className="text-muted-foreground">Manage your social media presence</p>
        </div>
        <div className="flex items-center gap-2">
          {stats.connectedPlatforms.map((platform) => (
            <Badge key={platform} variant="secondary" className="flex items-center gap-1">
              {getPlatformIcon(platform)}
              <span className="capitalize">{platform}</span>
            </Badge>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduledPosts}</div>
            <p className="text-xs text-muted-foreground">Upcoming posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedToday}</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEngagement.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <SocialPostComposer 
            onSave={handleSave}
            onSchedule={handleSchedule}
          />
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Posts</CardTitle>
              <CardDescription>
                Manage your upcoming social media posts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledPosts.map((post) => (
                  <div key={post.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{post.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {post.platforms.map((platform, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {getPlatformIcon(platform)}
                            <span className="ml-1 capitalize">{platform}</span>
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Scheduled for {formatDate(post.scheduledFor)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(post.status)}
                      <span className="text-sm capitalize">{post.status}</span>
                    </div>
                  </div>
                ))}
                {scheduledPosts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No scheduled posts</p>
                    <p className="text-sm">Create a new post to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <SocialAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Connected Platforms</CardTitle>
                <CardDescription>
                  Manage your social media platform connections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-600">
                      <Linkedin className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">LinkedIn</p>
                      <p className="text-sm text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-black">
                      <Twitter className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Twitter</p>
                      <p className="text-sm text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Posting Settings</CardTitle>
                <CardDescription>
                  Configure your default posting preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Platforms</label>
                  <div className="flex gap-2">
                    <Badge variant="outline">LinkedIn</Badge>
                    <Badge variant="outline">Twitter</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Auto-schedule</label>
                  <p className="text-sm text-muted-foreground">
                    Automatically schedule posts for optimal engagement times
                  </p>
                </div>
                
                <Button variant="outline" className="w-full">
                  Update Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Eye,
  Linkedin,
  Twitter,
  RefreshCw,
  Calendar,
  Target
} from "lucide-react"
import { toast } from "sonner"

interface AnalyticsData {
  overview: {
    totalPosts: number
    successfulPosts: number
    failedPosts: number
    successRate: string
    totalEngagement: number
    totalReach: number
    averageEngagement: string
  }
  platformStats: {
    [platform: string]: {
      posts: number
      engagement: number
    }
  }
  recentActivity: Array<{
    id: string
    content: string
    platforms: string[]
    status: string
    createdAt: string
    engagement: number
  }>
}

interface PlatformAnalytics {
  connectedPlatforms: string[]
  platformAnalytics: {
    [platform: string]: {
      totalPosts: number
      totalEngagement: number
      totalReach: number
      totalImpressions: number
      averageEngagement: string
      engagementRate: string
      recentPosts: Array<{
        id: string
        content: string
        createdAt: string
        engagement: number
      }>
    }
  }
  summary: {
    totalPlatforms: number
    totalPosts: number
    mostActivePlatform: string
  }
}

export function SocialAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [platformAnalytics, setPlatformAnalytics] = useState<PlatformAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      // Fetch summary analytics
      const summaryResponse = await fetch(`/api/social/analytics?action=summary&limit=${timeRange}`)
      const summaryResult = await summaryResponse.json()
      
      if (summaryResult.success) {
        setAnalyticsData(summaryResult.data)
      }

      // Fetch platform analytics
      const platformResponse = await fetch('/api/social/analytics?action=platforms')
      const platformResult = await platformResponse.json()
      
      if (platformResult.success) {
        setPlatformAnalytics(platformResult.data)
      }
    } catch (error) {
      console.error('Analytics fetch error:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />
      case 'twitter':
        return <Twitter className="h-4 w-4" />
      default:
        return <Share2 className="h-4 w-4" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return 'bg-blue-600'
      case 'twitter':
        return 'bg-black'
      default:
        return 'bg-gray-600'
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading analytics...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Media Analytics</h2>
          <p className="text-muted-foreground">Track your social media performance</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {analyticsData && (
            <>
              {/* Overview Stats */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overview.totalPosts}</div>
                    <p className="text-xs text-muted-foreground">
                      {analyticsData.overview.successfulPosts} successful
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analyticsData.overview.successRate}%</div>
                    <Progress value={parseFloat(analyticsData.overview.successRate)} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalEngagement)}</div>
                    <p className="text-xs text-muted-foreground">
                      Avg: {analyticsData.overview.averageEngagement} per post
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(analyticsData.overview.totalReach)}</div>
                    <p className="text-xs text-muted-foreground">
                      Across all platforms
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Platform Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                  <CardDescription>Posts and engagement by platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(analyticsData.platformStats).map(([platform, stats]) => (
                      <div key={platform} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${getPlatformColor(platform)}`}>
                            {getPlatformIcon(platform)}
                          </div>
                          <div>
                            <p className="font-medium capitalize">{platform}</p>
                            <p className="text-sm text-muted-foreground">{stats.posts} posts</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatNumber(stats.engagement)}</p>
                          <p className="text-sm text-muted-foreground">engagement</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          {platformAnalytics && (
            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(platformAnalytics.platformAnalytics).map(([platform, analytics]) => (
                <Card key={platform}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getPlatformIcon(platform)}
                      <span className="capitalize">{platform}</span>
                    </CardTitle>
                    <CardDescription>
                      Detailed analytics for {platform}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Posts</p>
                        <p className="text-2xl font-bold">{analytics.totalPosts}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Engagement Rate</p>
                        <p className="text-2xl font-bold">{analytics.engagementRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Reach</p>
                        <p className="text-xl font-bold">{formatNumber(analytics.totalReach)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Engagement</p>
                        <p className="text-xl font-bold">{analytics.averageEngagement}</p>
                      </div>
                    </div>
                    
                    {analytics.recentPosts.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Recent Posts</h4>
                        <div className="space-y-2">
                          {analytics.recentPosts.slice(0, 3).map((post, index) => (
                            <div key={index} className="p-2 border rounded text-sm">
                              <p className="truncate">{post.content}</p>
                              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                <span>{post.engagement} engagement</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          {analyticsData && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest social media posts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.recentActivity.map((post, index) => (
                    <div key={index} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{post.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {post.platforms.map((platform, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {getPlatformIcon(platform)}
                              <span className="ml-1 capitalize">{platform}</span>
                            </Badge>
                          ))}
                          <Badge 
                            variant={post.status === 'success' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {post.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(post.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{post.engagement}</p>
                        <p className="text-sm text-muted-foreground">engagement</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
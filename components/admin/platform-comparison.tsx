'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { 
  Eye, 
  Heart, 
  Share2, 
  MessageCircle,
  MousePointer,
  FileText,
  Linkedin,
  Twitter
} from 'lucide-react'

interface PerformanceMetrics {
  totalViews: number
  totalLikes: number
  totalShares: number
  totalComments: number
  totalClicks: number
  engagementRate: number
  averageEngagement: number
}

interface PlatformData {
  platform: string
  metrics: PerformanceMetrics
  contentCount: number
  averagePerformance: PerformanceMetrics
}

interface PlatformComparisonProps {
  data: PlatformData[]
  detailed?: boolean
}

export function PlatformComparison({ data, detailed = false }: PlatformComparisonProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatPercentage = (num: number): string => {
    return num.toFixed(1) + '%'
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return Linkedin
      case 'twitter':
        return Twitter
      case 'blog':
        return FileText
      default:
        return FileText
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600' }
      case 'twitter':
        return { bg: 'bg-sky-500', light: 'bg-sky-50', text: 'text-sky-600' }
      case 'blog':
        return { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-600' }
      default:
        return { bg: 'bg-gray-500', light: 'bg-gray-50', text: 'text-gray-600' }
    }
  }

  // Prepare data for charts
  const chartData = data.map(platform => ({
    name: platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1),
    views: platform.metrics.totalViews,
    likes: platform.metrics.totalLikes,
    shares: platform.metrics.totalShares,
    comments: platform.metrics.totalComments,
    clicks: platform.metrics.totalClicks,
    engagementRate: platform.metrics.engagementRate,
    contentCount: platform.contentCount,
    avgViews: platform.averagePerformance.totalViews
  }))

  // Prepare radar chart data
  const radarData = data.map(platform => ({
    platform: platform.platform.charAt(0).toUpperCase() + platform.platform.slice(1),
    views: Math.min(platform.averagePerformance.totalViews / 100, 100), // Normalize to 0-100
    engagement: Math.min(platform.metrics.engagementRate, 100),
    content: Math.min(platform.contentCount * 10, 100) // Scale content count
  }))

  const maxViews = Math.max(...data.map(p => p.metrics.totalViews))

  if (detailed) {
    return (
      <div className="space-y-6">
        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((platform, index) => {
            const IconComponent = getPlatformIcon(platform.platform)
            const colors = getPlatformColor(platform.platform)
            
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium capitalize">
                    {platform.platform}
                  </CardTitle>
                  <IconComponent className={`h-4 w-4 ${colors.text}`} />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold">
                        {formatNumber(platform.metrics.totalViews)}
                      </div>
                      <p className="text-xs text-muted-foreground">Total Views</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {platform.contentCount}
                      </div>
                      <p className="text-xs text-muted-foreground">Content Pieces</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Engagement Rate</span>
                      <span className="font-medium">
                        {formatPercentage(platform.metrics.engagementRate)}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(platform.metrics.engagementRate, 100)} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-500" />
                      <span>{formatNumber(platform.metrics.totalLikes)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-3 w-3 text-blue-500" />
                      <span>{formatNumber(platform.metrics.totalShares)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3 text-green-500" />
                      <span>{formatNumber(platform.metrics.totalComments)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MousePointer className="h-3 w-3 text-purple-500" />
                      <span>{formatNumber(platform.metrics.totalClicks)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Avg per Content</span>
                      <span className="text-sm font-medium">
                        {formatNumber(platform.averagePerformance.totalViews)} views
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Views by Platform</CardTitle>
              <CardDescription>Compare total views across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatNumber(Number(value))} />
                  <Bar dataKey="views" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Performance Radar</CardTitle>
              <CardDescription>Multi-dimensional platform comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="platform" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Views"
                    dataKey="views"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.1}
                  />
                  <Radar
                    name="Engagement"
                    dataKey="engagement"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    fillOpacity={0.1}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Average Performance Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Average Performance per Content</CardTitle>
            <CardDescription>Compare average performance metrics per content piece</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(Number(value))} />
                <Bar dataKey="avgViews" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Performance</CardTitle>
        <CardDescription>Compare performance across different platforms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((platform, index) => {
            const IconComponent = getPlatformIcon(platform.platform)
            const colors = getPlatformColor(platform.platform)
            const percentage = maxViews > 0 ? (platform.metrics.totalViews / maxViews) * 100 : 0
            
            return (
              <div key={index} className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${colors.light}`}>
                  <IconComponent className={`h-4 w-4 ${colors.text}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">{platform.platform}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(platform.metrics.totalViews)} views
                      </span>
                      <Badge variant="outline">
                        {platform.contentCount} content
                      </Badge>
                      <Badge variant="secondary">
                        {formatPercentage(platform.metrics.engagementRate)}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
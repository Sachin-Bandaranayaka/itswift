'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Eye, 
  Heart, 
  Share2, 
  MessageCircle,
  MousePointer,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink
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

interface ContentPerformanceData {
  contentId: string
  contentType: 'blog' | 'social' | 'newsletter'
  platform?: string
  title?: string
  publishedAt?: string
  metrics: PerformanceMetrics
  trend: 'up' | 'down' | 'stable'
}

interface TopPerformingContentProps {
  data: ContentPerformanceData[]
}

export function TopPerformingContent({ data }: TopPerformingContentProps) {
  const [sortBy, setSortBy] = useState<'views' | 'likes' | 'shares' | 'comments' | 'clicks' | 'engagementRate'>('views')
  const [filterBy, setFilterBy] = useState<'all' | 'blog' | 'social' | 'newsletter'>('all')

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

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Unknown'
    return new Date(dateString).toLocaleDateString()
  }

  const getContentIcon = (contentType: string, platform?: string) => {
    if (contentType === 'blog') return FileText
    if (contentType === 'newsletter') return Mail
    if (contentType === 'social') {
      if (platform === 'linkedin') return Linkedin
      if (platform === 'twitter') return Twitter
      return Share2
    }
    return FileText
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const getContentTypeColor = (contentType: string) => {
    switch (contentType) {
      case 'blog':
        return 'bg-purple-100 text-purple-800'
      case 'social':
        return 'bg-blue-100 text-blue-800'
      case 'newsletter':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlatformColor = (platform?: string) => {
    switch (platform) {
      case 'linkedin':
        return 'bg-blue-100 text-blue-800'
      case 'twitter':
        return 'bg-sky-100 text-sky-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter and sort data
  const filteredData = data
    .filter(item => filterBy === 'all' || item.contentType === filterBy)
    .sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return b.metrics.totalViews - a.metrics.totalViews
        case 'likes':
          return b.metrics.totalLikes - a.metrics.totalLikes
        case 'shares':
          return b.metrics.totalShares - a.metrics.totalShares
        case 'comments':
          return b.metrics.totalComments - a.metrics.totalComments
        case 'clicks':
          return b.metrics.totalClicks - a.metrics.totalClicks
        case 'engagementRate':
          return b.metrics.engagementRate - a.metrics.engagementRate
        default:
          return 0
      }
    })

  const getMetricValue = (metrics: PerformanceMetrics, metric: string): number => {
    switch (metric) {
      case 'views':
        return metrics.totalViews
      case 'likes':
        return metrics.totalLikes
      case 'shares':
        return metrics.totalShares
      case 'comments':
        return metrics.totalComments
      case 'clicks':
        return metrics.totalClicks
      case 'engagementRate':
        return metrics.engagementRate
      default:
        return 0
    }
  }

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'views':
        return Eye
      case 'likes':
        return Heart
      case 'shares':
        return Share2
      case 'comments':
        return MessageCircle
      case 'clicks':
        return MousePointer
      default:
        return Eye
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Sort by:</label>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="views">Views</SelectItem>
                <SelectItem value="likes">Likes</SelectItem>
                <SelectItem value="shares">Shares</SelectItem>
                <SelectItem value="comments">Comments</SelectItem>
                <SelectItem value="clicks">Clicks</SelectItem>
                <SelectItem value="engagementRate">Engagement Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Filter:</label>
            <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Badge variant="outline">
          {filteredData.length} content pieces
        </Badge>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {filteredData.map((content, index) => {
          const IconComponent = getContentIcon(content.contentType, content.platform)
          const MetricIcon = getMetricIcon(sortBy)
          const metricValue = getMetricValue(content.metrics, sortBy)
          
          return (
            <Card key={content.contentId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Rank */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-bold">
                      {index + 1}
                    </div>
                    
                    {/* Content Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {content.title || `${content.contentType} content`}
                        </span>
                        <Badge className={getContentTypeColor(content.contentType)}>
                          {content.contentType}
                        </Badge>
                        {content.platform && (
                          <Badge variant="outline" className={getPlatformColor(content.platform)}>
                            {content.platform}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Published: {formatDate(content.publishedAt)}</span>
                        <span>ID: {content.contentId.slice(0, 8)}...</span>
                      </div>
                      
                      {/* Metrics */}
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4 text-gray-500" />
                          <span>{formatNumber(content.metrics.totalViews)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span>{formatNumber(content.metrics.totalLikes)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Share2 className="h-4 w-4 text-blue-500" />
                          <span>{formatNumber(content.metrics.totalShares)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4 text-green-500" />
                          <span>{formatNumber(content.metrics.totalComments)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MousePointer className="h-4 w-4 text-purple-500" />
                          <span>{formatNumber(content.metrics.totalClicks)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Primary Metric & Trend */}
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <MetricIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-lg font-bold">
                          {sortBy === 'engagementRate' 
                            ? formatPercentage(metricValue)
                            : formatNumber(metricValue)
                          }
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Engagement: {formatPercentage(content.metrics.engagementRate)}
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {getTrendIcon(content.trend)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredData.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No content found</h3>
            <p className="text-muted-foreground">
              No content matches the current filter criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
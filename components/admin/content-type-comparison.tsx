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
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { 
  Eye, 
  Heart, 
  Share2, 
  MessageCircle,
  MousePointer,
  FileText,
  Share,
  Mail
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

interface ContentTypeComparisonProps {
  data: {
    blog: PerformanceMetrics
    social: PerformanceMetrics
    newsletter: PerformanceMetrics
  }
  detailed?: boolean
}

export function ContentTypeComparison({ data, detailed = false }: ContentTypeComparisonProps) {
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

  // Prepare data for charts
  const chartData = [
    {
      name: 'Blog',
      views: data.blog.totalViews,
      likes: data.blog.totalLikes,
      shares: data.blog.totalShares,
      comments: data.blog.totalComments,
      clicks: data.blog.totalClicks,
      engagementRate: data.blog.engagementRate
    },
    {
      name: 'Social',
      views: data.social.totalViews,
      likes: data.social.totalLikes,
      shares: data.social.totalShares,
      comments: data.social.totalComments,
      clicks: data.social.totalClicks,
      engagementRate: data.social.engagementRate
    },
    {
      name: 'Newsletter',
      views: data.newsletter.totalViews,
      likes: data.newsletter.totalLikes,
      shares: data.newsletter.totalShares,
      comments: data.newsletter.totalComments,
      clicks: data.newsletter.totalClicks,
      engagementRate: data.newsletter.engagementRate
    }
  ]

  const pieData = [
    { name: 'Blog', value: data.blog.totalViews, color: '#8884d8' },
    { name: 'Social', value: data.social.totalViews, color: '#82ca9d' },
    { name: 'Newsletter', value: data.newsletter.totalViews, color: '#ffc658' }
  ]

  const contentTypes = [
    {
      name: 'Blog Posts',
      icon: FileText,
      data: data.blog,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50'
    },
    {
      name: 'Social Media',
      icon: Share,
      data: data.social,
      color: 'bg-green-500',
      lightColor: 'bg-green-50'
    },
    {
      name: 'Newsletter',
      icon: Mail,
      data: data.newsletter,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-50'
    }
  ]

  const maxViews = Math.max(data.blog.totalViews, data.social.totalViews, data.newsletter.totalViews)

  if (detailed) {
    return (
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contentTypes.map((type, index) => {
            const IconComponent = type.icon
            
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {type.name}
                  </CardTitle>
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Views</span>
                      <span className="font-medium">{formatNumber(type.data.totalViews)}</span>
                    </div>
                    <Progress 
                      value={maxViews > 0 ? (type.data.totalViews / maxViews) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-500" />
                      <span>{formatNumber(type.data.totalLikes)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-3 w-3 text-blue-500" />
                      <span>{formatNumber(type.data.totalShares)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3 text-green-500" />
                      <span>{formatNumber(type.data.totalComments)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MousePointer className="h-3 w-3 text-purple-500" />
                      <span>{formatNumber(type.data.totalClicks)}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Engagement Rate</span>
                      <Badge variant="secondary">
                        {formatPercentage(type.data.engagementRate)}
                      </Badge>
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
              <CardTitle>Views by Content Type</CardTitle>
              <CardDescription>Total views across different content types</CardDescription>
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
              <CardTitle>Engagement Distribution</CardTitle>
              <CardDescription>Engagement breakdown by content type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatNumber(Number(value))} />
                  <Bar dataKey="likes" fill="#ef4444" />
                  <Bar dataKey="shares" fill="#3b82f6" />
                  <Bar dataKey="comments" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Type Performance</CardTitle>
        <CardDescription>Compare performance across different content types</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contentTypes.map((type, index) => {
            const IconComponent = type.icon
            const percentage = maxViews > 0 ? (type.data.totalViews / maxViews) * 100 : 0
            
            return (
              <div key={index} className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${type.lightColor}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{type.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {formatNumber(type.data.totalViews)} views
                      </span>
                      <Badge variant="outline">
                        {formatPercentage(type.data.engagementRate)}
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
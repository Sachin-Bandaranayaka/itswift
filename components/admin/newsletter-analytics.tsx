'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Mail, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Eye,
  MousePointer,
  UserMinus,
  AlertTriangle,
  Calendar,
  BarChart3
} from 'lucide-react'
import { NewsletterCampaign } from '@/lib/database/types'

interface NewsletterAnalytics {
  totalCampaigns: number
  totalSent: number
  totalSubscribers: number
  averageOpenRate: number
  averageClickRate: number
  unsubscribeRate: number
  bounceRate: number
  recentCampaigns: CampaignAnalytics[]
  subscriberGrowth: SubscriberGrowthData[]
  topPerformingCampaigns: CampaignAnalytics[]
}

interface CampaignAnalytics {
  id: string
  subject: string
  sentAt: string
  recipientCount: number
  openRate: number
  clickRate: number
  unsubscribeCount: number
  bounceCount: number
  status: string
}

interface SubscriberGrowthData {
  date: string
  subscribers: number
  newSubscribers: number
  unsubscribes: number
}

export function NewsletterAnalytics() {
  const [analytics, setAnalytics] = useState<NewsletterAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/newsletter/analytics?range=${timeRange}`)
      if (!response.ok) throw new Error('Failed to load analytics')
      
      const data = await response.json()
      setAnalytics(data.analytics)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  const getPerformanceColor = (rate: number, type: 'open' | 'click') => {
    const thresholds = {
      open: { good: 0.25, average: 0.15 },
      click: { good: 0.05, average: 0.02 }
    }
    
    const threshold = thresholds[type]
    if (rate >= threshold.good) return 'text-green-600'
    if (rate >= threshold.average) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      sent: 'default',
      scheduled: 'secondary',
      draft: 'outline',
      failed: 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            Failed to load analytics data
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Newsletter Analytics</h2>
          <p className="text-muted-foreground">
            Track your newsletter performance and subscriber engagement
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.totalSent} sent successfully
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(analytics.averageOpenRate, 'open')}`}>
              {formatPercentage(analytics.averageOpenRate)}
            </div>
            <p className="text-xs text-muted-foreground">
              Industry average: 21.3%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(analytics.averageClickRate, 'click')}`}>
              {formatPercentage(analytics.averageClickRate)}
            </div>
            <p className="text-xs text-muted-foreground">
              Industry average: 2.6%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSubscribers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Active subscribers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Engagement Rates</CardTitle>
            <CardDescription>
              How subscribers interact with your newsletters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Open Rate</span>
                <span className={getPerformanceColor(analytics.averageOpenRate, 'open')}>
                  {formatPercentage(analytics.averageOpenRate)}
                </span>
              </div>
              <Progress value={analytics.averageOpenRate * 100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Click Rate</span>
                <span className={getPerformanceColor(analytics.averageClickRate, 'click')}>
                  {formatPercentage(analytics.averageClickRate)}
                </span>
              </div>
              <Progress value={analytics.averageClickRate * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Unsubscribe Rate</span>
                <span className="text-red-600">
                  {formatPercentage(analytics.unsubscribeRate)}
                </span>
              </div>
              <Progress value={analytics.unsubscribeRate * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Bounce Rate</span>
                <span className="text-orange-600">
                  {formatPercentage(analytics.bounceRate)}
                </span>
              </div>
              <Progress value={analytics.bounceRate * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subscriber Growth</CardTitle>
            <CardDescription>
              Track how your subscriber base is growing
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.subscriberGrowth.length > 0 ? (
              <div className="space-y-4">
                {analytics.subscriberGrowth.slice(0, 5).map((data, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="text-sm">
                      {new Date(data.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span className="text-xs">+{data.newSubscribers}</span>
                      </div>
                      {data.unsubscribes > 0 && (
                        <div className="flex items-center text-red-600">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          <span className="text-xs">-{data.unsubscribes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No growth data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Campaign Performance</CardTitle>
          <CardDescription>
            Detailed metrics for your latest newsletter campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Open Rate</TableHead>
                  <TableHead>Click Rate</TableHead>
                  <TableHead>Unsubscribes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.recentCampaigns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      No campaigns found
                    </TableCell>
                  </TableRow>
                ) : (
                  analytics.recentCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {campaign.subject}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(campaign.status)}
                      </TableCell>
                      <TableCell>
                        {campaign.sentAt 
                          ? new Date(campaign.sentAt).toLocaleDateString()
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        {campaign.recipientCount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className={getPerformanceColor(campaign.openRate, 'open')}>
                          {formatPercentage(campaign.openRate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={getPerformanceColor(campaign.clickRate, 'click')}>
                          {formatPercentage(campaign.clickRate)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {campaign.unsubscribeCount > 0 && (
                            <UserMinus className="h-3 w-3 mr-1 text-red-600" />
                          )}
                          <span className={campaign.unsubscribeCount > 0 ? 'text-red-600' : ''}>
                            {campaign.unsubscribeCount}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Campaigns */}
      {analytics.topPerformingCampaigns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Campaigns</CardTitle>
            <CardDescription>
              Your best performing newsletters by engagement rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topPerformingCampaigns.map((campaign, index) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{campaign.subject}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(campaign.sentAt).toLocaleDateString()} • {campaign.recipientCount.toLocaleString()} recipients
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <div className={`font-bold ${getPerformanceColor(campaign.openRate, 'open')}`}>
                        {formatPercentage(campaign.openRate)}
                      </div>
                      <div className="text-muted-foreground">Opens</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-bold ${getPerformanceColor(campaign.clickRate, 'click')}`}>
                        {formatPercentage(campaign.clickRate)}
                      </div>
                      <div className="text-muted-foreground">Clicks</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
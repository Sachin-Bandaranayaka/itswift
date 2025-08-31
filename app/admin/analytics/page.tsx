'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  Share2, 
  MessageCircle,
  MousePointer,
  RefreshCw,
  Download,
  Calendar,
  Filter
} from 'lucide-react'
import { AnalyticsSummary } from '@/components/admin/analytics-summary'
import { ContentTypeComparison } from '@/components/admin/content-type-comparison'
import { PlatformComparison } from '@/components/admin/platform-comparison'
import { TopPerformingContent } from '@/components/admin/top-performing-content'
import { AnalyticsDateFilter } from '@/components/admin/analytics-date-filter'

interface AnalyticsData {
  summary: {
    totalContent: number
    totalViews: number
    totalEngagement: number
    averageEngagementRate: number
    topPlatform: string
    growthRate: number
  }
  contentTypeComparison: {
    blog: PerformanceMetrics
    social: PerformanceMetrics
    newsletter: PerformanceMetrics
  }
  platformComparison: Array<{
    platform: string
    metrics: PerformanceMetrics
    contentCount: number
    averagePerformance: PerformanceMetrics
  }>
  topPerforming: Array<{
    contentId: string
    contentType: 'blog' | 'social' | 'newsletter'
    platform?: string
    title?: string
    publishedAt?: string
    metrics: PerformanceMetrics
    trend: 'up' | 'down' | 'stable'
  }>
}

interface PerformanceMetrics {
  totalViews: number
  totalLikes: number
  totalShares: number
  totalComments: number
  totalClicks: number
  engagementRate: number
  averageEngagement: number
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{
    from: string | null
    to: string | null
  }>({
    from: null,
    to: null
  })
  const [refreshing, setRefreshing] = useState(false)

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (dateRange.from) params.append('dateFrom', dateRange.from)
      if (dateRange.to) params.append('dateTo', dateRange.to)

      // Fetch all analytics data in parallel
      const [summaryRes, comparisonRes, platformRes, topRes] = await Promise.all([
        fetch(`/api/admin/analytics/data?type=summary&${params.toString()}`),
        fetch(`/api/admin/analytics/data?type=comparison&${params.toString()}`),
        fetch(`/api/admin/analytics/data?type=platform&${params.toString()}`),
        fetch(`/api/admin/analytics/data?type=top&${params.toString()}`)
      ])

      const [summary, comparison, platform, top] = await Promise.all([
        summaryRes.json(),
        comparisonRes.json(),
        platformRes.json(),
        topRes.json()
      ])

      if (!summary.success || !comparison.success || !platform.success || !top.success) {
        throw new Error('Failed to fetch analytics data')
      }

      setAnalyticsData({
        summary: summary.data,
        contentTypeComparison: comparison.data,
        platformComparison: platform.data,
        topPerforming: top.data
      })
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  const refreshAnalytics = async () => {
    try {
      setRefreshing(true)
      
      // Trigger analytics collection
      const collectRes = await fetch('/api/admin/analytics/collect', {
        method: 'POST'
      })
      
      if (!collectRes.ok) {
        throw new Error('Failed to refresh analytics')
      }

      // Refetch data
      await fetchAnalyticsData()
    } catch (err) {
      console.error('Error refreshing analytics:', err)
      setError(err instanceof Error ? err.message : 'Failed to refresh analytics')
    } finally {
      setRefreshing(false)
    }
  }

  const exportData = async () => {
    try {
      if (!analyticsData) return

      const dataToExport = {
        exportDate: new Date().toISOString(),
        dateRange,
        ...analyticsData
      }

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error exporting data:', err)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading analytics...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchAnalyticsData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Track content performance across all platforms
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <AnalyticsDateFilter
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <Button
            variant="outline"
            onClick={refreshAnalytics}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={exportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {analyticsData && (
        <AnalyticsSummary data={analyticsData.summary} />
      )}

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content Types</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="performance">Top Performing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {analyticsData && (
              <>
                <ContentTypeComparison data={analyticsData.contentTypeComparison} />
                <PlatformComparison data={analyticsData.platformComparison} />
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {analyticsData && (
            <ContentTypeComparison 
              data={analyticsData.contentTypeComparison} 
              detailed={true}
            />
          )}
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          {analyticsData && (
            <PlatformComparison 
              data={analyticsData.platformComparison} 
              detailed={true}
            />
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {analyticsData && (
            <TopPerformingContent data={analyticsData.topPerforming} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
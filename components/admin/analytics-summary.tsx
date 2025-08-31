'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  Heart, 
  Share2, 
  MessageCircle,
  MousePointer,
  FileText,
  Users,
  Target
} from 'lucide-react'

interface AnalyticsSummaryProps {
  data: {
    totalContent: number
    totalViews: number
    totalEngagement: number
    averageEngagementRate: number
    topPlatform: string
    growthRate: number
  }
}

export function AnalyticsSummary({ data }: AnalyticsSummaryProps) {
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

  const getTrendIcon = (rate: number) => {
    if (rate > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    } else if (rate < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
    return null
  }

  const getTrendColor = (rate: number) => {
    if (rate > 0) return 'text-green-600'
    if (rate < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const summaryCards = [
    {
      title: 'Total Content',
      value: formatNumber(data.totalContent),
      icon: FileText,
      description: 'Published content pieces',
      trend: null
    },
    {
      title: 'Total Views',
      value: formatNumber(data.totalViews),
      icon: Eye,
      description: 'Across all platforms',
      trend: data.growthRate
    },
    {
      title: 'Total Engagement',
      value: formatNumber(data.totalEngagement),
      icon: Heart,
      description: 'Likes, shares, comments',
      trend: null
    },
    {
      title: 'Engagement Rate',
      value: formatPercentage(data.averageEngagementRate),
      icon: Target,
      description: 'Average across content',
      trend: null
    },
    {
      title: 'Top Platform',
      value: data.topPlatform || 'N/A',
      icon: Users,
      description: 'Best performing platform',
      trend: null
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {summaryCards.map((card, index) => {
        const IconComponent = card.icon
        
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </div>
                {card.trend !== null && (
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(card.trend)}
                    <span className={`text-xs font-medium ${getTrendColor(card.trend)}`}>
                      {Math.abs(card.trend).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
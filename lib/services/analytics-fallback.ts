import type { ContentPerformanceData, PerformanceMetrics, PlatformComparison } from './analytics-tracker'

type MetricKey = keyof Pick<PerformanceMetrics, 'totalViews' | 'totalLikes' | 'totalShares' | 'totalComments' | 'totalClicks' | 'averageEngagement'>

type TopMetric = 'views' | 'likes' | 'shares' | 'comments' | 'clicks'

type ContentType = 'blog' | 'social' | 'newsletter'

const fallbackSummary = {
  totalContent: 48,
  totalViews: 128500,
  totalEngagement: 8920,
  averageEngagementRate: 6.9,
  topPlatform: 'linkedin',
  growthRate: 5.4
} as const

const fallbackContentTypeComparison: Record<ContentType, PerformanceMetrics> = {
  blog: {
    totalViews: 48000,
    totalLikes: 2100,
    totalShares: 780,
    totalComments: 520,
    totalClicks: 1800,
    engagementRate: 7.3,
    averageEngagement: 95
  },
  social: {
    totalViews: 56000,
    totalLikes: 3200,
    totalShares: 1400,
    totalComments: 900,
    totalClicks: 4200,
    engagementRate: 8.9,
    averageEngagement: 128
  },
  newsletter: {
    totalViews: 24500,
    totalLikes: 180,
    totalShares: 90,
    totalComments: 30,
    totalClicks: 2280,
    engagementRate: 1.2,
    averageEngagement: 22
  }
}

const fallbackPlatformComparison: PlatformComparison[] = [
  {
    platform: 'linkedin',
    metrics: {
      totalViews: 36500,
      totalLikes: 2100,
      totalShares: 1120,
      totalComments: 760,
      totalClicks: 2800,
      engagementRate: 10,
      averageEngagement: 132
    },
    contentCount: 18,
    averagePerformance: {
      totalViews: 2027,
      totalLikes: 117,
      totalShares: 62,
      totalComments: 42,
      totalClicks: 155,
      engagementRate: 10,
      averageEngagement: 132
    }
  },
  {
    platform: 'twitter',
    metrics: {
      totalViews: 19500,
      totalLikes: 1100,
      totalShares: 540,
      totalComments: 320,
      totalClicks: 1400,
      engagementRate: 9.6,
      averageEngagement: 109
    },
    contentCount: 15,
    averagePerformance: {
      totalViews: 1300,
      totalLikes: 73,
      totalShares: 36,
      totalComments: 21,
      totalClicks: 93,
      engagementRate: 9.6,
      averageEngagement: 109
    }
  },
  {
    platform: 'newsletter',
    metrics: {
      totalViews: 24500,
      totalLikes: 180,
      totalShares: 90,
      totalComments: 30,
      totalClicks: 2280,
      engagementRate: 1.2,
      averageEngagement: 22
    },
    contentCount: 10,
    averagePerformance: {
      totalViews: 2450,
      totalLikes: 18,
      totalShares: 9,
      totalComments: 3,
      totalClicks: 228,
      engagementRate: 1.2,
      averageEngagement: 22
    }
  }
]

const fallbackTopPerforming: ContentPerformanceData[] = [
  {
    contentId: 'blog-post-102',
    contentType: 'blog',
    title: 'AI-Powered Learning Pathways',
    publishedAt: '2024-09-28T09:30:00.000Z',
    metrics: {
      totalViews: 11850,
      totalLikes: 720,
      totalShares: 310,
      totalComments: 190,
      totalClicks: 560,
      engagementRate: 10.2,
      averageEngagement: 1220
    },
    trend: 'up'
  },
  {
    contentId: 'linkedin-post-87',
    contentType: 'social',
    platform: 'linkedin',
    title: 'Case Study: Enterprise Upskilling Wins',
    publishedAt: '2024-10-02T14:15:00.000Z',
    metrics: {
      totalViews: 9600,
      totalLikes: 680,
      totalShares: 340,
      totalComments: 220,
      totalClicks: 430,
      engagementRate: 12.5,
      averageEngagement: 1240
    },
    trend: 'up'
  },
  {
    contentId: 'newsletter-44',
    contentType: 'newsletter',
    title: 'Q4 Learning Innovation Roundup',
    publishedAt: '2024-09-25T12:00:00.000Z',
    metrics: {
      totalViews: 8900,
      totalLikes: 60,
      totalShares: 30,
      totalComments: 10,
      totalClicks: 860,
      engagementRate: 1.1,
      averageEngagement: 100
    },
    trend: 'stable'
  },
  {
    contentId: 'blog-post-96',
    contentType: 'blog',
    title: 'Designing Microlearning Journeys',
    publishedAt: '2024-09-18T08:05:00.000Z',
    metrics: {
      totalViews: 8450,
      totalLikes: 510,
      totalShares: 240,
      totalComments: 150,
      totalClicks: 470,
      engagementRate: 10.8,
      averageEngagement: 900
    },
    trend: 'stable'
  },
  {
    contentId: 'twitter-post-141',
    contentType: 'social',
    platform: 'twitter',
    title: '3 Ways AI Supports L&D Teams',
    publishedAt: '2024-10-04T16:45:00.000Z',
    metrics: {
      totalViews: 7300,
      totalLikes: 420,
      totalShares: 190,
      totalComments: 85,
      totalClicks: 310,
      engagementRate: 9.1,
      averageEngagement: 695
    },
    trend: 'up'
  },
  {
    contentId: 'blog-post-90',
    contentType: 'blog',
    title: 'LMS Integrations That Matter in 2024',
    publishedAt: '2024-09-08T10:20:00.000Z',
    metrics: {
      totalViews: 6820,
      totalLikes: 390,
      totalShares: 170,
      totalComments: 110,
      totalClicks: 350,
      engagementRate: 9.8,
      averageEngagement: 670
    },
    trend: 'down'
  }
]

const metricKeyMap: Record<TopMetric, MetricKey> = {
  views: 'totalViews',
  likes: 'totalLikes',
  shares: 'totalShares',
  comments: 'totalComments',
  clicks: 'totalClicks'
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

export function getFallbackAnalyticsSummary() {
  return clone(fallbackSummary)
}

export function getFallbackContentTypeComparison() {
  return clone(fallbackContentTypeComparison)
}

export function getFallbackPlatformComparison() {
  return clone(fallbackPlatformComparison)
}

export function getFallbackTopPerforming(
  metric: TopMetric = 'views',
  limit = 10,
  contentType?: ContentType
) {
  const metricKey = metricKeyMap[metric]
  const filtered = fallbackTopPerforming.filter(item => {
    return contentType ? item.contentType === contentType : true
  })

  const sorted = filtered.sort((a, b) => {
    const aValue = a.metrics[metricKey] ?? 0
    const bValue = b.metrics[metricKey] ?? 0
    return bValue - aValue
  })

  return clone(sorted.slice(0, limit))
}

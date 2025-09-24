'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Share2, 
  Mail, 
  Heart, 
  Share, 
  MessageCircle,
  Eye,
  MousePointer,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PerformingContentItem } from '@/lib/types/dashboard';

interface TopPerformingContentCardProps {
  content?: PerformingContentItem[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
}

const getContentIcon = (type: PerformingContentItem['type']) => {
  switch (type) {
    case 'blog':
      return FileText;
    case 'social':
      return Share2;
    case 'newsletter':
      return Mail;
    default:
      return FileText;
  }
};

const getTypeColor = (type: PerformingContentItem['type']) => {
  switch (type) {
    case 'blog':
      return 'bg-blue-100 text-blue-800';
    case 'social':
      return 'bg-green-100 text-green-800';
    case 'newsletter':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const ContentItemSkeleton = () => (
  <div className="flex items-start space-x-3 p-3">
    <Skeleton className="h-8 w-8 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex space-x-4">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  </div>
);

const MetricItem = ({ 
  icon: Icon, 
  value, 
  label 
}: { 
  icon: React.ComponentType<any>; 
  value: number; 
  label: string; 
}) => (
  <div className="flex items-center space-x-1 text-xs text-gray-500">
    <Icon className="h-3 w-3" />
    <span>{formatNumber(value)}</span>
    <span className="sr-only">{label}</span>
  </div>
);

const ContentItemComponent = ({ item }: { item: PerformingContentItem }) => {
  const Icon = getContentIcon(item.type);
  const { metrics } = item;
  const engagementRate = item.metadata?.engagementRate;
  const daysSincePublished = typeof item.metadata?.daysSincePublished === 'number'
    ? item.metadata.daysSincePublished
    : undefined;
  const categories = item.metadata?.categories || [];
  const publishedLabel = typeof daysSincePublished === 'number'
    ? daysSincePublished === 0
      ? 'Today'
      : daysSincePublished === 1
        ? '1 day ago'
        : `${daysSincePublished} days ago`
    : undefined;
  
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0">
        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon className="h-4 w-4 text-gray-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-900 truncate">
            {item.title}
          </p>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary" 
              className={cn('text-xs', getTypeColor(item.type))}
            >
              {item.type}
            </Badge>
            {item.platform && (
              <Badge variant="outline" className="text-xs">
                {item.platform}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {metrics.views && (
            <MetricItem icon={Eye} value={metrics.views} label="views" />
          )}
          {metrics.likes && (
            <MetricItem icon={Heart} value={metrics.likes} label="likes" />
          )}
          {metrics.shares && (
            <MetricItem icon={Share} value={metrics.shares} label="shares" />
          )}
          {metrics.comments && (
            <MetricItem icon={MessageCircle} value={metrics.comments} label="comments" />
          )}
          {metrics.opens && (
            <MetricItem icon={Eye} value={metrics.opens} label="opens" />
          )}
          {metrics.clicks && (
            <MetricItem icon={MousePointer} value={metrics.clicks} label="clicks" />
          )}
        </div>

        {(engagementRate || publishedLabel || categories.length > 0) && (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              {engagementRate && (
                <span className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>{engagementRate}</span>
                </span>
              )}
              {categories.length > 0 && (
                <span className="flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                  <span>{categories.slice(0, 2).join(', ')}</span>
                </span>
              )}
            </div>
            {publishedLabel && (
              <span className="flex items-center space-x-1 ml-auto">
                <Clock className="h-3 w-3" />
                <span>{publishedLabel}</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export function TopPerformingContentCard({
  content = [],
  isLoading = false,
  error = null,
  onRetry,
  className
}: TopPerformingContentCardProps) {
  if (error) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Top Performing Content
            <AlertCircle className="h-5 w-5 text-red-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-sm text-red-600 mb-3">
              Failed to load performance data
            </p>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Top Performing Content
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <ContentItemSkeleton key={i} />
            ))}
          </div>
        ) : content.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-1">
              No performance data available
            </p>
            <p className="text-xs text-gray-400">
              Content performance will appear here once you have published content
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {content.map((item, index) => (
              <div key={item.id} className="relative">
                {index === 0 && (
                  <div className="absolute -left-2 top-3 h-6 w-1 bg-yellow-400 rounded-full" />
                )}
                <ContentItemComponent item={item} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

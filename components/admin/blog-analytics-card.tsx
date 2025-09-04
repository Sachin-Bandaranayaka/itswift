'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Heart,
  Share,
  MessageCircle,
  Calendar,
  RefreshCw,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { PerformingContentItem } from '@/lib/types/dashboard';

interface BlogAnalyticsCardProps {
  topPerformingPosts?: PerformingContentItem[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
}

const MetricIcon = ({ type }: { type: 'views' | 'likes' | 'shares' | 'comments' }) => {
  switch (type) {
    case 'views':
      return <Eye className="h-3 w-3" />;
    case 'likes':
      return <Heart className="h-3 w-3" />;
    case 'shares':
      return <Share className="h-3 w-3" />;
    case 'comments':
      return <MessageCircle className="h-3 w-3" />;
    default:
      return <BarChart3 className="h-3 w-3" />;
  }
};

const formatMetric = (value: number): string => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
};

const BlogPostSkeleton = () => (
  <div className="p-3 space-y-3">
    <div className="flex items-start justify-between">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-5 w-12 rounded-full" />
    </div>
    <div className="flex items-center space-x-4">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-16" />
    </div>
    <div className="flex items-center justify-between">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>
);

const BlogPostItem = ({ post }: { post: PerformingContentItem }) => {
  const engagementRate = post.metadata?.engagementRate || '0%';
  const daysSincePublished = post.metadata?.daysSincePublished || 0;
  const author = post.metadata?.author;
  const categories = post.metadata?.categories || [];

  return (
    <div className="p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1 mr-2">
          {post.title}
        </h4>
        <Badge 
          variant="secondary" 
          className={cn(
            'text-xs whitespace-nowrap',
            parseFloat(engagementRate) > 3 ? 'bg-green-100 text-green-800' : 
            parseFloat(engagementRate) > 1 ? 'bg-yellow-100 text-yellow-800' : 
            'bg-gray-100 text-gray-800'
          )}
        >
          {engagementRate}
        </Badge>
      </div>

      <div className="flex items-center space-x-4 mb-2">
        <div className="flex items-center text-xs text-gray-500">
          <MetricIcon type="views" />
          <span className="ml-1">{formatMetric(post.metrics.views || 0)}</span>
        </div>
        {(post.metrics.likes || 0) > 0 && (
          <div className="flex items-center text-xs text-gray-500">
            <MetricIcon type="likes" />
            <span className="ml-1">{formatMetric(post.metrics.likes || 0)}</span>
          </div>
        )}
        {(post.metrics.shares || 0) > 0 && (
          <div className="flex items-center text-xs text-gray-500">
            <MetricIcon type="shares" />
            <span className="ml-1">{formatMetric(post.metrics.shares || 0)}</span>
          </div>
        )}
        {(post.metrics.comments || 0) > 0 && (
          <div className="flex items-center text-xs text-gray-500">
            <MetricIcon type="comments" />
            <span className="ml-1">{formatMetric(post.metrics.comments || 0)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-2">
          {author && (
            <span>by {author}</span>
          )}
          {categories.length > 0 && (
            <>
              {author && <span>•</span>}
              <span>{categories.slice(0, 2).join(', ')}</span>
            </>
          )}
        </div>
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          <span>
            {daysSincePublished === 0 ? 'Today' : 
             daysSincePublished === 1 ? 'Yesterday' : 
             `${daysSincePublished} days ago`}
          </span>
        </div>
      </div>
    </div>
  );
};

export function BlogAnalyticsCard({
  topPerformingPosts = [],
  isLoading = false,
  error = null,
  onRetry,
  className
}: BlogAnalyticsCardProps) {
  if (error) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Top Blog Posts
            </div>
            <AlertCircle className="h-5 w-5 text-red-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-sm text-red-600 mb-3">
              Failed to load blog analytics
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
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Top Blog Posts
          </div>
          <Badge variant="outline" className="text-xs">
            Last 30 days
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <BlogPostSkeleton key={i} />
            ))}
          </div>
        ) : topPerformingPosts.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-1">
              No blog posts found
            </p>
            <p className="text-xs text-gray-400">
              Publish some blog posts to see analytics here
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {topPerformingPosts.map((post, index) => (
              <div key={post.id} className="relative">
                <div className="absolute left-1 top-3 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {index + 1}
                  </span>
                </div>
                <div className="ml-8">
                  <BlogPostItem post={post} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
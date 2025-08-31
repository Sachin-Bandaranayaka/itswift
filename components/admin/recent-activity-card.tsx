'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Share2, 
  Mail, 
  Bot, 
  Clock, 
  RefreshCw,
  AlertCircle 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export interface ActivityItem {
  id: string;
  type: 'blog' | 'social' | 'newsletter' | 'ai';
  title: string;
  description: string;
  timestamp: Date | string;
  status: 'published' | 'scheduled' | 'sent' | 'generated';
  platform?: string;
}

interface RecentActivityCardProps {
  activities?: ActivityItem[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
}

const getActivityIcon = (type: ActivityItem['type']) => {
  switch (type) {
    case 'blog':
      return FileText;
    case 'social':
      return Share2;
    case 'newsletter':
      return Mail;
    case 'ai':
      return Bot;
    default:
      return FileText;
  }
};

const getStatusColor = (status: ActivityItem['status']) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800';
    case 'sent':
      return 'bg-blue-100 text-blue-800';
    case 'scheduled':
      return 'bg-yellow-100 text-yellow-800';
    case 'generated':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ActivityItemSkeleton = () => (
  <div className="flex items-start space-x-3 p-3">
    <Skeleton className="h-8 w-8 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-48" />
      <Skeleton className="h-3 w-24" />
    </div>
  </div>
);

const ActivityItemComponent = ({ activity }: { activity: ActivityItem }) => {
  const Icon = getActivityIcon(activity.type);
  
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-shrink-0">
        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
          <Icon className="h-4 w-4 text-gray-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {activity.title}
          </p>
          <Badge 
            variant="secondary" 
            className={cn('text-xs', getStatusColor(activity.status))}
          >
            {activity.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 mb-1">
          {activity.description}
        </p>
        <div className="flex items-center text-xs text-gray-400">
          <Clock className="h-3 w-3 mr-1" />
          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
          {activity.platform && (
            <>
              <span className="mx-1">•</span>
              <span className="capitalize">{activity.platform}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export function RecentActivityCard({
  activities = [],
  isLoading = false,
  error = null,
  onRetry,
  className
}: RecentActivityCardProps) {
  if (error) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Activity
            <AlertCircle className="h-5 w-5 text-red-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-sm text-red-600 mb-3">
              Failed to load recent activity
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
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <ActivityItemSkeleton key={i} />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              No recent activity found
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {activities.map((activity) => (
              <ActivityItemComponent 
                key={activity.id} 
                activity={activity} 
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
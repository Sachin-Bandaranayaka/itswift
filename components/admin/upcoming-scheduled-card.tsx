'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  Share2, 
  Mail, 
  Calendar, 
  Clock,
  RefreshCw,
  AlertCircle,
  Plus
} from 'lucide-react';
import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns';
import { cn } from '@/lib/utils';

export interface ScheduledItem {
  id: string;
  title: string;
  type: 'blog' | 'social' | 'newsletter';
  platform?: string;
  scheduledAt: Date | string;
}

interface UpcomingScheduledCardProps {
  scheduledContent?: ScheduledItem[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onScheduleNew?: () => void;
  className?: string;
}

const getContentIcon = (type: ScheduledItem['type']) => {
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

const getTypeColor = (type: ScheduledItem['type']) => {
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

const getScheduleStatus = (scheduledAt: Date | string) => {
  const date = new Date(scheduledAt);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return {
      label: 'Invalid date',
      color: 'bg-gray-100 text-gray-800',
      urgent: false
    };
  }
  
  if (isToday(date)) {
    return {
      label: 'Today',
      color: 'bg-red-100 text-red-800',
      urgent: true
    };
  }
  if (isTomorrow(date)) {
    return {
      label: 'Tomorrow',
      color: 'bg-orange-100 text-orange-800',
      urgent: false
    };
  }
  return {
    label: formatDistanceToNow(date, { addSuffix: true }),
    color: 'bg-gray-100 text-gray-800',
    urgent: false
  };
};

const ScheduledItemSkeleton = () => (
  <div className="flex items-start space-x-3 p-3">
    <Skeleton className="h-8 w-8 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

const ScheduledItemComponent = ({ item }: { item: ScheduledItem }) => {
  const Icon = getContentIcon(item.type);
  const scheduleStatus = getScheduleStatus(item.scheduledAt);
  
  return (
    <div className={cn(
      "flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors",
      scheduleStatus.urgent && "bg-red-50 hover:bg-red-100"
    )}>
      <div className="flex-shrink-0">
        <div className={cn(
          "h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center",
          scheduleStatus.urgent && "bg-red-100"
        )}>
          <Icon className={cn(
            "h-4 w-4 text-gray-600",
            scheduleStatus.urgent && "text-red-600"
          )} />
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
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {(() => {
              const date = new Date(item.scheduledAt);
              return isNaN(date.getTime()) ? 'Invalid date' : format(date, 'MMM d, h:mm a');
            })()}
          </div>
          <Badge 
            variant="secondary" 
            className={cn('text-xs', scheduleStatus.color)}
          >
            {scheduleStatus.label}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export function UpcomingScheduledCard({
  scheduledContent = [],
  isLoading = false,
  error = null,
  onRetry,
  onScheduleNew,
  className
}: UpcomingScheduledCardProps) {
  if (error) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Upcoming Scheduled
            <AlertCircle className="h-5 w-5 text-red-500" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-sm text-red-600 mb-3">
              Failed to load scheduled content
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
            <Calendar className="h-5 w-5 mr-2" />
            Upcoming Scheduled
          </div>
          {onScheduleNew && !isLoading && (
            <Button
              variant="outline"
              size="sm"
              onClick={onScheduleNew}
            >
              <Plus className="h-4 w-4 mr-1" />
              Schedule
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <ScheduledItemSkeleton key={i} />
            ))}
          </div>
        ) : scheduledContent.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 mb-1">
              No scheduled content
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Schedule content to see it appear here
            </p>
            {onScheduleNew && (
              <Button
                variant="outline"
                size="sm"
                onClick={onScheduleNew}
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule Content
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {scheduledContent
              .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
              .map((item) => (
                <ScheduledItemComponent 
                  key={item.id} 
                  item={item} 
                />
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
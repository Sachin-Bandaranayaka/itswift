'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value?: number | string;
  change?: number;
  icon: LucideIcon;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
  formatValue?: (value: number | string) => string;
}

export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  isLoading = false,
  error = null,
  onRetry,
  className,
  formatValue = (val) => val?.toString() || '0'
}: StatCardProps) {
  const formatChange = (changeValue: number) => {
    const sign = changeValue >= 0 ? '+' : '';
    return `${sign}${changeValue.toFixed(1)}%`;
  };

  const getChangeColor = (changeValue: number) => {
    if (changeValue > 0) return 'text-green-600';
    if (changeValue < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  const getTrendIcon = (changeValue: number) => {
    return changeValue >= 0 ? TrendingUp : TrendingDown;
  };

  if (error) {
    return (
      <Card className={cn('relative', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <AlertCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm text-red-600">
              Failed to load data
            </div>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="h-8 px-2 text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('relative', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {isLoading ? (
          <Skeleton className="h-4 w-4 rounded" />
        ) : (
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-16" />
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">
                {formatValue(value || 0)}
              </div>
              {typeof change === 'number' && (
                <div className={cn(
                  'flex items-center text-xs',
                  getChangeColor(change)
                )}>
                  {(() => {
                    const TrendIcon = getTrendIcon(change);
                    return <TrendIcon className="h-3 w-3 mr-1" />;
                  })()}
                  {formatChange(change)} from last period
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  RefreshCw, 
  Wifi, 
  Server, 
  Database,
  Clock,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardErrorFallbackProps {
  error?: Error | null;
  onRetry?: () => void;
  onRefresh?: () => void;
  className?: string;
  title?: string;
  description?: string;
  showErrorDetails?: boolean;
}

export function DashboardErrorFallback({
  error,
  onRetry,
  onRefresh,
  className,
  title = "Dashboard Unavailable",
  description = "We're having trouble loading your dashboard data. This could be due to a network issue or temporary service interruption.",
  showErrorDetails = process.env.NODE_ENV === 'development'
}: DashboardErrorFallbackProps) {
  const getErrorIcon = () => {
    if (!error) return AlertTriangle;
    
    const errorMessage = error.message.toLowerCase();
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return Wifi;
    }
    if (errorMessage.includes('server') || errorMessage.includes('500')) {
      return Server;
    }
    if (errorMessage.includes('database') || errorMessage.includes('connection')) {
      return Database;
    }
    if (errorMessage.includes('timeout')) {
      return Clock;
    }
    return AlertTriangle;
  };

  const getErrorSuggestion = () => {
    if (!error) return "Please try refreshing the page or check your internet connection.";
    
    const errorMessage = error.message.toLowerCase();
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return "Please check your internet connection and try again.";
    }
    if (errorMessage.includes('server') || errorMessage.includes('500')) {
      return "Our servers are experiencing issues. Please try again in a few minutes.";
    }
    if (errorMessage.includes('database') || errorMessage.includes('connection')) {
      return "Database connection issue. Please try again shortly.";
    }
    if (errorMessage.includes('timeout')) {
      return "Request timed out. Please try again with a stable connection.";
    }
    if (errorMessage.includes('unauthorized') || errorMessage.includes('403')) {
      return "Authentication issue. Please refresh the page or log in again.";
    }
    return "Please try refreshing the page or contact support if the issue persists.";
  };

  const ErrorIcon = getErrorIcon();

  return (
    <div className={cn("min-h-[400px] flex items-center justify-center p-6", className)}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <ErrorIcon className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            {title}
          </CardTitle>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error suggestion */}
          <Alert>
            <AlertDescription className="text-sm">
              {getErrorSuggestion()}
            </AlertDescription>
          </Alert>

          {/* Error details in development */}
          {showErrorDetails && error && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm font-mono">
                <strong>Error:</strong> {error.message}
                {error.stack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs">Stack trace</summary>
                    <pre className="text-xs mt-1 whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </details>
                )}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            {onRetry && (
              <Button 
                onClick={onRetry}
                className="flex-1"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            {onRefresh && (
              <Button 
                onClick={onRefresh}
                className="flex-1"
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
            )}
            {!onRetry && !onRefresh && (
              <Button 
                onClick={() => window.location.reload()}
                className="flex-1"
                variant="default"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Page
              </Button>
            )}
          </div>

          {/* Additional help */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              If the problem continues, please{' '}
              <button 
                className="text-blue-600 hover:underline"
                onClick={() => {
                  // TODO: Open support modal or navigate to support page
                  console.log('Open support');
                }}
              >
                contact support
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Lightweight error fallback for individual dashboard sections
 */
interface SectionErrorFallbackProps {
  error?: Error | null;
  onRetry?: () => void;
  sectionName?: string;
  className?: string;
}

export function SectionErrorFallback({
  error,
  onRetry,
  sectionName = "section",
  className
}: SectionErrorFallbackProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-8 px-4", className)}>
      <AlertTriangle className="h-8 w-8 text-red-500 mb-3" />
      <h3 className="text-sm font-medium text-gray-900 mb-1">
        Failed to load {sectionName}
      </h3>
      <p className="text-xs text-gray-500 text-center mb-4">
        {error?.message || "An unexpected error occurred"}
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
  );
}

/**
 * Network status indicator component
 */
interface NetworkStatusProps {
  isOnline?: boolean;
  onRetry?: () => void;
}

export function NetworkStatus({ isOnline = true, onRetry }: NetworkStatusProps) {
  if (isOnline) return null;

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <Wifi className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        <div className="flex items-center justify-between">
          <span>You're currently offline. Some data may be outdated.</span>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Data staleness indicator
 */
interface DataFreshnessProps {
  lastUpdated?: number;
  staleThreshold?: number; // in milliseconds
  onRefresh?: () => void;
}

export function DataFreshness({ 
  lastUpdated, 
  staleThreshold = 10 * 60 * 1000, // 10 minutes
  onRefresh 
}: DataFreshnessProps) {
  if (!lastUpdated) return null;

  const now = Date.now();
  const isStale = now - lastUpdated > staleThreshold;

  if (!isStale) return null;

  const minutesAgo = Math.floor((now - lastUpdated) / (60 * 1000));

  return (
    <Alert className="mb-4 border-yellow-200 bg-yellow-50">
      <Clock className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        <div className="flex items-center justify-between">
          <span>
            Data was last updated {minutesAgo} minute{minutesAgo !== 1 ? 's' : ''} ago
          </span>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { DashboardErrorFallback } from './dashboard-error-fallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

/**
 * Specialized error boundary for dashboard components
 * Provides better error handling and recovery for dashboard-specific errors
 */
export class DashboardErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Generate unique error ID for tracking
    const errorId = `dashboard-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return { 
      hasError: true, 
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error details
    console.error('Dashboard Error Boundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      retryCount: this.retryCount,
      timestamp: new Date().toISOString()
    });
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // TODO: Integrate with error monitoring service (e.g., Sentry, LogRocket)
    try {
      // Example error reporting
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorId: this.state.errorId,
        retryCount: this.retryCount,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userId: 'admin', // TODO: Get actual user ID
        sessionId: sessionStorage.getItem('sessionId') || 'unknown'
      };

      // Send to monitoring service
      fetch('/api/admin/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      }).catch(reportingError => {
        console.error('Failed to report error:', reportingError);
      });
    } catch (reportingError) {
      console.error('Error in error reporting:', reportingError);
    }
  };

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`Dashboard retry mechanism attempt ${this.retryCount} of ${this.maxRetries}`);
      
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        errorId: undefined
      });
    } else {
      console.error('Max retries reached for dashboard error boundary');
      // Could show a different UI or redirect to a safe page
    }
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private isRecoverableError = (error: Error): boolean => {
    const recoverableErrors = [
      'ChunkLoadError',
      'Loading chunk',
      'Loading CSS chunk',
      'Network Error',
      'Failed to fetch',
      'TypeError: Failed to fetch'
    ];

    return recoverableErrors.some(errorType => 
      error.message.includes(errorType) || error.name.includes(errorType)
    );
  };

  private getErrorCategory = (error: Error): string => {
    // Error categorization for better handling
    if (error.message.includes('ChunkLoadError') || error.message.includes('Loading chunk')) {
      return 'chunk-loading';
    }
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return 'network';
    }
    if (error.message.includes('TypeError')) {
      return 'type-error';
    }
    if (error.message.includes('ReferenceError')) {
      return 'reference-error';
    }
    return 'unknown';
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorCategory = this.getErrorCategory(this.state.error);
      const isRecoverable = this.isRecoverableError(this.state.error);
      const canRetry = this.retryCount < this.maxRetries && isRecoverable;

      // Customize error message based on error type
      let title = "Dashboard Error";
      let description = "An unexpected error occurred while loading the dashboard.";

      switch (errorCategory) {
        case 'chunk-loading':
          title = "Loading Error";
          description = "Failed to load dashboard components. This usually happens after an app update.";
          break;
        case 'network':
          title = "Connection Error";
          description = "Unable to connect to the server. Please check your internet connection.";
          break;
        case 'type-error':
          title = "Data Error";
          description = "There was an issue processing dashboard data.";
          break;
        case 'reference-error':
          title = "Component Error";
          description = "A dashboard component failed to load properly.";
          break;
      }

      return (
        <DashboardErrorFallback
          error={this.state.error}
          onRetry={canRetry ? this.handleRetry : undefined}
          onRefresh={this.handleRefresh}
          title={title}
          description={description}
          showErrorDetails={process.env.NODE_ENV === 'development'}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * HOC for wrapping components with dashboard error boundary
 */
export function withDashboardErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <DashboardErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </DashboardErrorBoundary>
  );

  WrappedComponent.displayName = `withDashboardErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Hook for handling errors in functional components within dashboard
 */
export function useDashboardErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    console.error('Dashboard component error:', error);
    setError(error);
    
    // Report error in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to monitoring service
    }
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  // Throw error to be caught by error boundary
  if (error) {
    throw error;
  }

  return { handleError, clearError };
}
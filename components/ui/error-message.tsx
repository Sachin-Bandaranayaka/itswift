'use client'

import React from 'react'
import { AlertCircle, X, RefreshCw } from 'lucide-react'
import { Alert, AlertDescription } from './alert'
import { Button } from './button'

export interface ErrorMessageProps {
  error: string | Error | null
  onRetry?: () => void
  onDismiss?: () => void
  variant?: 'default' | 'destructive'
  showRetry?: boolean
  showDismiss?: boolean
  className?: string
}

export function ErrorMessage({
  error,
  onRetry,
  onDismiss,
  variant = 'destructive',
  showRetry = false,
  showDismiss = true,
  className
}: ErrorMessageProps) {
  if (!error) return null

  const errorMessage = error instanceof Error ? error.message : error

  return (
    <Alert variant={variant} className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span className="flex-1 mr-2">{errorMessage}</span>
        <div className="flex items-center gap-2">
          {showRetry && onRetry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="h-6 px-2"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
          {showDismiss && onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}

// Hook for managing error state
export function useErrorState(initialError: string | Error | null = null) {
  const [error, setError] = React.useState<string | Error | null>(initialError)

  const handleError = React.useCallback((error: string | Error) => {
    setError(error)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  const retry = React.useCallback((retryFunction: () => void | Promise<void>) => {
    clearError()
    try {
      const result = retryFunction()
      if (result instanceof Promise) {
        result.catch(handleError)
      }
    } catch (err) {
      handleError(err as Error)
    }
  }, [clearError, handleError])

  return {
    error,
    setError: handleError,
    clearError,
    retry,
    hasError: !!error
  }
}

// Component for displaying API errors with user-friendly messages
export function ApiErrorMessage({ 
  error, 
  onRetry, 
  onDismiss,
  className 
}: Omit<ErrorMessageProps, 'variant'>) {
  if (!error) return null

  // Convert technical errors to user-friendly messages
  const getUserFriendlyMessage = (error: string | Error): string => {
    const message = error instanceof Error ? error.message : error

    if (message.includes('fetch')) {
      return 'Unable to connect to the server. Please check your internet connection and try again.'
    }
    
    if (message.includes('401') || message.includes('unauthorized')) {
      return 'You are not authorized to perform this action. Please log in and try again.'
    }
    
    if (message.includes('403') || message.includes('forbidden')) {
      return 'You do not have permission to perform this action.'
    }
    
    if (message.includes('404') || message.includes('not found')) {
      return 'The requested resource was not found.'
    }
    
    if (message.includes('429') || message.includes('rate limit')) {
      return 'Too many requests. Please wait a moment and try again.'
    }
    
    if (message.includes('500') || message.includes('internal server error')) {
      return 'A server error occurred. Please try again later.'
    }
    
    if (message.includes('timeout')) {
      return 'The request timed out. Please try again.'
    }
    
    // Return original message if no specific pattern matches
    return message
  }

  const friendlyMessage = getUserFriendlyMessage(error)

  return (
    <ErrorMessage
      error={friendlyMessage}
      onRetry={onRetry}
      onDismiss={onDismiss}
      variant="destructive"
      showRetry={!!onRetry}
      className={className}
    />
  )
}
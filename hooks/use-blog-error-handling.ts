'use client'

import { useState, useCallback, useRef } from 'react'
import { withRetry } from '@/lib/utils/error-handler'

export interface BlogErrorState {
  error: string | Error | null
  isRetrying: boolean
  retryCount: number
  lastRetryAt: Date | null
}

export interface BlogErrorHandlingOptions {
  maxRetries?: number
  retryDelay?: number
  onError?: (error: Error) => void
  onRetrySuccess?: () => void
  onMaxRetriesReached?: (error: Error) => void
}

export function useBlogErrorHandling(options: BlogErrorHandlingOptions = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onError,
    onRetrySuccess,
    onMaxRetriesReached
  } = options

  const [errorState, setErrorState] = useState<BlogErrorState>({
    error: null,
    isRetrying: false,
    retryCount: 0,
    lastRetryAt: null
  })

  const retryTimeoutRef = useRef<NodeJS.Timeout>()

  const setError = useCallback((error: string | Error) => {
    const errorObj = error instanceof Error ? error : new Error(error)
    
    setErrorState(prev => ({
      ...prev,
      error: errorObj,
      isRetrying: false
    }))

    if (onError) {
      onError(errorObj)
    }
  }, [onError])

  const clearError = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }
    
    setErrorState({
      error: null,
      isRetrying: false,
      retryCount: 0,
      lastRetryAt: null
    })
  }, [])

  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    customMaxRetries?: number
  ): Promise<T | null> => {
    const actualMaxRetries = customMaxRetries ?? maxRetries
    
    try {
      clearError()
      const result = await withRetry(operation, actualMaxRetries, retryDelay)
      
      if (onRetrySuccess && errorState.retryCount > 0) {
        onRetrySuccess()
      }
      
      return result
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      setError(errorObj)
      
      if (onMaxRetriesReached) {
        onMaxRetriesReached(errorObj)
      }
      
      return null
    }
  }, [maxRetries, retryDelay, clearError, setError, onRetrySuccess, onMaxRetriesReached, errorState.retryCount])

  const retry = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    if (errorState.retryCount >= maxRetries) {
      if (onMaxRetriesReached && errorState.error) {
        onMaxRetriesReached(errorState.error instanceof Error ? errorState.error : new Error(String(errorState.error)))
      }
      return null
    }

    setErrorState(prev => ({
      ...prev,
      isRetrying: true,
      retryCount: prev.retryCount + 1,
      lastRetryAt: new Date()
    }))

    try {
      const result = await operation()
      
      // Success - clear error state
      clearError()
      
      if (onRetrySuccess) {
        onRetrySuccess()
      }
      
      return result
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      
      setErrorState(prev => ({
        ...prev,
        error: errorObj,
        isRetrying: false
      }))

      if (onError) {
        onError(errorObj)
      }

      return null
    }
  }, [errorState.retryCount, maxRetries, clearError, onError, onRetrySuccess, onMaxRetriesReached])

  const scheduleRetry = useCallback(<T>(
    operation: () => Promise<T>,
    delay: number = retryDelay
  ) => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
    }

    retryTimeoutRef.current = setTimeout(() => {
      retry(operation)
    }, delay)
  }, [retry, retryDelay])

  const canRetry = errorState.retryCount < maxRetries && !errorState.isRetrying

  return {
    error: errorState.error,
    isRetrying: errorState.isRetrying,
    retryCount: errorState.retryCount,
    lastRetryAt: errorState.lastRetryAt,
    canRetry,
    setError,
    clearError,
    retry,
    scheduleRetry,
    executeWithErrorHandling
  }
}

// Specialized hook for blog data fetching
export function useBlogDataErrorHandling() {
  const errorHandling = useBlogErrorHandling({
    maxRetries: 3,
    retryDelay: 2000,
    onError: (error) => {
      console.error('Blog data error:', error)
    },
    onRetrySuccess: () => {
      console.log('Blog data retry successful')
    },
    onMaxRetriesReached: (error) => {
      console.error('Max retries reached for blog data:', error)
    }
  })

  const fetchWithErrorHandling = useCallback(async <T>(
    fetchFunction: () => Promise<T>
  ): Promise<T | null> => {
    return errorHandling.executeWithErrorHandling(fetchFunction)
  }, [errorHandling])

  return {
    ...errorHandling,
    fetchWithErrorHandling
  }
}

// Hook for handling individual blog post errors
export function useBlogPostErrorHandling() {
  const errorHandling = useBlogErrorHandling({
    maxRetries: 2,
    retryDelay: 1500,
    onError: (error) => {
      console.error('Blog post error:', error)
    }
  })

  const getUserFriendlyError = useCallback((error: string | Error): string => {
    const message = error instanceof Error ? error.message : error
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes('not found') || lowerMessage.includes('404')) {
      return 'This blog post could not be found. It may have been moved or deleted.'
    }

    if (lowerMessage.includes('fetch') || lowerMessage.includes('network')) {
      return 'Unable to load the blog post. Please check your internet connection.'
    }

    if (lowerMessage.includes('timeout')) {
      return 'The blog post is taking too long to load. Please try again.'
    }

    if (lowerMessage.includes('500') || lowerMessage.includes('server')) {
      return 'Our servers are experiencing issues. Please try again in a few moments.'
    }

    return 'Unable to load the blog post. Please try again.'
  }, [])

  return {
    ...errorHandling,
    getUserFriendlyError
  }
}
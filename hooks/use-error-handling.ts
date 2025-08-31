'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'

export interface UseErrorHandlingOptions {
  showToast?: boolean
  logErrors?: boolean
  onError?: (error: Error) => void
}

export interface ErrorState {
  error: Error | null
  hasError: boolean
  isRetrying: boolean
}

export function useErrorHandling(options: UseErrorHandlingOptions = {}) {
  const { showToast = true, logErrors = true, onError } = options
  
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    hasError: false,
    isRetrying: false
  })

  const handleError = useCallback((error: Error | string) => {
    const errorObj = error instanceof Error ? error : new Error(error)
    
    // Log error if enabled
    if (logErrors) {
      console.error('Error handled:', errorObj)
    }
    
    // Show toast notification if enabled
    if (showToast) {
      toast.error(getUserFriendlyMessage(errorObj.message))
    }
    
    // Call custom error handler if provided
    if (onError) {
      onError(errorObj)
    }
    
    // Update error state
    setErrorState({
      error: errorObj,
      hasError: true,
      isRetrying: false
    })
  }, [showToast, logErrors, onError])

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      hasError: false,
      isRetrying: false
    })
  }, [])

  const retry = useCallback(async (retryFunction: () => Promise<void> | void) => {
    setErrorState(prev => ({ ...prev, isRetrying: true }))
    
    try {
      await retryFunction()
      clearError()
    } catch (error) {
      handleError(error as Error)
    }
  }, [handleError, clearError])

  // Wrapper for async operations
  const withErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    options?: { silent?: boolean }
  ): Promise<T | null> => {
    try {
      clearError()
      return await operation()
    } catch (error) {
      if (!options?.silent) {
        handleError(error as Error)
      }
      return null
    }
  }, [handleError, clearError])

  return {
    ...errorState,
    handleError,
    clearError,
    retry,
    withErrorHandling
  }
}

// Hook specifically for API calls
export function useApiErrorHandling() {
  const errorHandling = useErrorHandling({
    showToast: true,
    logErrors: true
  })

  const handleApiError = useCallback((error: unknown) => {
    if (error instanceof Response) {
      // Handle Response objects
      error.json().then(data => {
        const message = data.error || data.message || 'An API error occurred'
        errorHandling.handleError(new Error(message))
      }).catch(() => {
        errorHandling.handleError(new Error(`API error: ${error.status} ${error.statusText}`))
      })
    } else if (error instanceof Error) {
      errorHandling.handleError(error)
    } else {
      errorHandling.handleError(new Error('An unknown API error occurred'))
    }
  }, [errorHandling])

  const apiCall = useCallback(async <T>(
    operation: () => Promise<T>,
    options?: { silent?: boolean }
  ): Promise<T | null> => {
    try {
      errorHandling.clearError()
      return await operation()
    } catch (error) {
      if (!options?.silent) {
        handleApiError(error)
      }
      return null
    }
  }, [errorHandling, handleApiError])

  return {
    ...errorHandling,
    handleApiError,
    apiCall
  }
}

// Utility function to convert technical errors to user-friendly messages
function getUserFriendlyMessage(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
    return 'Network error. Please check your connection and try again.'
  }
  
  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('401')) {
    return 'You need to log in to perform this action.'
  }
  
  if (lowerMessage.includes('forbidden') || lowerMessage.includes('403')) {
    return 'You do not have permission to perform this action.'
  }
  
  if (lowerMessage.includes('not found') || lowerMessage.includes('404')) {
    return 'The requested resource was not found.'
  }
  
  if (lowerMessage.includes('rate limit') || lowerMessage.includes('429')) {
    return 'Too many requests. Please wait a moment and try again.'
  }
  
  if (lowerMessage.includes('server error') || lowerMessage.includes('500')) {
    return 'A server error occurred. Please try again later.'
  }
  
  if (lowerMessage.includes('timeout')) {
    return 'The request timed out. Please try again.'
  }
  
  if (lowerMessage.includes('validation')) {
    return 'Please check your input and try again.'
  }
  
  // Return original message if no pattern matches
  return message
}

// Hook for form error handling
export function useFormErrorHandling() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  const setFieldError = useCallback((field: string, error: string) => {
    setFieldErrors(prev => ({ ...prev, [field]: error }))
  }, [])

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setFieldErrors({})
    setGeneralError(null)
  }, [])

  const handleValidationErrors = useCallback((errors: Record<string, string> | string) => {
    if (typeof errors === 'string') {
      setGeneralError(errors)
    } else {
      setFieldErrors(errors)
    }
  }, [])

  return {
    fieldErrors,
    generalError,
    setFieldError,
    clearFieldError,
    setGeneralError,
    clearAllErrors,
    handleValidationErrors,
    hasErrors: Object.keys(fieldErrors).length > 0 || !!generalError
  }
}
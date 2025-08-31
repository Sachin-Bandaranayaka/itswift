'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LoadingStateProps {
  loading: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

export function LoadingState({ 
  loading, 
  children, 
  fallback,
  className 
}: LoadingStateProps) {
  if (loading) {
    return fallback || <DefaultLoadingFallback className={className} />
  }

  return <>{children}</>
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <Loader2 
      className={cn(
        'animate-spin text-muted-foreground',
        sizeClasses[size],
        className
      )} 
    />
  )
}

export interface DefaultLoadingFallbackProps {
  message?: string
  className?: string
}

export function DefaultLoadingFallback({ 
  message = 'Loading...', 
  className 
}: DefaultLoadingFallbackProps) {
  return (
    <div className={cn(
      'flex items-center justify-center p-8',
      className
    )}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <LoadingSpinner />
        <span>{message}</span>
      </div>
    </div>
  )
}

// Hook for managing loading states
export function useLoadingState(initialLoading: boolean = false) {
  const [loading, setLoading] = React.useState(initialLoading)

  const withLoading = React.useCallback(async <T,>(
    asyncOperation: () => Promise<T>
  ): Promise<T> => {
    setLoading(true)
    try {
      const result = await asyncOperation()
      return result
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    setLoading,
    withLoading
  }
}

// Component for buttons with loading state
export interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
  children: React.ReactNode
}

export function LoadingButton({ 
  loading = false, 
  loadingText = 'Loading...', 
  children, 
  disabled,
  className,
  ...props 
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        className
      )}
    >
      {loading && <LoadingSpinner size="sm" />}
      {loading ? loadingText : children}
    </button>
  )
}

// Skeleton loading components
export interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  )
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )} 
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn('p-4 border rounded-lg', className)}>
      <div className="space-y-3">
        <Skeleton className="h-4 w-1/2" />
        <SkeletonText lines={2} />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  )
}
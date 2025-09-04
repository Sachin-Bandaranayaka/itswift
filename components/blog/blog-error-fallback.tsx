'use client'

import React from 'react'
import { AlertCircle, RefreshCw, Wifi, WifiOff, Server } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export interface BlogErrorFallbackProps {
  error: string | Error | null
  onRetry?: () => void
  variant?: 'network' | 'server' | 'content' | 'generic'
  showRetry?: boolean
  className?: string
}

export function BlogErrorFallback({
  error,
  onRetry,
  variant = 'generic',
  showRetry = true,
  className = ''
}: BlogErrorFallbackProps) {
  if (!error) return null

  const errorMessage = error instanceof Error ? error.message : error

  // Determine error type and appropriate messaging
  const getErrorConfig = () => {
    const message = errorMessage.toLowerCase()
    
    if (message.includes('fetch') || message.includes('network') || message.includes('connection')) {
      return {
        variant: 'network' as const,
        icon: WifiOff,
        title: 'Connection Problem',
        description: 'Unable to connect to our servers. Please check your internet connection.',
        suggestion: 'Check your internet connection and try again.'
      }
    }
    
    if (message.includes('500') || message.includes('server') || message.includes('internal')) {
      return {
        variant: 'server' as const,
        icon: Server,
        title: 'Server Error',
        description: 'Our servers are experiencing issues. This is temporary.',
        suggestion: 'Please try again in a few moments.'
      }
    }
    
    if (message.includes('timeout')) {
      return {
        variant: 'network' as const,
        icon: Wifi,
        title: 'Request Timeout',
        description: 'The request took too long to complete.',
        suggestion: 'Please try again with a better connection.'
      }
    }
    
    if (message.includes('not found') || message.includes('404')) {
      return {
        variant: 'content' as const,
        icon: AlertCircle,
        title: 'Content Not Found',
        description: 'The requested blog content could not be found.',
        suggestion: 'The content may have been moved or deleted.'
      }
    }
    
    return {
      variant: 'generic' as const,
      icon: AlertCircle,
      title: 'Something Went Wrong',
      description: 'We encountered an unexpected error while loading the blog content.',
      suggestion: 'Please try refreshing the page.'
    }
  }

  const config = getErrorConfig()
  const IconComponent = config.icon

  return (
    <div className={`py-8 ${className}`}>
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-lg font-semibold">
            {config.title}
          </CardTitle>
          <CardDescription>
            {config.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription className="text-sm">
              {config.suggestion}
            </AlertDescription>
          </Alert>
          
          {showRetry && onRetry && (
            <div className="text-center">
              <Button 
                onClick={onRetry}
                variant="default"
                className="flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Specific fallback for empty blog state
export function BlogEmptyFallback({ 
  title = "No Blog Posts Found",
  description = "There are currently no published blog posts available. Check back later for new content!",
  showCreateButton = false,
  onCreatePost
}: {
  title?: string
  description?: string
  showCreateButton?: boolean
  onCreatePost?: () => void
}) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto mb-6 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">
        {title}
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {description}
      </p>
      
      {showCreateButton && onCreatePost && (
        <Button onClick={onCreatePost} variant="default">
          Create First Post
        </Button>
      )}
    </div>
  )
}

// Fallback for filtered results
export function BlogNoResultsFallback({
  searchTerm,
  category,
  onClearFilters
}: {
  searchTerm?: string
  category?: string
  onClearFilters?: () => void
}) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto mb-6 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">
        No Posts Match Your Filters
      </h2>
      <div className="text-muted-foreground mb-6 max-w-md mx-auto space-y-2">
        {searchTerm && (
          <p>No posts found for "{searchTerm}"</p>
        )}
        {category && (
          <p>No posts found in category "{category}"</p>
        )}
        <p>Try adjusting your search terms or category selection to find more posts.</p>
      </div>
      
      {onClearFilters && (
        <Button onClick={onClearFilters} variant="outline">
          Clear Filters
        </Button>
      )}
    </div>
  )
}
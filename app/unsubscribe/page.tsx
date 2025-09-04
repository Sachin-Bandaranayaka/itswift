'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Mail, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface UnsubscribeState {
  loading: boolean
  success: boolean
  error: string | null
  message: string | null
  showResubscribe: boolean
}

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const errorParam = searchParams.get('error')
  
  const [state, setState] = useState<UnsubscribeState>({
    loading: false,
    success: false,
    error: null,
    message: null,
    showResubscribe: false
  })

  useEffect(() => {
    // Handle URL error parameters
    if (errorParam) {
      let errorMessage = 'An error occurred'
      switch (errorParam) {
        case 'missing_token':
          errorMessage = 'Missing unsubscribe token. Please use the link from your email.'
          break
        case 'invalid_token':
          errorMessage = 'Invalid or expired unsubscribe token. Please contact support if you need assistance.'
          break
        case 'server_error':
          errorMessage = 'A server error occurred. Please try again later.'
          break
      }
      setState(prev => ({ ...prev, error: errorMessage }))
    }
  }, [errorParam])

  const handleUnsubscribe = async () => {
    if (!token) {
      setState(prev => ({ ...prev, error: 'No unsubscribe token provided' }))
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          confirmed: true
        })
      })

      const data = await response.json()

      if (data.success) {
        setState(prev => ({
          ...prev,
          loading: false,
          success: true,
          message: data.message,
          showResubscribe: true
        }))
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: data.error || 'Failed to unsubscribe'
        }))
      }
    } catch (error) {
      console.error('Error unsubscribing:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Network error. Please try again.'
      }))
    }
  }

  const handleResubscribe = async () => {
    if (!token) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Get subscriber info from token first
      const subscriberResponse = await fetch(`/api/newsletter/subscriber-by-token?token=${encodeURIComponent(token)}`)
      const subscriberData = await subscriberResponse.json()

      if (!subscriberData.success || !subscriberData.subscriber) {
        throw new Error('Could not find subscriber information')
      }

      // Resubscribe using the homepage subscription endpoint
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: subscriberData.subscriber.email,
          first_name: subscriberData.subscriber.first_name,
          last_name: subscriberData.subscriber.last_name,
          source: 'resubscribe'
        })
      })

      const data = await response.json()

      if (data.success) {
        setState(prev => ({
          ...prev,
          loading: false,
          success: true,
          message: 'Welcome back! You have been resubscribed to our newsletter.',
          showResubscribe: false
        }))
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: data.error || 'Failed to resubscribe'
        }))
      }
    } catch (error) {
      console.error('Error resubscribing:', error)
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Network error. Please try again.'
      }))
    }
  }

  // Show error state
  if (state.error && !token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-red-900">Unsubscribe Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
            <div className="flex justify-center">
              <Button asChild variant="outline">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Homepage
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show success state
  if (state.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-green-900">
              {state.showResubscribe ? 'Unsubscribed Successfully' : 'Subscription Updated'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
            
            {state.showResubscribe && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 text-center">
                  Changed your mind? You can resubscribe anytime.
                </p>
                <Button 
                  onClick={handleResubscribe}
                  disabled={state.loading}
                  className="w-full"
                  variant="outline"
                >
                  {state.loading ? 'Processing...' : 'Resubscribe to Newsletter'}
                </Button>
              </div>
            )}
            
            <div className="flex justify-center pt-4">
              <Button asChild variant="outline">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Homepage
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show confirmation form
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle>Unsubscribe from Newsletter</CardTitle>
          <CardDescription>
            We're sorry to see you go. Are you sure you want to unsubscribe from our newsletter?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-3">
            <Button 
              onClick={handleUnsubscribe}
              disabled={state.loading || !token}
              className="w-full"
              variant="destructive"
            >
              {state.loading ? 'Processing...' : 'Yes, Unsubscribe Me'}
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                Keep My Subscription
              </Link>
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 text-center space-y-1">
            <p>You will no longer receive our newsletter emails.</p>
            <p>You can resubscribe anytime from our homepage.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  )
}
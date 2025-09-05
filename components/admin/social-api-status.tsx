'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Linkedin,
  Twitter,
  Settings,
  Zap
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ApiStatus {
  linkedin: {
    configured: boolean
    tokenValid: boolean
  }
  twitter: {
    configured: boolean
    tokenValid: boolean
  }
}

interface SocialApiStatusProps {
  className?: string
}

export function SocialApiStatus({ className }: SocialApiStatusProps) {
  const [status, setStatus] = useState<ApiStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isUpdatingMetrics, setIsUpdatingMetrics] = useState(false)
  const { toast } = useToast()

  const fetchStatus = async () => {
    try {
      setIsRefreshing(true)
      const response = await fetch('/api/admin/social/status')
      const result = await response.json()

      if (response.ok) {
        setStatus(result.data.apis)
      } else {
        throw new Error(result.error || 'Failed to fetch status')
      }
    } catch (error) {
      console.error('Error fetching API status:', error)
      toast({
        title: "Error",
        description: "Failed to fetch API status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const updateMetrics = async () => {
    try {
      setIsUpdatingMetrics(true)
      const response = await fetch('/api/admin/social/status', {
        method: 'POST'
      })
      const result = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Metrics update started in background",
        })
      } else {
        throw new Error(result.error || 'Failed to update metrics')
      }
    } catch (error) {
      console.error('Error updating metrics:', error)
      toast({
        title: "Error",
        description: "Failed to start metrics update",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingMetrics(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const getStatusIcon = (configured: boolean, tokenValid: boolean) => {
    if (!configured) {
      return <XCircle className="h-4 w-4 text-red-500" />
    }
    if (!tokenValid) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  const getStatusBadge = (configured: boolean, tokenValid: boolean) => {
    if (!configured) {
      return <Badge variant="destructive">Not Configured</Badge>
    }
    if (!tokenValid) {
      return <Badge variant="secondary">Token Invalid</Badge>
    }
    return <Badge variant="default" className="bg-green-600">Ready</Badge>
  }

  const getStatusMessage = (configured: boolean, tokenValid: boolean) => {
    if (!configured) {
      return "API credentials not configured. Check environment variables."
    }
    if (!tokenValid) {
      return "API credentials configured but token validation failed. Check token permissions."
    }
    return "API is properly configured and ready for posting."
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Social Media API Status
          </CardTitle>
          <CardDescription>Loading API status...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!status) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Social Media API Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load API status. Please try refreshing.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const overallReady = (status.linkedin.configured && status.linkedin.tokenValid) || 
                      (status.twitter.configured && status.twitter.tokenValid)

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Social Media API Status
            </CardTitle>
            <CardDescription>
              Monitor and manage your social media API connections
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={updateMetrics}
              disabled={isUpdatingMetrics || !overallReady}
            >
              <Zap className="h-4 w-4 mr-2" />
              {isUpdatingMetrics ? 'Updating...' : 'Update Metrics'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStatus}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Status */}
        <Alert variant={overallReady ? "default" : "destructive"}>
          {overallReady ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            {overallReady 
              ? "At least one social media platform is ready for posting."
              : "No social media platforms are properly configured. Configure at least one platform to enable posting."
            }
          </AlertDescription>
        </Alert>

        {/* Platform Status */}
        <div className="space-y-4">
          <h4 className="font-medium">Platform Status</h4>
          
          {/* LinkedIn */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Linkedin className="h-6 w-6 text-blue-600" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">LinkedIn</span>
                  {getStatusIcon(status.linkedin.configured, status.linkedin.tokenValid)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {getStatusMessage(status.linkedin.configured, status.linkedin.tokenValid)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {status.linkedin.configured && !status.linkedin.tokenValid && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('/api/admin/social/linkedin/auth', '_blank')}
                >
                  Authorize LinkedIn
                </Button>
              )}
              {getStatusBadge(status.linkedin.configured, status.linkedin.tokenValid)}
            </div>
          </div>

          {/* Twitter */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Twitter className="h-6 w-6 text-black dark:text-white" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Twitter/X</span>
                  {getStatusIcon(status.twitter.configured, status.twitter.tokenValid)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {getStatusMessage(status.twitter.configured, status.twitter.tokenValid)}
                </p>
              </div>
            </div>
            <div>
              {getStatusBadge(status.twitter.configured, status.twitter.tokenValid)}
            </div>
          </div>
        </div>

        {/* Configuration Help */}
        {!overallReady && (
          <div className="space-y-3">
            <h4 className="font-medium">Configuration Help</h4>
            <div className="text-sm text-muted-foreground space-y-3">
              <div>
                <p><strong>LinkedIn:</strong></p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in your environment variables</li>
                  <li>Click "Authorize LinkedIn" button above to get an access token</li>
                  <li>Add the token to your .env.local file as LINKEDIN_ACCESS_TOKEN</li>
                </ul>
                {status.linkedin.configured && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.open('/api/admin/social/linkedin/auth', '_blank')}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    Get LinkedIn Access Token
                  </Button>
                )}
              </div>
              <div>
                <p><strong>Twitter/X:</strong> Set TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET, and TWITTER_BEARER_TOKEN in your environment variables.</p>
              </div>
              <p className="text-xs">Restart the application after updating environment variables.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
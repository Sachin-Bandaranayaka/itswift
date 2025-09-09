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
  Zap,
  ExternalLink
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AyrshareStatus {
  success: boolean
  connectedPlatforms: string[]
  accountDetails?: Array<{
    platform: string
    displayName: string
    username: string
    profileUrl: string
  }>
  monthlyQuota?: {
    used: number
    limit: number
    remaining: number
  }
  error?: string
}

interface AyrshareApiStatusProps {
  className?: string
}

export function AyrshareApiStatus({ className }: AyrshareApiStatusProps) {
  const [status, setStatus] = useState<AyrshareStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const { toast } = useToast()

  const fetchStatus = async () => {
    try {
      setIsRefreshing(true)
      const response = await fetch('/api/admin/social/ayrshare/test')
      const result = await response.json()

      setStatus(result)
    } catch (error) {
      console.error('Error fetching Ayrshare status:', error)
      setStatus({
        success: false,
        connectedPlatforms: [],
        error: 'Failed to connect to Ayrshare API'
      })
      toast({
        title: "Error",
        description: "Failed to fetch Ayrshare API status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const sendTestPost = async () => {
    try {
      setIsTesting(true)
      const response = await fetch('/api/admin/social/ayrshare/test', {
        method: 'POST'
      })
      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Test post sent successfully to all connected platforms!",
        })
      } else {
        throw new Error(result.error || 'Failed to send test post')
      }
    } catch (error) {
      console.error('Error sending test post:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send test post",
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin':
        return <Linkedin className="h-5 w-5 text-blue-600" />
      case 'twitter':
        return <Twitter className="h-5 w-5 text-black dark:text-white" />
      default:
        return <div className="h-5 w-5 bg-gray-400 rounded" />
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ayrshare API Status
          </CardTitle>
          <CardDescription>Loading API status...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-16 bg-muted animate-pulse rounded" />
            <div className="h-32 bg-muted animate-pulse rounded" />
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
            Ayrshare API Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load Ayrshare API status. Please try refreshing.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Ayrshare API Status
            </CardTitle>
            <CardDescription>
              Monitor your Ayrshare integration and connected social media accounts
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={sendTestPost}
              disabled={isTesting || !status.success}
            >
              <Zap className="h-4 w-4 mr-2" />
              {isTesting ? 'Sending...' : 'Send Test Post'}
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
        <Alert variant={status.success ? "default" : "destructive"}>
          {status.success ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <AlertDescription>
            {status.success 
              ? `Ayrshare API is connected with ${status.connectedPlatforms.length} platform(s).`
              : status.error || "Ayrshare API connection failed."
            }
          </AlertDescription>
        </Alert>

        {/* Monthly Quota */}
        {status.success && status.monthlyQuota && (
          <div className="p-4 border rounded-lg">
            <h4 className="font-medium mb-2">Monthly Usage</h4>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {status.monthlyQuota.used} / {status.monthlyQuota.limit} posts used
              </div>
              <Badge variant={status.monthlyQuota.remaining > 5 ? "default" : "destructive"}>
                {status.monthlyQuota.remaining} remaining
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ 
                  width: `${Math.min((status.monthlyQuota.used / status.monthlyQuota.limit) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        )}

        {/* Connected Platforms */}
        {status.success && status.accountDetails && (
          <div className="space-y-4">
            <h4 className="font-medium">Connected Accounts</h4>
            <div className="space-y-3">
              {status.accountDetails.map((account, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getPlatformIcon(account.platform)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{account.platform}</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {account.displayName} (@{account.username})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(account.profileUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                    <Badge variant="default" className="bg-green-600">Connected</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Configuration Help */}
        {!status.success && (
          <div className="space-y-3">
            <h4 className="font-medium">Setup Instructions</h4>
            <div className="text-sm text-muted-foreground space-y-3">
              <div>
                <p><strong>Step 1:</strong> Create an Ayrshare account at <a href="https://www.ayrshare.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ayrshare.com</a></p>
              </div>
              <div>
                <p><strong>Step 2:</strong> Connect your LinkedIn and Twitter accounts in the Ayrshare dashboard</p>
              </div>
              <div>
                <p><strong>Step 3:</strong> Get your API key from the Ayrshare dashboard</p>
              </div>
              <div>
                <p><strong>Step 4:</strong> Add your API key to your environment variables:</p>
                <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1">
                  AYRSHARE_API_KEY=your_api_key_here
                </code>
              </div>
              <div>
                <p><strong>Step 5:</strong> Restart your application</p>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://www.ayrshare.com', '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Go to Ayrshare
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://docs.ayrshare.com', '_blank')}
                >
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
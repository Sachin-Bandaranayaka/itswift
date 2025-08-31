'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Play,
  Pause,
  Settings
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SchedulerStats {
  totalScheduled: number
  readyToProcess: number
  byType: {
    social: { total: number; ready: number }
    newsletter: { total: number; ready: number }
  }
  error: string | null
}

interface SchedulerHealth {
  healthy: boolean
  lastRun?: Date
  nextRun?: Date
  errors: string[]
}

interface ProcessingResult {
  processed: number
  successful: number
  failed: number
  errors: string[]
  details: {
    social: { processed: number; successful: number; failed: number }
    newsletter: { processed: number; successful: number; failed: number }
  }
}

export function SchedulerMonitor() {
  const { toast } = useToast()
  const [stats, setStats] = useState<SchedulerStats | null>(null)
  const [health, setHealth] = useState<SchedulerHealth | null>(null)
  const [lastResult, setLastResult] = useState<ProcessingResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/scheduler?action=status')
      const data = await response.json()
      
      if (data.success) {
        // Transform new status format to legacy stats format for compatibility
        const status = data.data
        setStats({
          totalScheduled: status.queueStats.total,
          readyToProcess: status.queueStats.pending,
          byType: {
            social: { 
              total: status.queueStats.byType.social.total, 
              ready: status.queueStats.byType.social.pending 
            },
            newsletter: { 
              total: status.queueStats.byType.newsletter.total, 
              ready: status.queueStats.byType.newsletter.pending 
            }
          },
          error: null
        })
      } else {
        throw new Error(data.error || 'Failed to fetch stats')
      }
    } catch (error) {
      console.error('Error fetching scheduler stats:', error)
      toast({
        title: "Error",
        description: "Failed to fetch scheduler statistics",
        variant: "destructive"
      })
    }
  }

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/admin/scheduler?action=health')
      const data = await response.json()
      
      if (data.success) {
        setHealth({
          healthy: data.data.healthy,
          errors: data.data.issues || []
        })
      } else {
        throw new Error(data.error || 'Failed to fetch health')
      }
    } catch (error) {
      console.error('Error fetching scheduler health:', error)
      toast({
        title: "Error",
        description: "Failed to fetch scheduler health",
        variant: "destructive"
      })
    }
  }

  const fetchData = async () => {
    setIsLoading(true)
    await Promise.all([fetchStats(), fetchHealth()])
    setIsLoading(false)
  }

  const processScheduledContent = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/admin/scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'process' })
      })

      const data = await response.json()
      
      if (data.success) {
        setLastResult(data.data)
        toast({
          title: "Success",
          description: data.message
        })
        // Refresh stats after processing
        await fetchData()
      } else {
        throw new Error(data.error || 'Failed to process content')
      }
    } catch (error) {
      console.error('Error processing scheduled content:', error)
      toast({
        title: "Error",
        description: "Failed to process scheduled content",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [autoRefresh])

  const getHealthStatus = () => {
    if (!health) return { status: 'unknown', color: 'gray' }
    
    if (health.healthy) {
      return { status: 'healthy', color: 'green' }
    } else if (health.errors.length > 0) {
      return { status: 'error', color: 'red' }
    } else {
      return { status: 'warning', color: 'yellow' }
    }
  }

  const healthStatus = getHealthStatus()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Scheduler Monitor
          </CardTitle>
          <CardDescription>Loading scheduler status...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Scheduler Monitor</h2>
          <p className="text-muted-foreground">
            Monitor and control the content scheduling system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {autoRefresh ? 'Pause' : 'Resume'} Auto-refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
            <Badge 
              variant={healthStatus.color === 'green' ? 'default' : 'destructive'}
              className="ml-auto"
            >
              {healthStatus.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {health?.errors && health.errors.length > 0 && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  {health.errors.map((error, index) => (
                    <div key={index}>{error}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {health?.healthy ? 'Online' : 'Offline'}
              </div>
              <div className="text-sm text-muted-foreground">Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {health?.lastRun ? new Date(health.lastRun).toLocaleTimeString() : 'Never'}
              </div>
              <div className="text-sm text-muted-foreground">Last Run</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalScheduled || 0}</div>
            <p className="text-xs text-muted-foreground">
              All scheduled content
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready to Process</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats?.readyToProcess || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Due for processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social Posts</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats?.byType.social.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.byType.social.ready || 0} ready
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Newsletters</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats?.byType.newsletter.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.byType.newsletter.ready || 0} ready
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions and Results */}
      <Tabs defaultValue="actions" className="w-full">
        <TabsList>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="results">Last Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Processing</CardTitle>
              <CardDescription>
                Manually trigger processing of scheduled content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button
                  onClick={processScheduledContent}
                  disabled={isProcessing || (stats?.readyToProcess || 0) === 0}
                  className="flex items-center gap-2"
                >
                  {isProcessing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {isProcessing ? 'Processing...' : 'Process Now'}
                </Button>
                <div className="text-sm text-muted-foreground">
                  {stats?.readyToProcess || 0} items ready for processing
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {lastResult ? (
            <Card>
              <CardHeader>
                <CardTitle>Processing Results</CardTitle>
                <CardDescription>
                  Results from the last processing run
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{lastResult.processed}</div>
                    <div className="text-sm text-muted-foreground">Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{lastResult.successful}</div>
                    <div className="text-sm text-muted-foreground">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{lastResult.failed}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                </div>

                {lastResult.processed > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Success Rate</span>
                      <span>{Math.round((lastResult.successful / lastResult.processed) * 100)}%</span>
                    </div>
                    <Progress 
                      value={(lastResult.successful / lastResult.processed) * 100} 
                      className="w-full"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h4 className="font-medium mb-2">Social Media</h4>
                    <div className="text-sm space-y-1">
                      <div>Processed: {lastResult.details.social.processed}</div>
                      <div className="text-green-600">Successful: {lastResult.details.social.successful}</div>
                      <div className="text-red-600">Failed: {lastResult.details.social.failed}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Newsletters</h4>
                    <div className="text-sm space-y-1">
                      <div>Processed: {lastResult.details.newsletter.processed}</div>
                      <div className="text-green-600">Successful: {lastResult.details.newsletter.successful}</div>
                      <div className="text-red-600">Failed: {lastResult.details.newsletter.failed}</div>
                    </div>
                  </div>
                </div>

                {lastResult.errors && lastResult.errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <div className="font-medium">Errors encountered:</div>
                        {lastResult.errors.map((error, index) => (
                          <div key={index} className="text-sm">{error}</div>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-muted-foreground">
                  No processing results available yet
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Database, 
  Bot, 
  Mail, 
  Share2,
  Shield,
  Activity
} from 'lucide-react'

interface ServiceStatus {
  name: string
  status: 'connected' | 'configured' | 'not configured' | 'error'
  icon: React.ReactNode
  description: string
  lastChecked?: string
}

interface HealthCheck {
  timestamp: string
  status: 'healthy' | 'unhealthy'
  version: string
  environment: string
  services: Record<string, string>
}

export function IntegrationDashboard() {
  const [healthData, setHealthData] = useState<HealthCheck | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/health')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Health check failed')
      }
      
      setHealthData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  const getServiceStatus = (serviceName: string): ServiceStatus => {
    const serviceConfig = healthData?.services?.[serviceName] || 'not configured'
    
    const services: Record<string, Omit<ServiceStatus, 'status'>> = {
      database: {
        name: 'Supabase Database',
        icon: <Database className="h-4 w-4" />,
        description: 'Database connection and operations'
      },
      openai: {
        name: 'OpenAI API',
        icon: <Bot className="h-4 w-4" />,
        description: 'AI content generation service'
      },
      brevo: {
        name: 'Brevo Email',
        icon: <Mail className="h-4 w-4" />,
        description: 'Newsletter and email delivery'
      },
      linkedin: {
        name: 'LinkedIn API',
        icon: <Share2 className="h-4 w-4" />,
        description: 'LinkedIn post publishing'
      },
      twitter: {
        name: 'Twitter/X API',
        icon: <Share2 className="h-4 w-4" />,
        description: 'Twitter post publishing'
      }
    }

    return {
      ...services[serviceName],
      status: serviceConfig as ServiceStatus['status'],
      lastChecked: healthData?.timestamp
    }
  }

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'configured':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'not configured':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: ServiceStatus['status']) => {
    const variants = {
      connected: 'default',
      configured: 'secondary',
      'not configured': 'outline',
      error: 'destructive'
    } as const

    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const calculateOverallHealth = () => {
    if (!healthData) return 0
    
    const services = Object.values(healthData.services)
    const healthyServices = services.filter(s => s === 'connected' || s === 'configured').length
    
    return Math.round((healthyServices / services.length) * 100)
  }

  const serviceNames = ['database', 'openai', 'brevo', 'linkedin', 'twitter']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            System Integration Status
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor the health and status of all integrated services
          </p>
        </div>
        <Button onClick={checkHealth} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to check system health: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Overall Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Overall System Health
          </CardTitle>
          <CardDescription>
            System status as of {healthData?.timestamp ? new Date(healthData.timestamp).toLocaleString() : 'Unknown'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Health Score</span>
              <span className="text-2xl font-bold">{calculateOverallHealth()}%</span>
            </div>
            <Progress value={calculateOverallHealth()} className="h-2" />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Environment:</span>
                <span className="ml-2 font-medium">{healthData?.environment || 'Unknown'}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Version:</span>
                <span className="ml-2 font-medium">{healthData?.version || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceNames.map((serviceName) => {
          const service = getServiceStatus(serviceName)
          
          return (
            <Card key={serviceName}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-base">
                  <div className="flex items-center gap-2">
                    {service.icon}
                    {service.name}
                  </div>
                  {getStatusIcon(service.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    {getStatusBadge(service.status)}
                    {service.lastChecked && (
                      <span className="text-xs text-gray-500">
                        {new Date(service.lastChecked).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  
                  {service.status === 'not configured' && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Service not configured. Check environment variables.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {service.status === 'error' && (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Service error detected. Check logs for details.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Status
          </CardTitle>
          <CardDescription>
            Security configuration and authentication status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm font-medium">Admin Authentication</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm font-medium">API Key Management</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <span className="text-sm font-medium">Input Validation</span>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common maintenance and troubleshooting actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Test AI Generation
            </Button>
            <Button variant="outline" size="sm">
              Verify Database Connection
            </Button>
            <Button variant="outline" size="sm">
              Check Email Service
            </Button>
            <Button variant="outline" size="sm">
              Test Social Media APIs
            </Button>
            <Button variant="outline" size="sm">
              View System Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
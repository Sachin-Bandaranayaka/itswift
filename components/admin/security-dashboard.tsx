"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Shield, 
  Key, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Download,
  Eye,
  EyeOff
} from "lucide-react"

interface AuditStats {
  totalEvents: number
  successfulEvents: number
  failedEvents: number
  topActions: Array<{ action: string; count: number }>
  topUsers: Array<{ userId: string; userEmail: string; count: number }>
}

interface ApiKeyInfo {
  key: string
  masked: string
  encrypted: boolean
  usage: {
    requests: number
    errors: number
    lastUsed: string | null
    quotaUsed: number
    quotaLimit: number
  }
}

export function SecurityDashboard() {
  const [auditStats, setAuditStats] = useState<AuditStats | null>(null)
  const [apiKeys, setApiKeys] = useState<ApiKeyInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showApiKeys, setShowApiKeys] = useState(false)

  useEffect(() => {
    fetchSecurityData()
  }, [])

  const fetchSecurityData = async () => {
    try {
      setLoading(true)
      
      // Fetch audit statistics
      const auditResponse = await fetch('/api/admin/security/audit-logs?stats=true')
      if (auditResponse.ok) {
        const stats = await auditResponse.json()
        setAuditStats(stats)
      }

      // Fetch API key information
      const keysResponse = await fetch('/api/admin/security/api-keys')
      if (keysResponse.ok) {
        const { apiKeys: keys } = await keysResponse.json()
        setApiKeys(keys)
      }
    } catch (err) {
      setError('Failed to load security data')
      console.error('Error fetching security data:', err)
    } finally {
      setLoading(false)
    }
  }

  const rotateApiKey = async (service: string) => {
    try {
      const response = await fetch(`/api/admin/security/api-keys/${service}/rotate`, {
        method: 'POST',
      })

      if (response.ok) {
        await fetchSecurityData()
        // Show success message
      } else {
        setError('Failed to rotate API key')
      }
    } catch (err) {
      setError('Error rotating API key')
    }
  }

  const exportAuditLogs = async (format: 'json' | 'csv') => {
    try {
      const response = await fetch(`/api/admin/security/audit-logs?format=${format}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `audit-logs.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (err) {
      setError('Failed to export audit logs')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading security data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor system security, audit logs, and API key management
          </p>
        </div>
        <Button onClick={fetchSecurityData} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditStats?.totalEvents || 0}</div>
                <p className="text-xs text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Successful Events</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {auditStats?.successfulEvents || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {auditStats?.totalEvents ? 
                    Math.round((auditStats.successfulEvents / auditStats.totalEvents) * 100) : 0}% success rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed Events</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {auditStats?.failedEvents || 0}
                </div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Keys</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{apiKeys.length}</div>
                <p className="text-xs text-muted-foreground">
                  {apiKeys.filter(k => k.encrypted).length} encrypted
                </p>
              </CardContent>
            </Card>
          </div>

          {auditStats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Actions</CardTitle>
                  <CardDescription>Most frequent audit events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {auditStats.topActions.slice(0, 5).map((action, index) => (
                      <div key={action.action} className="flex items-center justify-between">
                        <span className="text-sm">{action.action.replace(/_/g, ' ')}</span>
                        <Badge variant="secondary">{action.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Users</CardTitle>
                  <CardDescription>Most active admin users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {auditStats.topUsers.slice(0, 5).map((user, index) => (
                      <div key={user.userId} className="flex items-center justify-between">
                        <span className="text-sm">{user.userEmail}</span>
                        <Badge variant="secondary">{user.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Audit Logs</h3>
            <div className="space-x-2">
              <Button onClick={() => exportAuditLogs('csv')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => exportAuditLogs('json')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="text-center p-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Detailed audit log viewer would be implemented here</p>
                <p className="text-sm">Use the export buttons above to download logs</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">API Key Management</h3>
            <Button
              onClick={() => setShowApiKeys(!showApiKeys)}
              variant="outline"
              size="sm"
            >
              {showApiKeys ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showApiKeys ? 'Hide' : 'Show'} Keys
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((apiKey) => (
                    <TableRow key={apiKey.key}>
                      <TableCell className="font-medium">
                        {apiKey.key.replace('_API_KEY', '').toLowerCase()}
                      </TableCell>
                      <TableCell>
                        <code className="text-sm">
                          {showApiKeys ? apiKey.masked : '••••••••'}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {apiKey.encrypted ? (
                            <Badge variant="default">
                              <Shield className="h-3 w-3 mr-1" />
                              Encrypted
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Plain</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {apiKey.usage.requests} requests
                          {apiKey.usage.errors > 0 && (
                            <span className="text-red-600 ml-2">
                              ({apiKey.usage.errors} errors)
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-500">
                          {apiKey.usage.lastUsed ? 
                            new Date(apiKey.usage.lastUsed).toLocaleDateString() : 
                            'Never'
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => rotateApiKey(apiKey.key.replace('_API_KEY', '').toLowerCase())}
                          variant="outline"
                          size="sm"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Rotate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
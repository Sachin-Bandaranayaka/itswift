'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Settings, 
  Play, 
  Pause, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Clock,
  Zap,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Activity
} from "lucide-react"
import { AutomationRule, AutomationStats } from '@/lib/database/automation-types'

interface AutomationRulesManagerProps {
  className?: string
}

// Mock data - in real implementation, this would come from API
const mockRules: AutomationRule[] = [
  {
    id: '1',
    name: 'Auto-generate social posts from blog',
    description: 'Automatically create LinkedIn and Twitter posts when a blog is published',
    rule_type: 'content_generation',
    trigger_type: 'blog_published',
    trigger_conditions: { blog_categories: ['all'], auto_publish: false },
    actions: [
      { type: 'generate_social_post', platform: 'linkedin', schedule_delay_hours: 1 },
      { type: 'generate_social_post', platform: 'twitter', schedule_delay_hours: 2 }
    ],
    is_active: true,
    priority: 10,
    execution_count: 25,
    last_executed: '2024-01-15T10:30:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Optimal timing scheduler',
    description: 'Schedule posts at optimal times based on analytics',
    rule_type: 'scheduling',
    trigger_type: 'manual',
    trigger_conditions: { platforms: ['linkedin', 'twitter'] },
    actions: [
      { type: 'optimize_posting_time', look_ahead_days: 7, min_engagement_score: 80 }
    ],
    is_active: true,
    priority: 5,
    execution_count: 12,
    last_executed: '2024-01-14T15:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-14T15:00:00Z'
  },
  {
    id: '3',
    name: 'Weekly newsletter automation',
    description: 'Generate and send weekly newsletter with content roundup',
    rule_type: 'content_generation',
    trigger_type: 'time_based',
    trigger_conditions: { schedule: 'weekly', day: 'monday', hour: 9 },
    actions: [
      { type: 'generate_newsletter', include_blog_posts: true, include_social_highlights: true, auto_send: false }
    ],
    is_active: false,
    priority: 8,
    execution_count: 4,
    last_executed: '2024-01-08T09:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-08T09:00:00Z'
  }
]

const mockStats: AutomationStats = {
  total_rules: 3,
  active_rules: 2,
  total_executions: 41,
  successful_executions: 38,
  failed_executions: 3,
  content_generated: 29,
  by_rule_type: {
    content_generation: 2,
    scheduling: 1,
    cross_promotion: 0,
    optimization: 0
  },
  by_trigger_type: {
    blog_published: 1,
    time_based: 1,
    engagement_threshold: 0,
    manual: 1
  },
  recent_executions: [],
  top_performing_rules: [
    { rule_id: '1', rule_name: 'Auto-generate social posts from blog', execution_count: 25, success_rate: 96 },
    { rule_id: '2', rule_name: 'Optimal timing scheduler', execution_count: 12, success_rate: 100 }
  ]
}

export function AutomationRulesManager({ className }: AutomationRulesManagerProps) {
  const [rules, setRules] = useState<AutomationRule[]>(mockRules)
  const [stats, setStats] = useState<AutomationStats>(mockStats)
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)

  const filteredRules = rules.filter(rule => {
    if (filterType === 'all') return true
    if (filterType === 'active') return rule.is_active
    if (filterType === 'inactive') return !rule.is_active
    return rule.rule_type === filterType
  })

  const handleToggleRule = async (ruleId: string) => {
    setIsLoading(true)
    try {
      // In real implementation, this would call the API
      setRules(prev => prev.map(rule => 
        rule.id === ruleId ? { ...rule, is_active: !rule.is_active } : rule
      ))
      
      // Update stats
      const updatedRules = rules.map(rule => 
        rule.id === ruleId ? { ...rule, is_active: !rule.is_active } : rule
      )
      setStats(prev => ({
        ...prev,
        active_rules: updatedRules.filter(r => r.is_active).length
      }))
    } catch (error) {
      console.error('Error toggling rule:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExecuteRule = async (ruleId: string) => {
    setIsLoading(true)
    try {
      // In real implementation, this would call the automation engine API
      console.log('Executing rule:', ruleId)
      
      // Update execution count
      setRules(prev => prev.map(rule => 
        rule.id === ruleId ? { 
          ...rule, 
          execution_count: rule.execution_count + 1,
          last_executed: new Date().toISOString()
        } : rule
      ))
    } catch (error) {
      console.error('Error executing rule:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRuleTypeColor = (type: string) => {
    switch (type) {
      case 'content_generation':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'scheduling':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cross_promotion':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'optimization':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTriggerTypeIcon = (type: string) => {
    switch (type) {
      case 'blog_published':
        return <Activity className="h-3 w-3" />
      case 'time_based':
        return <Clock className="h-3 w-3" />
      case 'engagement_threshold':
        return <BarChart3 className="h-3 w-3" />
      case 'manual':
        return <Settings className="h-3 w-3" />
      default:
        return <Zap className="h-3 w-3" />
    }
  }

  const formatLastExecuted = (dateString?: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else {
      return 'Recently'
    }
  }

  return (
    <div className={className}>
      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Automation Rules</h2>
              <p className="text-muted-foreground">
                Manage content automation rules and triggers
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rules</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                  <SelectItem value="content_generation">Content Generation</SelectItem>
                  <SelectItem value="scheduling">Scheduling</SelectItem>
                  <SelectItem value="cross_promotion">Cross Promotion</SelectItem>
                  <SelectItem value="optimization">Optimization</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Rule
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Rules</p>
                    <p className="text-2xl font-bold">{stats.total_rules}</p>
                  </div>
                  <Settings className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Rules</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active_rules}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Executions</p>
                    <p className="text-2xl font-bold">{stats.total_executions}</p>
                  </div>
                  <Activity className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold text-green-600">
                      {Math.round((stats.successful_executions / stats.total_executions) * 100)}%
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rules List */}
          <div className="space-y-4">
            {filteredRules.map((rule) => (
              <Card key={rule.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{rule.name}</h3>
                        <Badge 
                          variant="outline" 
                          className={getRuleTypeColor(rule.rule_type)}
                        >
                          {rule.rule_type.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getTriggerTypeIcon(rule.trigger_type)}
                          <span className="ml-1">{rule.trigger_type.replace('_', ' ')}</span>
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={rule.is_active}
                            onCheckedChange={() => handleToggleRule(rule.id)}
                            disabled={isLoading}
                          />
                          <span className="text-sm text-muted-foreground">
                            {rule.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground">{rule.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          <span>Executed {rule.execution_count} times</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Last run: {formatLastExecuted(rule.last_executed)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          <span>Priority: {rule.priority}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Actions:</span>
                        {rule.actions.map((action, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {action.type.replace('_', ' ')}
                            {action.platform && ` (${action.platform})`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExecuteRule(rule.id)}
                        disabled={!rule.is_active || isLoading}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Execute
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-3 w-3 mr-1" />
                        Clone
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRules.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No rules found</h3>
                <p className="text-muted-foreground mb-4">
                  {filterType === 'all' 
                    ? 'No automation rules have been created yet.'
                    : `No rules match the current filter: ${filterType}`
                  }
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Rule
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Automation Statistics</h2>
            <p className="text-muted-foreground">
              Performance metrics and insights for your automation rules
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Execution Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Execution Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Executions</span>
                  <span className="font-semibold">{stats.total_executions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Successful</span>
                  <span className="font-semibold text-green-600">{stats.successful_executions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Failed</span>
                  <span className="font-semibold text-red-600">{stats.failed_executions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Content Generated</span>
                  <span className="font-semibold">{stats.content_generated}</span>
                </div>
              </CardContent>
            </Card>

            {/* Rule Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Rules by Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(stats.by_rule_type).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">
                      {type.replace('_', ' ')}
                    </span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Trigger Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Triggers by Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(stats.by_trigger_type).map(([type, count]) => (
                  <div key={type} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">
                      {type.replace('_', ' ')}
                    </span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Performing Rules
              </CardTitle>
              <CardDescription>
                Rules with the highest execution count and success rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.top_performing_rules.map((rule, index) => (
                  <div key={rule.rule_id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{rule.rule_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {rule.execution_count} executions
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {Math.round(rule.success_rate)}% success
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
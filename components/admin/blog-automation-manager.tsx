'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertCircle, Bot, Play, Plus, Settings, Trash2, Zap } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'

interface AutomationRule {
  id: string
  name: string
  description?: string
  rule_type: string
  trigger_type: string
  trigger_conditions: any
  actions: AutomationAction[]
  is_active: boolean
  priority: number
  execution_count: number
  last_executed?: string
  created_at: string
}

interface AutomationAction {
  type: string
  platform?: string
  template_id?: string
  schedule_delay_hours?: number
  auto_publish?: boolean
  auto_send?: boolean
  notification_type?: string
  recipients?: string[]
}

interface AutomationStatus {
  is_processing: boolean
  queue_size: number
  last_execution?: string
}

export function BlogAutomationManager() {
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [status, setStatus] = useState<AutomationStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null)
  const { toast } = useToast()

  // Form state for creating/editing rules
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rule_type: 'content_generation',
    trigger_conditions: {
      blog_categories: ['all']
    },
    actions: [] as AutomationAction[],
    is_active: true,
    priority: 1
  })

  useEffect(() => {
    fetchAutomationData()
  }, [])

  const fetchAutomationData = async () => {
    try {
      setLoading(true)
      const [rulesResponse, statusResponse] = await Promise.all([
        fetch('/api/admin/blog/automation/rules'),
        fetch('/api/admin/blog/automation')
      ])

      if (!rulesResponse.ok || !statusResponse.ok) {
        throw new Error('Failed to fetch automation data')
      }

      const rulesData = await rulesResponse.json()
      const statusData = await statusResponse.json()

      setRules(rulesData.data || [])
      setStatus(statusData.data?.status || null)
      setError(null)
    } catch (err) {
      console.error('Error fetching automation data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch automation data')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRule = async (ruleId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/blog/automation/rules/${ruleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: isActive })
      })

      if (!response.ok) {
        throw new Error('Failed to update rule')
      }

      setRules(rules.map(rule => 
        rule.id === ruleId ? { ...rule, is_active: isActive } : rule
      ))

      toast({
        title: 'Rule Updated',
        description: `Rule ${isActive ? 'activated' : 'deactivated'} successfully`
      })
    } catch (err) {
      console.error('Error updating rule:', err)
      toast({
        title: 'Error',
        description: 'Failed to update rule',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this automation rule?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/blog/automation/rules/${ruleId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete rule')
      }

      setRules(rules.filter(rule => rule.id !== ruleId))
      toast({
        title: 'Rule Deleted',
        description: 'Automation rule deleted successfully'
      })
    } catch (err) {
      console.error('Error deleting rule:', err)
      toast({
        title: 'Error',
        description: 'Failed to delete rule',
        variant: 'destructive'
      })
    }
  }

  const handleCreateRule = async () => {
    try {
      const response = await fetch('/api/admin/blog/automation/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create rule')
      }

      const result = await response.json()
      setRules([...rules, result.data])
      setShowCreateDialog(false)
      resetForm()
      
      toast({
        title: 'Rule Created',
        description: 'Blog automation rule created successfully'
      })
    } catch (err) {
      console.error('Error creating rule:', err)
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create rule',
        variant: 'destructive'
      })
    }
  }

  const handleTriggerAutomation = async (blogPostId: string) => {
    try {
      const response = await fetch('/api/admin/blog/automation/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogPostId })
      })

      if (!response.ok) {
        throw new Error('Failed to trigger automation')
      }

      const result = await response.json()
      
      toast({
        title: 'Automation Triggered',
        description: `Generated ${result.data.socialPostsGenerated} social media posts`
      })
    } catch (err) {
      console.error('Error triggering automation:', err)
      toast({
        title: 'Error',
        description: 'Failed to trigger automation',
        variant: 'destructive'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      rule_type: 'content_generation',
      trigger_conditions: {
        blog_categories: ['all']
      },
      actions: [],
      is_active: true,
      priority: 1
    })
  }

  const addAction = (type: string) => {
    const newAction: AutomationAction = {
      type,
      platform: type === 'generate_social_post' ? 'linkedin' : undefined,
      auto_publish: false
    }
    
    setFormData({
      ...formData,
      actions: [...formData.actions, newAction]
    })
  }

  const removeAction = (index: number) => {
    setFormData({
      ...formData,
      actions: formData.actions.filter((_, i) => i !== index)
    })
  }

  const updateAction = (index: number, updates: Partial<AutomationAction>) => {
    const updatedActions = [...formData.actions]
    updatedActions[index] = { ...updatedActions[index], ...updates }
    setFormData({ ...formData, actions: updatedActions })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blog Automation</h2>
          <p className="text-gray-600">Manage automated actions for blog post publishing</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Automation Rule</DialogTitle>
              <DialogDescription>
                Create a new automation rule that triggers when blog posts are published
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Rule Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Auto-generate social posts"
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this rule does..."
                />
              </div>

              <div>
                <Label>Actions</Label>
                <div className="space-y-2">
                  {formData.actions.map((action, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <span className="text-sm font-medium">{action.type}</span>
                      {action.platform && (
                        <Badge variant="secondary">{action.platform}</Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeAction(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addAction('generate_social_post')}
                    >
                      Add Social Post
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addAction('send_notification')}
                    >
                      Add Notification
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addAction('update_analytics')}
                    >
                      Add Analytics
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, is_active: checked as boolean })
                  }
                />
                <Label htmlFor="is_active">Activate rule immediately</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateRule} disabled={!formData.name || formData.actions.length === 0}>
                  Create Rule
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="status">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          {rules.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bot className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Automation Rules</h3>
                <p className="text-gray-600 text-center mb-4">
                  Create your first automation rule to automatically generate social media posts,
                  send notifications, or track analytics when blog posts are published.
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Rule
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {rules.map((rule) => (
                <Card key={rule.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {rule.name}
                          <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                            {rule.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </CardTitle>
                        {rule.description && (
                          <CardDescription>{rule.description}</CardDescription>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.is_active}
                          onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteRule(rule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Priority: {rule.priority}</span>
                        <span>Executions: {rule.execution_count}</span>
                        {rule.last_executed && (
                          <span>Last run: {new Date(rule.last_executed).toLocaleDateString()}</span>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Actions:</h4>
                        <div className="flex flex-wrap gap-2">
                          {rule.actions.map((action, index) => (
                            <Badge key={index} variant="outline">
                              {action.type}
                              {action.platform && ` (${action.platform})`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Engine Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {status ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Processing:</span>
                      <Badge variant={status.is_processing ? 'default' : 'secondary'}>
                        {status.is_processing ? 'Active' : 'Idle'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Queue Size:</span>
                      <span>{status.queue_size}</span>
                    </div>
                    {status.last_execution && (
                      <div className="flex justify-between">
                        <span>Last Execution:</span>
                        <span>{new Date(status.last_execution).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">Status information unavailable</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Rule Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Rules:</span>
                    <span>{rules.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Rules:</span>
                    <span>{rules.filter(r => r.is_active).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Executions:</span>
                    <span>{rules.reduce((sum, r) => sum + r.execution_count, 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
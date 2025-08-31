'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Search, 
  Plus, 
  Download, 
  Upload, 
  Mail, 
  Users, 
  TrendingUp,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserPlus
} from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { toast } from '@/components/ui/use-toast'
import { NewsletterSubscriber, NewsletterCampaign } from '@/lib/database/types'
import { NewsletterComposer } from '@/components/admin/newsletter-composer'
import { NewsletterAnalytics } from '@/components/admin/newsletter-analytics'

interface SubscriberStats {
  total: number
  active: number
  unsubscribed: number
  bounced: number
  recentGrowth: number
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [stats, setStats] = useState<SubscriberStats>({
    total: 0,
    active: 0,
    unsubscribed: 0,
    bounced: 0,
    recentGrowth: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [selectedSubscriber, setSelectedSubscriber] = useState<NewsletterSubscriber | null>(null)

  // Load subscribers and stats
  useEffect(() => {
    loadSubscribers()
    loadStats()
  }, [searchTerm, statusFilter])

  const loadSubscribers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const response = await fetch(`/api/admin/newsletter/subscribers?${params}`)
      if (!response.ok) throw new Error('Failed to load subscribers')
      
      const data = await response.json()
      setSubscribers(data.subscribers || [])
    } catch (error) {
      console.error('Error loading subscribers:', error)
      toast({
        title: 'Error',
        description: 'Failed to load subscribers',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/newsletter/stats')
      if (!response.ok) throw new Error('Failed to load stats')
      
      const data = await response.json()
      setStats(data.stats || stats)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleAddSubscriber = async (formData: FormData) => {
    try {
      const subscriberData = {
        email: formData.get('email') as string,
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        tags: (formData.get('tags') as string)?.split(',').map(tag => tag.trim()).filter(Boolean) || []
      }

      const response = await fetch('/api/admin/newsletter/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscriberData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to add subscriber')
      }

      toast({
        title: 'Success',
        description: 'Subscriber added successfully'
      })

      setIsAddDialogOpen(false)
      loadSubscribers()
      loadStats()
    } catch (error) {
      console.error('Error adding subscriber:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add subscriber',
        variant: 'destructive'
      })
    }
  }

  const handleUpdateSubscriber = async (id: string, updates: Partial<NewsletterSubscriber>) => {
    try {
      const response = await fetch(`/api/admin/newsletter/subscribers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update subscriber')
      }

      toast({
        title: 'Success',
        description: 'Subscriber updated successfully'
      })

      loadSubscribers()
      loadStats()
    } catch (error) {
      console.error('Error updating subscriber:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update subscriber',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return

    try {
      const response = await fetch(`/api/admin/newsletter/subscribers/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete subscriber')
      }

      toast({
        title: 'Success',
        description: 'Subscriber deleted successfully'
      })

      loadSubscribers()
      loadStats()
    } catch (error) {
      console.error('Error deleting subscriber:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete subscriber',
        variant: 'destructive'
      })
    }
  }

  const handleExportSubscribers = async () => {
    try {
      const response = await fetch('/api/admin/newsletter/subscribers/export')
      if (!response.ok) throw new Error('Failed to export subscribers')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Success',
        description: 'Subscribers exported successfully'
      })
    } catch (error) {
      console.error('Error exporting subscribers:', error)
      toast({
        title: 'Error',
        description: 'Failed to export subscribers',
        variant: 'destructive'
      })
    }
  }

  const handleImportSubscribers = async (formData: FormData) => {
    try {
      const response = await fetch('/api/admin/newsletter/subscribers/import', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to import subscribers')
      }

      const result = await response.json()
      
      toast({
        title: 'Import Complete',
        description: `Successfully imported ${result.success} subscribers. ${result.failed} failed.`
      })

      setIsImportDialogOpen(false)
      loadSubscribers()
      loadStats()
    } catch (error) {
      console.error('Error importing subscribers:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to import subscribers',
        variant: 'destructive'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      unsubscribed: 'secondary',
      bounced: 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'default'}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Newsletter Management</h1>
          <p className="text-muted-foreground">
            Manage subscribers, create campaigns, and track performance
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.recentGrowth} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unsubscribed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unsubscribed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.unsubscribed / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounced</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bounced.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.bounced / stats.total) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subscribers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Subscriber Management</CardTitle>
                  <CardDescription>
                    Manage your newsletter subscribers and their preferences
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleExportSubscribers}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Import
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Import Subscribers</DialogTitle>
                        <DialogDescription>
                          Upload a CSV file with email, first_name, last_name columns
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        handleImportSubscribers(formData)
                      }}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="file">CSV File</Label>
                            <Input
                              id="file"
                              name="file"
                              type="file"
                              accept=".csv"
                              required
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Import</Button>
                          </div>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Subscriber
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Subscriber</DialogTitle>
                        <DialogDescription>
                          Add a new subscriber to your newsletter
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault()
                        const formData = new FormData(e.currentTarget)
                        handleAddSubscriber(formData)
                      }}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              required
                              placeholder="subscriber@example.com"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="first_name">First Name</Label>
                              <Input
                                id="first_name"
                                name="first_name"
                                placeholder="John"
                              />
                            </div>
                            <div>
                              <Label htmlFor="last_name">Last Name</Label>
                              <Input
                                id="last_name"
                                name="last_name"
                                placeholder="Doe"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input
                              id="tags"
                              name="tags"
                              placeholder="customer, premium, newsletter"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button type="submit">Add Subscriber</Button>
                          </div>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search subscribers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                    <SelectItem value="bounced">Bounced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subscribers Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscribed</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading subscribers...
                        </TableCell>
                      </TableRow>
                    ) : subscribers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No subscribers found
                        </TableCell>
                      </TableRow>
                    ) : (
                      subscribers.map((subscriber) => (
                        <TableRow key={subscriber.id}>
                          <TableCell className="font-medium">
                            {subscriber.email}
                          </TableCell>
                          <TableCell>
                            {subscriber.first_name || subscriber.last_name
                              ? `${subscriber.first_name || ''} ${subscriber.last_name || ''}`.trim()
                              : '-'
                            }
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(subscriber.status)}
                          </TableCell>
                          <TableCell>
                            {new Date(subscriber.subscribed_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {subscriber.tags && subscriber.tags.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {subscriber.tags.slice(0, 2).map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {subscriber.tags.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{subscriber.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setSelectedSubscriber(subscriber)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                {subscriber.status === 'unsubscribed' && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateSubscriber(subscriber.id, { status: 'active' })}
                                  >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Resubscribe
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleDeleteSubscriber(subscriber.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns">
          <CampaignsTab />
        </TabsContent>

        <TabsContent value="analytics">
          <NewsletterAnalytics />
        </TabsContent>
      </Tabs>

      {/* Edit Subscriber Dialog */}
      {selectedSubscriber && (
        <Dialog open={!!selectedSubscriber} onOpenChange={() => setSelectedSubscriber(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Subscriber</DialogTitle>
              <DialogDescription>
                Update subscriber information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const updates = {
                email: formData.get('email') as string,
                first_name: formData.get('first_name') as string,
                last_name: formData.get('last_name') as string,
                status: formData.get('status') as 'active' | 'unsubscribed' | 'bounced',
                tags: (formData.get('tags') as string)?.split(',').map(tag => tag.trim()).filter(Boolean) || []
              }
              handleUpdateSubscriber(selectedSubscriber.id, updates)
              setSelectedSubscriber(null)
            }}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit_email">Email *</Label>
                  <Input
                    id="edit_email"
                    name="email"
                    type="email"
                    required
                    defaultValue={selectedSubscriber.email}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_first_name">First Name</Label>
                    <Input
                      id="edit_first_name"
                      name="first_name"
                      defaultValue={selectedSubscriber.first_name || ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_last_name">Last Name</Label>
                    <Input
                      id="edit_last_name"
                      name="last_name"
                      defaultValue={selectedSubscriber.last_name || ''}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit_status">Status</Label>
                  <Select name="status" defaultValue={selectedSubscriber.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                      <SelectItem value="bounced">Bounced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit_tags">Tags (comma-separated)</Label>
                  <Input
                    id="edit_tags"
                    name="tags"
                    defaultValue={selectedSubscriber.tags?.join(', ') || ''}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setSelectedSubscriber(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Subscriber</Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function CampaignsTab() {
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCampaign, setSelectedCampaign] = useState<NewsletterCampaign | null>(null)
  const [isComposerOpen, setIsComposerOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    loadCampaigns()
  }, [searchTerm, statusFilter])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const response = await fetch(`/api/admin/newsletter/campaigns?${params}`)
      if (!response.ok) throw new Error('Failed to load campaigns')
      
      const data = await response.json()
      setCampaigns(data.campaigns || [])
    } catch (error) {
      console.error('Error loading campaigns:', error)
      toast({
        title: 'Error',
        description: 'Failed to load campaigns',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return

    try {
      const response = await fetch(`/api/admin/newsletter/campaigns/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete campaign')
      }

      toast({
        title: 'Success',
        description: 'Campaign deleted successfully'
      })

      loadCampaigns()
    } catch (error) {
      console.error('Error deleting campaign:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete campaign',
        variant: 'destructive'
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'outline',
      scheduled: 'secondary',
      sent: 'default',
      failed: 'destructive'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    )
  }

  if (isComposerOpen) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setIsComposerOpen(false)}>
            ← Back to Campaigns
          </Button>
        </div>
        <NewsletterComposer
          campaign={selectedCampaign || undefined}
          onSave={(campaign) => {
            setIsComposerOpen(false)
            setSelectedCampaign(null)
            loadCampaigns()
          }}
          onSend={(campaign) => {
            setIsComposerOpen(false)
            setSelectedCampaign(null)
            loadCampaigns()
          }}
        />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Newsletter Campaigns</CardTitle>
            <CardDescription>
              Create and manage your newsletter campaigns
            </CardDescription>
          </div>
          <Button onClick={() => {
            setSelectedCampaign(null)
            setIsComposerOpen(true)
          }}>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Campaigns Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Scheduled/Sent</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading campaigns...
                  </TableCell>
                </TableRow>
              ) : campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No campaigns found
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">
                      {campaign.subject}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(campaign.status)}
                    </TableCell>
                    <TableCell>
                      {campaign.recipient_count.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {campaign.sent_at 
                        ? new Date(campaign.sent_at).toLocaleDateString()
                        : campaign.scheduled_at
                        ? new Date(campaign.scheduled_at).toLocaleDateString()
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCampaign(campaign)
                              setIsComposerOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {campaign.status === 'draft' && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedCampaign(campaign)
                                setIsComposerOpen(true)
                              }}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
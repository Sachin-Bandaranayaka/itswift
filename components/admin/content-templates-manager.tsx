'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Eye,
  Code,
  Hash,
  Activity,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { ContentTemplate } from '@/lib/database/automation-types'

interface ContentTemplatesManagerProps {
  className?: string
}

// Mock data - in real implementation, this would come from API
const mockTemplates: ContentTemplate[] = [
  {
    id: '1',
    name: 'Blog to LinkedIn Post',
    description: 'Convert blog post to LinkedIn professional post',
    template_type: 'social',
    platform: 'linkedin',
    content_template: `🚀 New blog post: {{title}}

{{summary}}

Key insights:
{{key_points}}

Read the full article: {{url}}

#{{hashtags}}`,
    variables: ['title', 'summary', 'key_points', 'url', 'hashtags'],
    metadata: { usage_count: 25, last_used: '2024-01-15T10:30:00Z' },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Blog to Twitter Thread',
    description: 'Convert blog post to Twitter thread',
    template_type: 'social',
    platform: 'twitter',
    content_template: `🧵 Thread: {{title}}

1/{{thread_count}} {{summary}}

{{thread_content}}

Full article: {{url}}

#{{hashtags}}`,
    variables: ['title', 'summary', 'thread_content', 'thread_count', 'url', 'hashtags'],
    metadata: { usage_count: 18, last_used: '2024-01-14T15:00:00Z' },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-14T15:00:00Z'
  },
  {
    id: '3',
    name: 'Newsletter Welcome Email',
    description: 'Welcome email for new newsletter subscribers',
    template_type: 'newsletter',
    platform: 'all',
    content_template: `Welcome to our newsletter, {{first_name}}!

Thank you for subscribing. You'll receive:
- Weekly industry insights
- Exclusive content and tips
- Early access to new resources

Best regards,
The Team`,
    variables: ['first_name'],
    metadata: { usage_count: 45, last_used: '2024-01-16T08:00:00Z' },
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-16T08:00:00Z'
  },
  {
    id: '4',
    name: 'Weekly Newsletter Template',
    description: 'Standard weekly newsletter format',
    template_type: 'newsletter',
    platform: 'all',
    content_template: `Weekly Update - {{week_date}}

Hi {{first_name}},

This week's highlights:

📝 Latest Blog Posts:
{{blog_posts}}

📱 Social Media Highlights:
{{social_highlights}}

📊 Industry News:
{{industry_news}}

Best regards,
The Team`,
    variables: ['week_date', 'first_name', 'blog_posts', 'social_highlights', 'industry_news'],
    metadata: { usage_count: 8, last_used: '2024-01-08T09:00:00Z' },
    is_active: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-08T09:00:00Z'
  }
]

export function ContentTemplatesManager({ className }: ContentTemplatesManagerProps) {
  const [templates, setTemplates] = useState<ContentTemplate[]>(mockTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPlatform, setFilterPlatform] = useState<string>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<ContentTemplate | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Form state for creating/editing templates
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template_type: 'social' as 'blog' | 'social' | 'newsletter',
    platform: 'all' as 'linkedin' | 'twitter' | 'all',
    content_template: '',
    is_active: true
  })

  const filteredTemplates = templates.filter(template => {
    if (filterType !== 'all' && template.template_type !== filterType) return false
    if (filterPlatform !== 'all' && template.platform !== filterPlatform && template.platform !== 'all') return false
    return true
  })

  const handleToggleTemplate = async (templateId: string) => {
    setIsLoading(true)
    try {
      setTemplates(prev => prev.map(template => 
        template.id === templateId ? { ...template, is_active: !template.is_active } : template
      ))
    } catch (error) {
      console.error('Error toggling template:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCloneTemplate = async (template: ContentTemplate) => {
    setIsLoading(true)
    try {
      const clonedTemplate: ContentTemplate = {
        ...template,
        id: Date.now().toString(), // Mock ID generation
        name: `${template.name} (Copy)`,
        is_active: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: { ...template.metadata, cloned_from: template.id }
      }
      
      setTemplates(prev => [clonedTemplate, ...prev])
    } catch (error) {
      console.error('Error cloning template:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreviewTemplate = (template: ContentTemplate) => {
    setPreviewTemplate(template)
    setIsPreviewDialogOpen(true)
  }

  const extractVariablesFromContent = (content: string): string[] => {
    const matches = content.match(/\{\{([^}]+)\}\}/g)
    if (!matches) return []
    
    return [...new Set(matches.map(match => match.replace(/[{}]/g, '').trim()))]
  }

  const renderPreview = (template: ContentTemplate) => {
    if (!template) return ''
    
    // Mock data for preview
    const mockData: Record<string, string> = {
      title: 'How to Build Better Content Automation',
      summary: 'Learn the key strategies for creating effective content automation workflows that save time and improve engagement.',
      key_points: '• Identify repetitive tasks\n• Create reusable templates\n• Set up smart triggers',
      url: 'https://example.com/blog/content-automation',
      hashtags: 'ContentAutomation #MarketingTips #Productivity',
      first_name: 'John',
      week_date: 'January 15, 2024',
      blog_posts: '• New automation features\n• Best practices guide\n• Case study results',
      social_highlights: '• LinkedIn post got 500+ likes\n• Twitter thread went viral\n• New followers: +250',
      industry_news: '• AI tools market grows 40%\n• New social media algorithm\n• Content trends for 2024',
      thread_content: '2/5 The key is to start small and gradually build your automation stack...',
      thread_count: '5'
    }

    let preview = template.content_template
    template.variables.forEach(variable => {
      const value = mockData[variable] || `[${variable}]`
      preview = preview.replace(new RegExp(`\\{\\{${variable}\\}\\}`, 'g'), value)
    })

    return preview
  }

  const getTemplateTypeColor = (type: string) => {
    switch (type) {
      case 'blog':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'social':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'newsletter':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPlatformIcon = (platform?: string) => {
    switch (platform) {
      case 'linkedin':
        return '💼'
      case 'twitter':
        return '🐦'
      default:
        return '🌐'
    }
  }

  const formatLastUsed = (dateString?: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div className={className}>
      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Content Templates</TabsTrigger>
          <TabsTrigger value="variables">Variable Reference</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Content Templates</h2>
              <p className="text-muted-foreground">
                Manage reusable templates for automated content generation
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Template</DialogTitle>
                  <DialogDescription>
                    Create a reusable template for automated content generation
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Template Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter template name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Template Type</Label>
                      <Select 
                        value={formData.template_type} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, template_type: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blog">Blog Post</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the template"
                    />
                  </div>

                  {formData.template_type === 'social' && (
                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform</Label>
                      <Select 
                        value={formData.platform} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Platforms</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="twitter">Twitter/X</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="content">Template Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content_template}
                      onChange={(e) => setFormData(prev => ({ ...prev, content_template: e.target.value }))}
                      placeholder="Enter template content with variables like {{title}}, {{summary}}, etc."
                      rows={8}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use double curly braces for variables: {`{{variable_name}}`}
                    </p>
                  </div>

                  {formData.content_template && (
                    <div className="space-y-2">
                      <Label>Detected Variables</Label>
                      <div className="flex flex-wrap gap-2">
                        {extractVariablesFromContent(formData.content_template).map(variable => (
                          <Badge key={variable} variant="secondary" className="text-xs">
                            <Hash className="h-3 w-3 mr-1" />
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="active">Active template</Label>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button>Create Template</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="blog">Blog Posts</SelectItem>
                <SelectItem value="social">Social Media</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span>{getPlatformIcon(template.platform)}</span>
                        {template.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={template.is_active}
                        onCheckedChange={() => handleToggleTemplate(template.id)}
                        disabled={isLoading}
                        size="sm"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={getTemplateTypeColor(template.template_type)}
                    >
                      {template.template_type}
                    </Badge>
                    {template.platform && template.platform !== 'all' && (
                      <Badge variant="outline" className="text-xs">
                        {template.platform}
                      </Badge>
                    )}
                    <Badge variant={template.is_active ? "default" : "secondary"} className="text-xs">
                      {template.is_active ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Variables:</span>
                      <span className="font-medium">{template.variables.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.slice(0, 3).map(variable => (
                        <Badge key={variable} variant="secondary" className="text-xs">
                          <Hash className="h-2 w-2 mr-1" />
                          {variable}
                        </Badge>
                      ))}
                      {template.variables.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.variables.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      <span>Used {template.metadata.usage_count || 0} times</span>
                    </div>
                    <span>Last: {formatLastUsed(template.metadata.last_used)}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handlePreviewTemplate(template)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCloneTemplate(template)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No templates found</h3>
                <p className="text-muted-foreground mb-4">
                  {filterType === 'all' && filterPlatform === 'all'
                    ? 'No content templates have been created yet.'
                    : 'No templates match the current filters.'
                  }
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Template
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="variables" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Variable Reference</h2>
            <p className="text-muted-foreground">
              Available variables for use in your content templates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Blog Variables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Blog Variables
                </CardTitle>
                <CardDescription>
                  Variables available when triggered by blog posts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: 'title', desc: 'Blog post title' },
                  { name: 'summary', desc: 'Blog post summary/excerpt' },
                  { name: 'content', desc: 'Full blog post content' },
                  { name: 'url', desc: 'Blog post URL' },
                  { name: 'author', desc: 'Blog post author' },
                  { name: 'published_date', desc: 'Publication date' },
                  { name: 'categories', desc: 'Blog categories' },
                  { name: 'tags', desc: 'Blog tags' },
                  { name: 'key_points', desc: 'AI-extracted key points' },
                  { name: 'hashtags', desc: 'Generated hashtags' }
                ].map(variable => (
                  <div key={variable.name} className="flex items-start gap-2 text-sm">
                    <Badge variant="secondary" className="text-xs font-mono">
                      {`{{${variable.name}}}`}
                    </Badge>
                    <span className="text-muted-foreground">{variable.desc}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Social Variables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Social Variables
                </CardTitle>
                <CardDescription>
                  Variables for social media content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: 'platform', desc: 'Target platform (linkedin/twitter)' },
                  { name: 'thread_content', desc: 'Twitter thread content' },
                  { name: 'thread_count', desc: 'Number of tweets in thread' },
                  { name: 'engagement_score', desc: 'Expected engagement score' }
                ].map(variable => (
                  <div key={variable.name} className="flex items-start gap-2 text-sm">
                    <Badge variant="secondary" className="text-xs font-mono">
                      {`{{${variable.name}}}`}
                    </Badge>
                    <span className="text-muted-foreground">{variable.desc}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Newsletter Variables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Newsletter Variables
                </CardTitle>
                <CardDescription>
                  Variables for newsletter content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { name: 'first_name', desc: 'Subscriber first name' },
                  { name: 'last_name', desc: 'Subscriber last name' },
                  { name: 'email', desc: 'Subscriber email' },
                  { name: 'week_date', desc: 'Current week date' },
                  { name: 'blog_posts', desc: 'Recent blog posts list' },
                  { name: 'social_highlights', desc: 'Top social media posts' },
                  { name: 'industry_news', desc: 'Curated industry news' }
                ].map(variable => (
                  <div key={variable.name} className="flex items-start gap-2 text-sm">
                    <Badge variant="secondary" className="text-xs font-mono">
                      {`{{${variable.name}}}`}
                    </Badge>
                    <span className="text-muted-foreground">{variable.desc}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
            <DialogDescription>
              Preview of "{previewTemplate?.name}" with sample data
            </DialogDescription>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Template Code</Label>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <pre className="text-xs whitespace-pre-wrap font-mono">
                      {previewTemplate.content_template}
                    </pre>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Rendered Output</Label>
                  <div className="mt-2 p-3 border rounded-lg">
                    <div className="text-sm whitespace-pre-wrap">
                      {renderPreview(previewTemplate)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
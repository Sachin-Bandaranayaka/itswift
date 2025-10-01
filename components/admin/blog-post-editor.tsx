'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RichTextEditor } from "./rich-text-editor"
import { CloudinaryImageUpload } from "./cloudinary-image-upload"
import { 
  X, 
  Save, 
  Eye, 
  Calendar, 
  Share2, 
  Loader2,
  FileText,
  Image as ImageIcon,
  Tag,
  History,
  Search,
  Sparkles
} from "lucide-react"
import { toast } from "sonner"
import { BlogVersionHistory } from "./blog-version-history"
import { SEOOptimizer } from "./seo-optimizer"
import { AIContentAssistant } from "./ai-content-assistant"

interface BlogPost {
  id?: string
  title: string
  slug?: string
  author?: { name: string, id: string }
  featured_image_url?: string
  categories?: Array<{ name: string, id: string }>
  published_at?: string
  excerpt?: string
  content?: string
  status?: 'draft' | 'published' | 'scheduled' | 'archived'
  created_at?: string
  updated_at?: string
}

interface BlogPostEditorProps {
  post?: BlogPost | null
  onClose: () => void
  onSave: () => void
}

export function BlogPostEditor({ post, onClose, onSave }: BlogPostEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    publishedAt: '',
    categories: [] as string[],
    mainImageUrl: '',
    mainImageAlt: '',
    autoGenerateSocial: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    slug: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isGeneratingSocial, setIsGeneratingSocial] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [activeTab, setActiveTab] = useState('content')

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        publishedAt: post.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : '',
        categories: post.categories?.map(cat => cat.name) || [],
        mainImageUrl: post.featured_image_url || '',
        mainImageAlt: '',
        autoGenerateSocial: true,
        metaTitle: (post as any).meta_title || '',
        metaDescription: (post as any).meta_description || '',
        metaKeywords: (post as any).meta_keywords || '',
        slug: post.slug || ''
      })
    }
  }, [post])

  const convertBodyToText = (body: any[]): string => {
    if (!body) return ''
    
    return body.map(block => {
      if (block._type === 'block') {
        return block.children?.map((child: any) => child.text).join('') || ''
      }
      return ''
    }).join('\n\n')
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'categories' && typeof value === 'string' 
        ? value.split(',').map(cat => cat.trim()).filter(cat => cat.length > 0)
        : value
    }))
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title')
      return
    }

    setIsSaving(true)
    
    try {
      const saveData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        status: 'draft',
        featured_image_url: formData.mainImageUrl || null,
        published_at: formData.publishedAt || null,
        author_id: 'cae5f613-5fc0-42aa-8a2b-8ea5e451ab99', // Admin User author ID
        category_id: null, // Single category ID as expected by the API
        meta_title: formData.metaTitle || null,
        meta_description: formData.metaDescription || null,
        meta_keywords: formData.metaKeywords || null
      }

      const url = post?.id ? `/api/admin/blog/posts/${post.id}` : '/api/admin/blog/posts'
      const method = post?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
      })

      if (!response.ok) {
        throw new Error('Failed to save blog post')
      }

      toast.success(post ? 'Blog post updated successfully!' : 'Blog post created successfully!')
      onSave()
    } catch (error) {
      console.error('Error saving blog post:', error)
      toast.error('Failed to save blog post. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleGenerateSocialPosts = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please add title and content before generating social posts')
      return
    }

    setIsGeneratingSocial(true)
    
    try {
      const response = await fetch('/api/admin/blog/generate-social', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          excerpt: formData.excerpt
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate social posts')
      }

      const data = await response.json()
      toast.success('Social media posts generated successfully!')
      
      // You could show a modal or redirect to social media management
      // For now, just show success message
    } catch (error) {
      console.error('Error generating social posts:', error)
      toast.error('Failed to generate social posts. Please try again.')
    } finally {
      setIsGeneratingSocial(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {post ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {post ? 'Update your blog post content' : 'Write and publish your new blog post'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {post && (
            <Button
              variant="outline"
              onClick={() => setShowVersionHistory(true)}
            >
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={isSaving || !formData.title.trim()}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b px-6">
          <TabsList className="h-12">
            <TabsTrigger value="content" className="gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="seo" className="gap-2">
              <Search className="h-4 w-4" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content Tab */}
        <TabsContent value="content" className="flex-1 overflow-auto p-6 mt-0">
          <div className="max-w-4xl mx-auto space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter blog post title..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="text-lg font-medium"
            />
          </div>

          {/* Excerpt */}
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              placeholder="Brief description of your blog post..."
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              rows={3}
            />
          </div>

          {/* Featured Image Upload */}
          <CloudinaryImageUpload
            value={formData.mainImageUrl}
            onChange={(url) => handleInputChange('mainImageUrl', url)}
            onAltTextChange={(altText) => handleInputChange('mainImageAlt', altText)}
            altText={formData.mainImageAlt}
            label="Featured Image"
          />

          {/* Content */}
          <div>
            <Label htmlFor="content">Content *</Label>
            <RichTextEditor
              value={formData.content}
              onChange={(value) => handleInputChange('content', value)}
              placeholder="Write your blog post content here..."
            />
          </div>

          {/* Publishing Options */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Publishing Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="publishedAt">Publish Date & Time</Label>
                <Input
                  id="publishedAt"
                  type="datetime-local"
                  value={formData.publishedAt}
                  onChange={(e) => handleInputChange('publishedAt', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to save as draft. Set future date to schedule publication.
                </p>
              </div>
              
              {/* Quick scheduling options */}
              <div>
                <Label className="text-sm">Quick Schedule</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const now = new Date()
                      now.setHours(now.getHours() + 1)
                      handleInputChange('publishedAt', now.toISOString().slice(0, 16))
                    }}
                  >
                    In 1 hour
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const tomorrow = new Date()
                      tomorrow.setDate(tomorrow.getDate() + 1)
                      tomorrow.setHours(9, 0, 0, 0)
                      handleInputChange('publishedAt', tomorrow.toISOString().slice(0, 16))
                    }}
                  >
                    Tomorrow 9 AM
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const nextWeek = new Date()
                      nextWeek.setDate(nextWeek.getDate() + 7)
                      nextWeek.setHours(9, 0, 0, 0)
                      handleInputChange('publishedAt', nextWeek.toISOString().slice(0, 16))
                    }}
                  >
                    Next week
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleInputChange('publishedAt', '')}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Auto-generate social posts option */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoGenerateSocial"
                  className="rounded border-gray-300"
                  checked={formData.autoGenerateSocial}
                  onChange={(e) => handleInputChange('autoGenerateSocial', e.target.checked)}
                />
                <Label htmlFor="autoGenerateSocial" className="text-sm">
                  Automatically generate social media posts when published
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <div>
            <Label htmlFor="categories">Categories (comma-separated)</Label>
            <Input
              id="categories"
              placeholder="e.g., Technology, AI, Innovation"
              value={Array.isArray(formData.categories) ? formData.categories.join(', ') : ''}
              onChange={(e) => handleInputChange('categories', e.target.value)}
            />
          </div>

          {/* Preview Categories */}
          {Array.isArray(formData.categories) && formData.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.categories.map((category, index) => (
                <Badge key={index} variant="outline">
                  <Tag className="h-3 w-3 mr-1" />
                  {category}
                </Badge>
              ))}
            </div>
          )}

          {/* Generate Social Posts Button */}
          <div className="pt-4">
            <Button
              variant="outline"
              onClick={handleGenerateSocialPosts}
              disabled={isGeneratingSocial || !formData.title.trim()}
              className="w-full"
            >
              {isGeneratingSocial ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Social Posts...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Generate Social Media Posts
                </>
              )}
            </Button>
          </div>
          </div>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="flex-1 overflow-auto p-6 mt-0">
          <div className="max-w-4xl mx-auto">
            <SEOOptimizer
              title={formData.title}
              content={formData.content}
              excerpt={formData.excerpt}
              seoData={{
                metaTitle: formData.metaTitle,
                metaDescription: formData.metaDescription,
                metaKeywords: formData.metaKeywords,
                slug: formData.slug
              }}
              onSEODataChange={(seoData) => {
                setFormData(prev => ({
                  ...prev,
                  metaTitle: seoData.metaTitle,
                  metaDescription: seoData.metaDescription,
                  metaKeywords: seoData.metaKeywords,
                  slug: seoData.slug
                }))
              }}
            />
          </div>
        </TabsContent>

        {/* AI Assistant Tab */}
        <TabsContent value="ai" className="flex-1 overflow-auto p-6 mt-0">
          <div className="max-w-4xl mx-auto">
            <AIContentAssistant 
              contentType="blog"
              onContentGenerated={(content: any) => {
                // Handle AI generated content
                if (content.title) {
                  setFormData(prev => ({ ...prev, title: content.title || prev.title }))
                }
                if (content.content) {
                  setFormData(prev => ({ ...prev, content: content.content || prev.content }))
                }
                if (content.excerpt) {
                  setFormData(prev => ({ ...prev, excerpt: content.excerpt || prev.excerpt }))
                }
                toast.success('AI content applied to your post')
              }}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Version History Modal */}
      {post && post.id && (
        <BlogVersionHistory
          postId={post.id}
          isOpen={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
        />
      )}
    </div>
  )
}
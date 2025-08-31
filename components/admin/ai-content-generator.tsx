'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Copy, Download, Wand2, FileText, MessageSquare, Mail } from "lucide-react"
import { toast } from "sonner"

interface GeneratedContent {
  content: string
  title?: string
  suggestions: string[]
  seoKeywords: string[]
  hashtags: string[]
  tokensUsed: number
}

export function AIContentGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [contentType, setContentType] = useState<'blog' | 'social' | 'newsletter'>('blog')
  const [platform, setPlatform] = useState<'linkedin' | 'twitter'>('linkedin')
  const [tone, setTone] = useState<'professional' | 'casual' | 'engaging'>('professional')
  const [prompt, setPrompt] = useState('')
  const [keywords, setKeywords] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a topic or prompt')
      return
    }

    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/admin/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          contentType,
          platform: contentType === 'social' ? platform : undefined,
          tone,
          keywords: keywords ? keywords.split(',').map(k => k.trim()) : undefined,
          targetAudience: targetAudience || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const data = await response.json()
      setGeneratedContent(data)
      toast.success('Content generated successfully!')
    } catch (error) {
      console.error('Error generating content:', error)
      toast.error('Failed to generate content. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'blog': return <FileText className="h-4 w-4" />
      case 'social': return <MessageSquare className="h-4 w-4" />
      case 'newsletter': return <Mail className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Content Generation Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="contentType">Content Type</Label>
            <Select value={contentType} onValueChange={(value: 'blog' | 'social' | 'newsletter') => setContentType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Blog Post
                  </div>
                </SelectItem>
                <SelectItem value="social">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Social Media
                  </div>
                </SelectItem>
                <SelectItem value="newsletter">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Newsletter
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {contentType === 'social' && (
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select value={platform} onValueChange={(value: 'linkedin' | 'twitter') => setPlatform(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={(value: 'professional' | 'casual' | 'engaging') => setTone(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="engaging">Engaging</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              placeholder="e.g., AI, technology, innovation"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              placeholder="e.g., business professionals, developers"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="prompt">Topic or Prompt</Label>
        <Textarea
          id="prompt"
          placeholder="Enter your topic or detailed prompt for content generation..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />
      </div>

      <Button 
        onClick={handleGenerate} 
        disabled={isGenerating || !prompt.trim()}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating Content...
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4 mr-2" />
            Generate Content
          </>
        )}
      </Button>

      {/* Generated Content Display */}
      {generatedContent && (
        <div className="space-y-4">
          <Separator />
          
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              {getContentTypeIcon(contentType)}
              Generated Content
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {generatedContent.tokensUsed} tokens used
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(generatedContent.content)}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
          </div>

          {generatedContent.title && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Title</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{generatedContent.title}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {generatedContent.content}
                </pre>
              </div>
            </CardContent>
          </Card>

          {generatedContent.hashtags && generatedContent.hashtags.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Hashtags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.hashtags.map((hashtag, index) => (
                    <Badge key={index} variant="outline">
                      {hashtag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {generatedContent.seoKeywords && generatedContent.seoKeywords.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">SEO Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.seoKeywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {generatedContent.suggestions && generatedContent.suggestions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {generatedContent.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      • {suggestion}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
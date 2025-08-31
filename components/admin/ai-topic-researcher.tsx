'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Search, Lightbulb, Copy, RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface ContentIdea {
  title: string
  description: string
  contentType: string
}

export function AITopicResearcher() {
  const [isResearching, setIsResearching] = useState(false)
  const [contentType, setContentType] = useState<'blog' | 'social' | 'newsletter'>('blog')
  const [topic, setTopic] = useState('')
  const [contentIdeas, setContentIdeas] = useState<string[]>([])

  const handleResearch = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic to research')
      return
    }

    setIsResearching(true)
    
    try {
      const response = await fetch('/api/admin/ai/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          contentType,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to research topic')
      }

      const data = await response.json()
      setContentIdeas(data.ideas || [])
      toast.success('Topic research completed!')
    } catch (error) {
      console.error('Error researching topic:', error)
      toast.error('Failed to research topic. Please try again.')
    } finally {
      setIsResearching(false)
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

  const handleGenerateFromIdea = async (idea: string) => {
    try {
      // This would integrate with the content generator
      toast.info('Redirecting to content generator...')
      // You could implement navigation to the generate tab with pre-filled content
    } catch (error) {
      toast.error('Failed to generate content from idea')
    }
  }

  return (
    <div className="space-y-6">
      {/* Topic Research Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="topic">Topic or Industry</Label>
          <Input
            id="topic"
            placeholder="e.g., artificial intelligence, digital marketing"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="contentType">Content Type</Label>
          <Select value={contentType} onValueChange={(value: 'blog' | 'social' | 'newsletter') => setContentType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blog">Blog Post</SelectItem>
              <SelectItem value="social">Social Media</SelectItem>
              <SelectItem value="newsletter">Newsletter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        onClick={handleResearch} 
        disabled={isResearching || !topic.trim()}
        className="w-full"
      >
        {isResearching ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Researching Topic...
          </>
        ) : (
          <>
            <Search className="h-4 w-4 mr-2" />
            Research Topic & Generate Ideas
          </>
        )}
      </Button>

      {/* Research Results */}
      {contentIdeas.length > 0 && (
        <div className="space-y-4">
          <Separator />
          
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Content Ideas
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResearch}
              disabled={isResearching}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh Ideas
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {contentIdeas.map((idea, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Idea {index + 1}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {contentType}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {idea}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(idea)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleGenerateFromIdea(idea)}
                      >
                        Generate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
              <CardDescription>
                Use these ideas to create content or get more specific suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const allIdeas = contentIdeas.join('\n\n')
                    handleCopy(allIdeas)
                  }}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy All Ideas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // This could open a modal or navigate to generate content with all ideas
                    toast.info('Feature coming soon: Batch content generation')
                  }}
                >
                  <Lightbulb className="h-3 w-3 mr-1" />
                  Generate All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Research Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Research Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Be specific with your topic for more targeted ideas</li>
            <li>• Try different content types to see varied approaches</li>
            <li>• Use generated ideas as starting points for your own content</li>
            <li>• Combine multiple ideas for comprehensive content pieces</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
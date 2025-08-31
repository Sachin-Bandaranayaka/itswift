'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Copy, Target, Lightbulb, TrendingUp } from "lucide-react"
import { toast } from "sonner"

interface OptimizedContent {
  optimizedContent: string
  suggestions: string[]
  seoKeywords: string[]
}

export function AIContentOptimizer() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [contentType, setContentType] = useState<'blog' | 'social' | 'newsletter'>('blog')
  const [originalContent, setOriginalContent] = useState('')
  const [optimizedResult, setOptimizedResult] = useState<OptimizedContent | null>(null)

  const handleOptimize = async () => {
    if (!originalContent.trim()) {
      toast.error('Please enter content to optimize')
      return
    }

    setIsOptimizing(true)
    
    try {
      const response = await fetch('/api/admin/ai/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: originalContent.trim(),
          contentType,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to optimize content')
      }

      const data = await response.json()
      setOptimizedResult(data)
      toast.success('Content optimized successfully!')
    } catch (error) {
      console.error('Error optimizing content:', error)
      toast.error('Failed to optimize content. Please try again.')
    } finally {
      setIsOptimizing(false)
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

  return (
    <div className="space-y-6">
      {/* Content Optimization Form */}
      <div className="space-y-4">
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

        <div>
          <Label htmlFor="originalContent">Content to Optimize</Label>
          <Textarea
            id="originalContent"
            placeholder="Paste your existing content here for AI-powered optimization..."
            value={originalContent}
            onChange={(e) => setOriginalContent(e.target.value)}
            rows={8}
          />
        </div>

        <Button 
          onClick={handleOptimize} 
          disabled={isOptimizing || !originalContent.trim()}
          className="w-full"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Optimizing Content...
            </>
          ) : (
            <>
              <Target className="h-4 w-4 mr-2" />
              Optimize Content
            </>
          )}
        </Button>
      </div>

      {/* Optimization Results */}
      {optimizedResult && (
        <div className="space-y-4">
          <Separator />
          
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Optimization Results
            </h3>
          </div>

          <Tabs defaultValue="optimized" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="optimized">Optimized Content</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="keywords">SEO Keywords</TabsTrigger>
            </TabsList>

            <TabsContent value="optimized" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Optimized Content</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(optimizedResult.optimizedContent)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <CardDescription>
                    AI-enhanced version of your content with improved readability and SEO
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {optimizedResult.optimizedContent}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-600 dark:text-gray-400">Original</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <pre className="whitespace-pre-wrap font-sans text-xs text-gray-500">
                        {originalContent}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-green-600 dark:text-green-400">Optimized</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <pre className="whitespace-pre-wrap font-sans text-xs">
                        {optimizedResult.optimizedContent}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    Improvement Suggestions
                  </CardTitle>
                  <CardDescription>
                    AI-generated recommendations to enhance your content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {optimizedResult.suggestions.length > 0 ? (
                    <ul className="space-y-3">
                      {optimizedResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                            {index + 1}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {suggestion}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No specific suggestions available for this content.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="keywords" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">SEO Keywords</CardTitle>
                  <CardDescription>
                    Relevant keywords identified for better search engine optimization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {optimizedResult.seoKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {optimizedResult.seoKeywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No SEO keywords identified for this content.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
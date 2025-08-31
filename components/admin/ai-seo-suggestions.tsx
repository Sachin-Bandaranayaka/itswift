'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Search, Target, TrendingUp, Copy } from "lucide-react"
import { toast } from "sonner"

interface SEOData {
  keywords: string[]
  suggestions: string[]
}

export function AISEOSuggestions() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [topic, setTopic] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [seoData, setSeoData] = useState<SEOData | null>(null)

  const handleAnalyze = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic for SEO analysis')
      return
    }

    setIsAnalyzing(true)
    
    try {
      const response = await fetch('/api/admin/ai/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          targetAudience: targetAudience || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze SEO')
      }

      const data = await response.json()
      setSeoData(data)
      toast.success('SEO analysis completed!')
    } catch (error) {
      console.error('Error analyzing SEO:', error)
      toast.error('Failed to analyze SEO. Please try again.')
    } finally {
      setIsAnalyzing(false)
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

  const handleCopyKeywords = async () => {
    if (seoData?.keywords) {
      const keywordsText = seoData.keywords.join(', ')
      await handleCopy(keywordsText)
    }
  }

  return (
    <div className="space-y-6">
      {/* SEO Analysis Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="topic">Topic or Main Keyword</Label>
          <Input
            id="topic"
            placeholder="e.g., content marketing strategies"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="targetAudience">Target Audience (optional)</Label>
          <Input
            id="targetAudience"
            placeholder="e.g., small business owners, marketers"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          />
        </div>
      </div>

      <Button 
        onClick={handleAnalyze} 
        disabled={isAnalyzing || !topic.trim()}
        className="w-full"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyzing SEO...
          </>
        ) : (
          <>
            <Search className="h-4 w-4 mr-2" />
            Generate SEO Suggestions
          </>
        )}
      </Button>

      {/* SEO Results */}
      {seoData && (
        <div className="space-y-4">
          <Separator />
          
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              SEO Analysis Results
            </h3>
          </div>

          <Tabs defaultValue="keywords" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="suggestions">Optimization Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="keywords" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      SEO Keywords
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyKeywords}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy All
                    </Button>
                  </div>
                  <CardDescription>
                    Relevant keywords to target for better search engine visibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {seoData.keywords.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {seoData.keywords.map((keyword, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="cursor-pointer hover:bg-secondary/80 transition-colors"
                            onClick={() => handleCopy(keyword)}
                          >
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Keyword Categories */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Primary Keywords</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-1">
                              {seoData.keywords.slice(0, 3).map((keyword, index) => (
                                <Badge key={index} variant="default" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Long-tail Keywords</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-1">
                              {seoData.keywords.slice(3, 8).map((keyword, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Related Terms</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-1">
                              {seoData.keywords.slice(8).map((keyword, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No keywords generated. Try a different topic.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">SEO Optimization Tips</CardTitle>
                  <CardDescription>
                    AI-generated recommendations to improve your content's search visibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {seoData.suggestions && seoData.suggestions.length > 0 ? (
                    <ul className="space-y-3">
                      {seoData.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-xs font-medium text-green-600 dark:text-green-400">
                            {index + 1}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {suggestion}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-3">
                      {/* Default SEO tips when no specific suggestions are available */}
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                          1
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Use your primary keyword in the title, preferably near the beginning
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                          2
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Include keywords naturally throughout your content, aiming for 1-2% keyword density
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                          3
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Create compelling meta descriptions that include your target keywords
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                          4
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Use header tags (H1, H2, H3) to structure your content and include keywords
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400">
                          5
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          Focus on creating high-quality, valuable content that answers user questions
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* SEO Tips */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">SEO Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Research keywords with good search volume and low competition</li>
            <li>• Create content that matches search intent</li>
            <li>• Optimize for featured snippets with clear, concise answers</li>
            <li>• Use internal linking to connect related content</li>
            <li>• Ensure your content is mobile-friendly and loads quickly</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
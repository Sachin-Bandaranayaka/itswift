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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Loader2, 
  Copy, 
  Wand2, 
  FileText, 
  Search, 
  Target,
  Lightbulb,
  TrendingUp,
  Hash
} from "lucide-react"
import { toast } from "sonner"

interface AIContentAssistantProps {
  contentType: 'blog' | 'social' | 'newsletter'
  onContentGenerated?: (content: any) => void
}

interface GeneratedContent {
  content: string
  title?: string
  suggestions: string[]
  seoKeywords: string[]
  hashtags?: string[]
  tokensUsed: number
}

export function AIContentAssistant({ contentType, onContentGenerated }: AIContentAssistantProps) {
  const [activeTab, setActiveTab] = useState('generate')
  const [isLoading, setIsLoading] = useState(false)
  
  // Content Generation
  const [prompt, setPrompt] = useState('')
  const [tone, setTone] = useState<'professional' | 'casual' | 'engaging'>('professional')
  const [keywords, setKeywords] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  
  // Topic Research
  const [researchTopic, setResearchTopic] = useState('')
  const [researchResults, setResearchResults] = useState<any>(null)
  
  // SEO Optimization
  const [contentToOptimize, setContentToOptimize] = useState('')
  const [seoSuggestions, setSeoSuggestions] = useState<any>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a topic or prompt')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/admin/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          contentType,
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
      onContentGenerated?.(data)
      toast.success('Content generated successfully!')
    } catch (error) {
      console.error('Error generating content:', error)
      toast.error('Failed to generate content. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResearch = async () => {
    if (!researchTopic.trim()) {
      toast.error('Please enter a research topic')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/admin/ai/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: researchTopic.trim(),
          contentType
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to research topic')
      }

      const data = await response.json()
      setResearchResults(data)
      toast.success('Research completed successfully!')
    } catch (error) {
      console.error('Error researching topic:', error)
      toast.error('Failed to research topic. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptimize = async () => {
    if (!contentToOptimize.trim()) {
      toast.error('Please enter content to optimize')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/admin/ai/seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: contentToOptimize.trim(),
          contentType
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to optimize content')
      }

      const data = await response.json()
      setSeoSuggestions(data)
      toast.success('SEO analysis completed!')
    } catch (error) {
      console.error('Error optimizing content:', error)
      toast.error('Failed to optimize content. Please try again.')
    } finally {
      setIsLoading(false)
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
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          AI Content Assistant
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Get AI-powered help with your {contentType} content
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate" className="text-xs">
              <Wand2 className="h-3 w-3 mr-1" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="research" className="text-xs">
              <Search className="h-3 w-3 mr-1" />
              Research
            </TabsTrigger>
            <TabsTrigger value="optimize" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Optimize
            </TabsTrigger>
          </TabsList>

          {/* Content Generation Tab */}
          <TabsContent value="generate" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Generate Content</CardTitle>
                <CardDescription className="text-sm">
                  Create {contentType} content with AI assistance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="prompt" className="text-sm">Topic or Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder={`Enter your ${contentType} topic or detailed prompt...`}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label htmlFor="tone" className="text-sm">Tone</Label>
                    <Select value={tone} onValueChange={(value: 'professional' | 'casual' | 'engaging') => setTone(value)}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="engaging">Engaging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="keywords" className="text-sm">Keywords</Label>
                    <Input
                      id="keywords"
                      placeholder="AI, technology, innovation"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="audience" className="text-sm">Target Audience</Label>
                    <Input
                      id="audience"
                      placeholder="Business professionals, developers"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isLoading || !prompt.trim()}
                  className="w-full"
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-3 w-3 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Generated Content Display */}
            {generatedContent && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Generated Content</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(generatedContent.content)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {generatedContent.title && (
                    <div>
                      <Label className="text-xs font-medium">Title</Label>
                      <p className="text-sm font-medium mt-1">{generatedContent.title}</p>
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-xs font-medium">Content</Label>
                    <div className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                      <pre className="whitespace-pre-wrap font-sans">
                        {generatedContent.content}
                      </pre>
                    </div>
                  </div>

                  {generatedContent.seoKeywords && generatedContent.seoKeywords.length > 0 && (
                    <div>
                      <Label className="text-xs font-medium">SEO Keywords</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {generatedContent.seoKeywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {generatedContent.hashtags && generatedContent.hashtags.length > 0 && (
                    <div>
                      <Label className="text-xs font-medium">Hashtags</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {generatedContent.hashtags.map((hashtag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Hash className="h-2 w-2 mr-1" />
                            {hashtag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Research Tab */}
          <TabsContent value="research" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Topic Research</CardTitle>
                <CardDescription className="text-sm">
                  Research topics and gather insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="researchTopic" className="text-sm">Research Topic</Label>
                  <Input
                    id="researchTopic"
                    placeholder="Enter topic to research..."
                    value={researchTopic}
                    onChange={(e) => setResearchTopic(e.target.value)}
                    className="text-sm"
                  />
                </div>

                <Button 
                  onClick={handleResearch} 
                  disabled={isLoading || !researchTopic.trim()}
                  className="w-full"
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Search className="h-3 w-3 mr-2" />
                      Research
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {researchResults && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Research Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    {researchResults.insights && (
                      <div>
                        <Label className="text-xs font-medium">Key Insights</Label>
                        <ul className="mt-1 space-y-1">
                          {researchResults.insights.map((insight: string, index: number) => (
                            <li key={index} className="text-xs text-gray-600 dark:text-gray-400">
                              • {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Optimize Tab */}
          <TabsContent value="optimize" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">SEO Optimization</CardTitle>
                <CardDescription className="text-sm">
                  Optimize your content for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contentToOptimize" className="text-sm">Content to Optimize</Label>
                  <Textarea
                    id="contentToOptimize"
                    placeholder="Paste your content here for SEO analysis..."
                    value={contentToOptimize}
                    onChange={(e) => setContentToOptimize(e.target.value)}
                    rows={4}
                    className="text-sm"
                  />
                </div>

                <Button 
                  onClick={handleOptimize} 
                  disabled={isLoading || !contentToOptimize.trim()}
                  className="w-full"
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-3 w-3 mr-2" />
                      Analyze SEO
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {seoSuggestions && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">SEO Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    {seoSuggestions.suggestions && (
                      <div>
                        <Label className="text-xs font-medium">Recommendations</Label>
                        <ul className="mt-1 space-y-1">
                          {seoSuggestions.suggestions.map((suggestion: string, index: number) => (
                            <li key={index} className="text-xs text-gray-600 dark:text-gray-400">
                              • {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
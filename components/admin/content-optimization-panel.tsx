'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Search, 
  BookOpen, 
  MessageSquare, 
  TestTube,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  Clock,
  Target,
  Lightbulb
} from "lucide-react"
import { ContentOptimizer, SEOAnalysis, ReadabilityAnalysis, BrandVoiceAnalysis } from '@/lib/services/content-optimizer'

interface ContentOptimizationPanelProps {
  initialContent?: string
  contentType?: 'blog' | 'social' | 'newsletter'
  onOptimizedContent?: (content: string) => void
  className?: string
}

export function ContentOptimizationPanel({ 
  initialContent = '', 
  contentType = 'blog',
  onOptimizedContent,
  className 
}: ContentOptimizationPanelProps) {
  const [content, setContent] = useState(initialContent)
  const [title, setTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [targetKeywords, setTargetKeywords] = useState('')
  
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis | null>(null)
  const [readabilityAnalysis, setReadabilityAnalysis] = useState<ReadabilityAnalysis | null>(null)
  const [brandVoiceAnalysis, setBrandVoiceAnalysis] = useState<BrandVoiceAnalysis | null>(null)
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState('seo')

  useEffect(() => {
    if (initialContent !== content) {
      setContent(initialContent)
    }
  }, [initialContent])

  const handleAnalyzeContent = async () => {
    if (!content.trim()) {
      return
    }

    setIsAnalyzing(true)
    
    try {
      const keywords = targetKeywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
      
      // Run all analyses in parallel
      const [seoResult, readabilityResult, brandVoiceResult] = await Promise.all([
        ContentOptimizer.analyzeSEO(content, title, metaDescription, keywords),
        Promise.resolve(ContentOptimizer.analyzeReadability(content)),
        ContentOptimizer.analyzeBrandVoice(content)
      ])
      
      setSeoAnalysis(seoResult)
      setReadabilityAnalysis(readabilityResult)
      setBrandVoiceAnalysis(brandVoiceResult)
    } catch (error) {
      console.error('Error analyzing content:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const renderSEOAnalysis = () => {
    if (!seoAnalysis) return null

    return (
      <div className="space-y-6">
        {/* Overall Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                SEO Score
              </span>
              <Badge variant="outline" className={getScoreBadgeColor(seoAnalysis.score)}>
                {seoAnalysis.score}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={seoAnalysis.score} className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Title</p>
                <p className={`text-lg font-semibold ${getScoreColor(seoAnalysis.title_analysis.readability === 'good' ? 85 : 60)}`}>
                  {seoAnalysis.title_analysis.readability === 'good' ? 'Good' : 'Needs Work'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Content</p>
                <p className={`text-lg font-semibold ${getScoreColor(seoAnalysis.content_analysis.word_count >= 300 ? 85 : 40)}`}>
                  {seoAnalysis.content_analysis.word_count} words
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Keywords</p>
                <p className={`text-lg font-semibold ${getScoreColor(seoAnalysis.content_analysis.keyword_density >= 1 ? 85 : 40)}`}>
                  {seoAnalysis.content_analysis.keyword_density}% density
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Title Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Length</span>
                <span className="text-sm font-medium">
                  {seoAnalysis.title_analysis.length} chars 
                  <span className="text-muted-foreground ml-1">
                    (optimal: {seoAnalysis.title_analysis.optimal_length.min}-{seoAnalysis.title_analysis.optimal_length.max})
                  </span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Keywords</span>
                <span className="text-sm font-medium">
                  {seoAnalysis.title_analysis.has_keywords ? (
                    <span className="text-green-600">✓ Included</span>
                  ) : (
                    <span className="text-red-600">✗ Missing</span>
                  )}
                </span>
              </div>
              {seoAnalysis.title_analysis.suggestions.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium">Suggestions:</p>
                  {seoAnalysis.title_analysis.suggestions.map((suggestion, index) => (
                    <p key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                      <Lightbulb className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      {suggestion}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Word Count</span>
                <span className="text-sm font-medium">{seoAnalysis.content_analysis.word_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Keyword Density</span>
                <span className="text-sm font-medium">{seoAnalysis.content_analysis.keyword_density}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Headings</span>
                <span className="text-sm font-medium">
                  {seoAnalysis.content_analysis.headings_structure === 'good' ? (
                    <span className="text-green-600">✓ Good</span>
                  ) : (
                    <span className="text-red-600">✗ Poor</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Links</span>
                <span className="text-sm font-medium">
                  {seoAnalysis.content_analysis.internal_links} internal, {seoAnalysis.content_analysis.external_links} external
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Keywords */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Keywords Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Primary Keywords</p>
              <div className="flex flex-wrap gap-2">
                {seoAnalysis.keywords.primary.map((keyword, index) => (
                  <Badge key={index} variant="default" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Secondary Keywords</p>
              <div className="flex flex-wrap gap-2">
                {seoAnalysis.keywords.secondary.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            {seoAnalysis.keywords.missing_opportunities.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Missing Opportunities</p>
                <div className="flex flex-wrap gap-2">
                  {seoAnalysis.keywords.missing_opportunities.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-yellow-300 text-yellow-700">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overall Suggestions */}
        {seoAnalysis.overall_suggestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">SEO Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {seoAnalysis.overall_suggestions.map((suggestion, index) => (
                  <Alert key={index}>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>{suggestion}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderReadabilityAnalysis = () => {
    if (!readabilityAnalysis) return null

    return (
      <div className="space-y-6">
        {/* Overall Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Readability Score
              </span>
              <Badge variant="outline" className={getScoreBadgeColor(readabilityAnalysis.score)}>
                {readabilityAnalysis.score}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={readabilityAnalysis.score} className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Grade Level</p>
                <p className="text-lg font-semibold">{readabilityAnalysis.grade_level}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Reading Time</p>
                <p className="text-lg font-semibold flex items-center justify-center gap-1">
                  <Clock className="h-4 w-4" />
                  {readabilityAnalysis.reading_time}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Avg Sentence</p>
                <p className="text-lg font-semibold">{readabilityAnalysis.sentence_analysis.avg_sentence_length} words</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sentence Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sentence Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Length</span>
                <span className="text-sm font-medium">
                  {readabilityAnalysis.sentence_analysis.avg_sentence_length} words
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Long Sentences</span>
                <span className="text-sm font-medium">
                  {readabilityAnalysis.sentence_analysis.long_sentences} ({'>'}20 words)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Optimal Range</span>
                <span className="text-sm font-medium text-muted-foreground">
                  {readabilityAnalysis.sentence_analysis.optimal_range.min}-{readabilityAnalysis.sentence_analysis.optimal_range.max} words
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Word Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Word Complexity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg Word Length</span>
                <span className="text-sm font-medium">{readabilityAnalysis.word_analysis.avg_word_length} chars</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Complex Words</span>
                <span className="text-sm font-medium">{readabilityAnalysis.word_analysis.complex_words}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Passive Voice</span>
                <span className="text-sm font-medium">{readabilityAnalysis.word_analysis.passive_voice_percentage}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Structure Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Document Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{readabilityAnalysis.structure_analysis.paragraphs}</p>
                <p className="text-sm text-muted-foreground">Paragraphs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{readabilityAnalysis.structure_analysis.headings}</p>
                <p className="text-sm text-muted-foreground">Headings</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{readabilityAnalysis.structure_analysis.bullet_points}</p>
                <p className="text-sm text-muted-foreground">Bullet Points</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{readabilityAnalysis.structure_analysis.lists}</p>
                <p className="text-sm text-muted-foreground">Lists</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions */}
        {readabilityAnalysis.suggestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Readability Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {readabilityAnalysis.suggestions.map((suggestion, index) => (
                  <Alert key={index}>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>{suggestion}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderBrandVoiceAnalysis = () => {
    if (!brandVoiceAnalysis) return null

    return (
      <div className="space-y-6">
        {/* Overall Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Brand Voice Consistency
              </span>
              <Badge variant="outline" className={getScoreBadgeColor(brandVoiceAnalysis.consistency_score)}>
                {brandVoiceAnalysis.consistency_score}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={brandVoiceAnalysis.consistency_score} className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Tone Alignment</p>
                <p className={`text-lg font-semibold ${getScoreColor(brandVoiceAnalysis.tone_analysis.alignment_score)}`}>
                  {brandVoiceAnalysis.tone_analysis.alignment_score}/100
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Brand Terms</p>
                <p className="text-lg font-semibold">
                  {brandVoiceAnalysis.vocabulary_analysis.brand_terms_used.length} used
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Key Messages</p>
                <p className="text-lg font-semibold">
                  {brandVoiceAnalysis.messaging_alignment.key_messages_present.length} present
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tone Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tone Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Detected Tone</p>
              <div className="flex flex-wrap gap-2">
                {brandVoiceAnalysis.tone_analysis.detected_tone.map((tone, index) => (
                  <Badge key={index} variant="default" className="text-xs">
                    {tone}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Target Tone</p>
              <div className="flex flex-wrap gap-2">
                {brandVoiceAnalysis.tone_analysis.target_tone.map((tone, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tone}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Voice Characteristics</p>
              <div className="flex flex-wrap gap-2">
                {brandVoiceAnalysis.style_analysis.voice_characteristics.map((characteristic, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {characteristic}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Vocabulary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Brand Vocabulary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2 text-green-600">Terms Used</p>
                <div className="flex flex-wrap gap-2">
                  {brandVoiceAnalysis.vocabulary_analysis.brand_terms_used.map((term, index) => (
                    <Badge key={index} variant="default" className="text-xs bg-green-100 text-green-800">
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2 text-yellow-600">Missing Terms</p>
                <div className="flex flex-wrap gap-2">
                  {brandVoiceAnalysis.vocabulary_analysis.brand_terms_missing.map((term, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-yellow-300 text-yellow-700">
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Messages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2 text-green-600">Present</p>
                <div className="space-y-1">
                  {brandVoiceAnalysis.messaging_alignment.key_messages_present.map((message, index) => (
                    <p key={index} className="text-xs text-green-700 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {message}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2 text-yellow-600">Missing</p>
                <div className="space-y-1">
                  {brandVoiceAnalysis.messaging_alignment.key_messages_missing.map((message, index) => (
                    <p key={index} className="text-xs text-yellow-700 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {message}
                    </p>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suggestions */}
        {brandVoiceAnalysis.suggestions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Brand Voice Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {brandVoiceAnalysis.suggestions.map((suggestion, index) => (
                  <Alert key={index}>
                    <Lightbulb className="h-4 w-4" />
                    <AlertDescription>{suggestion}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Content Optimization
          </CardTitle>
          <CardDescription>
            Analyze and optimize your content for SEO, readability, and brand voice consistency
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content Input */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter content title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords">Target Keywords (Optional)</Label>
                <Input
                  id="keywords"
                  value={targetKeywords}
                  onChange={(e) => setTargetKeywords(e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="meta-description">Meta Description (Optional)</Label>
              <Input
                id="meta-description"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Brief description for search engines"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content to Analyze</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your content here for analysis..."
                rows={8}
              />
            </div>

            <Button 
              onClick={handleAnalyzeContent} 
              disabled={!content.trim() || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing Content...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Analyze Content
                </>
              )}
            </Button>
          </div>

          {/* Analysis Results */}
          {(seoAnalysis || readabilityAnalysis || brandVoiceAnalysis) && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="seo" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  SEO
                  {seoAnalysis && (
                    <Badge variant="outline" className={`ml-1 ${getScoreBadgeColor(seoAnalysis.score)}`}>
                      {seoAnalysis.score}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="readability" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Readability
                  {readabilityAnalysis && (
                    <Badge variant="outline" className={`ml-1 ${getScoreBadgeColor(readabilityAnalysis.score)}`}>
                      {readabilityAnalysis.score}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="brand-voice" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Brand Voice
                  {brandVoiceAnalysis && (
                    <Badge variant="outline" className={`ml-1 ${getScoreBadgeColor(brandVoiceAnalysis.consistency_score)}`}>
                      {brandVoiceAnalysis.consistency_score}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="seo" className="mt-6">
                {renderSEOAnalysis()}
              </TabsContent>

              <TabsContent value="readability" className="mt-6">
                {renderReadabilityAnalysis()}
              </TabsContent>

              <TabsContent value="brand-voice" className="mt-6">
                {renderBrandVoiceAnalysis()}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
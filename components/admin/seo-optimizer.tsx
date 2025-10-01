'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  TrendingUp,
  Eye,
  FileText,
  Hash,
  Link as LinkIcon
} from "lucide-react"

interface SEOData {
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  slug: string
}

interface SEOOptimizerProps {
  title: string
  content: string
  excerpt: string
  seoData: SEOData
  onSEODataChange: (data: SEOData) => void
}

interface SEOCheck {
  id: string
  label: string
  status: 'good' | 'warning' | 'error'
  message: string
}

export function SEOOptimizer({ 
  title, 
  content, 
  excerpt, 
  seoData, 
  onSEODataChange 
}: SEOOptimizerProps) {
  const [seoScore, setSeoScore] = useState(0)
  const [seoChecks, setSeoChecks] = useState<SEOCheck[]>([])
  const [focusKeyword, setFocusKeyword] = useState('')

  // Calculate SEO score and checks
  useEffect(() => {
    const checks: SEOCheck[] = []
    let score = 0
    const maxScore = 100

    // 1. Meta Title Check (15 points)
    if (seoData.metaTitle) {
      const titleLength = seoData.metaTitle.length
      if (titleLength >= 50 && titleLength <= 60) {
        checks.push({
          id: 'meta-title',
          label: 'Meta Title Length',
          status: 'good',
          message: `Perfect! Meta title is ${titleLength} characters (optimal: 50-60)`
        })
        score += 15
      } else if (titleLength >= 30 && titleLength <= 70) {
        checks.push({
          id: 'meta-title',
          label: 'Meta Title Length',
          status: 'warning',
          message: `Meta title is ${titleLength} characters. Optimal is 50-60 characters`
        })
        score += 10
      } else {
        checks.push({
          id: 'meta-title',
          label: 'Meta Title Length',
          status: 'error',
          message: titleLength < 30 
            ? `Meta title is too short (${titleLength} chars). Add more descriptive text.`
            : `Meta title is too long (${titleLength} chars). Keep it under 60 characters.`
        })
        score += 5
      }
    } else {
      checks.push({
        id: 'meta-title',
        label: 'Meta Title',
        status: 'error',
        message: 'Add a meta title for better SEO'
      })
    }

    // 2. Meta Description Check (15 points)
    if (seoData.metaDescription) {
      const descLength = seoData.metaDescription.length
      if (descLength >= 150 && descLength <= 160) {
        checks.push({
          id: 'meta-description',
          label: 'Meta Description Length',
          status: 'good',
          message: `Perfect! Meta description is ${descLength} characters (optimal: 150-160)`
        })
        score += 15
      } else if (descLength >= 120 && descLength <= 170) {
        checks.push({
          id: 'meta-description',
          label: 'Meta Description Length',
          status: 'warning',
          message: `Meta description is ${descLength} characters. Optimal is 150-160 characters`
        })
        score += 10
      } else {
        checks.push({
          id: 'meta-description',
          label: 'Meta Description Length',
          status: 'error',
          message: descLength < 120 
            ? `Meta description is too short (${descLength} chars). Add more details.`
            : `Meta description is too long (${descLength} chars). Keep it under 160 characters.`
        })
        score += 5
      }
    } else {
      checks.push({
        id: 'meta-description',
        label: 'Meta Description',
        status: 'error',
        message: 'Add a meta description for better SEO'
      })
    }

    // 3. Content Length Check (10 points)
    const contentLength = content.replace(/<[^>]*>/g, '').length
    if (contentLength >= 1000) {
      checks.push({
        id: 'content-length',
        label: 'Content Length',
        status: 'good',
        message: `Great! Content is ${contentLength} characters (recommended: 1000+)`
      })
      score += 10
    } else if (contentLength >= 500) {
      checks.push({
        id: 'content-length',
        label: 'Content Length',
        status: 'warning',
        message: `Content is ${contentLength} characters. Aim for 1000+ for better SEO`
      })
      score += 5
    } else {
      checks.push({
        id: 'content-length',
        label: 'Content Length',
        status: 'error',
        message: `Content is too short (${contentLength} chars). Add more valuable content.`
      })
    }

    // 4. Slug Check (10 points)
    if (seoData.slug) {
      const slugLength = seoData.slug.length
      if (slugLength >= 3 && slugLength <= 60 && /^[a-z0-9-]+$/.test(seoData.slug)) {
        checks.push({
          id: 'slug',
          label: 'URL Slug',
          status: 'good',
          message: 'URL slug is SEO-friendly'
        })
        score += 10
      } else {
        checks.push({
          id: 'slug',
          label: 'URL Slug',
          status: 'warning',
          message: 'URL slug could be improved (use lowercase, hyphens, and keep it short)'
        })
        score += 5
      }
    } else {
      checks.push({
        id: 'slug',
        label: 'URL Slug',
        status: 'error',
        message: 'Add a URL slug'
      })
    }

    // 5. Keywords Check (10 points)
    if (seoData.metaKeywords) {
      const keywords = seoData.metaKeywords.split(',').map(k => k.trim()).filter(k => k)
      if (keywords.length >= 3 && keywords.length <= 10) {
        checks.push({
          id: 'keywords',
          label: 'Meta Keywords',
          status: 'good',
          message: `Good! You have ${keywords.length} keywords (recommended: 3-10)`
        })
        score += 10
      } else {
        checks.push({
          id: 'keywords',
          label: 'Meta Keywords',
          status: 'warning',
          message: keywords.length < 3 
            ? 'Add more keywords (recommended: 3-10)'
            : 'Too many keywords. Focus on 3-10 relevant ones'
        })
        score += 5
      }
    } else {
      checks.push({
        id: 'keywords',
        label: 'Meta Keywords',
        status: 'error',
        message: 'Add meta keywords for better SEO'
      })
    }

    // 6. Focus Keyword in Title (10 points)
    if (focusKeyword && title) {
      if (title.toLowerCase().includes(focusKeyword.toLowerCase())) {
        checks.push({
          id: 'keyword-in-title',
          label: 'Focus Keyword in Title',
          status: 'good',
          message: 'Focus keyword appears in the title'
        })
        score += 10
      } else {
        checks.push({
          id: 'keyword-in-title',
          label: 'Focus Keyword in Title',
          status: 'warning',
          message: 'Consider adding focus keyword to the title'
        })
        score += 5
      }
    }

    // 7. Focus Keyword in Meta Description (10 points)
    if (focusKeyword && seoData.metaDescription) {
      if (seoData.metaDescription.toLowerCase().includes(focusKeyword.toLowerCase())) {
        checks.push({
          id: 'keyword-in-description',
          label: 'Focus Keyword in Meta Description',
          status: 'good',
          message: 'Focus keyword appears in meta description'
        })
        score += 10
      } else {
        checks.push({
          id: 'keyword-in-description',
          label: 'Focus Keyword in Meta Description',
          status: 'warning',
          message: 'Consider adding focus keyword to meta description'
        })
        score += 5
      }
    }

    // 8. Focus Keyword in Content (10 points)
    if (focusKeyword && content) {
      const plainContent = content.replace(/<[^>]*>/g, '').toLowerCase()
      const keywordCount = (plainContent.match(new RegExp(focusKeyword.toLowerCase(), 'g')) || []).length
      const wordCount = plainContent.split(/\s+/).length
      const density = wordCount > 0 ? (keywordCount / wordCount) * 100 : 0

      if (density >= 0.5 && density <= 2.5) {
        checks.push({
          id: 'keyword-density',
          label: 'Focus Keyword Density',
          status: 'good',
          message: `Perfect! Keyword appears ${keywordCount} times (${density.toFixed(2)}% density)`
        })
        score += 10
      } else if (density > 0 && density < 3) {
        checks.push({
          id: 'keyword-density',
          label: 'Focus Keyword Density',
          status: 'warning',
          message: `Keyword appears ${keywordCount} times (${density.toFixed(2)}% density). Aim for 0.5-2.5%`
        })
        score += 5
      } else if (density > 0) {
        checks.push({
          id: 'keyword-density',
          label: 'Focus Keyword Density',
          status: 'error',
          message: density > 3 
            ? `Keyword density too high (${density.toFixed(2)}%). Reduce usage to avoid keyword stuffing.`
            : `Keyword appears only ${keywordCount} times. Use it more naturally in content.`
        })
      }
    }

    // 9. Excerpt Check (10 points)
    if (excerpt) {
      const excerptLength = excerpt.length
      if (excerptLength >= 100 && excerptLength <= 200) {
        checks.push({
          id: 'excerpt',
          label: 'Excerpt Length',
          status: 'good',
          message: `Perfect! Excerpt is ${excerptLength} characters (optimal: 100-200)`
        })
        score += 10
      } else if (excerptLength >= 50) {
        checks.push({
          id: 'excerpt',
          label: 'Excerpt Length',
          status: 'warning',
          message: `Excerpt is ${excerptLength} characters. Optimal is 100-200 characters`
        })
        score += 5
      } else {
        checks.push({
          id: 'excerpt',
          label: 'Excerpt',
          status: 'error',
          message: 'Add a longer excerpt (100-200 characters recommended)'
        })
      }
    } else {
      checks.push({
        id: 'excerpt',
        label: 'Excerpt',
        status: 'error',
        message: 'Add an excerpt for better SEO'
      })
    }

    setSeoScore(Math.min(score, maxScore))
    setSeoChecks(checks)
  }, [title, content, excerpt, seoData, focusKeyword])

  const handleInputChange = (field: keyof SEOData, value: string) => {
    onSEODataChange({
      ...seoData,
      [field]: value
    })
  }

  const generateSlugFromTitle = () => {
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 60)
      handleInputChange('slug', slug)
    }
  }

  const autoFillFromContent = () => {
    if (!seoData.metaTitle && title) {
      handleInputChange('metaTitle', title.substring(0, 60))
    }
    if (!seoData.metaDescription && excerpt) {
      handleInputChange('metaDescription', excerpt.substring(0, 160))
    }
    if (!seoData.slug && title) {
      generateSlugFromTitle()
    }
  }

  const getScoreColor = () => {
    if (seoScore >= 80) return 'text-green-600'
    if (seoScore >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = () => {
    if (seoScore >= 80) return 'Excellent'
    if (seoScore >= 60) return 'Good'
    if (seoScore >= 40) return 'Needs Improvement'
    return 'Poor'
  }

  return (
    <div className="space-y-6">
      {/* SEO Score Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                SEO Score
              </CardTitle>
              <CardDescription>
                Optimize your content for search engines
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getScoreColor()}`}>
                {seoScore}
              </div>
              <div className="text-sm text-gray-500">
                {getScoreLabel()}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={seoScore} className="h-2" />
          <button
            onClick={autoFillFromContent}
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 underline"
          >
            Auto-fill SEO fields from content
          </button>
        </CardContent>
      </Card>

      {/* Focus Keyword */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Focus Keyword
          </CardTitle>
          <CardDescription>
            Enter the main keyword you want to rank for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="e.g., digital marketing strategies"
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Meta Title */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Meta Title
          </CardTitle>
          <CardDescription>
            The title that appears in search results (50-60 characters)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            placeholder="Enter meta title..."
            value={seoData.metaTitle}
            onChange={(e) => handleInputChange('metaTitle', e.target.value)}
            maxLength={70}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{seoData.metaTitle.length} / 60 characters</span>
            {seoData.metaTitle.length > 60 && (
              <span className="text-red-500">Too long</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Meta Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Meta Description
          </CardTitle>
          <CardDescription>
            The description that appears in search results (150-160 characters)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            placeholder="Enter meta description..."
            value={seoData.metaDescription}
            onChange={(e) => handleInputChange('metaDescription', e.target.value)}
            maxLength={170}
            rows={3}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{seoData.metaDescription.length} / 160 characters</span>
            {seoData.metaDescription.length > 160 && (
              <span className="text-red-500">Too long</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* URL Slug */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <LinkIcon className="h-4 w-4 mr-2" />
            URL Slug
          </CardTitle>
          <CardDescription>
            The URL-friendly version of your title
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="enter-url-slug"
              value={seoData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
            />
            <button
              onClick={generateSlugFromTitle}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md whitespace-nowrap"
            >
              Generate
            </button>
          </div>
          <div className="text-xs text-gray-500">
            Preview: /blog/{seoData.slug || 'your-post-slug'}
          </div>
        </CardContent>
      </Card>

      {/* Meta Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Hash className="h-4 w-4 mr-2" />
            Meta Keywords
          </CardTitle>
          <CardDescription>
            Comma-separated keywords (3-10 recommended)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            placeholder="keyword1, keyword2, keyword3"
            value={seoData.metaKeywords}
            onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
          />
          {seoData.metaKeywords && (
            <div className="flex flex-wrap gap-2">
              {seoData.metaKeywords.split(',').map((keyword, index) => (
                <Badge key={index} variant="secondary">
                  {keyword.trim()}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Search Engine Preview
          </CardTitle>
          <CardDescription>
            How your post will appear in Google search results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-white">
            <div className="text-xs text-gray-500 mb-1">
              www.yoursite.com › blog › {seoData.slug || 'post-slug'}
            </div>
            <div className="text-xl text-blue-600 mb-1 hover:underline cursor-pointer">
              {seoData.metaTitle || title || 'Your Post Title'}
            </div>
            <div className="text-sm text-gray-600">
              {seoData.metaDescription || excerpt || 'Your post description will appear here...'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">SEO Analysis</CardTitle>
          <CardDescription>
            Recommendations to improve your SEO score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {seoChecks.map((check) => (
              <div key={check.id} className="flex items-start gap-3">
                <div className="mt-0.5">
                  {check.status === 'good' && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {check.status === 'warning' && (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                  {check.status === 'error' && (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{check.label}</div>
                  <div className="text-sm text-gray-600">{check.message}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  TestTube, 
  Plus, 
  Play, 
  Pause, 
  BarChart3,
  TrendingUp,
  Users,
  MousePointer,
  Target,
  Trophy,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import { ContentOptimizer, ABTest, ABTestVariant, ABTestResult } from '@/lib/services/content-optimizer'

interface ABTestingManagerProps {
  className?: string
}

// Mock data - in real implementation, this would come from API
const mockTests: ABTest[] = [
  {
    id: '1',
    name: 'Blog Title Optimization',
    description: 'Testing different blog post titles for engagement',
    content_type: 'blog',
    status: 'running',
    variants: [
      {
        id: 'control',
        name: 'Control (Original)',
        content: 'How to Build Better Content Automation',
        type: 'title',
        created_at: '2024-01-10T00:00:00Z'
      },
      {
        id: 'variant_1',
        name: 'Variant 1',
        content: '5 Proven Strategies to Build Better Content Automation',
        type: 'title',
        created_at: '2024-01-10T00:00:00Z'
      },
      {
        id: 'variant_2',
        name: 'Variant 2',
        content: 'The Ultimate Guide to Content Automation That Actually Works',
        type: 'title',
        created_at: '2024-01-10T00:00:00Z'
      }
    ],
    results: [
      {
        variant_id: 'control',
        impressions: 1250,
        clicks: 89,
        conversions: 12,
        ctr: 7.12,
        conversion_rate: 13.48,
        engagement_score: 85,
        statistical_significance: 0
      },
      {
        variant_id: 'variant_1',
        impressions: 1180,
        clicks: 142,
        conversions: 23,
        ctr: 12.03,
        conversion_rate: 16.20,
        engagement_score: 92,
        statistical_significance: 87
      },
      {
        variant_id: 'variant_2',
        impressions: 1320,
        clicks: 118,
        conversions: 18,
        ctr: 8.94,
        conversion_rate: 15.25,
        engagement_score: 88,
        statistical_significance: 45
      }
    ],
    confidence_level: 87,
    start_date: '2024-01-10T00:00:00Z',
    created_at: '2024-01-10T00:00:00Z'
  },
  {
    id: '2',
    name: 'Social Media CTA Test',
    description: 'Testing different call-to-action phrases for LinkedIn posts',
    content_type: 'social',
    platform: 'linkedin',
    status: 'completed',
    variants: [
      {
        id: 'control',
        name: 'Control (Original)',
        content: 'Learn more',
        type: 'cta',
        created_at: '2024-01-05T00:00:00Z'
      },
      {
        id: 'variant_1',
        name: 'Variant 1',
        content: 'Get started today',
        type: 'cta',
        created_at: '2024-01-05T00:00:00Z'
      }
    ],
    results: [
      {
        variant_id: 'control',
        impressions: 850,
        clicks: 34,
        conversions: 8,
        ctr: 4.00,
        conversion_rate: 23.53,
        engagement_score: 72,
        statistical_significance: 0
      },
      {
        variant_id: 'variant_1',
        impressions: 920,
        clicks: 67,
        conversions: 19,
        ctr: 7.28,
        conversion_rate: 28.36,
        engagement_score: 89,
        statistical_significance: 96
      }
    ],
    winner: 'variant_1',
    confidence_level: 96,
    start_date: '2024-01-05T00:00:00Z',
    end_date: '2024-01-12T00:00:00Z',
    created_at: '2024-01-05T00:00:00Z'
  }
]

export function ABTestingManager({ className }: ABTestingManagerProps) {
  const [tests, setTests] = useState<ABTest[]>(mockTests)
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Form state for creating new tests
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    content_type: 'blog' as 'blog' | 'social' | 'newsletter',
    platform: '',
    test_type: 'title' as 'title' | 'description' | 'cta' | 'full_content',
    original_content: '',
    variant_count: 2
  })

  const handleCreateTest = async () => {
    setIsLoading(true)
    try {
      // Generate variants using AI
      const variants = await ContentOptimizer.createABTestVariants(
        formData.original_content,
        formData.test_type,
        formData.variant_count
      )

      const newTest: ABTest = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        content_type: formData.content_type,
        platform: formData.platform || undefined,
        status: 'draft',
        variants,
        results: [],
        confidence_level: 0,
        created_at: new Date().toISOString()
      }

      setTests(prev => [newTest, ...prev])
      setIsCreateDialogOpen(false)
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        content_type: 'blog',
        platform: '',
        test_type: 'title',
        original_content: '',
        variant_count: 2
      })
    } catch (error) {
      console.error('Error creating A/B test:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartTest = async (testId: string) => {
    setIsLoading(true)
    try {
      setTests(prev => prev.map(test => 
        test.id === testId 
          ? { ...test, status: 'running', start_date: new Date().toISOString() }
          : test
      ))
    } catch (error) {
      console.error('Error starting test:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePauseTest = async (testId: string) => {
    setIsLoading(true)
    try {
      setTests(prev => prev.map(test => 
        test.id === testId 
          ? { ...test, status: 'paused' }
          : test
      ))
    } catch (error) {
      console.error('Error pausing test:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="h-3 w-3" />
      case 'completed':
        return <CheckCircle className="h-3 w-3" />
      case 'paused':
        return <Pause className="h-3 w-3" />
      case 'draft':
        return <Edit className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const renderTestResults = (test: ABTest) => {
    if (test.results.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No results yet</p>
          <p className="text-sm">Start the test to begin collecting data</p>
        </div>
      )
    }

    const sortedResults = [...test.results].sort((a, b) => b.engagement_score - a.engagement_score)
    const winner = sortedResults[0]

    return (
      <div className="space-y-6">
        {/* Overall Results */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Impressions</p>
                  <p className="text-2xl font-bold">
                    {test.results.reduce((sum, result) => sum + result.impressions, 0).toLocaleString()}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                  <p className="text-2xl font-bold">
                    {test.results.reduce((sum, result) => sum + result.clicks, 0).toLocaleString()}
                  </p>
                </div>
                <MousePointer className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversions</p>
                  <p className="text-2xl font-bold">
                    {test.results.reduce((sum, result) => sum + result.conversions, 0)}
                  </p>
                </div>
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <p className="text-2xl font-bold">{test.confidence_level}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Variant Results */}
        <div className="space-y-4">
          <h4 className="font-semibold">Variant Performance</h4>
          {sortedResults.map((result, index) => {
            const variant = test.variants.find(v => v.id === result.variant_id)
            const isWinner = result.variant_id === winner.variant_id
            
            return (
              <Card key={result.variant_id} className={isWinner ? 'border-green-200 bg-green-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${isWinner ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div>
                        <h5 className="font-medium flex items-center gap-2">
                          {variant?.name}
                          {isWinner && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <Trophy className="h-3 w-3 mr-1" />
                              Winner
                            </Badge>
                          )}
                        </h5>
                        <p className="text-sm text-muted-foreground">{variant?.content}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={isWinner ? 'border-green-300 text-green-700' : ''}>
                      {result.engagement_score} score
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Impressions</p>
                      <p className="font-semibold">{result.impressions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Clicks</p>
                      <p className="font-semibold">{result.clicks}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">CTR</p>
                      <p className="font-semibold">{result.ctr.toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Conversions</p>
                      <p className="font-semibold">{result.conversions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Conv. Rate</p>
                      <p className="font-semibold">{result.conversion_rate.toFixed(2)}%</p>
                    </div>
                  </div>

                  {result.statistical_significance > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Statistical Significance</span>
                        <span>{result.statistical_significance}%</span>
                      </div>
                      <Progress value={result.statistical_significance} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Test Analysis */}
        {test.confidence_level >= 95 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Test Complete!</strong> The results are statistically significant. 
              {test.winner && ` Variant "${test.variants.find(v => v.id === test.winner)?.name}" is the clear winner.`}
            </AlertDescription>
          </Alert>
        )}

        {test.confidence_level < 95 && test.confidence_level > 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Test in Progress.</strong> Continue running the test to reach statistical significance (95% confidence).
              Current confidence: {test.confidence_level}%
            </AlertDescription>
          </Alert>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      <Tabs defaultValue="tests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tests">A/B Tests</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">A/B Testing</h2>
              <p className="text-muted-foreground">
                Test different content variations to optimize performance
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New A/B Test
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New A/B Test</DialogTitle>
                  <DialogDescription>
                    Set up a new A/B test to optimize your content performance
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="test-name">Test Name</Label>
                      <Input
                        id="test-name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter test name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content-type">Content Type</Label>
                      <Select 
                        value={formData.content_type} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value as any }))}
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
                      placeholder="Brief description of what you're testing"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="test-type">Test Type</Label>
                      <Select 
                        value={formData.test_type} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, test_type: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="title">Title</SelectItem>
                          <SelectItem value="description">Description</SelectItem>
                          <SelectItem value="cta">Call-to-Action</SelectItem>
                          <SelectItem value="full_content">Full Content</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="variant-count">Number of Variants</Label>
                      <Select 
                        value={formData.variant_count.toString()} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, variant_count: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Variant</SelectItem>
                          <SelectItem value="2">2 Variants</SelectItem>
                          <SelectItem value="3">3 Variants</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.content_type === 'social' && (
                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform (Optional)</Label>
                      <Select 
                        value={formData.platform} 
                        onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
                      >
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

                  <div className="space-y-2">
                    <Label htmlFor="original-content">Original Content</Label>
                    <Textarea
                      id="original-content"
                      value={formData.original_content}
                      onChange={(e) => setFormData(prev => ({ ...prev, original_content: e.target.value }))}
                      placeholder="Enter the original content to test against"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTest} disabled={isLoading || !formData.name || !formData.original_content}>
                      {isLoading ? 'Creating...' : 'Create Test'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Tests List */}
          <div className="space-y-4">
            {tests.map((test) => (
              <Card key={test.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{test.name}</h3>
                        <Badge variant="outline" className={getStatusColor(test.status)}>
                          {getStatusIcon(test.status)}
                          <span className="ml-1 capitalize">{test.status}</span>
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {test.content_type}
                          {test.platform && ` • ${test.platform}`}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{test.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{test.variants.length} variants</span>
                        <span>Created {formatDate(test.created_at)}</span>
                        {test.start_date && <span>Started {formatDate(test.start_date)}</span>}
                        {test.confidence_level > 0 && (
                          <span className="font-medium">
                            {test.confidence_level}% confidence
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {test.status === 'draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartTest(test.id)}
                          disabled={isLoading}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      )}
                      {test.status === 'running' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePauseTest(test.id)}
                          disabled={isLoading}
                        >
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTest(selectedTest?.id === test.id ? null : test)}
                      >
                        <BarChart3 className="h-3 w-3 mr-1" />
                        {selectedTest?.id === test.id ? 'Hide' : 'View'} Results
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Test Results */}
                  {selectedTest?.id === test.id && (
                    <div className="mt-6 pt-6 border-t">
                      {renderTestResults(test)}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {tests.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No A/B tests yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first A/B test to start optimizing your content performance
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Test
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">A/B Testing Insights</h2>
            <p className="text-muted-foreground">
              Key learnings and patterns from your A/B tests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Improvement</span>
                    <span className="font-semibold text-green-600">+23%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Best Performing Type</span>
                    <span className="font-semibold">Title Tests</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="font-semibold">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium text-green-600">✓ Numbers in titles</p>
                    <p className="text-muted-foreground">Increase CTR by 36%</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-green-600">✓ Action-oriented CTAs</p>
                    <p className="text-muted-foreground">Boost conversions by 28%</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-green-600">✓ Benefit-focused copy</p>
                    <p className="text-muted-foreground">Improve engagement by 19%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Audience Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium">Professional tone</p>
                    <p className="text-muted-foreground">Works best on LinkedIn</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Casual language</p>
                    <p className="text-muted-foreground">Higher engagement on Twitter</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Urgency words</p>
                    <p className="text-muted-foreground">Effective across all platforms</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
              <CardDescription>
                Based on your A/B testing results and industry best practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Test more title variations:</strong> Your title tests show the highest improvement rates. 
                    Consider testing emotional vs. rational appeals in your next blog post titles.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Expand CTA testing:</strong> Your successful social media CTA test suggests testing 
                    different action words across all content types could yield significant improvements.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Platform-specific optimization:</strong> Consider creating platform-specific variants 
                    to account for different audience behaviors on LinkedIn vs. Twitter.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
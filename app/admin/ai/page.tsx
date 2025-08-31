'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Sparkles, FileText, MessageSquare, Mail, Search, Lightbulb, Target } from "lucide-react"
import { AIContentGenerator } from "@/components/admin/ai-content-generator"
import { AIContentOptimizer } from "@/components/admin/ai-content-optimizer"
import { AITopicResearcher } from "@/components/admin/ai-topic-researcher"
import { AISEOSuggestions } from "@/components/admin/ai-seo-suggestions"

export default function AIAssistant() {
  const [activeTab, setActiveTab] = useState('generate')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Generate and optimize content with AI assistance
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="optimize" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Optimize
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Research
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            SEO
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="h-5 w-5 mr-2" />
                AI Content Generation
              </CardTitle>
              <CardDescription>
                Generate blog posts, social media content, and newsletters using AI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIContentGenerator />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimize" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Content Optimization
              </CardTitle>
              <CardDescription>
                Improve existing content for better engagement and SEO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AIContentOptimizer />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="research" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Topic Research
              </CardTitle>
              <CardDescription>
                Research topics and generate content ideas with AI assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AITopicResearcher />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                SEO Suggestions
              </CardTitle>
              <CardDescription>
                Get AI-powered SEO recommendations and keyword suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AISEOSuggestions />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
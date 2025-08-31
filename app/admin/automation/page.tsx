// Admin Automation Page - Content automation and optimization management

import { Metadata } from 'next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AutomationRulesManager } from '@/components/admin/automation-rules-manager'
import { ContentTemplatesManager } from '@/components/admin/content-templates-manager'
import { OptimalTimingSuggestions } from '@/components/admin/optimal-timing-suggestions'
import { ContentOptimizationPanel } from '@/components/admin/content-optimization-panel'
import { ABTestingManager } from '@/components/admin/ab-testing-manager'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, FileText, Clock, BarChart3, Target, TestTube } from "lucide-react"

export const metadata: Metadata = {
  title: 'Content Automation | Admin Dashboard',
  description: 'Manage content automation rules, templates, and optimal timing suggestions',
}

export default function AutomationPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold">Content Automation</h1>
        <p className="text-muted-foreground mt-2">
          Automate your content creation and publishing workflows with intelligent rules and templates
        </p>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Automation Rules
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Content Templates
          </TabsTrigger>
          <TabsTrigger value="timing" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Optimal Timing
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Optimization
          </TabsTrigger>
          <TabsTrigger value="ab-testing" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            A/B Testing
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* Automation Rules Tab */}
        <TabsContent value="rules">
          <AutomationRulesManager />
        </TabsContent>

        {/* Content Templates Tab */}
        <TabsContent value="templates">
          <ContentTemplatesManager />
        </TabsContent>

        {/* Optimal Timing Tab */}
        <TabsContent value="timing" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Optimal Timing Analysis</h2>
            <p className="text-muted-foreground">
              AI-powered analysis of the best times to post content for maximum engagement
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OptimalTimingSuggestions 
              platform="linkedin" 
              className="h-fit"
            />
            <OptimalTimingSuggestions 
              platform="twitter" 
              className="h-fit"
            />
          </div>

          {/* Timing Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Timing Insights
              </CardTitle>
              <CardDescription>
                Key insights from your content timing analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm text-muted-foreground">Best Overall Day</h4>
                  <p className="text-2xl font-bold">Tuesday</p>
                  <p className="text-xs text-muted-foreground">Across all platforms</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm text-muted-foreground">Peak Engagement Hour</h4>
                  <p className="text-2xl font-bold">2:00 PM</p>
                  <p className="text-xs text-muted-foreground">Average across platforms</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-sm text-muted-foreground">Engagement Boost</h4>
                  <p className="text-2xl font-bold text-green-600">+34%</p>
                  <p className="text-xs text-muted-foreground">When posting at optimal times</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">Platform-Specific Insights</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">LinkedIn</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Best: Tue-Thu, 8-10 AM</p>
                      <p className="text-xs text-muted-foreground">Professional hours show highest engagement</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                      <span className="font-medium">Twitter/X</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Best: Mon-Fri, 9 AM, 3 PM, 7-9 PM</p>
                      <p className="text-xs text-muted-foreground">Commute and evening hours peak</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Optimization Tab */}
        <TabsContent value="optimization">
          <ContentOptimizationPanel />
        </TabsContent>

        {/* A/B Testing Tab */}
        <TabsContent value="ab-testing">
          <ABTestingManager />
        </TabsContent>

        {/* Performance Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Automation Performance</h2>
            <p className="text-muted-foreground">
              Track the effectiveness of your automation rules and content templates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Content Generated</p>
                    <p className="text-3xl font-bold">247</p>
                    <p className="text-xs text-green-600">+12% this month</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Time Saved</p>
                    <p className="text-3xl font-bold">42h</p>
                    <p className="text-xs text-green-600">This month</p>
                  </div>
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement Boost</p>
                    <p className="text-3xl font-bold">+28%</p>
                    <p className="text-xs text-green-600">Vs manual posting</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-3xl font-bold">94%</p>
                    <p className="text-xs text-green-600">Rule executions</p>
                  </div>
                  <Settings className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Generation Trends</CardTitle>
                <CardDescription>
                  Monthly content generation by automation rules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Content generation chart would be displayed here</p>
                    <p className="text-sm">Integration with charting library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rule Performance</CardTitle>
                <CardDescription>
                  Success rate and execution frequency by rule type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Rule performance chart would be displayed here</p>
                    <p className="text-sm">Integration with charting library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Automation Activity</CardTitle>
              <CardDescription>
                Latest executions and generated content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    time: '2 hours ago',
                    action: 'Generated LinkedIn post from blog',
                    rule: 'Auto-generate social posts from blog',
                    status: 'success'
                  },
                  {
                    time: '4 hours ago',
                    action: 'Optimized posting time for Twitter thread',
                    rule: 'Optimal timing scheduler',
                    status: 'success'
                  },
                  {
                    time: '6 hours ago',
                    action: 'Generated newsletter content',
                    rule: 'Weekly newsletter automation',
                    status: 'success'
                  },
                  {
                    time: '8 hours ago',
                    action: 'Failed to generate social post',
                    rule: 'Auto-generate social posts from blog',
                    status: 'failed'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.rule}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
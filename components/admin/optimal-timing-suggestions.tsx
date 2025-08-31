'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Clock, 
  TrendingUp, 
  Calendar,
  Lightbulb,
  BarChart3,
  Users,
  Zap
} from "lucide-react"
import { format, addHours, startOfWeek, addDays } from 'date-fns'

interface OptimalTimingSuggestionsProps {
  platform: 'linkedin' | 'twitter' | 'all'
  onSelectTime?: (dateTime: string) => void
  className?: string
}

interface TimeSlot {
  time: string
  day: string
  score: number
  engagement: 'high' | 'medium' | 'low'
  reason: string
  datetime: Date
}

// Mock data based on general social media best practices
const OPTIMAL_TIMES: Record<'linkedin' | 'twitter', TimeSlot[]> = {
  linkedin: [
    {
      time: '8:00 AM',
      day: 'Tuesday',
      score: 95,
      engagement: 'high',
      reason: 'Peak professional hours - users checking updates before work',
      datetime: addHours(addDays(startOfWeek(new Date()), 2), 8)
    },
    {
      time: '12:00 PM',
      day: 'Wednesday',
      score: 92,
      engagement: 'high',
      reason: 'Lunch break browsing - high professional engagement',
      datetime: addHours(addDays(startOfWeek(new Date()), 3), 12)
    },
    {
      time: '5:00 PM',
      day: 'Thursday',
      score: 88,
      engagement: 'high',
      reason: 'End of workday - professionals catching up on industry news',
      datetime: addHours(addDays(startOfWeek(new Date()), 4), 17)
    },
    {
      time: '9:00 AM',
      day: 'Monday',
      score: 85,
      engagement: 'medium',
      reason: 'Start of work week - moderate engagement',
      datetime: addHours(addDays(startOfWeek(new Date()), 1), 9)
    },
    {
      time: '2:00 PM',
      day: 'Friday',
      score: 78,
      engagement: 'medium',
      reason: 'Friday afternoon - lower but consistent engagement',
      datetime: addHours(addDays(startOfWeek(new Date()), 5), 14)
    }
  ],
  twitter: [
    {
      time: '9:00 AM',
      day: 'Monday',
      score: 94,
      engagement: 'high',
      reason: 'Monday morning commute - high mobile engagement',
      datetime: addHours(addDays(startOfWeek(new Date()), 1), 9)
    },
    {
      time: '3:00 PM',
      day: 'Wednesday',
      score: 91,
      engagement: 'high',
      reason: 'Mid-week afternoon slump - users seeking entertainment',
      datetime: addHours(addDays(startOfWeek(new Date()), 3), 15)
    },
    {
      time: '7:00 PM',
      day: 'Tuesday',
      score: 89,
      engagement: 'high',
      reason: 'Evening social media browsing - peak engagement time',
      datetime: addHours(addDays(startOfWeek(new Date()), 2), 19)
    },
    {
      time: '12:00 PM',
      day: 'Thursday',
      score: 86,
      engagement: 'medium',
      reason: 'Lunch break scrolling - good engagement window',
      datetime: addHours(addDays(startOfWeek(new Date()), 4), 12)
    },
    {
      time: '6:00 PM',
      day: 'Friday',
      score: 82,
      engagement: 'medium',
      reason: 'Friday evening - moderate engagement before weekend',
      datetime: addHours(addDays(startOfWeek(new Date()), 5), 18)
    }
  ]
}

export function OptimalTimingSuggestions({ 
  platform, 
  onSelectTime,
  className 
}: OptimalTimingSuggestionsProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<'linkedin' | 'twitter'>(
    platform === 'all' ? 'linkedin' : platform
  )
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  useEffect(() => {
    setTimeSlots(OPTIMAL_TIMES[selectedPlatform])
  }, [selectedPlatform])

  const getEngagementColor = (engagement: 'high' | 'medium' | 'low') => {
    switch (engagement) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  const getEngagementIcon = (engagement: 'high' | 'medium' | 'low') => {
    switch (engagement) {
      case 'high':
        return <TrendingUp className="h-3 w-3" />
      case 'medium':
        return <BarChart3 className="h-3 w-3" />
      case 'low':
        return <Users className="h-3 w-3" />
    }
  }

  const handleSelectTime = (timeSlot: TimeSlot) => {
    // Create a datetime string for the next occurrence of this day/time
    const nextOccurrence = new Date(timeSlot.datetime)
    
    // If the time has already passed this week, move to next week
    if (nextOccurrence < new Date()) {
      nextOccurrence.setDate(nextOccurrence.getDate() + 7)
    }
    
    const datetimeString = format(nextOccurrence, "yyyy-MM-dd'T'HH:mm")
    onSelectTime?.(datetimeString)
  }

  const getBestTimeRecommendation = () => {
    const bestTime = timeSlots[0]
    if (!bestTime) return null

    return (
      <Alert className="border-green-200 bg-green-50">
        <Lightbulb className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Best time to post:</strong> {bestTime.day}s at {bestTime.time}
          <br />
          <span className="text-sm">{bestTime.reason}</span>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Optimal Timing Suggestions
        </CardTitle>
        <CardDescription>
          AI-powered recommendations for the best times to post based on audience engagement patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {platform === 'all' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Platform</label>
            <Select value={selectedPlatform} onValueChange={(value) => setSelectedPlatform(value as 'linkedin' | 'twitter')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter/X</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {getBestTimeRecommendation()}

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Recommended Time Slots</h4>
          {timeSlots.map((slot, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <div className="font-medium">
                    {slot.day}s at {slot.time}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getEngagementColor(slot.engagement)}`}
                  >
                    {getEngagementIcon(slot.engagement)}
                    <span className="ml-1 capitalize">{slot.engagement}</span>
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Zap className="h-3 w-3" />
                    {slot.score}% score
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {slot.reason}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSelectTime(slot)}
                className="ml-4"
              >
                <Calendar className="h-3 w-3 mr-1" />
                Use Time
              </Button>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Note:</strong> These recommendations are based on general industry best practices and audience behavior patterns.</p>
            <p>For more accurate suggestions, connect your analytics to get personalized recommendations based on your specific audience engagement.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
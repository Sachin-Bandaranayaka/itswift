'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Zap, 
  Settings,
  Info,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { format, addDays, addHours, setHours, setMinutes, isAfter, isBefore } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface PostSchedulerProps {
  onSchedule: (scheduledDate: Date, useOptimalTime: boolean) => void
  platforms: string[]
  minDate?: Date
  maxDate?: Date
}

interface OptimalTime {
  platform: string
  time: string
  description: string
  engagement: string
}

const OPTIMAL_TIMES: Record<string, OptimalTime[]> = {
  linkedin: [
    { platform: 'linkedin', time: '09:00', description: 'Morning commute', engagement: 'High' },
    { platform: 'linkedin', time: '12:00', description: 'Lunch break', engagement: 'Medium' },
    { platform: 'linkedin', time: '17:00', description: 'End of workday', engagement: 'High' }
  ],
  twitter: [
    { platform: 'twitter', time: '08:00', description: 'Morning check-in', engagement: 'Medium' },
    { platform: 'twitter', time: '12:00', description: 'Lunch scrolling', engagement: 'High' },
    { platform: 'twitter', time: '19:00', description: 'Evening engagement', engagement: 'High' },
    { platform: 'twitter', time: '21:00', description: 'Prime time', engagement: 'Very High' }
  ]
}

const TIME_ZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' }
]

export function PostScheduler({ 
  onSchedule, 
  platforms = [], 
  minDate = new Date(),
  maxDate = addDays(new Date(), 365)
}: PostSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState('09:00')
  const [selectedTimeZone, setSelectedTimeZone] = useState('UTC')
  const [useOptimalTime, setUseOptimalTime] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [schedulingMode, setSchedulingMode] = useState<'manual' | 'optimal'>('manual')

  // Get optimal times for selected platforms
  const getOptimalTimesForPlatforms = () => {
    const times: OptimalTime[] = []
    platforms.forEach(platform => {
      if (OPTIMAL_TIMES[platform]) {
        times.push(...OPTIMAL_TIMES[platform])
      }
    })
    return times
  }

  // Get the best time across all platforms
  const getBestOptimalTime = () => {
    const times = getOptimalTimesForPlatforms()
    const timeMap = new Map<string, { count: number, engagement: string }>()
    
    times.forEach(time => {
      const existing = timeMap.get(time.time)
      if (existing) {
        existing.count += 1
      } else {
        timeMap.set(time.time, { count: 1, engagement: time.engagement })
      }
    })
    
    let bestTime = '12:00'
    let maxCount = 0
    
    timeMap.forEach((data, time) => {
      if (data.count > maxCount) {
        maxCount = data.count
        bestTime = time
      }
    })
    
    return bestTime
  }

  // Handle optimal time selection
  useEffect(() => {
    if (useOptimalTime && schedulingMode === 'optimal') {
      const bestTime = getBestOptimalTime()
      setSelectedTime(bestTime)
    }
  }, [useOptimalTime, platforms, schedulingMode])

  const handleSchedule = () => {
    if (!selectedDate) {
      toast.error('Please select a date')
      return
    }

    const [hours, minutes] = selectedTime.split(':').map(Number)
    const scheduledDateTime = setMinutes(setHours(selectedDate, hours), minutes)
    
    // Validate the scheduled time is in the future
    if (!isAfter(scheduledDateTime, new Date())) {
      toast.error('Scheduled time must be in the future')
      return
    }

    // Validate the scheduled time is within allowed range
    if (isBefore(scheduledDateTime, minDate) || isAfter(scheduledDateTime, maxDate)) {
      toast.error('Scheduled time is outside the allowed range')
      return
    }

    onSchedule(scheduledDateTime, useOptimalTime)
    toast.success(`Post scheduled for ${format(scheduledDateTime, 'PPP p')}`)
  }

  const getQuickScheduleOptions = () => {
    const now = new Date()
    return [
      { label: 'In 1 hour', date: addHours(now, 1) },
      { label: 'In 4 hours', date: addHours(now, 4) },
      { label: 'Tomorrow 9 AM', date: setHours(setMinutes(addDays(now, 1), 0), 9) },
      { label: 'Tomorrow 12 PM', date: setHours(setMinutes(addDays(now, 1), 0), 12) },
      { label: 'Next Monday 9 AM', date: setHours(setMinutes(addDays(now, (8 - now.getDay()) % 7), 0), 9) }
    ]
  }

  const handleQuickSchedule = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime(format(date, 'HH:mm'))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Schedule Post
        </CardTitle>
        <CardDescription>
          Choose when to publish your post for maximum engagement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scheduling Mode */}
        <div className="space-y-4">
          <Label>Scheduling Mode</Label>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={schedulingMode === 'manual' ? 'default' : 'outline'}
              onClick={() => setSchedulingMode('manual')}
              className="h-auto p-4 flex flex-col items-start"
            >
              <div className="flex items-center gap-2 mb-2">
                <Settings className="h-4 w-4" />
                <span className="font-medium">Manual</span>
              </div>
              <span className="text-sm text-left opacity-80">
                Choose your own date and time
              </span>
            </Button>
            
            <Button
              variant={schedulingMode === 'optimal' ? 'default' : 'outline'}
              onClick={() => setSchedulingMode('optimal')}
              className="h-auto p-4 flex flex-col items-start"
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4" />
                <span className="font-medium">Optimal</span>
              </div>
              <span className="text-sm text-left opacity-80">
                AI-suggested best times
              </span>
            </Button>
          </div>
        </div>

        {schedulingMode === 'optimal' && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Optimal times are based on platform engagement data and your selected platforms: {platforms.join(', ')}
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Schedule Options */}
        {schedulingMode === 'manual' && (
          <div className="space-y-3">
            <Label>Quick Schedule</Label>
            <div className="grid grid-cols-2 gap-2">
              {getQuickScheduleOptions().map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSchedule(option.date)}
                  className="justify-start"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Date Selection */}
        <div className="space-y-3">
          <Label>Date</Label>
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date)
                  setShowCalendar(false)
                }}
                disabled={(date) => 
                  isBefore(date, minDate) || isAfter(date, maxDate)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Time</Label>
            <Input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              disabled={schedulingMode === 'optimal' && useOptimalTime}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Time Zone</Label>
            <Select value={selectedTimeZone} onValueChange={setSelectedTimeZone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_ZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Optimal Time Toggle */}
        {schedulingMode === 'optimal' && (
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label>Use Optimal Time</Label>
              <p className="text-sm text-muted-foreground">
                Automatically select the best time for engagement
              </p>
            </div>
            <Switch
              checked={useOptimalTime}
              onCheckedChange={setUseOptimalTime}
            />
          </div>
        )}

        {/* Optimal Times Display */}
        {schedulingMode === 'optimal' && platforms.length > 0 && (
          <div className="space-y-3">
            <Label>Recommended Times</Label>
            <div className="space-y-2">
              {getOptimalTimesForPlatforms().map((time, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {time.platform}
                      </Badge>
                      <span className="font-medium">{time.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{time.description}</p>
                  </div>
                  <Badge 
                    variant={time.engagement === 'Very High' ? 'default' : 'secondary'}
                    className={cn(
                      time.engagement === 'Very High' && 'bg-green-600',
                      time.engagement === 'High' && 'bg-blue-600',
                    )}
                  >
                    {time.engagement}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedule Summary */}
        {selectedDate && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Post will be published on {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime} ({selectedTimeZone})
            </AlertDescription>
          </Alert>
        )}

        {/* Schedule Button */}
        <Button 
          onClick={handleSchedule} 
          className="w-full"
          disabled={!selectedDate}
        >
          <Clock className="h-4 w-4 mr-2" />
          Schedule Post
        </Button>
      </CardContent>
    </Card>
  )
}
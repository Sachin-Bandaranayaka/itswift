'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CalendarIcon, X } from 'lucide-react'
import { format, subDays, subWeeks, subMonths, startOfDay, endOfDay } from 'date-fns'

interface AnalyticsDateFilterProps {
  dateRange: {
    from: string | null
    to: string | null
  }
  onDateRangeChange: (range: { from: string | null; to: string | null }) => void
}

export function AnalyticsDateFilter({ dateRange, onDateRangeChange }: AnalyticsDateFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customRange, setCustomRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: dateRange.from ? new Date(dateRange.from) : undefined,
    to: dateRange.to ? new Date(dateRange.to) : undefined
  })

  const presetRanges = [
    {
      label: 'Last 7 days',
      value: 'last7days',
      getRange: () => ({
        from: startOfDay(subDays(new Date(), 7)).toISOString(),
        to: endOfDay(new Date()).toISOString()
      })
    },
    {
      label: 'Last 30 days',
      value: 'last30days',
      getRange: () => ({
        from: startOfDay(subDays(new Date(), 30)).toISOString(),
        to: endOfDay(new Date()).toISOString()
      })
    },
    {
      label: 'Last 3 months',
      value: 'last3months',
      getRange: () => ({
        from: startOfDay(subMonths(new Date(), 3)).toISOString(),
        to: endOfDay(new Date()).toISOString()
      })
    },
    {
      label: 'Last 6 months',
      value: 'last6months',
      getRange: () => ({
        from: startOfDay(subMonths(new Date(), 6)).toISOString(),
        to: endOfDay(new Date()).toISOString()
      })
    },
    {
      label: 'This year',
      value: 'thisyear',
      getRange: () => ({
        from: startOfDay(new Date(new Date().getFullYear(), 0, 1)).toISOString(),
        to: endOfDay(new Date()).toISOString()
      })
    }
  ]

  const handlePresetChange = (value: string) => {
    if (value === 'all') {
      onDateRangeChange({ from: null, to: null })
      return
    }

    if (value === 'custom') {
      setIsOpen(true)
      return
    }

    const preset = presetRanges.find(p => p.value === value)
    if (preset) {
      const range = preset.getRange()
      onDateRangeChange(range)
    }
  }

  const handleCustomRangeApply = () => {
    if (customRange.from && customRange.to) {
      onDateRangeChange({
        from: startOfDay(customRange.from).toISOString(),
        to: endOfDay(customRange.to).toISOString()
      })
    } else if (customRange.from) {
      onDateRangeChange({
        from: startOfDay(customRange.from).toISOString(),
        to: endOfDay(customRange.from).toISOString()
      })
    }
    setIsOpen(false)
  }

  const clearDateRange = () => {
    onDateRangeChange({ from: null, to: null })
    setCustomRange({ from: undefined, to: undefined })
  }

  const getCurrentPreset = () => {
    if (!dateRange.from || !dateRange.to) return 'all'
    
    for (const preset of presetRanges) {
      const range = preset.getRange()
      if (range.from === dateRange.from && range.to === dateRange.to) {
        return preset.value
      }
    }
    
    return 'custom'
  }

  const formatDateRange = () => {
    if (!dateRange.from || !dateRange.to) return 'All time'
    
    const from = format(new Date(dateRange.from), 'MMM d, yyyy')
    const to = format(new Date(dateRange.to), 'MMM d, yyyy')
    
    if (from === to) return from
    return `${from} - ${to}`
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={getCurrentPreset()} onValueChange={handlePresetChange}>
        <SelectTrigger className="w-40">
          <CalendarIcon className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All time</SelectItem>
          {presetRanges.map(preset => (
            <SelectItem key={preset.value} value={preset.value}>
              {preset.label}
            </SelectItem>
          ))}
          <SelectItem value="custom">Custom range</SelectItem>
        </SelectContent>
      </Select>

      {(dateRange.from || dateRange.to) && (
        <div className="flex items-center gap-1">
          <span className="text-sm text-muted-foreground">
            {formatDateRange()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDateRange}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Select custom date range</h4>
              <Calendar
                mode="range"
                selected={{
                  from: customRange.from,
                  to: customRange.to
                }}
                onSelect={(range) => {
                  setCustomRange({
                    from: range?.from,
                    to: range?.to
                  })
                }}
                numberOfMonths={2}
                disabled={(date) => date > new Date()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCustomRangeApply}
                disabled={!customRange.from}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
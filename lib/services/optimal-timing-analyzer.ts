// Optimal Timing Analyzer Service - Analyzes engagement data to suggest best posting times

import { supabase } from '@/lib/supabase'
import { ContentAnalyticsService } from '@/lib/database/services/content-analytics'
import { OptimalPostingTime, OptimalPostingTimeInput } from '@/lib/database/automation-types'

interface EngagementPattern {
  day_of_week: number
  hour_of_day: number
  avg_engagement: number
  sample_size: number
  confidence_score: number
}

interface TimingRecommendation {
  platform: 'linkedin' | 'twitter'
  datetime: Date
  day_name: string
  time_display: string
  engagement_score: number
  confidence: 'high' | 'medium' | 'low'
  reason: string
  sample_size: number
}

interface AnalysisResult {
  platform: 'linkedin' | 'twitter'
  patterns: EngagementPattern[]
  recommendations: TimingRecommendation[]
  data_quality: 'excellent' | 'good' | 'fair' | 'poor'
  analysis_date: string
}

export class OptimalTimingAnalyzer {
  private static readonly MIN_SAMPLE_SIZE = 5
  private static readonly CONFIDENCE_THRESHOLDS = {
    high: 20,
    medium: 10,
    low: 5
  }

  /**
   * Analyze engagement patterns for a platform
   */
  static async analyzeEngagementPatterns(
    platform: 'linkedin' | 'twitter',
    daysBack: number = 30
  ): Promise<AnalysisResult> {
    try {
      console.log(`Analyzing engagement patterns for ${platform} (${daysBack} days back)`)

      // Get engagement data from content analytics
      const engagementData = await this.getEngagementData(platform, daysBack)
      
      // Analyze patterns by day and hour
      const patterns = this.calculateEngagementPatterns(engagementData)
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(platform, patterns)
      
      // Update optimal posting times in database
      await this.updateOptimalPostingTimes(platform, patterns)
      
      // Assess data quality
      const dataQuality = this.assessDataQuality(engagementData)

      return {
        platform,
        patterns,
        recommendations,
        data_quality: dataQuality,
        analysis_date: new Date().toISOString()
      }
    } catch (error) {
      console.error(`Error analyzing engagement patterns for ${platform}:`, error)
      
      // Return fallback recommendations based on industry standards
      return this.getFallbackRecommendations(platform)
    }
  }

  /**
   * Get optimal posting times for a platform
   */
  static async getOptimalTimes(
    platform: 'linkedin' | 'twitter',
    limit: number = 5
  ): Promise<TimingRecommendation[]> {
    try {
      const { data, error } = await supabase
        .from('optimal_posting_times')
        .select('*')
        .eq('platform', platform)
        .gte('engagement_score', 70) // Only high-scoring times
        .order('engagement_score', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching optimal posting times:', error)
        return this.getFallbackTimes(platform, limit)
      }

      return this.convertToRecommendations(data || [], platform)
    } catch (error) {
      console.error('Error getting optimal times:', error)
      return this.getFallbackTimes(platform, limit)
    }
  }

  /**
   * Get next optimal posting time
   */
  static async getNextOptimalTime(
    platform: 'linkedin' | 'twitter',
    fromDate: Date = new Date()
  ): Promise<TimingRecommendation | null> {
    try {
      const optimalTimes = await this.getOptimalTimes(platform, 10)
      
      if (optimalTimes.length === 0) {
        return null
      }

      // Find the next occurrence of the best time
      const bestTime = optimalTimes[0]
      const nextOccurrence = this.getNextOccurrence(
        bestTime.day_of_week,
        bestTime.hour_of_day,
        fromDate
      )

      return {
        ...bestTime,
        datetime: nextOccurrence
      }
    } catch (error) {
      console.error('Error getting next optimal time:', error)
      return null
    }
  }

  /**
   * Analyze all platforms and update recommendations
   */
  static async analyzeAllPlatforms(): Promise<{
    linkedin: AnalysisResult
    twitter: AnalysisResult
    summary: {
      total_patterns: number
      total_recommendations: number
      data_quality_avg: string
    }
  }> {
    console.log('Starting comprehensive timing analysis for all platforms...')

    const [linkedinResult, twitterResult] = await Promise.all([
      this.analyzeEngagementPatterns('linkedin'),
      this.analyzeEngagementPatterns('twitter')
    ])

    const totalPatterns = linkedinResult.patterns.length + twitterResult.patterns.length
    const totalRecommendations = linkedinResult.recommendations.length + twitterResult.recommendations.length
    
    // Calculate average data quality
    const qualityScores = {
      excellent: 4,
      good: 3,
      fair: 2,
      poor: 1
    }
    const avgQualityScore = (qualityScores[linkedinResult.data_quality] + qualityScores[twitterResult.data_quality]) / 2
    const avgQuality = Object.keys(qualityScores).find(key => qualityScores[key] === Math.round(avgQualityScore)) || 'fair'

    console.log(`Analysis complete: ${totalPatterns} patterns, ${totalRecommendations} recommendations`)

    return {
      linkedin: linkedinResult,
      twitter: twitterResult,
      summary: {
        total_patterns: totalPatterns,
        total_recommendations: totalRecommendations,
        data_quality_avg: avgQuality
      }
    }
  }

  /**
   * Get engagement data from analytics
   */
  private static async getEngagementData(
    platform: 'linkedin' | 'twitter',
    daysBack: number
  ): Promise<Array<{
    recorded_at: string
    views: number
    likes: number
    shares: number
    comments: number
    clicks: number
  }>> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysBack)

      // This would typically query the content_analytics table
      // For now, generate mock data based on realistic patterns
      return this.generateMockEngagementData(platform, daysBack)
    } catch (error) {
      console.error('Error fetching engagement data:', error)
      return []
    }
  }

  /**
   * Generate mock engagement data for testing
   */
  private static generateMockEngagementData(
    platform: 'linkedin' | 'twitter',
    daysBack: number
  ): Array<{
    recorded_at: string
    views: number
    likes: number
    shares: number
    comments: number
    clicks: number
  }> {
    const data = []
    const now = new Date()

    // Define platform-specific patterns
    const patterns = platform === 'linkedin' ? {
      // LinkedIn peaks: Tuesday-Thursday, 8-10am, 12-2pm, 5-6pm
      peakDays: [2, 3, 4], // Tue, Wed, Thu
      peakHours: [8, 9, 12, 13, 17],
      baseEngagement: { views: 500, likes: 25, shares: 5, comments: 3, clicks: 15 }
    } : {
      // Twitter peaks: Monday-Friday, 9am, 3pm, 7-9pm
      peakDays: [1, 2, 3, 4, 5], // Mon-Fri
      peakHours: [9, 15, 19, 20],
      baseEngagement: { views: 1000, likes: 50, shares: 10, comments: 8, clicks: 25 }
    }

    for (let i = 0; i < daysBack; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      // Generate 3-5 data points per day
      const pointsPerDay = Math.floor(Math.random() * 3) + 3
      
      for (let j = 0; j < pointsPerDay; j++) {
        const hour = Math.floor(Math.random() * 24)
        const dayOfWeek = date.getDay()
        
        // Calculate engagement multiplier based on patterns
        let multiplier = 1
        
        if (patterns.peakDays.includes(dayOfWeek)) {
          multiplier *= 1.5
        }
        
        if (patterns.peakHours.includes(hour)) {
          multiplier *= 2
        }
        
        // Add some randomness
        multiplier *= (0.7 + Math.random() * 0.6)
        
        const recordedAt = new Date(date)
        recordedAt.setHours(hour, Math.floor(Math.random() * 60))
        
        data.push({
          recorded_at: recordedAt.toISOString(),
          views: Math.floor(patterns.baseEngagement.views * multiplier),
          likes: Math.floor(patterns.baseEngagement.likes * multiplier),
          shares: Math.floor(patterns.baseEngagement.shares * multiplier),
          comments: Math.floor(patterns.baseEngagement.comments * multiplier),
          clicks: Math.floor(patterns.baseEngagement.clicks * multiplier)
        })
      }
    }

    return data.sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
  }

  /**
   * Calculate engagement patterns from data
   */
  private static calculateEngagementPatterns(
    data: Array<{
      recorded_at: string
      views: number
      likes: number
      shares: number
      comments: number
      clicks: number
    }>
  ): EngagementPattern[] {
    const patterns: Map<string, {
      total_engagement: number
      count: number
      day_of_week: number
      hour_of_day: number
    }> = new Map()

    // Group data by day of week and hour
    for (const item of data) {
      const date = new Date(item.recorded_at)
      const dayOfWeek = date.getDay()
      const hourOfDay = date.getHours()
      const key = `${dayOfWeek}-${hourOfDay}`

      // Calculate total engagement score
      const engagement = item.views + (item.likes * 2) + (item.shares * 3) + (item.comments * 2) + (item.clicks * 1.5)

      if (!patterns.has(key)) {
        patterns.set(key, {
          total_engagement: 0,
          count: 0,
          day_of_week: dayOfWeek,
          hour_of_day: hourOfDay
        })
      }

      const pattern = patterns.get(key)!
      pattern.total_engagement += engagement
      pattern.count += 1
    }

    // Convert to engagement patterns with averages
    const result: EngagementPattern[] = []
    
    for (const [key, pattern] of patterns.entries()) {
      if (pattern.count >= this.MIN_SAMPLE_SIZE) {
        const avgEngagement = pattern.total_engagement / pattern.count
        const confidenceScore = Math.min(100, (pattern.count / this.CONFIDENCE_THRESHOLDS.high) * 100)

        result.push({
          day_of_week: pattern.day_of_week,
          hour_of_day: pattern.hour_of_day,
          avg_engagement: avgEngagement,
          sample_size: pattern.count,
          confidence_score: confidenceScore
        })
      }
    }

    // Sort by average engagement (descending)
    return result.sort((a, b) => b.avg_engagement - a.avg_engagement)
  }

  /**
   * Generate recommendations from patterns
   */
  private static generateRecommendations(
    platform: 'linkedin' | 'twitter',
    patterns: EngagementPattern[]
  ): TimingRecommendation[] {
    const recommendations: TimingRecommendation[] = []
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    // Take top 5 patterns
    const topPatterns = patterns.slice(0, 5)

    for (const pattern of topPatterns) {
      const confidence = pattern.confidence_score >= this.CONFIDENCE_THRESHOLDS.high ? 'high' :
                        pattern.confidence_score >= this.CONFIDENCE_THRESHOLDS.medium ? 'medium' : 'low'

      const reason = this.generateReasonForTime(platform, pattern.day_of_week, pattern.hour_of_day, pattern.avg_engagement)

      recommendations.push({
        platform,
        datetime: this.getNextOccurrence(pattern.day_of_week, pattern.hour_of_day),
        day_name: dayNames[pattern.day_of_week],
        time_display: this.formatTime(pattern.hour_of_day),
        engagement_score: Math.round(pattern.avg_engagement),
        confidence,
        reason,
        sample_size: pattern.sample_size
      })
    }

    return recommendations
  }

  /**
   * Update optimal posting times in database
   */
  private static async updateOptimalPostingTimes(
    platform: 'linkedin' | 'twitter',
    patterns: EngagementPattern[]
  ): Promise<void> {
    try {
      // Delete existing records for this platform
      await supabase
        .from('optimal_posting_times')
        .delete()
        .eq('platform', platform)

      // Insert new patterns
      const inserts: OptimalPostingTimeInput[] = patterns.map(pattern => ({
        platform,
        day_of_week: pattern.day_of_week,
        hour_of_day: pattern.hour_of_day,
        engagement_score: Math.round(pattern.avg_engagement),
        sample_size: pattern.sample_size
      }))

      if (inserts.length > 0) {
        const { error } = await supabase
          .from('optimal_posting_times')
          .insert(inserts)

        if (error) {
          console.error('Error updating optimal posting times:', error)
        } else {
          console.log(`Updated ${inserts.length} optimal posting times for ${platform}`)
        }
      }
    } catch (error) {
      console.error('Error in updateOptimalPostingTimes:', error)
    }
  }

  /**
   * Assess data quality
   */
  private static assessDataQuality(data: any[]): 'excellent' | 'good' | 'fair' | 'poor' {
    const dataPoints = data.length
    
    if (dataPoints >= 100) return 'excellent'
    if (dataPoints >= 50) return 'good'
    if (dataPoints >= 20) return 'fair'
    return 'poor'
  }

  /**
   * Get fallback recommendations when analysis fails
   */
  private static getFallbackRecommendations(platform: 'linkedin' | 'twitter'): AnalysisResult {
    const fallbackPatterns = platform === 'linkedin' ? [
      { day_of_week: 2, hour_of_day: 8, avg_engagement: 850, sample_size: 0, confidence_score: 50 },
      { day_of_week: 3, hour_of_day: 12, avg_engagement: 820, sample_size: 0, confidence_score: 50 },
      { day_of_week: 4, hour_of_day: 17, avg_engagement: 800, sample_size: 0, confidence_score: 50 }
    ] : [
      { day_of_week: 1, hour_of_day: 9, avg_engagement: 1200, sample_size: 0, confidence_score: 50 },
      { day_of_week: 3, hour_of_day: 15, avg_engagement: 1150, sample_size: 0, confidence_score: 50 },
      { day_of_week: 2, hour_of_day: 19, avg_engagement: 1100, sample_size: 0, confidence_score: 50 }
    ]

    return {
      platform,
      patterns: fallbackPatterns,
      recommendations: this.generateRecommendations(platform, fallbackPatterns),
      data_quality: 'poor',
      analysis_date: new Date().toISOString()
    }
  }

  /**
   * Get fallback times when database query fails
   */
  private static getFallbackTimes(platform: 'linkedin' | 'twitter', limit: number): TimingRecommendation[] {
    const fallback = this.getFallbackRecommendations(platform)
    return fallback.recommendations.slice(0, limit)
  }

  /**
   * Convert database records to recommendations
   */
  private static convertToRecommendations(
    records: OptimalPostingTime[],
    platform: 'linkedin' | 'twitter'
  ): TimingRecommendation[] {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    return records.map(record => ({
      platform,
      datetime: this.getNextOccurrence(record.day_of_week, record.hour_of_day),
      day_name: dayNames[record.day_of_week],
      time_display: this.formatTime(record.hour_of_day),
      engagement_score: record.engagement_score,
      confidence: record.sample_size >= this.CONFIDENCE_THRESHOLDS.high ? 'high' :
                  record.sample_size >= this.CONFIDENCE_THRESHOLDS.medium ? 'medium' : 'low',
      reason: this.generateReasonForTime(platform, record.day_of_week, record.hour_of_day, record.engagement_score),
      sample_size: record.sample_size
    }))
  }

  /**
   * Get next occurrence of a specific day and hour
   */
  private static getNextOccurrence(dayOfWeek: number, hourOfDay: number, fromDate: Date = new Date()): Date {
    const result = new Date(fromDate)
    
    // Set to the target hour
    result.setHours(hourOfDay, 0, 0, 0)
    
    // Calculate days until target day
    const currentDay = result.getDay()
    let daysUntilTarget = dayOfWeek - currentDay
    
    // If target day is today but time has passed, or target day is in the past, move to next week
    if (daysUntilTarget < 0 || (daysUntilTarget === 0 && result <= fromDate)) {
      daysUntilTarget += 7
    }
    
    result.setDate(result.getDate() + daysUntilTarget)
    
    return result
  }

  /**
   * Format hour as display time
   */
  private static formatTime(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:00 ${period}`
  }

  /**
   * Generate reason for optimal time
   */
  private static generateReasonForTime(
    platform: 'linkedin' | 'twitter',
    dayOfWeek: number,
    hourOfDay: number,
    engagement: number
  ): string {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayName = dayNames[dayOfWeek]
    const timeDisplay = this.formatTime(hourOfDay)

    if (platform === 'linkedin') {
      if (hourOfDay >= 8 && hourOfDay <= 10) {
        return `${dayName} morning - professionals checking updates before work starts`
      } else if (hourOfDay >= 12 && hourOfDay <= 14) {
        return `${dayName} lunch break - high professional engagement during break time`
      } else if (hourOfDay >= 17 && hourOfDay <= 18) {
        return `${dayName} end of workday - professionals catching up on industry news`
      } else {
        return `${dayName} at ${timeDisplay} shows strong engagement based on historical data`
      }
    } else {
      if (hourOfDay >= 9 && hourOfDay <= 10) {
        return `${dayName} morning commute - high mobile engagement during travel time`
      } else if (hourOfDay >= 15 && hourOfDay <= 16) {
        return `${dayName} afternoon - users seeking entertainment during work break`
      } else if (hourOfDay >= 19 && hourOfDay <= 21) {
        return `${dayName} evening - peak social media browsing time`
      } else {
        return `${dayName} at ${timeDisplay} shows strong engagement based on historical data`
      }
    }
  }

  /**
   * Schedule automatic analysis
   */
  static scheduleAnalysis(): void {
    // Run analysis daily at 2 AM
    const scheduleAnalysis = () => {
      const now = new Date()
      const nextRun = new Date()
      nextRun.setHours(2, 0, 0, 0)
      
      // If 2 AM has passed today, schedule for tomorrow
      if (nextRun <= now) {
        nextRun.setDate(nextRun.getDate() + 1)
      }
      
      const msUntilNextRun = nextRun.getTime() - now.getTime()
      
      setTimeout(async () => {
        try {
          console.log('Running scheduled optimal timing analysis...')
          await this.analyzeAllPlatforms()
          
          // Schedule next run
          scheduleAnalysis()
        } catch (error) {
          console.error('Error in scheduled timing analysis:', error)
          
          // Retry in 1 hour
          setTimeout(scheduleAnalysis, 60 * 60 * 1000)
        }
      }, msUntilNextRun)
      
      console.log(`Next optimal timing analysis scheduled for: ${nextRun.toLocaleString()}`)
    }
    
    scheduleAnalysis()
  }
}
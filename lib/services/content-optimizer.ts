// Content Optimization Service - SEO, readability, brand voice, and A/B testing

import { OpenAIService } from '@/lib/integrations/openai'

export interface SEOAnalysis {
  score: number // 0-100
  title_analysis: {
    length: number
    optimal_length: { min: number; max: number }
    has_keywords: boolean
    readability: 'good' | 'fair' | 'poor'
    suggestions: string[]
  }
  meta_description: {
    length: number
    optimal_length: { min: number; max: number }
    has_keywords: boolean
    suggestions: string[]
  }
  content_analysis: {
    word_count: number
    keyword_density: number
    optimal_density: { min: number; max: number }
    headings_structure: 'good' | 'fair' | 'poor'
    internal_links: number
    external_links: number
    suggestions: string[]
  }
  keywords: {
    primary: string[]
    secondary: string[]
    missing_opportunities: string[]
  }
  overall_suggestions: string[]
}

export interface ReadabilityAnalysis {
  score: number // 0-100 (Flesch Reading Ease)
  grade_level: string
  reading_time: string
  sentence_analysis: {
    avg_sentence_length: number
    long_sentences: number
    optimal_range: { min: number; max: number }
  }
  word_analysis: {
    avg_word_length: number
    complex_words: number
    passive_voice_percentage: number
  }
  structure_analysis: {
    paragraphs: number
    avg_paragraph_length: number
    headings: number
    bullet_points: number
    lists: number
  }
  suggestions: string[]
}

export interface BrandVoiceAnalysis {
  consistency_score: number // 0-100
  tone_analysis: {
    detected_tone: string[]
    target_tone: string[]
    alignment_score: number
  }
  style_analysis: {
    formality_level: 'very_formal' | 'formal' | 'neutral' | 'informal' | 'very_informal'
    target_formality: 'very_formal' | 'formal' | 'neutral' | 'informal' | 'very_informal'
    voice_characteristics: string[]
  }
  vocabulary_analysis: {
    brand_terms_used: string[]
    brand_terms_missing: string[]
    jargon_level: 'high' | 'medium' | 'low'
  }
  messaging_alignment: {
    key_messages_present: string[]
    key_messages_missing: string[]
    value_proposition_clarity: number
  }
  suggestions: string[]
}

export interface ABTestVariant {
  id: string
  name: string
  content: string
  type: 'title' | 'description' | 'cta' | 'full_content'
  created_at: string
}

export interface ABTestResult {
  variant_id: string
  impressions: number
  clicks: number
  conversions: number
  ctr: number // Click-through rate
  conversion_rate: number
  engagement_score: number
  statistical_significance: number // 0-100
}

export interface ABTest {
  id: string
  name: string
  description: string
  content_type: 'blog' | 'social' | 'newsletter'
  platform?: string
  status: 'draft' | 'running' | 'completed' | 'paused'
  variants: ABTestVariant[]
  results: ABTestResult[]
  winner?: string
  confidence_level: number
  start_date?: string
  end_date?: string
  created_at: string
}

export class ContentOptimizer {
  private static readonly BRAND_VOICE_CONFIG = {
    target_tone: ['professional', 'helpful', 'approachable'],
    target_formality: 'neutral' as const,
    brand_terms: [
      'Swift Solution',
      'e-learning',
      'content automation',
      'digital transformation',
      'learning solutions',
      'training programs'
    ],
    key_messages: [
      'Innovative learning solutions',
      'Streamlined content creation',
      'Data-driven insights',
      'Scalable training programs'
    ]
  }

  /**
   * Analyze content for SEO optimization
   */
  static async analyzeSEO(
    content: string,
    title?: string,
    metaDescription?: string,
    targetKeywords: string[] = []
  ): Promise<SEOAnalysis> {
    try {
      console.log('Analyzing content for SEO optimization...')

      // Analyze title
      const titleAnalysis = this.analyzeTitleSEO(title || '', targetKeywords)
      
      // Analyze meta description
      const metaAnalysis = this.analyzeMetaDescriptionSEO(metaDescription || '', targetKeywords)
      
      // Analyze content
      const contentAnalysis = this.analyzeContentSEO(content, targetKeywords)
      
      // Extract keywords using AI
      const keywords = await this.extractKeywords(content, targetKeywords)
      
      // Calculate overall score
      const score = this.calculateSEOScore(titleAnalysis, metaAnalysis, contentAnalysis)
      
      // Generate overall suggestions
      const overallSuggestions = this.generateSEOSuggestions(
        titleAnalysis,
        metaAnalysis,
        contentAnalysis,
        keywords
      )

      return {
        score,
        title_analysis: titleAnalysis,
        meta_description: metaAnalysis,
        content_analysis: contentAnalysis,
        keywords,
        overall_suggestions: overallSuggestions
      }
    } catch (error) {
      console.error('Error analyzing SEO:', error)
      throw new Error('Failed to analyze SEO')
    }
  }

  /**
   * Analyze content readability
   */
  static analyzeReadability(content: string): ReadabilityAnalysis {
    try {
      console.log('Analyzing content readability...')

      // Clean content for analysis
      const cleanContent = this.cleanContentForAnalysis(content)
      
      // Count basic metrics
      const sentences = this.countSentences(cleanContent)
      const words = this.countWords(cleanContent)
      const syllables = this.countSyllables(cleanContent)
      const paragraphs = this.countParagraphs(content)
      
      // Calculate Flesch Reading Ease score
      const fleschScore = this.calculateFleschScore(sentences.length, words.length, syllables)
      
      // Analyze sentence structure
      const sentenceAnalysis = this.analyzeSentenceStructure(sentences)
      
      // Analyze word complexity
      const wordAnalysis = this.analyzeWordComplexity(words)
      
      // Analyze document structure
      const structureAnalysis = this.analyzeDocumentStructure(content)
      
      // Calculate reading time
      const readingTime = this.calculateReadingTime(words.length)
      
      // Generate suggestions
      const suggestions = this.generateReadabilitySuggestions(
        fleschScore,
        sentenceAnalysis,
        wordAnalysis,
        structureAnalysis
      )

      return {
        score: Math.round(fleschScore),
        grade_level: this.getGradeLevel(fleschScore),
        reading_time: readingTime,
        sentence_analysis: sentenceAnalysis,
        word_analysis: wordAnalysis,
        structure_analysis: structureAnalysis,
        suggestions
      }
    } catch (error) {
      console.error('Error analyzing readability:', error)
      throw new Error('Failed to analyze readability')
    }
  }

  /**
   * Analyze brand voice consistency
   */
  static async analyzeBrandVoice(content: string): Promise<BrandVoiceAnalysis> {
    try {
      console.log('Analyzing brand voice consistency...')

      // Use AI to analyze tone and style
      const aiAnalysis = await this.analyzeContentWithAI(content)
      
      // Analyze vocabulary usage
      const vocabularyAnalysis = this.analyzeBrandVocabulary(content)
      
      // Check messaging alignment
      const messagingAlignment = this.analyzeMessagingAlignment(content)
      
      // Calculate consistency score
      const consistencyScore = this.calculateBrandVoiceScore(
        aiAnalysis,
        vocabularyAnalysis,
        messagingAlignment
      )
      
      // Generate suggestions
      const suggestions = this.generateBrandVoiceSuggestions(
        aiAnalysis,
        vocabularyAnalysis,
        messagingAlignment
      )

      return {
        consistency_score: consistencyScore,
        tone_analysis: {
          detected_tone: aiAnalysis.detected_tone,
          target_tone: this.BRAND_VOICE_CONFIG.target_tone,
          alignment_score: aiAnalysis.tone_alignment_score
        },
        style_analysis: {
          formality_level: aiAnalysis.formality_level,
          target_formality: this.BRAND_VOICE_CONFIG.target_formality,
          voice_characteristics: aiAnalysis.voice_characteristics
        },
        vocabulary_analysis: vocabularyAnalysis,
        messaging_alignment: messagingAlignment,
        suggestions
      }
    } catch (error) {
      console.error('Error analyzing brand voice:', error)
      throw new Error('Failed to analyze brand voice')
    }
  }

  /**
   * Create A/B test variants
   */
  static async createABTestVariants(
    originalContent: string,
    testType: 'title' | 'description' | 'cta' | 'full_content',
    variantCount: number = 2
  ): Promise<ABTestVariant[]> {
    try {
      console.log(`Creating ${variantCount} A/B test variants for ${testType}...`)

      const variants: ABTestVariant[] = []
      
      // Add original as control variant
      variants.push({
        id: 'control',
        name: 'Control (Original)',
        content: originalContent,
        type: testType,
        created_at: new Date().toISOString()
      })

      // Generate AI-powered variants
      for (let i = 1; i <= variantCount; i++) {
        const variantContent = await this.generateContentVariant(
          originalContent,
          testType,
          i
        )
        
        variants.push({
          id: `variant_${i}`,
          name: `Variant ${i}`,
          content: variantContent,
          type: testType,
          created_at: new Date().toISOString()
        })
      }

      return variants
    } catch (error) {
      console.error('Error creating A/B test variants:', error)
      throw new Error('Failed to create A/B test variants')
    }
  }

  /**
   * Analyze A/B test results
   */
  static analyzeABTestResults(test: ABTest): {
    winner: string | null
    confidence: number
    insights: string[]
    recommendations: string[]
  } {
    try {
      console.log('Analyzing A/B test results...')

      if (test.results.length < 2) {
        return {
          winner: null,
          confidence: 0,
          insights: ['Insufficient data for analysis'],
          recommendations: ['Continue running the test to gather more data']
        }
      }

      // Find best performing variant
      const sortedResults = [...test.results].sort((a, b) => 
        b.engagement_score - a.engagement_score
      )
      
      const winner = sortedResults[0]
      const runnerUp = sortedResults[1]
      
      // Calculate statistical significance
      const confidence = this.calculateStatisticalSignificance(winner, runnerUp)
      
      // Generate insights
      const insights = this.generateABTestInsights(test.results, winner, runnerUp)
      
      // Generate recommendations
      const recommendations = this.generateABTestRecommendations(
        test,
        winner,
        confidence
      )

      return {
        winner: confidence >= 95 ? winner.variant_id : null,
        confidence,
        insights,
        recommendations
      }
    } catch (error) {
      console.error('Error analyzing A/B test results:', error)
      throw new Error('Failed to analyze A/B test results')
    }
  }

  // Private helper methods

  private static analyzeTitleSEO(title: string, keywords: string[]) {
    const length = title.length
    const optimalLength = { min: 30, max: 60 }
    const hasKeywords = keywords.some(keyword => 
      title.toLowerCase().includes(keyword.toLowerCase())
    )
    
    const suggestions: string[] = []
    
    if (length < optimalLength.min) {
      suggestions.push('Title is too short. Consider adding more descriptive words.')
    } else if (length > optimalLength.max) {
      suggestions.push('Title is too long. Consider shortening for better display in search results.')
    }
    
    if (!hasKeywords && keywords.length > 0) {
      suggestions.push(`Include target keywords: ${keywords.join(', ')}`)
    }

    return {
      length,
      optimal_length: optimalLength,
      has_keywords: hasKeywords,
      readability: length <= optimalLength.max && hasKeywords ? 'good' as const : 'fair' as const,
      suggestions
    }
  }

  private static analyzeMetaDescriptionSEO(description: string, keywords: string[]) {
    const length = description.length
    const optimalLength = { min: 120, max: 160 }
    const hasKeywords = keywords.some(keyword => 
      description.toLowerCase().includes(keyword.toLowerCase())
    )
    
    const suggestions: string[] = []
    
    if (length === 0) {
      suggestions.push('Add a meta description to improve search result appearance.')
    } else if (length < optimalLength.min) {
      suggestions.push('Meta description is too short. Add more compelling details.')
    } else if (length > optimalLength.max) {
      suggestions.push('Meta description is too long. It may be truncated in search results.')
    }
    
    if (!hasKeywords && keywords.length > 0) {
      suggestions.push(`Include target keywords in meta description: ${keywords.join(', ')}`)
    }

    return {
      length,
      optimal_length: optimalLength,
      has_keywords: hasKeywords,
      suggestions
    }
  }

  private static analyzeContentSEO(content: string, keywords: string[]) {
    const wordCount = this.countWords(this.cleanContentForAnalysis(content)).length
    const keywordDensity = this.calculateKeywordDensity(content, keywords)
    const optimalDensity = { min: 1, max: 3 }
    
    // Analyze heading structure
    const headings = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || []
    const headingsStructure = headings.length > 0 ? 'good' as const : 'poor' as const
    
    // Count links (simplified)
    const internalLinks = (content.match(/href="\/[^"]*"/g) || []).length
    const externalLinks = (content.match(/href="https?:\/\/[^"]*"/g) || []).length
    
    const suggestions: string[] = []
    
    if (wordCount < 300) {
      suggestions.push('Content is too short. Aim for at least 300 words for better SEO.')
    }
    
    if (keywordDensity < optimalDensity.min) {
      suggestions.push('Keyword density is too low. Include target keywords more naturally.')
    } else if (keywordDensity > optimalDensity.max) {
      suggestions.push('Keyword density is too high. Reduce keyword usage to avoid over-optimization.')
    }
    
    if (headings.length === 0) {
      suggestions.push('Add headings (H1, H2, H3) to improve content structure.')
    }
    
    if (internalLinks === 0) {
      suggestions.push('Add internal links to related content.')
    }

    return {
      word_count: wordCount,
      keyword_density: keywordDensity,
      optimal_density: optimalDensity,
      headings_structure: headingsStructure,
      internal_links: internalLinks,
      external_links: externalLinks,
      suggestions
    }
  }

  private static async extractKeywords(content: string, targetKeywords: string[]) {
    try {
      // Use AI to extract relevant keywords
      const prompt = `Analyze this content and extract relevant keywords:

Content: ${content.substring(0, 1000)}...

Target keywords: ${targetKeywords.join(', ')}

Return a JSON object with:
- primary: array of 3-5 most important keywords found
- secondary: array of 5-10 supporting keywords
- missing_opportunities: array of relevant keywords not found but should be included`

      const response = await OpenAIService.generateContent(prompt, 'blog')
      
      try {
        const parsed = JSON.parse(response.content)
        return {
          primary: parsed.primary || targetKeywords.slice(0, 3),
          secondary: parsed.secondary || [],
          missing_opportunities: parsed.missing_opportunities || []
        }
      } catch {
        // Fallback if AI response isn't valid JSON
        return {
          primary: targetKeywords.slice(0, 3),
          secondary: targetKeywords.slice(3),
          missing_opportunities: []
        }
      }
    } catch (error) {
      console.error('Error extracting keywords:', error)
      return {
        primary: targetKeywords.slice(0, 3),
        secondary: targetKeywords.slice(3),
        missing_opportunities: []
      }
    }
  }

  private static calculateSEOScore(titleAnalysis: any, metaAnalysis: any, contentAnalysis: any): number {
    let score = 0
    
    // Title score (30%)
    if (titleAnalysis.readability === 'good') score += 30
    else if (titleAnalysis.readability === 'fair') score += 20
    
    // Meta description score (20%)
    if (metaAnalysis.length > 0 && metaAnalysis.has_keywords) score += 20
    else if (metaAnalysis.length > 0) score += 10
    
    // Content score (50%)
    if (contentAnalysis.word_count >= 300) score += 15
    if (contentAnalysis.keyword_density >= 1 && contentAnalysis.keyword_density <= 3) score += 15
    if (contentAnalysis.headings_structure === 'good') score += 10
    if (contentAnalysis.internal_links > 0) score += 5
    if (contentAnalysis.external_links > 0) score += 5
    
    return Math.min(100, score)
  }

  private static generateSEOSuggestions(titleAnalysis: any, metaAnalysis: any, contentAnalysis: any, keywords: any): string[] {
    const suggestions: string[] = []
    
    suggestions.push(...titleAnalysis.suggestions)
    suggestions.push(...metaAnalysis.suggestions)
    suggestions.push(...contentAnalysis.suggestions)
    
    if (keywords.missing_opportunities.length > 0) {
      suggestions.push(`Consider including these relevant keywords: ${keywords.missing_opportunities.join(', ')}`)
    }
    
    return suggestions
  }

  private static cleanContentForAnalysis(content: string): string {
    // Remove HTML tags and normalize whitespace
    return content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  private static countSentences(content: string): string[] {
    return content
      .split(/[.!?]+/)
      .filter(sentence => sentence.trim().length > 0)
      .map(sentence => sentence.trim())
  }

  private static countWords(content: string): string[] {
    return content
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 0 && /[a-zA-Z]/.test(word))
  }

  private static countSyllables(content: string): number {
    const words = this.countWords(content)
    return words.reduce((total, word) => {
      // Simplified syllable counting
      const syllables = word.match(/[aeiouy]+/g) || []
      return total + Math.max(1, syllables.length)
    }, 0)
  }

  private static countParagraphs(content: string): number {
    return content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length
  }

  private static calculateFleschScore(sentences: number, words: number, syllables: number): number {
    if (sentences === 0 || words === 0) return 0
    
    const avgSentenceLength = words / sentences
    const avgSyllablesPerWord = syllables / words
    
    return 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord)
  }

  private static getGradeLevel(fleschScore: number): string {
    if (fleschScore >= 90) return '5th grade'
    if (fleschScore >= 80) return '6th grade'
    if (fleschScore >= 70) return '7th grade'
    if (fleschScore >= 60) return '8th-9th grade'
    if (fleschScore >= 50) return '10th-12th grade'
    if (fleschScore >= 30) return 'College level'
    return 'Graduate level'
  }

  private static analyzeSentenceStructure(sentences: string[]) {
    const lengths = sentences.map(s => s.split(/\s+/).length)
    const avgLength = lengths.reduce((sum, len) => sum + len, 0) / lengths.length
    const longSentences = lengths.filter(len => len > 20).length
    
    return {
      avg_sentence_length: Math.round(avgLength),
      long_sentences: longSentences,
      optimal_range: { min: 15, max: 20 }
    }
  }

  private static analyzeWordComplexity(words: string[]) {
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length
    const complexWords = words.filter(word => word.length > 6).length
    const passiveVoiceWords = words.filter(word => 
      ['was', 'were', 'been', 'being', 'is', 'are', 'am'].includes(word)
    ).length
    
    return {
      avg_word_length: Math.round(avgWordLength * 10) / 10,
      complex_words: complexWords,
      passive_voice_percentage: Math.round((passiveVoiceWords / words.length) * 100)
    }
  }

  private static analyzeDocumentStructure(content: string) {
    const paragraphs = this.countParagraphs(content)
    const headings = (content.match(/<h[1-6][^>]*>/gi) || []).length
    const bulletPoints = (content.match(/^\s*[-*•]/gm) || []).length
    const lists = (content.match(/<[uo]l>/gi) || []).length
    
    const words = this.countWords(this.cleanContentForAnalysis(content))
    const avgParagraphLength = paragraphs > 0 ? Math.round(words.length / paragraphs) : 0
    
    return {
      paragraphs,
      avg_paragraph_length: avgParagraphLength,
      headings,
      bullet_points: bulletPoints,
      lists
    }
  }

  private static calculateReadingTime(wordCount: number): string {
    const wordsPerMinute = 200
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return `${minutes} min read`
  }

  private static generateReadabilitySuggestions(
    fleschScore: number,
    sentenceAnalysis: any,
    wordAnalysis: any,
    structureAnalysis: any
  ): string[] {
    const suggestions: string[] = []
    
    if (fleschScore < 60) {
      suggestions.push('Content is difficult to read. Use shorter sentences and simpler words.')
    }
    
    if (sentenceAnalysis.avg_sentence_length > 20) {
      suggestions.push('Average sentence length is too long. Break up complex sentences.')
    }
    
    if (sentenceAnalysis.long_sentences > 0) {
      suggestions.push(`${sentenceAnalysis.long_sentences} sentences are too long (>20 words). Consider splitting them.`)
    }
    
    if (wordAnalysis.passive_voice_percentage > 10) {
      suggestions.push('Reduce passive voice usage. Use active voice for clearer communication.')
    }
    
    if (structureAnalysis.avg_paragraph_length > 100) {
      suggestions.push('Paragraphs are too long. Break them into smaller chunks for better readability.')
    }
    
    if (structureAnalysis.headings === 0) {
      suggestions.push('Add headings to break up content and improve scannability.')
    }
    
    if (structureAnalysis.bullet_points === 0 && structureAnalysis.lists === 0) {
      suggestions.push('Consider using bullet points or lists to present information clearly.')
    }
    
    return suggestions
  }

  private static calculateKeywordDensity(content: string, keywords: string[]): number {
    if (keywords.length === 0) return 0
    
    const words = this.countWords(this.cleanContentForAnalysis(content))
    const keywordCount = keywords.reduce((count, keyword) => {
      const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
      const matches = content.match(regex) || []
      return count + matches.length
    }, 0)
    
    return Math.round((keywordCount / words.length) * 100 * 10) / 10
  }

  private static async analyzeContentWithAI(content: string) {
    try {
      const prompt = `Analyze the tone, style, and voice characteristics of this content:

Content: ${content.substring(0, 1500)}...

Return a JSON object with:
- detected_tone: array of detected tones (e.g., ["professional", "friendly", "authoritative"])
- formality_level: one of "very_formal", "formal", "neutral", "informal", "very_informal"
- voice_characteristics: array of voice characteristics (e.g., ["conversational", "expert", "helpful"])
- tone_alignment_score: number 0-100 indicating how well it aligns with professional, helpful, approachable tone`

      const response = await OpenAIService.generateContent(prompt, 'blog')
      
      try {
        const parsed = JSON.parse(response.content)
        return {
          detected_tone: parsed.detected_tone || ['neutral'],
          formality_level: parsed.formality_level || 'neutral',
          voice_characteristics: parsed.voice_characteristics || ['informative'],
          tone_alignment_score: parsed.tone_alignment_score || 50
        }
      } catch {
        // Fallback analysis
        return {
          detected_tone: ['professional'],
          formality_level: 'neutral' as const,
          voice_characteristics: ['informative'],
          tone_alignment_score: 75
        }
      }
    } catch (error) {
      console.error('Error analyzing content with AI:', error)
      return {
        detected_tone: ['neutral'],
        formality_level: 'neutral' as const,
        voice_characteristics: ['informative'],
        tone_alignment_score: 50
      }
    }
  }

  private static analyzeBrandVocabulary(content: string) {
    const brandTermsUsed = this.BRAND_VOICE_CONFIG.brand_terms.filter(term =>
      content.toLowerCase().includes(term.toLowerCase())
    )
    
    const brandTermsMissing = this.BRAND_VOICE_CONFIG.brand_terms.filter(term =>
      !content.toLowerCase().includes(term.toLowerCase())
    )
    
    // Simple jargon detection
    const technicalTerms = [
      'API', 'SDK', 'framework', 'implementation', 'optimization',
      'scalability', 'integration', 'methodology', 'paradigm'
    ]
    const jargonCount = technicalTerms.filter(term =>
      content.toLowerCase().includes(term.toLowerCase())
    ).length
    
    const jargonLevel = jargonCount > 5 ? 'high' : jargonCount > 2 ? 'medium' : 'low'
    
    return {
      brand_terms_used: brandTermsUsed,
      brand_terms_missing: brandTermsMissing,
      jargon_level: jargonLevel as 'high' | 'medium' | 'low'
    }
  }

  private static analyzeMessagingAlignment(content: string) {
    const keyMessagesPresent = this.BRAND_VOICE_CONFIG.key_messages.filter(message =>
      content.toLowerCase().includes(message.toLowerCase()) ||
      message.split(' ').some(word => content.toLowerCase().includes(word.toLowerCase()))
    )
    
    const keyMessagesMissing = this.BRAND_VOICE_CONFIG.key_messages.filter(message =>
      !keyMessagesPresent.includes(message)
    )
    
    // Simple value proposition clarity score
    const valuePropositionClarity = Math.min(100, (keyMessagesPresent.length / this.BRAND_VOICE_CONFIG.key_messages.length) * 100)
    
    return {
      key_messages_present: keyMessagesPresent,
      key_messages_missing: keyMessagesMissing,
      value_proposition_clarity: Math.round(valuePropositionClarity)
    }
  }

  private static calculateBrandVoiceScore(aiAnalysis: any, vocabularyAnalysis: any, messagingAlignment: any): number {
    let score = 0
    
    // Tone alignment (40%)
    score += (aiAnalysis.tone_alignment_score * 0.4)
    
    // Brand vocabulary usage (30%)
    const vocabScore = (vocabularyAnalysis.brand_terms_used.length / this.BRAND_VOICE_CONFIG.brand_terms.length) * 100
    score += (vocabScore * 0.3)
    
    // Messaging alignment (30%)
    score += (messagingAlignment.value_proposition_clarity * 0.3)
    
    return Math.round(score)
  }

  private static generateBrandVoiceSuggestions(aiAnalysis: any, vocabularyAnalysis: any, messagingAlignment: any): string[] {
    const suggestions: string[] = []
    
    if (aiAnalysis.tone_alignment_score < 70) {
      suggestions.push(`Adjust tone to be more ${this.BRAND_VOICE_CONFIG.target_tone.join(', ')}`)
    }
    
    if (vocabularyAnalysis.brand_terms_missing.length > 0) {
      suggestions.push(`Consider including brand terms: ${vocabularyAnalysis.brand_terms_missing.slice(0, 3).join(', ')}`)
    }
    
    if (vocabularyAnalysis.jargon_level === 'high') {
      suggestions.push('Reduce technical jargon to improve accessibility')
    }
    
    if (messagingAlignment.key_messages_missing.length > 0) {
      suggestions.push(`Incorporate key messages: ${messagingAlignment.key_messages_missing.slice(0, 2).join(', ')}`)
    }
    
    if (messagingAlignment.value_proposition_clarity < 50) {
      suggestions.push('Strengthen value proposition clarity in the content')
    }
    
    return suggestions
  }

  private static async generateContentVariant(
    originalContent: string,
    testType: 'title' | 'description' | 'cta' | 'full_content',
    variantNumber: number
  ): Promise<string> {
    try {
      const prompts = {
        title: `Create an alternative title for A/B testing. Original: "${originalContent}". Make it ${variantNumber === 1 ? 'more compelling' : 'more specific'}.`,
        description: `Create an alternative description for A/B testing. Original: "${originalContent}". Make it ${variantNumber === 1 ? 'more benefit-focused' : 'more action-oriented'}.`,
        cta: `Create an alternative call-to-action for A/B testing. Original: "${originalContent}". Make it ${variantNumber === 1 ? 'more urgent' : 'more value-focused'}.`,
        full_content: `Create an alternative version of this content for A/B testing. Original: "${originalContent.substring(0, 500)}...". Make it ${variantNumber === 1 ? 'more conversational' : 'more authoritative'}.`
      }
      
      const response = await OpenAIService.generateContent(prompts[testType], 'blog')
      return response.content
    } catch (error) {
      console.error('Error generating content variant:', error)
      return `${originalContent} (Variant ${variantNumber})`
    }
  }

  private static calculateStatisticalSignificance(winner: ABTestResult, runnerUp: ABTestResult): number {
    // Simplified statistical significance calculation
    // In a real implementation, you'd use proper statistical tests
    
    const winnerSampleSize = winner.impressions
    const runnerUpSampleSize = runnerUp.impressions
    const minSampleSize = 100
    
    if (winnerSampleSize < minSampleSize || runnerUpSampleSize < minSampleSize) {
      return 0
    }
    
    const winnerRate = winner.ctr
    const runnerUpRate = runnerUp.ctr
    const difference = Math.abs(winnerRate - runnerUpRate)
    const averageRate = (winnerRate + runnerUpRate) / 2
    
    // Simple confidence calculation based on difference and sample size
    const confidenceBase = Math.min(95, (difference / averageRate) * 100)
    const sampleSizeBonus = Math.min(20, (Math.min(winnerSampleSize, runnerUpSampleSize) / 1000) * 20)
    
    return Math.round(confidenceBase + sampleSizeBonus)
  }

  private static generateABTestInsights(results: ABTestResult[], winner: ABTestResult, runnerUp: ABTestResult): string[] {
    const insights: string[] = []
    
    const improvementPercent = Math.round(((winner.engagement_score - runnerUp.engagement_score) / runnerUp.engagement_score) * 100)
    insights.push(`Winner performed ${improvementPercent}% better than runner-up`)
    
    if (winner.ctr > runnerUp.ctr) {
      insights.push(`Winner had ${Math.round((winner.ctr - runnerUp.ctr) * 100) / 100}% higher click-through rate`)
    }
    
    if (winner.conversion_rate > runnerUp.conversion_rate) {
      insights.push(`Winner had ${Math.round((winner.conversion_rate - runnerUp.conversion_rate) * 100) / 100}% higher conversion rate`)
    }
    
    const totalImpressions = results.reduce((sum, result) => sum + result.impressions, 0)
    insights.push(`Test reached ${totalImpressions} total impressions`)
    
    return insights
  }

  private static generateABTestRecommendations(test: ABTest, winner: ABTestResult, confidence: number): string[] {
    const recommendations: string[] = []
    
    if (confidence >= 95) {
      recommendations.push('Implement the winning variant - results are statistically significant')
    } else if (confidence >= 80) {
      recommendations.push('Consider implementing the winning variant, but monitor results closely')
    } else {
      recommendations.push('Continue testing - results are not yet statistically significant')
    }
    
    if (winner.impressions < 1000) {
      recommendations.push('Gather more data before making final decisions')
    }
    
    if (test.variants.length === 2) {
      recommendations.push('Consider testing additional variants to find further improvements')
    }
    
    recommendations.push('Apply learnings from this test to future content creation')
    
    return recommendations
  }
}
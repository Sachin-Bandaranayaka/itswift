// A/B Test Service with proper database integration

import { ABTest, ABTestVariant, ABTestFilters } from '@/types/ab-test'
import { ContentOptimizer } from './content-optimizer'

// Mock database for demonstration - in production, this would use Supabase
let mockDatabase: ABTest[] = []

export class ABTestService {
  static async getAll(filters: ABTestFilters = {}): Promise<ABTest[]> {
    try {
      let filteredTests = [...mockDatabase]

      // Apply filters
      if (filters.status) {
        filteredTests = filteredTests.filter(test => test.status === filters.status)
      }
      
      if (filters.content_type) {
        filteredTests = filteredTests.filter(test => test.content_type === filters.content_type)
      }
      
      if (filters.platform) {
        filteredTests = filteredTests.filter(test => test.platform === filters.platform)
      }

      // Sort by created_at descending
      filteredTests.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      return filteredTests
    } catch (error) {
      console.error('Error in ABTestService.getAll:', error)
      throw error
    }
  }

  static async getById(id: string): Promise<ABTest | null> {
    try {
      const test = mockDatabase.find(test => test.id === id)
      return test || null
    } catch (error) {
      console.error('Error in ABTestService.getById:', error)
      throw error
    }
  }

  static async create(testData: {
    name: string
    description: string
    content_type: string
    platform?: string
    test_type: string
    original_content: string
    variant_count: number
  }): Promise<ABTest> {
    try {
      // Validate required fields
      const requiredFields = ['name', 'description', 'content_type', 'test_type', 'original_content']
      const missingFields = requiredFields.filter(field => !testData[field as keyof typeof testData])
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
      }

      // Validate test_type
      const validTestTypes = ['title', 'description', 'cta', 'full_content']
      if (!validTestTypes.includes(testData.test_type)) {
        throw new Error(`Invalid test_type. Must be one of: ${validTestTypes.join(', ')}`)
      }

      // Validate variant count
      if (testData.variant_count < 2 || testData.variant_count > 10) {
        throw new Error('Variant count must be between 2 and 10')
      }

      // Validate name length
      if (testData.name.length < 3) {
        throw new Error('Test name must be at least 3 characters long')
      }

      // Generate variants using AI
      const variants = await ContentOptimizer.createABTestVariants(
        testData.original_content,
        testData.test_type as 'title' | 'description' | 'cta' | 'full_content',
        testData.variant_count
      )

      // Create new test
      const newTest: ABTest = {
        id: Date.now().toString(),
        name: testData.name,
        description: testData.description,
        content_type: testData.content_type as ABTest['content_type'],
        platform: testData.platform as ABTest['platform'],
        test_type: testData.test_type as ABTest['test_type'],
        status: 'draft',
        variants,
        results: [],
        confidence_level: 0,
        created_at: new Date().toISOString()
      }

      // Add to mock database
      mockDatabase.push(newTest)

      return newTest
    } catch (error) {
      console.error('Error in ABTestService.create:', error)
      throw error
    }
  }

  static async update(id: string, updates: Partial<ABTest>): Promise<ABTest> {
    try {
      const testIndex = mockDatabase.findIndex(test => test.id === id)
      
      if (testIndex === -1) {
        throw new Error('A/B test not found')
      }

      // Update the test
      mockDatabase[testIndex] = {
        ...mockDatabase[testIndex],
        ...updates,
        updated_at: new Date().toISOString()
      }

      return mockDatabase[testIndex]
    } catch (error) {
      console.error('Error in ABTestService.update:', error)
      throw error
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      const testIndex = mockDatabase.findIndex(test => test.id === id)
      
      if (testIndex === -1) {
        throw new Error('A/B test not found')
      }

      mockDatabase.splice(testIndex, 1)
    } catch (error) {
      console.error('Error in ABTestService.delete:', error)
      throw error
    }
  }
}
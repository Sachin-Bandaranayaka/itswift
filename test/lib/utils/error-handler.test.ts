import { describe, it, expect, vi } from 'vitest'
import { NextResponse } from 'next/server'
import {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ExternalServiceError,
  RateLimitError,
  handleApiError,
  createErrorResponse,
  createSuccessResponse,
  withRetry
} from '@/lib/utils/error-handler'

describe('Error Handler', () => {
  describe('Custom Error Classes', () => {
    it('creates ValidationError with correct properties', () => {
      const error = new ValidationError('Invalid input', { field: 'email' })
      
      expect(error.name).toBe('ValidationError')
      expect(error.message).toBe('Invalid input')
      expect(error.statusCode).toBe(400)
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.details).toEqual({ field: 'email' })
    })

    it('creates AuthenticationError with correct properties', () => {
      const error = new AuthenticationError()
      
      expect(error.name).toBe('AuthenticationError')
      expect(error.message).toBe('Authentication required')
      expect(error.statusCode).toBe(401)
      expect(error.code).toBe('AUTHENTICATION_ERROR')
    })

    it('creates ExternalServiceError with service info', () => {
      const error = new ExternalServiceError('API timeout', 'OpenAI', { timeout: 5000 })
      
      expect(error.name).toBe('ExternalServiceError')
      expect(error.message).toBe('API timeout')
      expect(error.service).toBe('OpenAI')
      expect(error.details).toEqual({ timeout: 5000 })
    })
  })

  describe('handleApiError', () => {
    it('handles ValidationError correctly', () => {
      const error = new ValidationError('Invalid email format', { field: 'email' })
      const response = handleApiError(error)
      
      expect(response).toBeInstanceOf(NextResponse)
      expect(response.status).toBe(400)
    })

    it('handles AuthenticationError correctly', () => {
      const error = new AuthenticationError('Token expired')
      const response = handleApiError(error)
      
      expect(response).toBeInstanceOf(NextResponse)
      expect(response.status).toBe(401)
    })

    it('handles generic Error in development', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      
      const error = new Error('Database connection failed')
      const response = handleApiError(error)
      
      expect(response).toBeInstanceOf(NextResponse)
      expect(response.status).toBe(500)
      
      process.env.NODE_ENV = originalEnv
    })

    it('handles generic Error in production', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
      
      const error = new Error('Database connection failed')
      const response = handleApiError(error)
      
      expect(response).toBeInstanceOf(NextResponse)
      expect(response.status).toBe(500)
      
      process.env.NODE_ENV = originalEnv
    })

    it('handles unknown error types', () => {
      const response = handleApiError('Unknown error')
      
      expect(response).toBeInstanceOf(NextResponse)
      expect(response.status).toBe(500)
    })
  })

  describe('createErrorResponse', () => {
    it('creates error response with default values', () => {
      const response = createErrorResponse('Something went wrong')
      
      expect(response).toBeInstanceOf(NextResponse)
      expect(response.status).toBe(500)
    })

    it('creates error response with custom values', () => {
      const response = createErrorResponse('Not found', 404, 'NOT_FOUND', { resource: 'user' })
      
      expect(response).toBeInstanceOf(NextResponse)
      expect(response.status).toBe(404)
    })
  })

  describe('createSuccessResponse', () => {
    it('creates success response with data', () => {
      const response = createSuccessResponse({ id: 1, name: 'Test' })
      
      expect(response).toBeInstanceOf(NextResponse)
      expect(response.status).toBe(200)
    })

    it('creates success response with message', () => {
      const response = createSuccessResponse({ id: 1 }, 'Created successfully')
      
      expect(response).toBeInstanceOf(NextResponse)
      expect(response.status).toBe(200)
    })
  })

  describe('withRetry', () => {
    it('succeeds on first attempt', async () => {
      const operation = vi.fn().mockResolvedValue('success')
      
      const result = await withRetry(operation, 3, 100)
      
      expect(result).toBe('success')
      expect(operation).toHaveBeenCalledTimes(1)
    })

    it('retries on failure and eventually succeeds', async () => {
      const operation = vi.fn()
        .mockRejectedValueOnce(new Error('Attempt 1 failed'))
        .mockRejectedValueOnce(new Error('Attempt 2 failed'))
        .mockResolvedValue('success')
      
      const result = await withRetry(operation, 3, 10)
      
      expect(result).toBe('success')
      expect(operation).toHaveBeenCalledTimes(3)
    })

    it('throws error after max retries', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Always fails'))
      
      await expect(withRetry(operation, 2, 10)).rejects.toThrow('Always fails')
      expect(operation).toHaveBeenCalledTimes(2)
    })

    it('waits between retries with exponential backoff', async () => {
      const operation = vi.fn()
        .mockRejectedValueOnce(new Error('Attempt 1 failed'))
        .mockResolvedValue('success')
      
      const startTime = Date.now()
      await withRetry(operation, 3, 100)
      const endTime = Date.now()
      
      // Should have waited at least 100ms for the retry
      expect(endTime - startTime).toBeGreaterThanOrEqual(100)
    })
  })
})
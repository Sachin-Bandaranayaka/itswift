import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useBlogErrorHandling, useBlogDataErrorHandling, useBlogPostErrorHandling } from '@/hooks/use-blog-error-handling'

// Mock the error handler utility
vi.mock('@/lib/utils/error-handler', () => ({
  withRetry: vi.fn()
}))

import { withRetry } from '@/lib/utils/error-handler'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { beforeEach } from 'node:test'
import { describe } from 'node:test'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { beforeEach } from 'node:test'
import { describe } from 'node:test'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { it } from 'date-fns/locale'
import { beforeEach } from 'node:test'
import { describe } from 'node:test'
const mockWithRetry = withRetry as ReturnType<typeof vi.fn>

describe('useBlogErrorHandling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('initializes with no error state', () => {
    const { result } = renderHook(() => useBlogErrorHandling())

    expect(result.current.error).toBeNull()
    expect(result.current.isRetrying).toBe(false)
    expect(result.current.retryCount).toBe(0)
    expect(result.current.canRetry).toBe(true)
  })

  it('sets error correctly', () => {
    const { result } = renderHook(() => useBlogErrorHandling())

    act(() => {
      result.current.setError('Test error')
    })

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Test error')
  })

  it('sets Error object correctly', () => {
    const { result } = renderHook(() => useBlogErrorHandling())
    const testError = new Error('Test error object')

    act(() => {
      result.current.setError(testError)
    })

    expect(result.current.error).toBe(testError)
  })

  it('clears error state', () => {
    const { result } = renderHook(() => useBlogErrorHandling())

    act(() => {
      result.current.setError('Test error')
    })

    expect(result.current.error).not.toBeNull()

    act(() => {
      result.current.clearError()
    })

    expect(result.current.error).toBeNull()
    expect(result.current.retryCount).toBe(0)
  })

  it('executes operation with error handling successfully', async () => {
    const { result } = renderHook(() => useBlogErrorHandling())
    const mockOperation = vi.fn().mockResolvedValue('success')
    mockWithRetry.mockResolvedValue('success')

    let operationResult: any
    await act(async () => {
      operationResult = await result.current.executeWithErrorHandling(mockOperation)
    })

    expect(operationResult).toBe('success')
    expect(mockWithRetry).toHaveBeenCalledWith(mockOperation, 3, 1000)
    expect(result.current.error).toBeNull()
  })

  it('handles operation failure in executeWithErrorHandling', async () => {
    const { result } = renderHook(() => useBlogErrorHandling())
    const mockOperation = vi.fn()
    const testError = new Error('Operation failed')
    mockWithRetry.mockRejectedValue(testError)

    let operationResult: any
    await act(async () => {
      operationResult = await result.current.executeWithErrorHandling(mockOperation)
    })

    expect(operationResult).toBeNull()
    expect(result.current.error).toBe(testError)
  })

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn()
    const { result } = renderHook(() => useBlogErrorHandling({ onError }))

    act(() => {
      result.current.setError('Test error')
    })

    expect(onError).toHaveBeenCalledWith(expect.any(Error))
  })

  it('calls onRetrySuccess callback on successful retry', async () => {
    const onRetrySuccess = vi.fn()
    const { result } = renderHook(() => useBlogErrorHandling({ onRetrySuccess }))
    const mockOperation = vi.fn().mockResolvedValue('success')

    // Set initial error state
    act(() => {
      result.current.setError('Initial error')
    })

    await act(async () => {
      await result.current.retry(mockOperation)
    })

    expect(onRetrySuccess).toHaveBeenCalledTimes(1)
    expect(result.current.error).toBeNull()
  })

  it('calls onMaxRetriesReached when max retries exceeded', async () => {
    const onMaxRetriesReached = vi.fn()
    const { result } = renderHook(() => useBlogErrorHandling({ 
      maxRetries: 2,
      onMaxRetriesReached 
    }))
    const mockOperation = vi.fn().mockRejectedValue(new Error('Always fails'))

    // Simulate reaching max retries
    act(() => {
      result.current.setError('Initial error')
    })

    // Manually set retry count to max
    await act(async () => {
      await result.current.retry(mockOperation)
    })
    await act(async () => {
      await result.current.retry(mockOperation)
    })
    
    // This should trigger onMaxRetriesReached
    await act(async () => {
      await result.current.retry(mockOperation)
    })

    expect(onMaxRetriesReached).toHaveBeenCalled()
  })

  it('updates retry count correctly', async () => {
    const { result } = renderHook(() => useBlogErrorHandling())
    const mockOperation = vi.fn().mockRejectedValue(new Error('Retry test'))

    act(() => {
      result.current.setError('Initial error')
    })

    await act(async () => {
      await result.current.retry(mockOperation)
    })

    expect(result.current.retryCount).toBe(1)
    expect(result.current.canRetry).toBe(true)
  })

  it('prevents retry when max retries reached', async () => {
    const { result } = renderHook(() => useBlogErrorHandling({ maxRetries: 1 }))
    const mockOperation = vi.fn().mockRejectedValue(new Error('Retry test'))

    act(() => {
      result.current.setError('Initial error')
    })

    await act(async () => {
      await result.current.retry(mockOperation)
    })

    expect(result.current.canRetry).toBe(false)

    // Attempt another retry
    const secondResult = await act(async () => {
      return await result.current.retry(mockOperation)
    })

    expect(secondResult).toBeNull()
    expect(mockOperation).toHaveBeenCalledTimes(1) // Should not be called again
  })
})

describe('useBlogDataErrorHandling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides fetchWithErrorHandling function', () => {
    const { result } = renderHook(() => useBlogDataErrorHandling())

    expect(typeof result.current.fetchWithErrorHandling).toBe('function')
  })

  it('executes fetch operation successfully', async () => {
    const { result } = renderHook(() => useBlogDataErrorHandling())
    const mockFetch = vi.fn().mockResolvedValue('data')
    mockWithRetry.mockResolvedValue('data')

    let fetchResult: any
    await act(async () => {
      fetchResult = await result.current.fetchWithErrorHandling(mockFetch)
    })

    expect(fetchResult).toBe('data')
    expect(mockWithRetry).toHaveBeenCalledWith(mockFetch, 3, 2000)
  })
})

describe('useBlogPostErrorHandling', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides getUserFriendlyError function', () => {
    const { result } = renderHook(() => useBlogPostErrorHandling())

    expect(typeof result.current.getUserFriendlyError).toBe('function')
  })

  it('converts not found error to user-friendly message', () => {
    const { result } = renderHook(() => useBlogPostErrorHandling())

    const friendlyMessage = result.current.getUserFriendlyError('Post not found')
    expect(friendlyMessage).toBe('This blog post could not be found. It may have been moved or deleted.')
  })

  it('converts network error to user-friendly message', () => {
    const { result } = renderHook(() => useBlogPostErrorHandling())

    const friendlyMessage = result.current.getUserFriendlyError('Failed to fetch')
    expect(friendlyMessage).toBe('Unable to load the blog post. Please check your internet connection.')
  })

  it('converts timeout error to user-friendly message', () => {
    const { result } = renderHook(() => useBlogPostErrorHandling())

    const friendlyMessage = result.current.getUserFriendlyError('Request timeout')
    expect(friendlyMessage).toBe('The blog post is taking too long to load. Please try again.')
  })

  it('converts server error to user-friendly message', () => {
    const { result } = renderHook(() => useBlogPostErrorHandling())

    const friendlyMessage = result.current.getUserFriendlyError('Internal server error')
    expect(friendlyMessage).toBe('Our servers are experiencing issues. Please try again in a few moments.')
  })

  it('provides generic message for unknown errors', () => {
    const { result } = renderHook(() => useBlogPostErrorHandling())

    const friendlyMessage = result.current.getUserFriendlyError('Unknown error')
    expect(friendlyMessage).toBe('Unable to load the blog post. Please try again.')
  })

  it('handles Error objects correctly', () => {
    const { result } = renderHook(() => useBlogPostErrorHandling())
    const error = new Error('Network error occurred')

    const friendlyMessage = result.current.getUserFriendlyError(error)
    expect(friendlyMessage).toBe('Unable to load the blog post. Please check your internet connection.')
  })
})
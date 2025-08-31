/**
 * Retry mechanism hook for handling failed operations with exponential backoff
 */

import { useState, useCallback, useRef, useEffect } from 'react';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  onRetry?: (attempt: number, error: Error) => void;
  onMaxRetriesReached?: (error: Error) => void;
}

interface RetryState {
  isRetrying: boolean;
  retryCount: number;
  lastError: Error | null;
  nextRetryIn: number | null;
}

export function useRetryMechanism<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffFactor = 2,
    onRetry,
    onMaxRetriesReached
  } = options;

  const [state, setState] = useState<RetryState>({
    isRetrying: false,
    retryCount: 0,
    lastError: null,
    nextRetryIn: null
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  const calculateDelay = useCallback((attempt: number) => {
    const delay = initialDelay * Math.pow(backoffFactor, attempt);
    return Math.min(delay, maxDelay);
  }, [initialDelay, backoffFactor, maxDelay]);

  const startCountdown = useCallback((delay: number) => {
    setState(prev => ({ ...prev, nextRetryIn: delay }));
    
    const startTime = Date.now();
    countdownRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, delay - elapsed);
      
      if (remaining <= 0) {
        setState(prev => ({ ...prev, nextRetryIn: null }));
        if (countdownRef.current) {
          clearInterval(countdownRef.current);
        }
      } else {
        setState(prev => ({ ...prev, nextRetryIn: remaining }));
      }
    }, 100);
  }, []);

  const executeWithRetry = useCallback(async (): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        setState(prev => ({ 
          ...prev, 
          isRetrying: attempt > 0,
          retryCount: attempt,
          lastError: null,
          nextRetryIn: null
        }));

        const result = await operation();
        
        // Success - reset state
        setState({
          isRetrying: false,
          retryCount: 0,
          lastError: null,
          nextRetryIn: null
        });
        
        return result;
      } catch (error) {
        lastError = error as Error;
        
        setState(prev => ({ 
          ...prev, 
          lastError: lastError,
          retryCount: attempt
        }));

        // If this was the last attempt, don't retry
        if (attempt === maxRetries) {
          setState(prev => ({ 
            ...prev, 
            isRetrying: false,
            nextRetryIn: null
          }));
          
          if (onMaxRetriesReached) {
            onMaxRetriesReached(lastError);
          }
          
          throw lastError;
        }

        // Calculate delay for next retry
        const delay = calculateDelay(attempt);
        
        if (onRetry) {
          onRetry(attempt + 1, lastError);
        }

        // Start countdown and wait
        startCountdown(delay);
        
        await new Promise(resolve => {
          timeoutRef.current = setTimeout(resolve, delay);
        });
      }
    }

    throw lastError!;
  }, [operation, maxRetries, calculateDelay, onRetry, onMaxRetriesReached, startCountdown]);

  const retry = useCallback(() => {
    return executeWithRetry();
  }, [executeWithRetry]);

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    
    setState({
      isRetrying: false,
      retryCount: 0,
      lastError: null,
      nextRetryIn: null
    });
  }, []);

  return {
    ...state,
    retry,
    reset,
    executeWithRetry,
    canRetry: state.retryCount < maxRetries,
    nextRetryInSeconds: state.nextRetryIn ? Math.ceil(state.nextRetryIn / 1000) : null
  };
}

/**
 * Hook for managing multiple retry operations
 */
export function useMultipleRetries<T extends Record<string, () => Promise<any>>>(
  operations: T,
  options: RetryOptions = {}
) {
  const retryHooks = Object.keys(operations).reduce((acc, key) => {
    acc[key] = useRetryMechanism(operations[key], options);
    return acc;
  }, {} as Record<keyof T, ReturnType<typeof useRetryMechanism>>);

  const retryAll = useCallback(async () => {
    const promises = Object.values(retryHooks).map(hook => hook.retry());
    return Promise.allSettled(promises);
  }, [retryHooks]);

  const resetAll = useCallback(() => {
    Object.values(retryHooks).forEach(hook => hook.reset());
  }, [retryHooks]);

  const isAnyRetrying = Object.values(retryHooks).some(hook => hook.isRetrying);
  const hasAnyErrors = Object.values(retryHooks).some(hook => hook.lastError);
  const totalRetryCount = Object.values(retryHooks).reduce((sum, hook) => sum + hook.retryCount, 0);

  return {
    retryHooks,
    retryAll,
    resetAll,
    isAnyRetrying,
    hasAnyErrors,
    totalRetryCount
  };
}

/**
 * Hook for circuit breaker pattern to prevent cascading failures
 */
interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeout?: number;
  monitoringPeriod?: number;
}

type CircuitState = 'closed' | 'open' | 'half-open';

export function useCircuitBreaker<T>(
  operation: () => Promise<T>,
  options: CircuitBreakerOptions = {}
) {
  const {
    failureThreshold = 5,
    resetTimeout = 60000, // 1 minute
    monitoringPeriod = 60000 // 1 minute
  } = options;

  const [state, setState] = useState<{
    circuitState: CircuitState;
    failureCount: number;
    lastFailureTime: number | null;
    nextAttemptTime: number | null;
  }>({
    circuitState: 'closed',
    failureCount: 0,
    lastFailureTime: null,
    nextAttemptTime: null
  });

  const execute = useCallback(async (): Promise<T> => {
    const now = Date.now();

    // Check if circuit should be reset
    if (state.circuitState === 'open' && state.nextAttemptTime && now >= state.nextAttemptTime) {
      setState(prev => ({ ...prev, circuitState: 'half-open' }));
    }

    // Reject if circuit is open
    if (state.circuitState === 'open') {
      const waitTime = state.nextAttemptTime ? Math.max(0, state.nextAttemptTime - now) : 0;
      throw new Error(`Circuit breaker is open. Try again in ${Math.ceil(waitTime / 1000)} seconds.`);
    }

    try {
      const result = await operation();
      
      // Success - reset circuit if it was half-open
      if (state.circuitState === 'half-open') {
        setState({
          circuitState: 'closed',
          failureCount: 0,
          lastFailureTime: null,
          nextAttemptTime: null
        });
      }
      
      return result;
    } catch (error) {
      const newFailureCount = state.failureCount + 1;
      const shouldOpenCircuit = newFailureCount >= failureThreshold;
      
      setState({
        circuitState: shouldOpenCircuit ? 'open' : 'closed',
        failureCount: newFailureCount,
        lastFailureTime: now,
        nextAttemptTime: shouldOpenCircuit ? now + resetTimeout : null
      });
      
      throw error;
    }
  }, [operation, state, failureThreshold, resetTimeout]);

  const reset = useCallback(() => {
    setState({
      circuitState: 'closed',
      failureCount: 0,
      lastFailureTime: null,
      nextAttemptTime: null
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
    isOpen: state.circuitState === 'open',
    isHalfOpen: state.circuitState === 'half-open',
    timeUntilRetry: state.nextAttemptTime ? Math.max(0, state.nextAttemptTime - Date.now()) : 0
  };
}
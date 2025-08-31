/**
 * Performance Testing Utilities for Dashboard
 * 
 * Utilities to measure and validate dashboard performance under various conditions
 */

import { performance } from 'perf_hooks';

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  dataFetchTime: number;
  memoryUsage?: number;
  componentCount?: number;
}

export interface PerformanceThresholds {
  maxLoadTime: number;
  maxRenderTime: number;
  maxDataFetchTime: number;
  maxMemoryUsage?: number;
}

export class PerformanceMonitor {
  private startTime: number = 0;
  private metrics: Partial<PerformanceMetrics> = {};
  private thresholds: PerformanceThresholds;

  constructor(thresholds: PerformanceThresholds) {
    this.thresholds = thresholds;
  }

  startMeasurement(): void {
    this.startTime = performance.now();
    this.metrics = {};
  }

  markDataFetchStart(): void {
    this.metrics.dataFetchTime = performance.now();
  }

  markDataFetchEnd(): void {
    if (this.metrics.dataFetchTime) {
      this.metrics.dataFetchTime = performance.now() - this.metrics.dataFetchTime;
    }
  }

  markRenderStart(): void {
    this.metrics.renderTime = performance.now();
  }

  markRenderEnd(): void {
    if (this.metrics.renderTime) {
      this.metrics.renderTime = performance.now() - this.metrics.renderTime;
    }
  }

  endMeasurement(): PerformanceMetrics {
    this.metrics.loadTime = performance.now() - this.startTime;
    
    // Measure memory usage if available
    if (typeof window !== 'undefined' && 'memory' in performance) {
      this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }

    return this.metrics as PerformanceMetrics;
  }

  validatePerformance(metrics: PerformanceMetrics): {
    passed: boolean;
    failures: string[];
  } {
    const failures: string[] = [];

    if (metrics.loadTime > this.thresholds.maxLoadTime) {
      failures.push(`Load time ${metrics.loadTime}ms exceeds threshold ${this.thresholds.maxLoadTime}ms`);
    }

    if (metrics.renderTime > this.thresholds.maxRenderTime) {
      failures.push(`Render time ${metrics.renderTime}ms exceeds threshold ${this.thresholds.maxRenderTime}ms`);
    }

    if (metrics.dataFetchTime > this.thresholds.maxDataFetchTime) {
      failures.push(`Data fetch time ${metrics.dataFetchTime}ms exceeds threshold ${this.thresholds.maxDataFetchTime}ms`);
    }

    if (this.thresholds.maxMemoryUsage && metrics.memoryUsage && metrics.memoryUsage > this.thresholds.maxMemoryUsage) {
      failures.push(`Memory usage ${metrics.memoryUsage} bytes exceeds threshold ${this.thresholds.maxMemoryUsage} bytes`);
    }

    return {
      passed: failures.length === 0,
      failures
    };
  }
}

export const createMockDataset = (size: 'small' | 'medium' | 'large' | 'xlarge') => {
  const sizes = {
    small: { posts: 10, activities: 5, content: 3 },
    medium: { posts: 100, activities: 50, content: 20 },
    large: { posts: 1000, activities: 500, content: 100 },
    xlarge: { posts: 10000, activities: 5000, content: 1000 }
  };

  const config = sizes[size];

  return {
    blogStats: {
      totalPosts: config.posts,
      publishedThisMonth: Math.floor(config.posts * 0.1),
      growthPercentage: Math.random() * 50
    },
    socialStats: {
      totalPosts: config.posts * 2,
      postsThisWeek: Math.floor(config.posts * 0.05),
      totalEngagement: config.posts * 10,
      growthPercentage: Math.random() * 30
    },
    newsletterStats: {
      totalSubscribers: config.posts * 5,
      newSubscribersThisMonth: Math.floor(config.posts * 0.2),
      growthPercentage: Math.random() * 20
    },
    aiUsage: {
      contentGenerated: Math.floor(config.posts * 0.3),
      tokensUsed: config.posts * 1000,
      timeSaved: config.posts * 2
    },
    recentActivity: Array.from({ length: config.activities }, (_, i) => ({
      id: `activity-${i}`,
      type: ['blog', 'social', 'newsletter', 'ai'][i % 4] as any,
      title: `Activity Item ${i}`,
      description: `Description for activity ${i}`,
      timestamp: new Date(Date.now() - i * 60000),
      status: 'published' as any
    })),
    topPerformingContent: Array.from({ length: config.content }, (_, i) => ({
      id: `content-${i}`,
      title: `Top Content ${i}`,
      type: 'blog' as any,
      metrics: {
        views: 1000 + i * 100,
        likes: 50 + i * 5,
        shares: 10 + i
      }
    })),
    upcomingScheduled: Array.from({ length: Math.floor(config.content / 2) }, (_, i) => ({
      id: `scheduled-${i}`,
      title: `Scheduled Content ${i}`,
      type: 'blog' as any,
      scheduledAt: new Date(Date.now() + i * 86400000) // Future dates
    }))
  };
};

export const simulateNetworkDelay = (min: number = 100, max: number = 500): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

export const simulateNetworkError = (errorRate: number = 0.1): boolean => {
  return Math.random() < errorRate;
};

export const measureComponentRenderTime = async (renderFn: () => Promise<void>): Promise<number> => {
  const start = performance.now();
  await renderFn();
  return performance.now() - start;
};

export const DEFAULT_PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  maxLoadTime: 3000, // 3 seconds
  maxRenderTime: 1000, // 1 second
  maxDataFetchTime: 2000, // 2 seconds
  maxMemoryUsage: 50 * 1024 * 1024 // 50MB
};

export const STRESS_TEST_THRESHOLDS: PerformanceThresholds = {
  maxLoadTime: 5000, // 5 seconds
  maxRenderTime: 2000, // 2 seconds
  maxDataFetchTime: 3000, // 3 seconds
  maxMemoryUsage: 100 * 1024 * 1024 // 100MB
};
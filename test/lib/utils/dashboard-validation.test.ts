/**
 * Tests for dashboard validation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  sanitizeString,
  validateNumber,
  validatePercentage,
  validateDate,
  validateBlogStats,
  validateSocialStats,
  validateNewsletterStats,
  validateActivityItem,
  validatePerformingContentItem,
  validateScheduledItem,
  validateAIUsageStats,
  validateDashboardData,
  isBlogStats,
  isDashboardData
} from '@/lib/utils/dashboard-validation';

describe('Dashboard Validation Utilities', () => {
  describe('sanitizeString', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeString('<script>alert("xss")</script>Hello')).toBe('alert(&quot;xss&quot;)Hello');
    });

    it('should escape dangerous characters', () => {
      expect(sanitizeString('Hello <world> & "test"')).toBe('Hello  &amp; &quot;test&quot;');
    });

    it('should handle non-string inputs', () => {
      expect(sanitizeString(123)).toBe('');
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
    });

    it('should limit string length', () => {
      const longString = 'a'.repeat(2000);
      const result = sanitizeString(longString);
      expect(result.length).toBe(1000);
    });
  });

  describe('validateNumber', () => {
    it('should validate positive numbers', () => {
      expect(validateNumber(42)).toBe(42);
      expect(validateNumber(0)).toBe(0);
    });

    it('should reject negative numbers', () => {
      expect(validateNumber(-5)).toBe(0);
    });

    it('should handle invalid inputs', () => {
      expect(validateNumber('not a number')).toBe(0);
      expect(validateNumber(NaN)).toBe(0);
      expect(validateNumber(Infinity)).toBe(0);
    });

    it('should use default value when provided', () => {
      expect(validateNumber('invalid', 10)).toBe(10);
    });
  });

  describe('validatePercentage', () => {
    it('should validate percentages within bounds', () => {
      expect(validatePercentage(50)).toBe(50);
      expect(validatePercentage(-25)).toBe(-25);
    });

    it('should cap extreme values', () => {
      expect(validatePercentage(2000)).toBe(1000);
      expect(validatePercentage(-2000)).toBe(-1000);
    });

    it('should handle invalid inputs', () => {
      expect(validatePercentage('not a number')).toBe(0);
      expect(validatePercentage(NaN)).toBe(0);
    });
  });

  describe('validateDate', () => {
    it('should validate valid dates', () => {
      const date = new Date('2024-01-01');
      expect(validateDate(date)).toEqual(date);
    });

    it('should parse valid date strings', () => {
      const result = validateDate('2024-01-01');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
    });

    it('should reject invalid dates', () => {
      expect(validateDate('invalid date')).toBeNull();
      expect(validateDate(new Date('invalid'))).toBeNull();
      expect(validateDate(null)).toBeNull();
    });
  });

  describe('validateBlogStats', () => {
    it('should validate valid blog stats', () => {
      const input = {
        totalPosts: 10,
        publishedThisMonth: 5,
        growthPercentage: 25
      };
      const result = validateBlogStats(input);
      expect(result).toEqual(input);
    });

    it('should handle invalid inputs', () => {
      const result = validateBlogStats(null);
      expect(result).toEqual({
        totalPosts: 0,
        publishedThisMonth: 0,
        growthPercentage: 0
      });
    });

    it('should sanitize invalid numbers', () => {
      const input = {
        totalPosts: -5,
        publishedThisMonth: 'invalid',
        growthPercentage: 2000
      };
      const result = validateBlogStats(input);
      expect(result).toEqual({
        totalPosts: 0,
        publishedThisMonth: 0,
        growthPercentage: 1000
      });
    });
  });

  describe('validateActivityItem', () => {
    it('should validate valid activity item', () => {
      const input = {
        id: 'test-id',
        type: 'blog',
        title: 'Test Title',
        description: 'Test Description',
        timestamp: new Date('2024-01-01'),
        status: 'published',
        platform: 'web'
      };
      const result = validateActivityItem(input);
      expect(result).toBeTruthy();
      expect(result?.id).toBe('test-id');
      expect(result?.type).toBe('blog');
    });

    it('should return null for invalid inputs', () => {
      expect(validateActivityItem(null)).toBeNull();
      expect(validateActivityItem({})).toBeNull();
      expect(validateActivityItem({ id: 'test' })).toBeNull(); // missing required fields
    });

    it('should sanitize user content', () => {
      const input = {
        id: 'test-id',
        type: 'blog',
        title: '<script>alert("xss")</script>Safe Title',
        description: 'Safe Description',
        timestamp: new Date('2024-01-01'),
        status: 'published'
      };
      const result = validateActivityItem(input);
      expect(result?.title).toBe('alert(&quot;xss&quot;)Safe Title');
    });
  });

  describe('isBlogStats type guard', () => {
    it('should identify valid blog stats', () => {
      const validStats = {
        totalPosts: 10,
        publishedThisMonth: 5,
        growthPercentage: 25
      };
      expect(isBlogStats(validStats)).toBe(true);
    });

    it('should reject invalid blog stats', () => {
      expect(isBlogStats(null)).toBe(false);
      expect(isBlogStats({})).toBe(false);
      expect(isBlogStats({ totalPosts: 'invalid' })).toBe(false);
    });
  });

  describe('validateDashboardData', () => {
    it('should validate complete dashboard data', () => {
      const input = {
        blogStats: { totalPosts: 10, publishedThisMonth: 5, growthPercentage: 25 },
        socialStats: { totalPosts: 20, postsThisWeek: 3, totalEngagement: 100, growthPercentage: 15 },
        newsletterStats: { totalSubscribers: 500, newSubscribersThisMonth: 50, growthPercentage: 10 },
        recentActivity: [],
        topPerformingContent: [],
        upcomingScheduled: [],
        aiUsage: { contentGenerated: 5, tokensUsed: 1000, timeSaved: 60 }
      };
      
      const result = validateDashboardData(input);
      expect(result.blogStats.totalPosts).toBe(10);
      expect(result.socialStats.totalPosts).toBe(20);
      expect(result.newsletterStats.totalSubscribers).toBe(500);
    });

    it('should return default data for invalid input', () => {
      const result = validateDashboardData(null);
      expect(result.blogStats.totalPosts).toBe(0);
      expect(result.socialStats.totalPosts).toBe(0);
      expect(result.newsletterStats.totalSubscribers).toBe(0);
      expect(result.recentActivity).toEqual([]);
    });
  });
});
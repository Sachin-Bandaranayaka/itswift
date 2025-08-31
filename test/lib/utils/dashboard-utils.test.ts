/**
 * Tests for dashboard utility functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isThisMonth,
  isLastMonth,
  isThisWeek,
  isLastWeek,
  isThisYear,
  isLastYear,
  isWithinLastDays,
  isWithinLastHours,
  isToday,
  isYesterday,
  calculateGrowth,
  calculatePercentageChange,
  formatNumber,
  formatPercentage,
  formatDate,
  formatRelativeDate,
  formatDuration,
  getDateRange,
  getCurrentPeriodBounds,
  getPreviousPeriodBounds
} from '@/lib/utils/dashboard-utils';
import { afterEach } from 'node:test';

describe('Dashboard Utility Functions', () => {
  beforeEach(() => {
    // Mock current date to January 15, 2024 (Monday)
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Date filtering functions', () => {
    describe('isThisMonth', () => {
      it('should identify dates in current month', () => {
        expect(isThisMonth(new Date('2024-01-01'))).toBe(true);
        expect(isThisMonth(new Date('2024-01-31'))).toBe(true);
        expect(isThisMonth(new Date('2024-01-15'))).toBe(true);
      });

      it('should reject dates not in current month', () => {
        expect(isThisMonth(new Date('2024-02-01'))).toBe(false);
        expect(isThisMonth(new Date('2023-01-15'))).toBe(false);
      });

      it('should handle invalid dates', () => {
        expect(isThisMonth(new Date('invalid'))).toBe(false);
        expect(isThisMonth(null as any)).toBe(false);
      });
    });

    describe('isToday', () => {
      it('should identify today\'s date', () => {
        expect(isToday(new Date('2024-01-15'))).toBe(true);
      });

      it('should reject other dates', () => {
        expect(isToday(new Date('2024-01-14'))).toBe(false);
        expect(isToday(new Date('2024-01-16'))).toBe(false);
      });
    });

    describe('isWithinLastDays', () => {
      it('should identify dates within last N days', () => {
        // Current time is 2024-01-15T12:00:00Z, so 2024-01-15T11:00:00Z is within last 1 day
        expect(isWithinLastDays(new Date('2024-01-15T11:00:00Z'), 1)).toBe(true);
        expect(isWithinLastDays(new Date('2024-01-10T12:00:00Z'), 7)).toBe(true);
      });

      it('should reject dates outside range', () => {
        expect(isWithinLastDays(new Date('2024-01-01'), 7)).toBe(false);
      });

      it('should handle invalid inputs', () => {
        expect(isWithinLastDays(new Date('invalid'), 7)).toBe(false);
        expect(isWithinLastDays(new Date(), -1)).toBe(false);
      });
    });
  });

  describe('Calculation functions', () => {
    describe('calculateGrowth', () => {
      it('should calculate positive growth', () => {
        expect(calculateGrowth(120, 100)).toBe(20);
      });

      it('should calculate negative growth', () => {
        expect(calculateGrowth(80, 100)).toBe(-20);
      });

      it('should handle zero previous value', () => {
        expect(calculateGrowth(50, 0)).toBe(100);
        expect(calculateGrowth(0, 0)).toBe(0);
      });

      it('should handle invalid inputs', () => {
        expect(calculateGrowth(NaN, 100)).toBe(0);
        expect(calculateGrowth(100, Infinity)).toBe(0);
      });
    });

    describe('calculatePercentageChange', () => {
      it('should return detailed change information', () => {
        const result = calculatePercentageChange(120, 100);
        expect(result.percentage).toBe(20);
        expect(result.direction).toBe('up');
        expect(result.isSignificant).toBe(true);
      });

      it('should identify insignificant changes', () => {
        const result = calculatePercentageChange(102, 100);
        expect(result.percentage).toBe(2);
        expect(result.direction).toBe('up');
        expect(result.isSignificant).toBe(false);
      });
    });
  });

  describe('Formatting functions', () => {
    describe('formatNumber', () => {
      it('should format large numbers with suffixes', () => {
        expect(formatNumber(1500)).toBe('1.5K');
        expect(formatNumber(1500000)).toBe('1.5M');
        expect(formatNumber(1500000000)).toBe('1.5B');
      });

      it('should handle small numbers', () => {
        expect(formatNumber(999)).toBe('999');
        expect(formatNumber(0)).toBe('0');
      });

      it('should handle negative numbers', () => {
        expect(formatNumber(-1500)).toBe('-1.5K');
      });

      it('should handle invalid inputs', () => {
        expect(formatNumber(NaN)).toBe('0');
        expect(formatNumber(Infinity)).toBe('0');
      });
    });

    describe('formatPercentage', () => {
      it('should format positive percentages', () => {
        expect(formatPercentage(25)).toBe('+25%');
      });

      it('should format negative percentages', () => {
        expect(formatPercentage(-15)).toBe('-15%');
      });

      it('should format zero', () => {
        expect(formatPercentage(0)).toBe('0%');
      });

      it('should handle invalid inputs', () => {
        expect(formatPercentage(NaN)).toBe('0%');
      });
    });

    describe('formatDuration', () => {
      it('should format minutes', () => {
        expect(formatDuration(30)).toBe('30 minutes');
        expect(formatDuration(1)).toBe('1 minute');
      });

      it('should format hours', () => {
        expect(formatDuration(90)).toBe('1h 30m');
        expect(formatDuration(120)).toBe('2 hours');
      });

      it('should format days', () => {
        expect(formatDuration(1440)).toBe('1 day');
        expect(formatDuration(1500)).toBe('1d 1h');
      });

      it('should handle invalid inputs', () => {
        expect(formatDuration(-10)).toBe('0 minutes');
        expect(formatDuration(NaN)).toBe('0 minutes');
      });
    });

    describe('formatRelativeDate', () => {
      it('should format recent times', () => {
        const fiveMinutesAgo = new Date('2024-01-15T11:55:00Z');
        expect(formatRelativeDate(fiveMinutesAgo)).toBe('5 minutes ago');
      });

      it('should format hours', () => {
        const twoHoursAgo = new Date('2024-01-15T10:00:00Z');
        expect(formatRelativeDate(twoHoursAgo)).toBe('2 hours ago');
      });

      it('should handle invalid dates', () => {
        expect(formatRelativeDate(new Date('invalid'))).toBe('Invalid date');
      });
    });
  });

  describe('Date range functions', () => {
    describe('getDateRange', () => {
      it('should get today range', () => {
        const { start, end } = getDateRange('today');
        expect(start.getHours()).toBe(0);
        expect(end.getHours()).toBe(23);
        expect(start.toDateString()).toBe(end.toDateString());
      });

      it('should get week range', () => {
        const { start, end } = getDateRange('week');
        expect(start.getDay()).toBe(0); // Sunday
        expect(end.getDay()).toBe(6); // Saturday
      });

      it('should get month range', () => {
        const { start, end } = getDateRange('month');
        expect(start.getDate()).toBe(1);
        expect(end.getMonth()).toBe(start.getMonth());
      });
    });

    describe('getCurrentPeriodBounds', () => {
      it('should get current day bounds', () => {
        const { start, end } = getCurrentPeriodBounds('day');
        expect(start.getHours()).toBe(0);
        expect(end.getHours()).toBe(23);
      });

      it('should get current week bounds', () => {
        const { start, end } = getCurrentPeriodBounds('week');
        expect(start.getDay()).toBe(0);
        expect(end.getDay()).toBe(6);
      });
    });

    describe('getPreviousPeriodBounds', () => {
      it('should get previous day bounds', () => {
        const { start, end } = getPreviousPeriodBounds('day');
        expect(start.getDate()).toBe(14); // Yesterday
        expect(end.getDate()).toBe(14);
      });

      it('should get previous week bounds', () => {
        const { start, end } = getPreviousPeriodBounds('week');
        expect(start.getDay()).toBe(0);
        expect(end.getDay()).toBe(6);
        expect(start.getDate()).toBe(7); // Previous Sunday
      });
    });
  });
});
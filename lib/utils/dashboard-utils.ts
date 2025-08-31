/**
 * Utility functions for dashboard data calculations and date filtering
 */

/**
 * Check if a date is within the current month
 */
export function isThisMonth(date: Date): boolean {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && 
         date.getMonth() === now.getMonth();
}

/**
 * Check if a date is within the previous month
 */
export function isLastMonth(date: Date): boolean {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
  return date.getFullYear() === lastMonth.getFullYear() && 
         date.getMonth() === lastMonth.getMonth();
}

/**
 * Check if a date is within the current week
 */
export function isThisWeek(date: Date): boolean {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return date >= startOfWeek && date <= endOfWeek;
}

/**
 * Check if a date is within the previous week
 */
export function isLastWeek(date: Date): boolean {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }
  const now = new Date();
  const startOfLastWeek = new Date(now);
  startOfLastWeek.setDate(now.getDate() - now.getDay() - 7);
  startOfLastWeek.setHours(0, 0, 0, 0);
  
  const endOfLastWeek = new Date(startOfLastWeek);
  endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
  endOfLastWeek.setHours(23, 59, 59, 999);
  
  return date >= startOfLastWeek && date <= endOfLastWeek;
}

/**
 * Check if a date is within the current year
 */
export function isThisYear(date: Date): boolean {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }
  const now = new Date();
  return date.getFullYear() === now.getFullYear();
}

/**
 * Check if a date is within the previous year
 */
export function isLastYear(date: Date): boolean {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }
  const now = new Date();
  return date.getFullYear() === now.getFullYear() - 1;
}

/**
 * Check if a date is within the last N days
 */
export function isWithinLastDays(date: Date, days: number): boolean {
  if (!date || !(date instanceof Date) || isNaN(date.getTime()) || days < 0) {
    return false;
  }
  const now = new Date();
  const cutoff = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
  return date >= cutoff && date <= now;
}

/**
 * Check if a date is within the last N hours
 */
export function isWithinLastHours(date: Date, hours: number): boolean {
  if (!date || !(date instanceof Date) || isNaN(date.getTime()) || hours < 0) {
    return false;
  }
  const now = new Date();
  const cutoff = new Date(now.getTime() - (hours * 60 * 60 * 1000));
  return date >= cutoff && date <= now;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }
  const now = new Date();
  return date.toDateString() === now.toDateString();
}

/**
 * Check if a date is yesterday
 */
export function isYesterday(date: Date): boolean {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return false;
  }
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
}

/**
 * Calculate growth percentage between current and previous values
 */
export function calculateGrowth(current: number, previous: number): number {
  // Validate inputs
  if (typeof current !== 'number' || typeof previous !== 'number' || 
      !isFinite(current) || !isFinite(previous)) {
    return 0;
  }
  
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  
  const growth = ((current - previous) / previous) * 100;
  return Math.round(growth);
}

/**
 * Calculate percentage change with more detailed handling
 */
export function calculatePercentageChange(current: number, previous: number): {
  percentage: number;
  direction: 'up' | 'down' | 'neutral';
  isSignificant: boolean;
} {
  const percentage = calculateGrowth(current, previous);
  const direction = percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral';
  const isSignificant = Math.abs(percentage) >= 5; // Consider 5% or more as significant
  
  return { percentage, direction, isSignificant };
}

/**
 * Format number with appropriate suffixes (K, M, B)
 */
export function formatNumber(num: number): string {
  if (typeof num !== 'number' || !isFinite(num)) {
    return '0';
  }
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum >= 1000000000) {
    return sign + (absNum / 1000000000).toFixed(1) + 'B';
  }
  if (absNum >= 1000000) {
    return sign + (absNum / 1000000).toFixed(1) + 'M';
  }
  if (absNum >= 1000) {
    return sign + (absNum / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Format percentage with appropriate sign and symbol
 */
export function formatPercentage(percentage: number): string {
  if (typeof percentage !== 'number' || !isFinite(percentage)) {
    return '0%';
  }
  
  const sign = percentage > 0 ? '+' : '';
  return `${sign}${percentage}%`;
}

/**
 * Format date for display in dashboard
 */
export function formatDate(date: Date, format: 'short' | 'medium' | 'long' | 'relative' = 'medium'): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    case 'medium':
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    case 'long':
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    case 'relative':
      return formatRelativeDate(date);
    default:
      return date.toLocaleDateString();
  }
}

/**
 * Format date relative to now (e.g., "2 hours ago", "yesterday")
 */
export function formatRelativeDate(date: Date): string {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) {
    return 'Just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months === 1 ? '' : 's'} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  }
}

/**
 * Format time duration in minutes to human readable format
 */
export function formatDuration(minutes: number): string {
  if (typeof minutes !== 'number' || !isFinite(minutes) || minutes < 0) {
    return '0 minutes';
  }
  
  if (minutes < 60) {
    return `${Math.round(minutes)} minute${Math.round(minutes) === 1 ? '' : 's'}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  
  if (hours < 24) {
    if (remainingMinutes === 0) {
      return `${hours} hour${hours === 1 ? '' : 's'}`;
    }
    return `${hours}h ${remainingMinutes}m`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  if (remainingHours === 0) {
    return `${days} day${days === 1 ? '' : 's'}`;
  }
  return `${days}d ${remainingHours}h`;
}

/**
 * Get date range for filtering (start and end of period)
 */
export function getDateRange(period: 'today' | 'yesterday' | 'week' | 'last-week' | 'month' | 'last-month' | 'year' | 'last-year'): { start: Date; end: Date } {
  const now = new Date();
  let start = new Date();
  let end = new Date();
  
  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'yesterday':
      start.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(now.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case 'last-week':
      start.setDate(now.getDate() - now.getDay() - 7);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(start.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'last-month':
      start.setMonth(now.getMonth() - 1, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(now.getMonth(), 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
    case 'last-year':
      start.setFullYear(now.getFullYear() - 1, 0, 1);
      start.setHours(0, 0, 0, 0);
      end.setFullYear(now.getFullYear() - 1, 11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }
  
  return { start, end };
}

/**
 * Get start and end of current period for comparison calculations
 */
export function getCurrentPeriodBounds(period: 'day' | 'week' | 'month' | 'year'): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date();
  const end = new Date();
  
  switch (period) {
    case 'day':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(start.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }
  
  return { start, end };
}

/**
 * Get previous period bounds for comparison calculations
 */
export function getPreviousPeriodBounds(period: 'day' | 'week' | 'month' | 'year'): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date();
  const end = new Date();
  
  switch (period) {
    case 'day':
      start.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(now.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week':
      start.setDate(now.getDate() - now.getDay() - 7);
      start.setHours(0, 0, 0, 0);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
      start.setMonth(now.getMonth() - 1, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(now.getMonth(), 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'year':
      start.setFullYear(now.getFullYear() - 1, 0, 1);
      start.setHours(0, 0, 0, 0);
      end.setFullYear(now.getFullYear() - 1, 11, 31);
      end.setHours(23, 59, 59, 999);
      break;
  }
  
  return { start, end };
}
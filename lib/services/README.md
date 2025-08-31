# Dashboard Data Services

This directory contains the data service layer for fetching real dashboard statistics from various sources including Sanity CMS, Supabase database, and AI usage logs.

## Services Overview

### BlogDataService (`blog-data.ts`)
Fetches blog statistics from Sanity CMS:
- Total published posts
- Posts published this month
- Growth percentage
- Recent blog activity
- Scheduled blog posts
- Top performing blog posts

### SocialDataService (`social-data.ts`)
Fetches social media data from Supabase:
- Total social posts
- Posts published this week
- Total engagement metrics
- Growth percentage
- Recent social activity
- Top performing social content
- Scheduled social posts

### NewsletterDataService (`newsletter-data.ts`)
Fetches newsletter data from Supabase:
- Total active subscribers
- New subscribers this month
- Growth percentage
- Recent newsletter campaigns
- Top performing campaigns
- Scheduled campaigns
- Subscriber growth trends

### AIUsageDataService (`ai-usage-data.ts`)
Fetches AI usage statistics from Supabase:
- Total content generated
- Tokens used
- Time saved estimation
- Recent AI activity
- Usage trends
- Cost savings estimation

## Usage

### Basic Usage

```typescript
import {
  blogDataService,
  socialDataService,
  newsletterDataService,
  aiUsageDataService
} from '@/lib/services/dashboard-data-services';

// Fetch blog statistics
const blogStats = await blogDataService.getBlogStats();
console.log(`Total posts: ${blogStats.totalPosts}`);

// Fetch social media statistics
const socialStats = await socialDataService.getSocialStats();
console.log(`Total engagement: ${socialStats.totalEngagement}`);

// Fetch newsletter statistics
const newsletterStats = await newsletterDataService.getNewsletterStats();
console.log(`Total subscribers: ${newsletterStats.totalSubscribers}`);

// Fetch AI usage statistics
const aiStats = await aiUsageDataService.getAIUsageStats();
console.log(`Content generated: ${aiStats.contentGenerated}`);
```

### Advanced Usage

```typescript
import { fetchDashboardData } from '@/lib/services/dashboard-data-example';

// Fetch all dashboard data in parallel
const dashboardData = await fetchDashboardData();

// Use the data in your components
const {
  blogStats,
  socialStats,
  newsletterStats,
  aiUsage,
  recentActivity,
  topPerformingContent
} = dashboardData;
```

### Error Handling

```typescript
import { fetchDashboardDataWithFallbacks } from '@/lib/services/dashboard-data-example';

// Fetch data with automatic fallbacks
const dashboardData = await fetchDashboardDataWithFallbacks();
// This will never throw - returns default values if APIs fail
```

## Utility Functions

The `dashboard-utils.ts` file provides helpful utility functions:

```typescript
import {
  isThisMonth,
  isThisWeek,
  calculateGrowth,
  formatNumber,
  getDateRange
} from '@/lib/utils/dashboard-utils';

// Check if a date is in the current month
const isCurrentMonth = isThisMonth(new Date());

// Calculate growth percentage
const growth = calculateGrowth(120, 100); // Returns 20

// Format large numbers
const formatted = formatNumber(1500); // Returns "1.5K"

// Get date range for filtering
const { start, end } = getDateRange('month');
```

## Type Definitions

All type definitions are available in `@/lib/types/dashboard`:

```typescript
import type {
  BlogStats,
  SocialStats,
  NewsletterStats,
  AIUsageStats,
  ActivityItem,
  PerformingContentItem,
  ScheduledItem,
  DashboardData
} from '@/lib/types/dashboard';
```

## Testing

Run the tests to verify all services are working correctly:

```bash
npx vitest run test/lib/services/dashboard-data-services.test.ts
```

## Requirements Mapping

This implementation satisfies the following requirements:

- **Requirement 1.1**: Blog post statistics from Sanity CMS ✅
- **Requirement 2.1**: Social media post counts from database ✅
- **Requirement 3.1**: Newsletter subscriber counts from database ✅
- **Requirement 7.1**: AI usage statistics from AI content log ✅

## Performance Considerations

- All services use parallel data fetching where possible
- Database queries are optimized with proper filtering
- Error handling prevents cascading failures
- Caching can be implemented at the hook level (see next tasks)

## Next Steps

The next tasks in the implementation plan will:
1. Create React hooks to consume these services
2. Add real-time data updates
3. Create dashboard components that use real data
4. Replace mock data in the main dashboard page
# Requirements Document

## Introduction

This feature will replace all mock/hardcoded data in the admin dashboard at `/admin` with real data from the database, APIs, and content management systems. The dashboard currently displays static numbers and placeholder content, but should show actual metrics like real blog post counts, social media engagement, newsletter subscriber numbers, and genuine recent activity from the system.

## Requirements

### Requirement 1

**User Story:** As a content administrator, I want to see real blog post statistics on the dashboard, so that I can track actual content performance and publication metrics.

#### Acceptance Criteria

1. WHEN an admin views the dashboard THEN the system SHALL display the actual count of published blog posts from Sanity CMS
2. WHEN an admin views blog post metrics THEN the system SHALL show real growth numbers compared to previous periods
3. WHEN blog post data is unavailable THEN the system SHALL display appropriate loading states or error messages
4. WHEN blog posts are published or unpublished THEN the dashboard metrics SHALL update to reflect current counts

### Requirement 2

**User Story:** As a social media manager, I want to see actual social media post counts and engagement metrics, so that I can monitor real social media performance.

#### Acceptance Criteria

1. WHEN an admin views the dashboard THEN the system SHALL display actual counts of social media posts from the database
2. WHEN social media metrics are shown THEN the system SHALL include real engagement data (likes, shares, comments) from API responses
3. WHEN social posts are created or published THEN the dashboard SHALL reflect updated counts immediately
4. WHEN engagement data is fetched THEN the system SHALL show real growth percentages compared to previous periods

### Requirement 3

**User Story:** As a marketing manager, I want to see real newsletter subscriber counts and engagement metrics, so that I can track actual email marketing performance.

#### Acceptance Criteria

1. WHEN an admin views the dashboard THEN the system SHALL display actual subscriber count from the database
2. WHEN newsletter metrics are shown THEN the system SHALL include real open rates, click rates, and subscriber growth from Brevo API
3. WHEN new subscribers join or unsubscribe THEN the dashboard SHALL update subscriber counts in real-time
4. WHEN newsletter campaigns are sent THEN the system SHALL update engagement metrics with actual data

### Requirement 4

**User Story:** As a content manager, I want to see real recent activity instead of placeholder text, so that I can monitor actual system activity and content updates.

#### Acceptance Criteria

1. WHEN an admin views recent activity THEN the system SHALL display actual recent blog posts, social posts, and newsletter activities from the database
2. WHEN content is published THEN the system SHALL add real entries to the recent activity feed with accurate timestamps
3. WHEN no recent activity exists THEN the system SHALL display an appropriate empty state message
4. WHEN activity items are clicked THEN the system SHALL navigate to the actual content items

### Requirement 5

**User Story:** As a content strategist, I want to see real top-performing content data, so that I can identify which content actually drives the most engagement.

#### Acceptance Criteria

1. WHEN an admin views top performing content THEN the system SHALL display actual blog posts and social posts ranked by real engagement metrics
2. WHEN performance data is calculated THEN the system SHALL use real view counts, likes, shares, and other engagement metrics
3. WHEN no performance data is available THEN the system SHALL display appropriate placeholder content with explanatory text
4. WHEN performance metrics are updated THEN the top performing content list SHALL refresh with current data

### Requirement 6

**User Story:** As a content scheduler, I want to see real upcoming scheduled content, so that I can manage actual planned publications.

#### Acceptance Criteria

1. WHEN an admin views upcoming scheduled content THEN the system SHALL display actual scheduled blog posts, social posts, and newsletters from the database
2. WHEN content is scheduled or rescheduled THEN the upcoming content list SHALL update to reflect real scheduling changes
3. WHEN scheduled content is published THEN the system SHALL remove it from the upcoming list and add it to recent activity
4. WHEN no content is scheduled THEN the system SHALL display an appropriate empty state with options to schedule content

### Requirement 7

**User Story:** As a system administrator, I want to see real AI usage statistics, so that I can monitor actual AI content generation usage and costs.

#### Acceptance Criteria

1. WHEN an admin views AI usage statistics THEN the system SHALL display actual token usage, content generation counts, and time saved metrics from the AI content log
2. WHEN AI content is generated THEN the system SHALL update usage statistics with real token consumption and generation counts
3. WHEN AI usage data is unavailable THEN the system SHALL display appropriate loading or error states
4. WHEN usage limits are approached THEN the system SHALL display warnings about approaching API limits

### Requirement 8

**User Story:** As a content administrator, I want real-time data updates on the dashboard, so that I can see current information without manually refreshing the page.

#### Acceptance Criteria

1. WHEN an admin has the dashboard open THEN the system SHALL periodically refresh data to show current metrics
2. WHEN data is being fetched THEN the system SHALL show appropriate loading indicators without disrupting the user experience
3. WHEN data fetching fails THEN the system SHALL display error messages and provide retry options
4. WHEN real-time updates occur THEN the system SHALL smoothly update the UI without jarring transitions
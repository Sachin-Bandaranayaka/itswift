# Enhanced Brevo Integration API

This document describes the enhanced Brevo integration service that provides subscriber synchronization, unsubscribe management, and error handling with retry logic.

## Overview

The enhanced Brevo integration service extends the existing email functionality with:

- **Subscriber Sync**: Automatically sync newsletter subscribers with Brevo contacts
- **Unsubscribe Management**: Handle unsubscribe requests and sync status with Brevo
- **Unsubscribe Link Generation**: Create secure unsubscribe links for email campaigns
- **Error Handling**: Robust retry logic with exponential backoff
- **Rate Limit Handling**: Intelligent handling of API rate limits

## Configuration

### Environment Variables

```bash
BREVO_API_KEY=your_brevo_api_key
BREVO_DEFAULT_LIST_ID=1
BREVO_RETRY_ATTEMPTS=3
BREVO_RETRY_DELAY=1000
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Service Initialization

```typescript
import { getBrevoService } from '../lib/integrations/brevo'

const brevoService = getBrevoService()
```

## API Methods

### syncSubscriber(subscriber: NewsletterSubscriber)

Synchronizes a newsletter subscriber with Brevo contacts.

**Parameters:**
- `subscriber`: NewsletterSubscriber object containing subscriber information

**Returns:**
```typescript
interface SyncResult {
  success: boolean
  brevo_contact_id?: string
  error?: string
  retry_after?: number // Seconds to wait before retry (for rate limits)
}
```

**Example:**
```typescript
const subscriber = {
  id: '123',
  email: 'user@example.com',
  first_name: 'John',
  last_name: 'Doe',
  status: 'active',
  subscribed_at: '2024-01-01T00:00:00Z',
  source: 'homepage'
}

const result = await brevoService.syncSubscriber(subscriber)
if (result.success) {
  console.log('Subscriber synced with Brevo ID:', result.brevo_contact_id)
} else {
  console.error('Sync failed:', result.error)
  if (result.retry_after) {
    console.log(`Retry after ${result.retry_after} seconds`)
  }
}
```

### syncUnsubscribe(email: string)

Synchronizes unsubscribe status with Brevo by removing the contact from all lists.

**Parameters:**
- `email`: Email address of the subscriber to unsubscribe

**Returns:**
```typescript
interface SyncResult {
  success: boolean
  error?: string
  retry_after?: number
}
```

**Example:**
```typescript
const result = await brevoService.syncUnsubscribe('user@example.com')
if (result.success) {
  console.log('Unsubscribe synced with Brevo')
} else {
  console.error('Unsubscribe sync failed:', result.error)
}
```

### createUnsubscribeLink(email: string, campaignId?: string)

Creates a secure unsubscribe link for email campaigns.

**Parameters:**
- `email`: Email address of the subscriber
- `campaignId`: Optional campaign ID for tracking

**Returns:**
- `Promise<string>`: Unsubscribe URL

**Example:**
```typescript
const unsubscribeLink = await brevoService.createUnsubscribeLink(
  'user@example.com',
  'campaign-123'
)
console.log('Unsubscribe link:', unsubscribeLink)
// Output: https://your-domain.com/unsubscribe?token=secure-token&campaign=campaign-123
```

## Error Handling

### Retry Logic

The service implements exponential backoff retry logic:

- **Default Retries**: 3 attempts
- **Default Delay**: 1000ms (1 second)
- **Backoff**: Each retry doubles the delay (1s, 2s, 4s)

### Rate Limiting

When rate limits are encountered:

- The service automatically retries with exponential backoff
- Returns `retry_after` field suggesting when to retry
- Identifies rate limit errors by message content

### Error Types

```typescript
// Network/Connection errors
{
  success: false,
  error: "Network error: Connection failed"
}

// API errors
{
  success: false,
  error: "HTTP 400: Invalid email format"
}

// Rate limiting
{
  success: false,
  error: "Rate limit exceeded",
  retry_after: 300 // 5 minutes
}

// Duplicate contact (handled automatically)
{
  success: true,
  brevo_contact_id: "789" // Updated existing contact
}
```

## Integration with Newsletter Service

### Automatic Sync on Subscription

```typescript
import { NewsletterSubscribersService } from '../lib/database/services/newsletter-subscribers'
import { getBrevoService } from '../lib/integrations/brevo'

// After creating a subscriber
const subscriber = await NewsletterSubscribersService.subscribeFromHomepage({
  email: 'user@example.com',
  first_name: 'John',
  last_name: 'Doe'
})

if (subscriber.success && subscriber.data) {
  // Sync with Brevo
  const brevoService = getBrevoService()
  const syncResult = await brevoService.syncSubscriber(subscriber.data)
  
  if (syncResult.success) {
    // Update subscriber with Brevo contact ID
    await NewsletterSubscribersService.update(subscriber.data.id, {
      brevo_contact_id: syncResult.brevo_contact_id,
      last_synced_at: new Date().toISOString()
    })
  }
}
```

### Automatic Sync on Unsubscribe

```typescript
// After unsubscribing a subscriber
const unsubscribeResult = await NewsletterSubscribersService.unsubscribeByToken(token)

if (unsubscribeResult.success) {
  // Sync unsubscribe with Brevo
  const brevoService = getBrevoService()
  await brevoService.syncUnsubscribe(email)
}
```

## Best Practices

### 1. Handle Sync Failures Gracefully

```typescript
const syncResult = await brevoService.syncSubscriber(subscriber)
if (!syncResult.success) {
  // Log error but don't fail the subscription
  console.error('Brevo sync failed:', syncResult.error)
  
  // Store subscriber locally even if Brevo sync fails
  // Implement background retry mechanism if needed
}
```

### 2. Respect Rate Limits

```typescript
const syncResult = await brevoService.syncSubscriber(subscriber)
if (!syncResult.success && syncResult.retry_after) {
  // Schedule retry after suggested time
  setTimeout(() => {
    brevoService.syncSubscriber(subscriber)
  }, syncResult.retry_after * 1000)
}
```

### 3. Batch Operations

For bulk operations, implement batching to avoid rate limits:

```typescript
const subscribers = await NewsletterSubscribersService.getAll()
const batchSize = 10
const delay = 1000 // 1 second between batches

for (let i = 0; i < subscribers.data.length; i += batchSize) {
  const batch = subscribers.data.slice(i, i + batchSize)
  
  await Promise.all(
    batch.map(subscriber => brevoService.syncSubscriber(subscriber))
  )
  
  // Wait between batches to respect rate limits
  if (i + batchSize < subscribers.data.length) {
    await new Promise(resolve => setTimeout(resolve, delay))
  }
}
```

## Testing

The service includes comprehensive tests covering:

- Successful sync operations
- Error handling and retries
- Rate limiting scenarios
- Duplicate contact handling
- Unsubscribe link generation

Run tests with:
```bash
npm test test/lib/integrations/brevo-enhanced.test.ts
npm test test/lib/integrations/brevo-helpers.test.ts
npm test test/integration/brevo-newsletter-integration.test.ts
```

## Monitoring

Monitor the integration with:

- **Success Rates**: Track sync success/failure ratios
- **Response Times**: Monitor API response times
- **Error Patterns**: Identify common error types
- **Rate Limit Events**: Track rate limiting occurrences

Example monitoring:
```typescript
const startTime = Date.now()
const result = await brevoService.syncSubscriber(subscriber)
const duration = Date.now() - startTime

// Log metrics
console.log({
  operation: 'sync_subscriber',
  success: result.success,
  duration,
  error: result.error,
  subscriber_id: subscriber.id
})
```
# Newsletter Subscribers Service - Enhanced Methods

This document describes the new methods added to the `NewsletterSubscribersService` class to support homepage newsletter signup and token-based unsubscribe functionality.

## New Methods

### 1. `subscribeFromHomepage(data: HomepageSubscriptionData): Promise<ServiceResult<NewsletterSubscriber>>`

Handles newsletter subscriptions from the homepage with source tracking and automatic reactivation of previously unsubscribed users.

**Features:**
- Validates email format
- Handles duplicate subscriptions gracefully
- Automatically reactivates unsubscribed users
- Generates secure unsubscribe tokens
- Tracks subscription source (homepage, admin, etc.)

**Parameters:**
```typescript
interface HomepageSubscriptionData {
  email: string
  first_name?: string
  last_name?: string
  source?: 'homepage' | 'admin' | 'import' | 'api'
}
```

**Returns:**
```typescript
interface ServiceResult<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
```

### 2. `generateUnsubscribeToken(subscriberId: string): Promise<string>`

Generates a secure unsubscribe token for a subscriber and updates their record.

**Features:**
- Creates cryptographically secure tokens
- Updates subscriber record with new token
- Uses subscriber ID and email for token generation

**Parameters:**
- `subscriberId`: The unique ID of the subscriber

**Returns:**
- Promise resolving to the generated token string

### 3. `reactivateSubscriber(email: string): Promise<ServiceResult<NewsletterSubscriber>>`

Reactivates a previously unsubscribed subscriber.

**Features:**
- Changes status from 'unsubscribed' to 'active'
- Clears unsubscribed_at timestamp
- Generates new unsubscribe token
- Resets sync status for Brevo integration

**Parameters:**
- `email`: The email address of the subscriber to reactivate

**Returns:**
- ServiceResult with updated subscriber data

### 4. `unsubscribeByToken(token: string): Promise<ServiceResult<boolean>>`

Unsubscribes a user using their secure unsubscribe token.

**Features:**
- Validates token format and existence
- Handles already unsubscribed users gracefully
- Updates subscriber status and timestamp
- Resets sync status for Brevo integration

**Parameters:**
- `token`: The secure unsubscribe token

**Returns:**
- ServiceResult indicating success/failure

### 5. `getByUnsubscribeToken(token: string): Promise<{ data: NewsletterSubscriber | null; error: string | null }>`

Retrieves a subscriber by their unsubscribe token.

**Features:**
- Finds subscriber by unique token
- Returns null for invalid tokens
- Handles database errors gracefully

**Parameters:**
- `token`: The unsubscribe token to search for

**Returns:**
- Object with subscriber data or null, and any error message

## Usage Examples

### Homepage Subscription
```typescript
const result = await NewsletterSubscribersService.subscribeFromHomepage({
  email: 'user@example.com',
  first_name: 'John',
  last_name: 'Doe',
  source: 'homepage'
})

if (result.success) {
  console.log('Subscription successful:', result.message)
  console.log('Subscriber:', result.data)
} else {
  console.error('Subscription failed:', result.error)
}
```

### Token-based Unsubscribe
```typescript
const result = await NewsletterSubscribersService.unsubscribeByToken(token)

if (result.success) {
  console.log('Unsubscribed successfully:', result.message)
} else {
  console.error('Unsubscribe failed:', result.error)
}
```

### Reactivating a Subscriber
```typescript
const result = await NewsletterSubscribersService.reactivateSubscriber('user@example.com')

if (result.success) {
  console.log('Subscriber reactivated:', result.data)
} else {
  console.error('Reactivation failed:', result.error)
}
```

## Database Schema Requirements

These methods require the following columns in the `newsletter_subscribers` table:
- `source`: VARCHAR(50) - tracks subscription source
- `unsubscribe_token`: VARCHAR(255) UNIQUE - secure unsubscribe token
- `brevo_contact_id`: VARCHAR(255) - Brevo integration ID
- `last_synced_at`: TIMESTAMP - last sync with Brevo

## Security Features

- **Secure Token Generation**: Uses cryptographic hashing with random data
- **Token Uniqueness**: Each subscriber has a unique unsubscribe token
- **Input Validation**: All inputs are validated and sanitized
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Integration Points

These methods are designed to work with:
- Homepage newsletter signup component
- Brevo email service integration
- Admin newsletter management interface
- Unsubscribe confirmation pages
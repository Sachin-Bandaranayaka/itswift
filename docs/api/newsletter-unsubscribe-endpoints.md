# Newsletter Unsubscribe API Endpoints

This document describes the API endpoints for the newsletter unsubscribe system.

## Overview

The unsubscribe system provides secure, token-based unsubscription from newsletters with the ability to resubscribe. It includes both API endpoints and a user-friendly web interface.

## Endpoints

### GET /api/newsletter/unsubscribe

Handles unsubscribe requests from email links and redirects to the unsubscribe confirmation page.

**Parameters:**
- `token` (query parameter, required): The unsubscribe token from the email link

**Responses:**
- `307 Redirect`: Redirects to `/unsubscribe?token={token}` for valid tokens
- `307 Redirect`: Redirects to `/unsubscribe?error={error_type}` for errors

**Error Types:**
- `missing_token`: No token provided in the request
- `invalid_token`: Token is invalid or expired
- `server_error`: Internal server error occurred

**Example:**
```
GET /api/newsletter/unsubscribe?token=abc123xyz
→ Redirects to /unsubscribe?token=abc123xyz
```

### POST /api/newsletter/unsubscribe

Processes unsubscribe confirmations from the web interface.

**Request Body:**
```json
{
  "token": "string (required)",
  "confirmed": "boolean (required)"
}
```

**Responses:**

**Success (200):**
```json
{
  "success": true,
  "message": "Successfully unsubscribed from newsletter"
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Error message"
}
```

**Error (500):**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

**Example:**
```bash
curl -X POST /api/newsletter/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{"token": "abc123xyz", "confirmed": true}'
```

### GET /api/newsletter/subscriber-by-token

Retrieves subscriber information by unsubscribe token (used for resubscribe functionality).

**Parameters:**
- `token` (query parameter, required): The unsubscribe token

**Responses:**

**Success (200):**
```json
{
  "success": true,
  "subscriber": {
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "status": "unsubscribed"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "error": "Missing token parameter"
}
```

**Error (404):**
```json
{
  "success": false,
  "error": "Invalid or expired token"
}
```

**Error (500):**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

**Example:**
```bash
curl /api/newsletter/subscriber-by-token?token=abc123xyz
```

## Web Interface

### /unsubscribe

The unsubscribe confirmation page provides a user-friendly interface for managing newsletter subscriptions.

**URL Parameters:**
- `token`: The unsubscribe token (required for unsubscribe functionality)
- `error`: Error type for displaying error messages

**Features:**
- Unsubscribe confirmation with clear messaging
- Resubscribe option for users who change their mind
- Error handling with user-friendly messages
- Responsive design and accessibility compliance

## Security Features

### Token-Based Security
- Cryptographically secure unsubscribe tokens
- Tokens are unique per subscriber and tied to their email
- Tokens are validated on every request

### Input Validation
- All inputs are validated and sanitized
- Proper error handling for malformed requests
- Rate limiting protection (inherited from application-level middleware)

### Privacy Protection
- Subscriber information is filtered to exclude sensitive data
- Tokens are not exposed in client-side code
- Secure token generation and validation

## Error Handling

### Client-Side Errors
- Form validation with real-time feedback
- Network error handling with retry options
- User-friendly error messages

### Server-Side Errors
- Comprehensive error logging
- Graceful degradation for service failures
- Consistent error response format

## Integration with Newsletter System

### Database Updates
- Subscriber status changes are immediately reflected in the database
- Unsubscribe timestamps are recorded for analytics
- Sync status is reset to trigger external service updates

### Brevo Integration
- Unsubscribe status is synchronized with Brevo (when configured)
- Resubscribe actions trigger re-sync with external services
- Graceful fallback when external services are unavailable

## Testing

### Unit Tests
- API endpoint request/response handling
- Input validation and error cases
- Service method functionality

### Integration Tests
- Complete unsubscribe flow testing
- Resubscribe functionality
- Token validation and security

### Manual Testing
Use the provided test script:
```bash
node scripts/test-newsletter-unsubscribe-api.js
```

## Usage Examples

### Email Template Integration
Include unsubscribe links in your email templates:
```html
<a href="https://yourdomain.com/api/newsletter/unsubscribe?token={{unsubscribe_token}}">
  Unsubscribe from this newsletter
</a>
```

### Programmatic Unsubscribe
```javascript
// Unsubscribe a user programmatically
const result = await NewsletterSubscribersService.unsubscribeByToken(token)
if (result.success) {
  console.log('User unsubscribed successfully')
}
```

### Resubscribe Flow
```javascript
// Get subscriber info for resubscribe
const subscriber = await NewsletterSubscribersService.getByUnsubscribeToken(token)
if (subscriber.data) {
  // Reactivate subscription
  const result = await NewsletterSubscribersService.reactivateSubscriber(subscriber.data.email)
}
```

## Monitoring and Analytics

### Metrics to Track
- Unsubscribe rate by source
- Resubscribe rate
- Token validation failures
- API response times

### Logging
- All unsubscribe/resubscribe events are logged
- Error conditions are tracked for debugging
- Performance metrics are collected

## Compliance

### GDPR Compliance
- Right to be forgotten is implemented through unsubscribe
- User consent is properly managed
- Data retention policies are followed

### CAN-SPAM Compliance
- One-click unsubscribe functionality
- Clear unsubscribe process
- Immediate processing of unsubscribe requests
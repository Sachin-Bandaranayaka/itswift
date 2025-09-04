# Implementation Plan

- [x] 1. Set up database schema enhancements and core utilities
  - Add new columns to newsletter_subscribers table for source tracking, unsubscribe tokens, and Brevo sync
  - Create database migration script with proper indexing
  - Update database types and interfaces to include new fields
  - _Requirements: 1.3, 5.1, 6.2_

- [ ] 2. Create public newsletter subscription API endpoint
  - Implement POST /api/newsletter/subscribe endpoint with validation
  - Add email format validation and duplicate handling
  - Include proper error responses and success confirmations
  - Add CORS headers for frontend integration
  - _Requirements: 1.1, 1.4, 1.5, 7.1, 7.3_

- [x] 3. Enhance newsletter subscribers service with new methods
  - Add subscribeFromHomepage method with source tracking
  - Implement generateUnsubscribeToken method for secure unsubscribe links
  - Create reactivateSubscriber method for handling re-subscriptions
  - Add unsubscribeByToken method for token-based unsubscription
  - _Requirements: 1.3, 6.1, 6.4, 6.5_

- [x] 4. Build newsletter signup component for homepage
  - Create NewsletterSignup component with email and optional name fields
  - Implement form validation with real-time feedback
  - Add loading states and success/error messaging
  - Ensure responsive design and accessibility compliance
  - _Requirements: 1.1, 1.2, 1.5, 2.1, 2.2_

- [x] 5. Integrate newsletter signup component into homepage
  - Add NewsletterSignup component to the bottom of the homepage
  - Position component appropriately in the existing layout
  - Ensure proper styling that matches the site design
  - Test component functionality and user experience
  - _Requirements: 1.1, 2.3_

- [x] 6. Create unsubscribe system with public endpoints
  - Implement GET /api/newsletter/unsubscribe endpoint for email links
  - Create POST /api/newsletter/unsubscribe endpoint for confirmations
  - Build unsubscribe confirmation page with user-friendly interface
  - Add resubscribe option on unsubscribe page
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 7. Enhance Brevo integration service for subscriber sync
  - Add syncSubscriber method to sync new subscribers with Brevo
  - Implement syncUnsubscribe method for unsubscribe status updates
  - Create createUnsubscribeLink method for email campaign links
  - Add error handling and retry logic for Brevo API failures
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 8. Update admin newsletter management to include homepage subscribers
  - Modify subscriber list queries to include all sources
  - Add source filtering in admin interface
  - Update export functionality to include all subscribers
  - Ensure search functionality works across all subscriber sources
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 9. Integrate newsletter campaigns with complete subscriber base
  - Update campaign sending logic to include all active subscribers
  - Ensure Brevo delivery includes homepage subscribers
  - Add proper unsubscribe links to all newsletter emails
  - Update campaign analytics to track all subscriber sources
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 10. Add comprehensive error handling and validation
  - Implement proper error responses for all API endpoints
  - Add client-side validation with user-friendly error messages
  - Create fallback mechanisms for Brevo service failures
  - Add logging and monitoring for subscription and unsubscription events
  - _Requirements: 1.6, 5.3, 7.2, 7.4_

- [x] 11. Create comprehensive test suite for newsletter functionality
  - Write unit tests for newsletter signup component
  - Create integration tests for subscription and unsubscription APIs
  - Add tests for Brevo integration service methods
  - Implement end-to-end tests for complete subscription flow
  - _Requirements: 1.1, 1.4, 1.5, 6.1, 6.3_

- [x] 12. Implement security measures and performance optimizations
  - Add rate limiting to subscription endpoints
  - Implement secure token generation for unsubscribe links
  - Add database indexing for optimal query performance
  - Create caching strategy for frequently accessed subscriber data
  - _Requirements: 5.4, 6.2, 7.5_
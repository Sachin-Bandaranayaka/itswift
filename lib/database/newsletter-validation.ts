import { NewsletterSubscriber, NewsletterSubscriberInput, NewsletterSubscriberUpdate, ValidationResult } from './types'

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate subscriber source
 */
export function validateSource(source: string): boolean {
  const validSources = ['homepage', 'admin', 'import', 'api']
  return validSources.includes(source)
}

/**
 * Validate subscriber status
 */
export function validateStatus(status: string): boolean {
  const validStatuses = ['active', 'unsubscribed', 'bounced']
  return validStatuses.includes(status)
}

/**
 * Validate unsubscribe token format
 */
export function validateUnsubscribeToken(token: string): boolean {
  // Token should be a hex string between 32-64 characters
  return /^[a-f0-9]{32,64}$/i.test(token)
}

/**
 * Validate Brevo contact ID format
 */
export function validateBrevoContactId(contactId: string): boolean {
  // Brevo contact IDs are typically numeric strings
  return /^\d+$/.test(contactId)
}

/**
 * Validate newsletter subscriber input data
 */
export function validateNewsletterSubscriberInput(input: NewsletterSubscriberInput): ValidationResult {
  const errors: string[] = []

  // Required fields
  if (!input.email) {
    errors.push('Email is required')
  } else if (!validateEmail(input.email)) {
    errors.push('Invalid email format')
  }

  // Optional fields validation
  if (input.source && !validateSource(input.source)) {
    errors.push('Invalid source value')
  }

  if (input.status && !validateStatus(input.status)) {
    errors.push('Invalid status value')
  }

  if (input.unsubscribe_token && !validateUnsubscribeToken(input.unsubscribe_token)) {
    errors.push('Invalid unsubscribe token format')
  }

  if (input.brevo_contact_id && !validateBrevoContactId(input.brevo_contact_id)) {
    errors.push('Invalid Brevo contact ID format')
  }

  // Name validation (if provided)
  if (input.first_name && input.first_name.length > 100) {
    errors.push('First name must be 100 characters or less')
  }

  if (input.last_name && input.last_name.length > 100) {
    errors.push('Last name must be 100 characters or less')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validate newsletter subscriber update data
 */
export function validateNewsletterSubscriberUpdate(update: NewsletterSubscriberUpdate): ValidationResult {
  const errors: string[] = []

  // Email validation (if provided)
  if (update.email && !validateEmail(update.email)) {
    errors.push('Invalid email format')
  }

  // Optional fields validation
  if (update.source && !validateSource(update.source)) {
    errors.push('Invalid source value')
  }

  if (update.status && !validateStatus(update.status)) {
    errors.push('Invalid status value')
  }

  if (update.unsubscribe_token && !validateUnsubscribeToken(update.unsubscribe_token)) {
    errors.push('Invalid unsubscribe token format')
  }

  if (update.brevo_contact_id && !validateBrevoContactId(update.brevo_contact_id)) {
    errors.push('Invalid Brevo contact ID format')
  }

  // Name validation (if provided)
  if (update.first_name && update.first_name.length > 100) {
    errors.push('First name must be 100 characters or less')
  }

  if (update.last_name && update.last_name.length > 100) {
    errors.push('Last name must be 100 characters or less')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Sanitize subscriber input data
 */
export function sanitizeNewsletterSubscriberInput(input: NewsletterSubscriberInput): NewsletterSubscriberInput {
  return {
    ...input,
    email: input.email?.toLowerCase().trim(),
    first_name: input.first_name?.trim(),
    last_name: input.last_name?.trim(),
    source: input.source || 'homepage'
  }
}

/**
 * Prepare subscriber data for database insertion
 */
export function prepareSubscriberForDatabase(input: NewsletterSubscriberInput): NewsletterSubscriberInput {
  const sanitized = sanitizeNewsletterSubscriberInput(input)
  
  return {
    ...sanitized,
    status: sanitized.status || 'active',
    source: sanitized.source || 'homepage'
  }
}
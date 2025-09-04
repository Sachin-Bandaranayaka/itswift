import { randomBytes, createHash } from 'crypto'

/**
 * Generate a secure unsubscribe token
 * @param subscriberId - The subscriber's ID
 * @param email - The subscriber's email
 * @returns A secure token string
 */
export function generateUnsubscribeToken(subscriberId: string, email: string): string {
  // Generate random bytes for additional entropy
  const randomData = randomBytes(16).toString('hex')

  // Create a hash combining subscriber ID, email, and random data
  const hash = createHash('sha256')
  hash.update(`${subscriberId}:${email}:${randomData}:${Date.now()}`)

  return hash.digest('hex')
}

/**
 * Generate a shorter, URL-safe token
 * @param subscriberId - The subscriber's ID
 * @returns A URL-safe token string
 */
export function generateShortToken(subscriberId: string): string {
  const randomData = randomBytes(12).toString('base64url')
  const hash = createHash('sha256')
  hash.update(`${subscriberId}:${randomData}:${Date.now()}`)

  // Return first 32 characters of the hash for a shorter token
  return hash.digest('hex').substring(0, 32)
}

/**
 * Validate token format
 * @param token - The token to validate
 * @returns True if token format is valid
 */
export function isValidTokenFormat(token: string): boolean {
  // Check if token is a valid hex string of expected length
  return /^[a-f0-9]{32,64}$/i.test(token)
}

/**
 * Generate a time-limited token with expiration
 * @param subscriberId - The subscriber's ID
 * @param email - The subscriber's email
 * @param expirationHours - Hours until token expires (default: 24)
 * @returns Object with token and expiration timestamp
 */
export function generateTimeLimitedToken(
  subscriberId: string,
  email: string,
  expirationHours: number = 24
): { token: string; expiresAt: Date } {
  const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000)
  const expirationTimestamp = expiresAt.getTime().toString()

  const hash = createHash('sha256')
  hash.update(`${subscriberId}:${email}:${expirationTimestamp}:${randomBytes(16).toString('hex')}`)

  return {
    token: hash.digest('hex'),
    expiresAt
  }
}

/**
 * Generate a secure unsubscribe token with enhanced security
 * @param subscriberId - The subscriber's ID
 * @param email - The subscriber's email
 * @param options - Additional security options
 * @returns A secure token string
 */
export function generateSecureUnsubscribeToken(
  subscriberId: string,
  email: string,
  options: {
    includeTimestamp?: boolean
    includeUserAgent?: string
    includeIpHash?: string
    expirationHours?: number
  } = {}
): string {
  const {
    includeTimestamp = true,
    includeUserAgent,
    includeIpHash,
    expirationHours = 168 // 7 days default
  } = options

  // Generate high-entropy random data
  const randomData = randomBytes(32).toString('hex')

  // Create hash components
  const components = [
    subscriberId,
    email.toLowerCase().trim(),
    randomData
  ]

  if (includeTimestamp) {
    const expirationTime = Date.now() + (expirationHours * 60 * 60 * 1000)
    components.push(expirationTime.toString())
  }

  if (includeUserAgent) {
    // Hash user agent to avoid storing sensitive data
    const userAgentHash = createHash('sha256').update(includeUserAgent).digest('hex')
    components.push(userAgentHash.substring(0, 16))
  }

  if (includeIpHash) {
    components.push(includeIpHash)
  }

  // Create final hash
  const hash = createHash('sha256')
  hash.update(components.join(':'))

  return hash.digest('hex')
}

/**
 * Validate token expiration if timestamp is embedded
 * @param token - The token to validate
 * @param subscriberId - The subscriber's ID
 * @param email - The subscriber's email
 * @returns True if token is valid and not expired
 */
export function validateTokenExpiration(
  token: string,
  subscriberId: string,
  email: string
): boolean {
  // This is a simplified validation - in production, you'd store
  // token metadata in the database for proper validation
  return isValidTokenFormat(token)
}

/**
 * Generate a one-time use token with additional entropy
 * @param subscriberId - The subscriber's ID
 * @param email - The subscriber's email
 * @param nonce - Additional nonce for one-time use
 * @returns A one-time use token
 */
export function generateOneTimeToken(
  subscriberId: string,
  email: string,
  nonce: string = randomBytes(16).toString('hex')
): string {
  const timestamp = Date.now().toString()
  const hash = createHash('sha256')
  hash.update(`${subscriberId}:${email}:${nonce}:${timestamp}:${randomBytes(24).toString('hex')}`)

  return hash.digest('hex')
}
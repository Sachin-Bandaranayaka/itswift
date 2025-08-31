import crypto from 'crypto'

/**
 * Encrypt sensitive data using AES-256-GCM
 */
export function encryptApiKey(apiKey: string, masterKey?: string): {
  encrypted: string
  iv: string
  tag: string
} {
  const key = masterKey || process.env.ENCRYPTION_KEY
  
  if (!key) {
    throw new Error('Encryption key not configured')
  }

  // Generate a random initialization vector
  const iv = crypto.randomBytes(16)
  
  // Create cipher
  const cipher = crypto.createCipher('aes-256-gcm', key)
  cipher.setAAD(Buffer.from('api-key', 'utf8'))
  
  // Encrypt the API key
  let encrypted = cipher.update(apiKey, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  // Get the authentication tag
  const tag = cipher.getAuthTag()

  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
  }
}

/**
 * Decrypt API key
 */
export function decryptApiKey(
  encryptedData: { encrypted: string; iv: string; tag: string },
  masterKey?: string
): string {
  const key = masterKey || process.env.ENCRYPTION_KEY
  
  if (!key) {
    throw new Error('Encryption key not configured')
  }

  try {
    // Create decipher
    const decipher = crypto.createDecipher('aes-256-gcm', key)
    decipher.setAAD(Buffer.from('api-key', 'utf8'))
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'))

    // Decrypt the API key
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    throw new Error('Failed to decrypt API key')
  }
}

/**
 * Mask API key for display purposes
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) {
    return '***'
  }

  const start = apiKey.substring(0, 4)
  const end = apiKey.substring(apiKey.length - 4)
  const middle = '*'.repeat(Math.max(4, apiKey.length - 8))

  return `${start}${middle}${end}`
}

/**
 * Validate API key format and strength
 */
export function validateApiKeyFormat(apiKey: string, service: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!apiKey || apiKey.trim().length === 0) {
    errors.push('API key cannot be empty')
    return { valid: false, errors }
  }

  // Service-specific validation
  switch (service.toLowerCase()) {
    case 'openai':
      if (!apiKey.startsWith('sk-')) {
        errors.push('OpenAI API key must start with "sk-"')
      }
      if (apiKey.length !== 51) {
        errors.push('OpenAI API key must be 51 characters long')
      }
      break

    case 'brevo':
      if (!apiKey.startsWith('xkeysib-')) {
        errors.push('Brevo API key must start with "xkeysib-"')
      }
      if (apiKey.length !== 89) {
        errors.push('Brevo API key must be 89 characters long')
      }
      break

    case 'linkedin':
      if (apiKey.length < 16) {
        errors.push('LinkedIn API key must be at least 16 characters long')
      }
      break

    case 'twitter':
      if (apiKey.length < 25) {
        errors.push('Twitter API key must be at least 25 characters long')
      }
      break

    default:
      if (apiKey.length < 16) {
        errors.push('API key must be at least 16 characters long')
      }
  }

  // Check for common patterns that might indicate a fake or test key
  const suspiciousPatterns = [
    /^(test|demo|example|sample)/i,
    /^(your_|my_|api_key)/i,
    /^(123|abc|xxx)/i,
  ]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(apiKey)) {
      errors.push('API key appears to be a placeholder or test value')
      break
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Generate a secure random API key (for internal use)
 */
export function generateSecureApiKey(length: number = 32): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += charset.charAt(crypto.randomInt(0, charset.length))
  }
  
  return result
}

/**
 * Check if API key has been compromised (basic checks)
 */
export function checkApiKeyCompromise(apiKey: string): {
  compromised: boolean
  reasons: string[]
} {
  const reasons: string[] = []

  // Check against known compromised patterns (in production, use external service)
  const knownCompromisedPatterns = [
    // Add patterns of known compromised keys
  ]

  for (const pattern of knownCompromisedPatterns) {
    if (apiKey.includes(pattern)) {
      reasons.push('API key matches known compromised pattern')
      break
    }
  }

  // Check for keys that are too simple
  if (/^(.)\1+$/.test(apiKey)) {
    reasons.push('API key consists of repeated characters')
  }

  if (/^(012|123|abc|xyz)/i.test(apiKey)) {
    reasons.push('API key appears to be sequential or predictable')
  }

  return {
    compromised: reasons.length > 0,
    reasons,
  }
}

/**
 * Rotate API key (generate new one and invalidate old)
 */
export function rotateApiKey(currentKey: string): {
  newKey: string
  rotationId: string
  timestamp: string
} {
  const newKey = generateSecureApiKey()
  const rotationId = crypto.randomUUID()
  const timestamp = new Date().toISOString()

  // In production, you would:
  // 1. Store the new key securely
  // 2. Mark the old key for deprecation
  // 3. Log the rotation event
  // 4. Notify relevant systems

  console.log('API Key Rotation:', {
    rotationId,
    timestamp,
    oldKeyMask: maskApiKey(currentKey),
    newKeyMask: maskApiKey(newKey),
  })

  return {
    newKey,
    rotationId,
    timestamp,
  }
}

/**
 * Get API key usage statistics (mock implementation)
 */
export function getApiKeyUsage(apiKey: string, timeframe: 'day' | 'week' | 'month' = 'day'): {
  requests: number
  errors: number
  lastUsed: string | null
  quotaUsed: number
  quotaLimit: number
} {
  // In production, this would query actual usage data
  return {
    requests: Math.floor(Math.random() * 1000),
    errors: Math.floor(Math.random() * 10),
    lastUsed: new Date().toISOString(),
    quotaUsed: Math.floor(Math.random() * 80),
    quotaLimit: 100,
  }
}

/**
 * Secure environment variable management
 */
export class SecureEnvManager {
  private static instance: SecureEnvManager
  private encryptedVars: Map<string, { encrypted: string; iv: string; tag: string }> = new Map()

  private constructor() {}

  static getInstance(): SecureEnvManager {
    if (!SecureEnvManager.instance) {
      SecureEnvManager.instance = new SecureEnvManager()
    }
    return SecureEnvManager.instance
  }

  /**
   * Store encrypted environment variable
   */
  setSecureVar(key: string, value: string): void {
    const encrypted = encryptApiKey(value)
    this.encryptedVars.set(key, encrypted)
  }

  /**
   * Retrieve and decrypt environment variable
   */
  getSecureVar(key: string): string | null {
    const encrypted = this.encryptedVars.get(key)
    if (!encrypted) {
      return process.env[key] || null
    }

    try {
      return decryptApiKey(encrypted)
    } catch (error) {
      console.error(`Failed to decrypt environment variable: ${key}`)
      return null
    }
  }

  /**
   * List all secure variables (masked)
   */
  listSecureVars(): Array<{ key: string; masked: string; encrypted: boolean }> {
    const result: Array<{ key: string; masked: string; encrypted: boolean }> = []

    // Add encrypted variables
    for (const [key] of this.encryptedVars) {
      const value = this.getSecureVar(key)
      result.push({
        key,
        masked: value ? maskApiKey(value) : '***',
        encrypted: true,
      })
    }

    // Add regular environment variables (API keys only)
    const apiKeyPatterns = [
      /API_KEY$/i,
      /SECRET$/i,
      /TOKEN$/i,
      /PASSWORD$/i,
    ]

    for (const [key, value] of Object.entries(process.env)) {
      if (apiKeyPatterns.some(pattern => pattern.test(key)) && !this.encryptedVars.has(key)) {
        result.push({
          key,
          masked: value ? maskApiKey(value) : '***',
          encrypted: false,
        })
      }
    }

    return result.sort((a, b) => a.key.localeCompare(b.key))
  }
}
#!/usr/bin/env node

const bcrypt = require('bcryptjs')
const crypto = require('crypto')

async function generatePasswordHash() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    console.log('Usage: node scripts/generate-password-hash.js <password>')
    console.log('Example: node scripts/generate-password-hash.js mySecurePassword123!')
    process.exit(1)
  }

  const password = args[0]
  
  // Validate password strength
  const errors = []
  if (password.length < 8) errors.push('At least 8 characters')
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter')
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter')
  if (!/\d/.test(password)) errors.push('One number')
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('One special character')

  if (errors.length > 0) {
    console.error('Password does not meet security requirements:')
    errors.forEach(error => console.error(`- ${error}`))
    process.exit(1)
  }

  try {
    console.log('Generating secure password hash...')
    
    const saltRounds = 12
    const hash = await bcrypt.hash(password, saltRounds)
    
    console.log('\n✅ Password hash generated successfully!')
    console.log('\nAdd this to your .env file:')
    console.log(`ADMIN_PASSWORD_HASH=${hash}`)
    
    // Also generate encryption key if needed
    const encryptionKey = crypto.randomBytes(32).toString('hex')
    console.log(`ENCRYPTION_KEY=${encryptionKey}`)
    
    console.log('\n⚠️  Security Notes:')
    console.log('- Keep these values secure and never commit them to version control')
    console.log('- The encryption key is used to encrypt API keys in the database')
    console.log('- Change the default NEXTAUTH_SECRET as well')
    
  } catch (error) {
    console.error('Error generating password hash:', error)
    process.exit(1)
  }
}

generatePasswordHash()
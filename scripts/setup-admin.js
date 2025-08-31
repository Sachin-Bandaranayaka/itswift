#!/usr/bin/env node

/**
 * Setup script to generate admin password hash
 * Usage: node scripts/setup-admin.js [password]
 */

const bcrypt = require('bcryptjs')
const crypto = require('crypto')

async function setupAdmin() {
  const args = process.argv.slice(2)
  let password = args[0]

  if (!password) {
    // Generate a secure random password
    password = crypto.randomBytes(16).toString('hex')
    console.log('Generated secure password:', password)
    console.log('Please save this password securely!')
    console.log('')
  }

  try {
    const saltRounds = 12
    const hash = await bcrypt.hash(password, saltRounds)
    
    console.log('Add these to your .env.local file:')
    console.log('')
    console.log(`ADMIN_USERNAME=admin`)
    console.log(`ADMIN_PASSWORD_HASH=${hash}`)
    console.log(`NEXTAUTH_SECRET=${crypto.randomBytes(32).toString('hex')}`)
    console.log('')
    console.log('Admin setup complete!')
    
  } catch (error) {
    console.error('Error generating password hash:', error)
    process.exit(1)
  }
}

setupAdmin()
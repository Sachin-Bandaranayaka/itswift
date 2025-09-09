#!/usr/bin/env node

/**
 * Buffer API Setup Script
 * Run this after getting your Buffer access token to get profile IDs
 */

const BUFFER_ACCESS_TOKEN = process.env.BUFFER_ACCESS_TOKEN || 'YOUR_TOKEN_HERE';

async function getBufferProfiles() {
  try {
    console.log('🔍 Fetching Buffer profiles...\n');
    
    const response = await fetch('https://api.bufferapp.com/1/profiles.json', {
      headers: {
        'Authorization': `Bearer ${BUFFER_ACCESS_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const profiles = await response.json();
    
    console.log('📱 Your connected social media profiles:\n');
    
    profiles.forEach(profile => {
      console.log(`Platform: ${profile.service}`);
      console.log(`Name: ${profile.formatted_username || profile.username}`);
      console.log(`Profile ID: ${profile.id}`);
      console.log(`Status: ${profile.schedules_count > 0 ? 'Active' : 'Connected'}`);
      console.log('---');
    });

    console.log('\n📝 Add these to your .env.local file:');
    console.log('BUFFER_ACCESS_TOKEN=' + BUFFER_ACCESS_TOKEN);
    
    const linkedinProfile = profiles.find(p => p.service === 'linkedin');
    const twitterProfile = profiles.find(p => p.service === 'twitter');
    
    if (linkedinProfile) {
      console.log(`BUFFER_LINKEDIN_PROFILE_ID=${linkedinProfile.id}`);
    }
    if (twitterProfile) {
      console.log(`BUFFER_TWITTER_PROFILE_ID=${twitterProfile.id}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure you:');
    console.log('1. Have a valid Buffer access token');
    console.log('2. Connected your social media accounts in Buffer');
    console.log('3. Set BUFFER_ACCESS_TOKEN environment variable');
  }
}

// Run the script
getBufferProfiles();
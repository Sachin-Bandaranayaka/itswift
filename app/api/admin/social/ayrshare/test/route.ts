import { NextRequest, NextResponse } from 'next/server'
import { AyrshareAPI } from '@/lib/integrations/ayrshare'

export async function GET(request: NextRequest) {
  try {
    const ayrshare = new AyrshareAPI()
    
    // Test connection and get user info
    const user = await ayrshare.getUser()
    
    return NextResponse.json({
      success: true,
      message: 'Ayrshare API connection successful!',
      connectedPlatforms: user.activeSocialAccounts || [],
      accountDetails: user.displayNames || [],
      monthlyQuota: {
        used: user.monthlyPostCount || 0,
        limit: user.monthlyPostQuota || 0,
        remaining: (user.monthlyPostQuota || 0) - (user.monthlyPostCount || 0)
      }
    })
  } catch (error) {
    console.error('Ayrshare test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to connect to Ayrshare API. Check your API key.'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const ayrshare = new AyrshareAPI()
    
    // Send a test post
    const result = await ayrshare.createPost({
      content: `Test post from CMS - ${new Date().toLocaleString()}`,
      platforms: ['linkedin', 'twitter']
    })
    
    return NextResponse.json({
      success: true,
      message: 'Test post sent successfully!',
      result
    })
  } catch (error) {
    console.error('Ayrshare post test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
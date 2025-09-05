import { NextRequest, NextResponse } from 'next/server'
import { createLinkedInAPI } from '@/lib/integrations/linkedin'

export async function GET(request: NextRequest) {
    try {
        const linkedinAPI = createLinkedInAPI()
        const token = process.env.LINKEDIN_ACCESS_TOKEN

        if (!token) {
            return NextResponse.json({ error: 'No LinkedIn token found' }, { status: 400 })
        }

        // Test 1: Check token validity
        console.log('Testing LinkedIn token...')
        
        // Test 2: Try to get profile info
        try {
            const profileResponse = await fetch('https://api.linkedin.com/v2/people/~', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            
            console.log('Profile response status:', profileResponse.status)
            const profileText = await profileResponse.text()
            console.log('Profile response:', profileText)

            // Test 3: Try a simple post to see what happens
            const testPostData = {
                author: 'urn:li:member:~',
                commentary: 'Test post from API',
                visibility: 'PUBLIC',
                lifecycleState: 'PUBLISHED'
            }

            const postTestResponse = await fetch('https://api.linkedin.com/v2/posts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'LinkedIn-Version': '202401'
                },
                body: JSON.stringify(testPostData)
            })

            const postTestText = await postTestResponse.text()
            console.log('Post test response:', postTestResponse.status, postTestText)
            
            if (profileResponse.ok) {
                const profile = JSON.parse(profileText)
                return NextResponse.json({
                    success: true,
                    profile,
                    token: token.substring(0, 20) + '...',
                    message: 'Token is valid and profile retrieved',
                    postTest: {
                        status: postTestResponse.status,
                        response: postTestText
                    }
                })
            } else {
                return NextResponse.json({
                    success: false,
                    error: 'Profile fetch failed',
                    status: profileResponse.status,
                    response: profileText,
                    token: token.substring(0, 20) + '...',
                    postTest: {
                        status: postTestResponse.status,
                        response: postTestText
                    }
                })
            }
        } catch (error) {
            return NextResponse.json({
                success: false,
                error: 'Request failed',
                message: error instanceof Error ? error.message : 'Unknown error',
                token: token.substring(0, 20) + '...'
            })
        }
    } catch (error) {
        console.error('LinkedIn test error:', error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
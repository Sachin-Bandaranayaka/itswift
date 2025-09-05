import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const token = process.env.LINKEDIN_ACCESS_TOKEN

    if (!token) {
        return NextResponse.json({ error: 'No LinkedIn token' }, { status: 400 })
    }

    try {
        // Step 1: Skip profile info since we don't have permission
        console.log('Step 1: Skipping profile (no permission), testing posting directly...')
        const profile = { note: 'Profile access denied - only have posting permission' }
        const personId = 'unknown'

        // Step 2: Try different URN formats (skip profile-based ones since we don't have access)
        const testFormats = [
            'urn:li:person:~',
            'urn:li:member:~'
        ]

        const results = []

        for (const authorUrn of testFormats) {
            console.log(`Testing URN format: ${authorUrn}`)
            
            const postData = {
                author: authorUrn,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text: `Test post with ${authorUrn} - ${new Date().toISOString()}`
                        },
                        shareMediaCategory: 'NONE'
                    }
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
            }

            try {
                const testResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'X-Restli-Protocol-Version': '2.0.0'
                    },
                    body: JSON.stringify(postData)
                })

                const testResult = await testResponse.text()
                
                results.push({
                    urn: authorUrn,
                    status: testResponse.status,
                    success: testResponse.ok,
                    response: testResult
                })

                console.log(`Result for ${authorUrn}:`, testResponse.status, testResult)

                // If successful, break
                if (testResponse.ok) {
                    break
                }
            } catch (error) {
                results.push({
                    urn: authorUrn,
                    status: 'error',
                    success: false,
                    response: error instanceof Error ? error.message : 'Unknown error'
                })
            }
        }

        return NextResponse.json({
            profile,
            personId,
            testResults: results,
            message: 'Debug test completed'
        })

    } catch (error) {
        console.error('Debug error:', error)
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
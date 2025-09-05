import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const clientId = process.env.LINKEDIN_CLIENT_ID
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI
    
    return new NextResponse(`
        <html>
            <head>
                <title>LinkedIn Manual Authorization</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                    .step { background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px; }
                    .code-box { background: #e3f2fd; padding: 15px; border-radius: 4px; font-family: monospace; }
                    .warning { background: #fff3cd; padding: 15px; border-radius: 4px; border-left: 4px solid #ffc107; }
                </style>
            </head>
            <body>
                <h1>🔗 LinkedIn Manual Authorization</h1>
                
                <div class="warning">
                    <strong>Note:</strong> Use this method if the automatic authorization isn't working.
                </div>
                
                <div class="step">
                    <h3>Step 1: Check Your LinkedIn App Settings</h3>
                    <p>Go to <a href="https://www.linkedin.com/developers/apps" target="_blank">LinkedIn Developer Console</a> and verify:</p>
                    <ul>
                        <li><strong>Client ID:</strong> ${clientId}</li>
                        <li><strong>Redirect URI:</strong> ${redirectUri}</li>
                        <li><strong>Products:</strong> "Share on LinkedIn" must be added and approved</li>
                        <li><strong>Scopes:</strong> w_member_social, r_liteprofile</li>
                    </ul>
                </div>
                
                <div class="step">
                    <h3>Step 2: Manual Authorization URL</h3>
                    <p>If your app is properly configured, click this link to authorize:</p>
                    <div class="code-box">
                        <a href="https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri || '')}&scope=w_member_social%20r_liteprofile&state=manual-auth" target="_blank">
                            Authorize LinkedIn Access
                        </a>
                    </div>
                </div>
                
                <div class="step">
                    <h3>Step 3: Alternative - LinkedIn Token Tool</h3>
                    <p>If the above doesn't work, you can use LinkedIn's token generation tool:</p>
                    <ol>
                        <li>Go to your <a href="https://www.linkedin.com/developers/apps" target="_blank">LinkedIn App</a></li>
                        <li>Click on your app</li>
                        <li>Go to the "Auth" tab</li>
                        <li>Look for "Generate Access Token" or similar option</li>
                        <li>Copy the generated token</li>
                        <li>Add it to your .env.local file as LINKEDIN_ACCESS_TOKEN</li>
                    </ol>
                </div>
                
                <div class="step">
                    <h3>Step 4: Test Mode (Recommended for Development)</h3>
                    <p>For development and testing, you can use test mode:</p>
                    <div class="code-box">
                        LINKEDIN_TEST_MODE=true
                    </div>
                    <p>This will simulate LinkedIn posting without making actual API calls.</p>
                </div>
                
                <p><a href="/admin/social">← Back to Social Media Dashboard</a></p>
            </body>
        </html>
    `, {
        headers: { 'Content-Type': 'text/html' }
    })
}
import { NextRequest, NextResponse } from 'next/server'
import { createLinkedInAPI } from '@/lib/integrations/linkedin'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')

        // Handle OAuth errors
        if (error) {
            const errorDescription = searchParams.get('error_description') || 'Unknown error'
            return new NextResponse(`
        <html>
          <head><title>LinkedIn Auth Error</title></head>
          <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
            <h1 style="color: #d32f2f;">Authentication Failed</h1>
            <p><strong>Error:</strong> ${error}</p>
            <p><strong>Description:</strong> ${errorDescription}</p>
            <a href="/admin/social" style="color: #1976d2;">← Back to Social Media</a>
          </body>
        </html>
      `, {
                headers: { 'Content-Type': 'text/html' }
            })
        }

        if (!code) {
            // Redirect to LinkedIn OAuth
            const linkedinAPI = createLinkedInAPI()
            const authUrl = linkedinAPI.getAuthUrl('linkedin-auth')
            return NextResponse.redirect(authUrl)
        }

        // Exchange code for access token
        const linkedinAPI = createLinkedInAPI()
        const tokenResponse = await linkedinAPI.getAccessToken(code)

        // Log the token for the user to copy
        console.log('🔑 LinkedIn Access Token:', tokenResponse.access_token)
        console.log('⏰ Expires in:', tokenResponse.expires_in, 'seconds')

        // Return a user-friendly HTML page with the token
        return new NextResponse(`
      <html>
        <head>
          <title>LinkedIn Authentication Success</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .success { color: #2e7d32; }
            .token-box { 
              background: #f5f5f5; 
              padding: 20px; 
              border-radius: 8px; 
              margin: 20px 0; 
              word-break: break-all;
              border-left: 4px solid #2e7d32;
            }
            .copy-btn { 
              background: #1976d2; 
              color: white; 
              border: none; 
              padding: 10px 20px; 
              border-radius: 4px; 
              cursor: pointer; 
              margin: 10px 0;
            }
            .copy-btn:hover { background: #1565c0; }
            .instructions { 
              background: #e3f2fd; 
              padding: 20px; 
              border-radius: 8px; 
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <h1 class="success">✅ LinkedIn Authentication Successful!</h1>
          
          <div class="instructions">
            <h3>📋 Next Steps:</h3>
            <ol>
              <li>Copy the access token below</li>
              <li>Add it to your <code>.env.local</code> file as <code>LINKEDIN_ACCESS_TOKEN=your_token_here</code></li>
              <li>Set <code>LINKEDIN_TEST_MODE=false</code> in your <code>.env.local</code> file</li>
              <li>Restart your development server</li>
            </ol>
          </div>

          <div class="token-box">
            <h3>🔑 Your LinkedIn Access Token:</h3>
            <div id="token">${tokenResponse.access_token}</div>
            <button class="copy-btn" onclick="copyToken()">📋 Copy Token</button>
          </div>

          <div class="token-box">
            <h3>⏰ Token Information:</h3>
            <p><strong>Expires in:</strong> ${tokenResponse.expires_in} seconds (${Math.round(tokenResponse.expires_in / 3600)} hours)</p>
            <p><strong>Scope:</strong> ${tokenResponse.scope || 'w_member_social'}</p>
          </div>

          <p><a href="/admin/social" style="color: #1976d2;">← Back to Social Media Dashboard</a></p>

          <script>
            function copyToken() {
              const token = document.getElementById('token').textContent;
              navigator.clipboard.writeText(token).then(() => {
                alert('Token copied to clipboard!');
              }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = token;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Token copied to clipboard!');
              });
            }
          </script>
        </body>
      </html>
    `, {
            headers: { 'Content-Type': 'text/html' }
        })
    } catch (error) {
        console.error('LinkedIn auth error:', error)

        return new NextResponse(`
      <html>
        <head><title>LinkedIn Auth Error</title></head>
        <body style="font-family: Arial, sans-serif; padding: 40px; text-align: center;">
          <h1 style="color: #d32f2f;">Authentication Error</h1>
          <p>Something went wrong during authentication.</p>
          <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
          <a href="/admin/social" style="color: #1976d2;">← Back to Social Media</a>
        </body>
      </html>
    `, {
            headers: { 'Content-Type': 'text/html' }
        })
    }
}
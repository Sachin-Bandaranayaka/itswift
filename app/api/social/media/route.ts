import { NextRequest, NextResponse } from 'next/server'
import { AyrshareAPI } from '@/lib/integrations/ayrshare'

// Initialize Ayrshare API
const ayrshare = new AyrshareAPI()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/mov',
      'video/avi'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, MOV, AVI) are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Upload to Ayrshare
    const result = await ayrshare.uploadMedia(file, file.name)
    
    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      },
      message: 'Media uploaded successfully'
    })

  } catch (error) {
    console.error('Media upload error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload media',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Get media upload limits and supported formats
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        maxFileSize: '10MB',
        supportedFormats: {
          images: ['JPEG', 'JPG', 'PNG', 'GIF', 'WebP'],
          videos: ['MP4', 'MOV', 'AVI']
        },
        platformLimits: {
          linkedin: {
            images: {
              maxSize: '10MB',
              formats: ['JPEG', 'PNG', 'GIF']
            },
            videos: {
              maxSize: '5GB',
              formats: ['MP4', 'MOV', 'AVI'],
              maxDuration: '10 minutes'
            }
          },
          twitter: {
            images: {
              maxSize: '5MB',
              formats: ['JPEG', 'PNG', 'GIF', 'WebP']
            },
            videos: {
              maxSize: '512MB',
              formats: ['MP4', 'MOV'],
              maxDuration: '2 minutes 20 seconds'
            }
          }
        }
      }
    })
  } catch (error) {
    console.error('Media info error:', error)
    return NextResponse.json(
      { error: 'Failed to get media information' },
      { status: 500 }
    )
  }
}
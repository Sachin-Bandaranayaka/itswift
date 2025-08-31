import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity.client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // Query to fetch document history from Sanity
    // Note: This is a simplified version. Sanity's document history API requires special permissions
    const query = `
      *[_type == "post" && _id == $postId] {
        _id,
        _rev,
        _createdAt,
        _updatedAt,
        title,
        "version": _rev
      } | order(_updatedAt desc)
    `

    const versions = await client.fetch(query, { postId })

    return NextResponse.json({
      success: true,
      versions: versions || []
    })
  } catch (error) {
    console.error('Error fetching post versions:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch post versions',
        versions: []
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { postId, action, metadata } = await request.json()

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // Create a version history entry
    // This would typically be stored in a separate collection for version tracking
    const versionEntry = {
      _type: 'postVersion',
      postId,
      action, // 'created', 'updated', 'published', 'scheduled'
      metadata: metadata || {},
      timestamp: new Date().toISOString(),
      _createdAt: new Date().toISOString()
    }

    const result = await client.create(versionEntry)

    return NextResponse.json({
      success: true,
      version: result,
      message: 'Version history entry created'
    })
  } catch (error) {
    console.error('Error creating version history:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create version history entry'
      },
      { status: 500 }
    )
  }
}
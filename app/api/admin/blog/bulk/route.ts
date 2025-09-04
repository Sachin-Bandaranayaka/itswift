import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity.client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, postIds, duplicatePostId } = body

    if (!action || !['delete', 'duplicate'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Valid action is required (delete or duplicate)' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'delete':
        if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
          return NextResponse.json(
            { success: false, error: 'Post IDs are required for delete action' },
            { status: 400 }
          )
        }

        // Delete posts in batch
        const transaction = client.transaction()
        
        for (const postId of postIds) {
          transaction.delete(postId)
        }

        await transaction.commit()

        // Log the deletion for audit purposes
        try {
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/blog/audit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'bulk_delete',
              postIds,
              timestamp: new Date().toISOString()
            })
          })
        } catch (auditError) {
          console.error('Error logging bulk delete:', auditError)
        }

        return NextResponse.json({
          success: true,
          deletedCount: postIds.length,
          message: `Successfully deleted ${postIds.length} posts`
        })

      case 'duplicate':
        if (!duplicatePostId) {
          return NextResponse.json(
            { success: false, error: 'Post ID is required for duplicate action' },
            { status: 400 }
          )
        }

        // Fetch the original post
        const originalPost = await client.fetch(
          '*[_type == "post" && _id == $id][0]',
          { id: duplicatePostId }
        )

        if (!originalPost) {
          return NextResponse.json(
            { success: false, error: 'Original post not found' },
            { status: 404 }
          )
        }

        // Create duplicate with modified title and slug
        const duplicateData = {
          ...originalPost,
          _id: undefined, // Remove ID to create new document
          _createdAt: undefined,
          _updatedAt: undefined,
          _rev: undefined,
          title: `${originalPost.title} (Copy)`,
          slug: {
            _type: 'slug',
            current: `${originalPost.slug.current}-copy-${Date.now()}`
          },
          publishedAt: null, // Reset to draft
          status: null // Reset status
        }

        const duplicatedPost = await client.create(duplicateData)

        // Log the duplication for audit purposes
        try {
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/blog/audit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'duplicate',
              originalPostId: duplicatePostId,
              newPostId: duplicatedPost._id,
              timestamp: new Date().toISOString()
            })
          })
        } catch (auditError) {
          console.error('Error logging duplication:', auditError)
        }

        return NextResponse.json({
          success: true,
          duplicatedPost,
          message: 'Post duplicated successfully'
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error performing bulk operation:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to perform bulk operation'
      },
      { status: 500 }
    )
  }
}
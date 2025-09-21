import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity.client'
import { BlogToSocialService } from '@/lib/services/blog-to-social'
import { VersionHistoryService } from '@/lib/services/version-history'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      excerpt, 
      content, 
      publishedAt, 
      categories, 
      mainImageUrl, 
      mainImageAlt,
      id,
      isUpdate,
      autoGenerateSocial = true
    } = body

    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      )
    }

    // Convert content to Sanity block format (simplified)
    const bodyBlocks = content ? content.split('\n\n').map((paragraph: string) => ({
      _type: 'block',
      _key: Math.random().toString(36).substr(2, 9),
      style: 'normal',
      markDefs: [],
      children: [{
        _type: 'span',
        _key: Math.random().toString(36).substr(2, 9),
        text: paragraph,
        marks: []
      }]
    })) : []

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')

    const postData = {
      _type: 'post',
      title: title.trim(),
      slug: {
        _type: 'slug',
        current: slug
      },
      excerpt: excerpt?.trim() || null,
      body: bodyBlocks,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
      ...(mainImageUrl && {
        mainImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: mainImageUrl // This would need proper Sanity asset handling
          },
          alt: mainImageAlt || ''
        }
      })
    }

    let result
    let wasJustPublished = false
    
    if (isUpdate && id) {
      // Check if this is a publish action (was draft, now has publishedAt)
      const existingPost = await client.fetch('*[_type == "post" && _id == $id][0]', { id })
      wasJustPublished = !existingPost?.publishedAt && publishedAt
      
      // Update existing post
      result = await client
        .patch(id)
        .set(postData)
        .commit()
    } else {
      // Create new post
      result = await client.create(postData)
      wasJustPublished = !!publishedAt
    }

    // Create version history entry
    await VersionHistoryService.createEntry({
      postId: result._id,
      action: isUpdate ? (wasJustPublished ? 'published' : 'updated') : 'created',
      metadata: {
        title: title.trim(),
        publishedAt: publishedAt || null,
        hasSchedule: !!publishedAt && new Date(publishedAt) > new Date()
      }
    })

    // Auto-generate social media posts if the post is being published
    let socialPosts = []
    if (autoGenerateSocial && wasJustPublished && content?.trim()) {
      try {
        const blogPost = {
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt?.trim(),
          categories: categories ? categories.split(',').map((c: string) => c.trim()) : [],
          publishedAt: publishedAt
        }

        const socialResult = await BlogToSocialService.processNewBlogPost(
          blogPost,
          result._id,
          {
            platforms: ['linkedin', 'twitter'],
            autoSchedule: !!publishedAt && new Date(publishedAt) > new Date(),
            scheduleDelay: 30 // 30 minutes after blog publication
          }
        )

        if (socialResult.success) {
          socialPosts = socialResult.posts
        }
      } catch (socialError) {
        console.error('Error generating social posts:', socialError)
        // Don't fail the main operation for social post generation errors
      }
    }

    return NextResponse.json({
      success: true,
      post: result,
      socialPosts,
      message: isUpdate ? 'Post updated successfully' : 'Post created successfully',
      ...(socialPosts.length > 0 && {
        socialMessage: `Generated ${socialPosts.length} social media posts`
      })
    })
  } catch (error) {
    console.error('Error saving blog post:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save blog post'
      },
      { status: 500 }
    )
  }
}
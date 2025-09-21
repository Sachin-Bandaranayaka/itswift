import { NextRequest, NextResponse } from 'next/server'
import { BlogService } from '@/lib/services/blog.service'
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

    const blogService = new BlogService()

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-')

    const postData = {
      title: title.trim(),
      slug: { current: slug },
      excerpt: excerpt?.trim() || '',
      content: content || '',
      publishedAt: publishedAt || null,
      categories: categories || [],
      mainImageUrl: mainImageUrl || null,
      mainImageAlt: mainImageAlt || null,
      _updatedAt: new Date().toISOString()
    }

    let savedPost

    if (isUpdate && id) {
      // TODO: Implement update with Supabase
      // For now, return placeholder data
      savedPost = {
        _id: id,
        ...postData,
        _createdAt: new Date().toISOString()
      }

      // Save version history
      try {
        await VersionHistoryService.createEntry({
          postId: id,
          action: 'updated',
          metadata: {
            title: savedPost.title,
            publishedAt: savedPost.publishedAt
          }
        })
      } catch (error) {
        console.error('Error saving version history:', error)
      }
    } else {
      // TODO: Implement create with Supabase
      // For now, return placeholder data
      const newId = `post-${Date.now()}`
      savedPost = {
        _id: newId,
        ...postData,
        _createdAt: new Date().toISOString()
      }

      // Save initial version
      try {
        await VersionHistoryService.createEntry({
          postId: newId,
          action: 'created',
          metadata: {
            title: savedPost.title,
            publishedAt: savedPost.publishedAt
          }
        })
      } catch (error) {
        console.error('Error saving version history:', error)
      }
    }

    // Auto-generate social media posts if enabled and post is published
    if (autoGenerateSocial && publishedAt) {
      try {
        const socialResult = await BlogToSocialService.processNewBlogPost({
          title: savedPost.title,
          content: savedPost.content,
          excerpt: savedPost.excerpt,
          categories: savedPost.categories,
          publishedAt: savedPost.publishedAt
        }, savedPost._id, {
          platforms: ['linkedin', 'twitter'],
          autoSchedule: true,
          scheduleDelay: 30
        })

        if (socialResult.success) {
          console.log(`Generated ${socialResult.posts.length} social media posts`)
        }
      } catch (socialError) {
        console.warn('Failed to generate social media posts:', socialError)
        // Don't fail the blog save if social generation fails
      }
    }

    return NextResponse.json({
      success: true,
      post: savedPost,
      message: isUpdate ? 'Blog post updated successfully' : 'Blog post created successfully'
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
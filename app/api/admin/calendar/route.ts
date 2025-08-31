import { NextRequest, NextResponse } from 'next/server'
import { SocialPostsService, NewsletterCampaignsService } from '@/lib/database/services/index'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const contentType = searchParams.get('contentType')
    const platform = searchParams.get('platform')
    const status = searchParams.get('status')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    // Fetch social posts
    const socialPostsResult = await SocialPostsService.getAll(
      { orderBy: 'scheduled_at', orderDirection: 'asc' },
      { 
        platform: platform === 'all' ? undefined : platform,
        status: status === 'all' ? undefined : status,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined
      }
    )

    // Fetch newsletter campaigns
    const newslettersResult = await NewsletterCampaignsService.getAll(
      { orderBy: 'scheduled_at', orderDirection: 'asc' },
      {
        status: status === 'all' ? undefined : status,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined
      }
    )

    if (socialPostsResult.error) {
      return NextResponse.json(
        { error: socialPostsResult.error },
        { status: 500 }
      )
    }

    if (newslettersResult.error) {
      return NextResponse.json(
        { error: newslettersResult.error },
        { status: 500 }
      )
    }

    // Filter by content type if specified
    let socialPosts = socialPostsResult.data
    let newsletters = newslettersResult.data

    if (contentType && contentType !== 'all') {
      if (contentType !== 'social') {
        socialPosts = []
      }
      if (contentType !== 'newsletter') {
        newsletters = []
      }
    }

    return NextResponse.json({
      socialPosts,
      newsletters,
      // Note: Blog posts would need to be fetched from Sanity CMS
      blogPosts: [] // Placeholder for now
    })
  } catch (error) {
    console.error('Error fetching calendar content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar content' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { contentId, contentType, scheduledAt } = body

    if (!contentId || !contentType || !scheduledAt) {
      return NextResponse.json(
        { error: 'Missing required fields: contentId, contentType, scheduledAt' },
        { status: 400 }
      )
    }

    let result

    switch (contentType) {
      case 'social':
        result = await SocialPostsService.update(contentId, {
          scheduled_at: scheduledAt
        })
        break
      
      case 'newsletter':
        result = await NewsletterCampaignsService.update(contentId, {
          scheduled_at: scheduledAt
        })
        break
      
      case 'blog':
        // Blog posts would need to be updated in Sanity CMS
        return NextResponse.json(
          { error: 'Blog post rescheduling not implemented yet' },
          { status: 501 }
        )
      
      default:
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        )
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: result.data
    })
  } catch (error) {
    console.error('Error rescheduling content:', error)
    return NextResponse.json(
      { error: 'Failed to reschedule content' },
      { status: 500 }
    )
  }
}
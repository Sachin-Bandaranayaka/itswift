import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity.client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { postIds, status, publishedAt } = body

    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Post IDs are required' },
        { status: 400 }
      )
    }

    if (!status || !['draft', 'scheduled', 'published', 'archived'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Valid status is required' },
        { status: 400 }
      )
    }

    // Prepare the update data based on status
    let updateData: any = {}

    switch (status) {
      case 'published':
        updateData.publishedAt = publishedAt || new Date().toISOString()
        break
      case 'scheduled':
        if (!publishedAt) {
          return NextResponse.json(
            { success: false, error: 'Published date is required for scheduled posts' },
            { status: 400 }
          )
        }
        updateData.publishedAt = publishedAt
        break
      case 'draft':
      case 'archived':
        updateData.publishedAt = null
        break
    }

    // Add status field for archived posts
    if (status === 'archived') {
      updateData.status = 'archived'
    } else {
      updateData.status = null // Remove archived status
    }

    // Update all posts in batch
    const transaction = client.transaction()
    
    for (const postId of postIds) {
      transaction.patch(postId).set(updateData)
    }

    const result = await transaction.commit()

    // Log the status change for audit purposes
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/blog/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'status_change',
          postIds,
          newStatus: status,
          publishedAt,
          timestamp: new Date().toISOString()
        })
      })
    } catch (auditError) {
      console.error('Error logging status change:', auditError)
      // Don't fail the main operation for audit logging errors
    }

    return NextResponse.json({
      success: true,
      updatedPosts: result.length,
      status,
      message: `Successfully updated ${result.length} posts to ${status}`
    })
  } catch (error) {
    console.error('Error updating post status:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update post status'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const author = searchParams.get('author')
    const category = searchParams.get('category')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'newest'

    // Build the GROQ query based on filters
    let query = '*[_type == "post"'
    const params: any = {}

    // Status filter
    if (status && status !== 'all') {
      switch (status) {
        case 'published':
          query += ' && publishedAt != null && publishedAt <= now() && (status == null || status != "archived")'
          break
        case 'scheduled':
          query += ' && publishedAt != null && publishedAt > now() && (status == null || status != "archived")'
          break
        case 'draft':
          query += ' && (publishedAt == null || publishedAt == "") && (status == null || status != "archived")'
          break
        case 'archived':
          query += ' && status == "archived"'
          break
      }
    } else {
      // Exclude archived posts from "all" view unless specifically requested
      query += ' && (status == null || status != "archived")'
    }

    // Author filter
    if (author) {
      query += ' && author->name match $author'
      params.author = `*${author}*`
    }

    // Category filter
    if (category) {
      query += ' && $category in categories[]->title'
      params.category = category
    }

    // Date range filter
    if (startDate) {
      query += ' && _createdAt >= $startDate'
      params.startDate = startDate
    }
    if (endDate) {
      query += ' && _createdAt <= $endDate'
      params.endDate = endDate
    }

    // Search filter
    if (search) {
      query += ' && (title match $search || pt::text(body) match $search)'
      params.search = `*${search}*`
    }

    query += ']'

    // Add sorting
    switch (sortBy) {
      case 'oldest':
        query += ' | order(_createdAt asc)'
        break
      case 'title-asc':
        query += ' | order(title asc)'
        break
      case 'title-desc':
        query += ' | order(title desc)'
        break
      case 'author':
        query += ' | order(author->name asc)'
        break
      case 'newest':
      default:
        query += ' | order(_createdAt desc)'
        break
    }

    // Add field selection
    query += ` {
      _id,
      title,
      slug,
      author->{
        name,
        _id
      },
      mainImage{
        asset->{
          url
        },
        alt
      },
      categories[]->{
        title,
        _id
      },
      publishedAt,
      excerpt,
      body,
      status,
      _createdAt,
      _updatedAt
    }`

    const posts = await client.fetch(query, params)

    // Get summary statistics
    const statsQuery = `{
      "total": count(*[_type == "post" && (status == null || status != "archived")]),
      "published": count(*[_type == "post" && publishedAt != null && publishedAt <= now() && (status == null || status != "archived")]),
      "scheduled": count(*[_type == "post" && publishedAt != null && publishedAt > now() && (status == null || status != "archived")]),
      "draft": count(*[_type == "post" && (publishedAt == null || publishedAt == "") && (status == null || status != "archived")]),
      "archived": count(*[_type == "post" && status == "archived"])
    }`

    const stats = await client.fetch(statsQuery)

    // Get available authors and categories for filters
    const filtersQuery = `{
      "authors": array::unique(*[_type == "post" && defined(author)].author->name),
      "categories": array::unique(*[_type == "post" && count(categories) > 0].categories[]->title)
    }`

    const filters = await client.fetch(filtersQuery)

    return NextResponse.json({
      success: true,
      posts: posts || [],
      stats,
      filters: {
        authors: filters.authors || [],
        categories: filters.categories || []
      },
      query: {
        status,
        author,
        category,
        startDate,
        endDate,
        search,
        sortBy
      }
    })
  } catch (error) {
    console.error('Error fetching filtered posts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch posts',
        posts: [],
        stats: { total: 0, published: 0, scheduled: 0, draft: 0, archived: 0 },
        filters: { authors: [], categories: [] }
      },
      { status: 500 }
    )
  }
}
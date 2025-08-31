import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity.client'

export async function GET(request: NextRequest) {
  try {
    // Query to fetch all blog posts with their related data
    const query = `
      *[_type == "post"] | order(_createdAt desc) {
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
        _createdAt,
        _updatedAt
      }
    `

    const posts = await client.fetch(query)

    return NextResponse.json({
      success: true,
      posts: posts || []
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch blog posts',
        posts: []
      },
      { status: 500 }
    )
  }
}
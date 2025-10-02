import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"

// GET all testimonials
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const searchParams = request.nextUrl.searchParams
    const includeInactive = searchParams.get("includeInactive") === "true"

    let query = supabase
      .from("testimonials")
      .select("*")
      .order("display_order", { ascending: true })

    if (!includeInactive) {
      query = query.eq("is_active", true)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching testimonials:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ testimonials: data || [] })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    )
  }
}

// POST - Create new testimonial
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const body = await request.json()

    const { name, role, company, content, rating, avatar_url, display_order, is_active } = body

    // Validation
    if (!name || !role || !company || !content) {
      return NextResponse.json(
        { error: "Missing required fields: name, role, company, content" },
        { status: 400 }
      )
    }

    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("testimonials")
      .insert([
        {
          name,
          role,
          company,
          content,
          rating: rating || 5,
          avatar_url,
          display_order: display_order || 0,
          is_active: is_active !== undefined ? is_active : true,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating testimonial:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ testimonial: data }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    )
  }
}


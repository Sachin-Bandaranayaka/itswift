import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase"

export const dynamic = "force-dynamic"

// GET single testimonial
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching testimonial:", error)
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ testimonial: data })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Failed to fetch testimonial" },
      { status: 500 }
    )
  }
}

// PUT - Update testimonial
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getSupabaseAdmin()
    const body = await request.json()

    const { name, role, company, content, rating, avatar_url, display_order, is_active } = body

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (role !== undefined) updateData.role = role
    if (company !== undefined) updateData.company = company
    if (content !== undefined) updateData.content = content
    if (rating !== undefined) updateData.rating = rating
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url
    if (display_order !== undefined) updateData.display_order = display_order
    if (is_active !== undefined) updateData.is_active = is_active

    const { data, error } = await supabase
      .from("testimonials")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating testimonial:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ testimonial: data })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    )
  }
}

// DELETE testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getSupabaseAdmin()

    const { error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting testimonial:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    )
  }
}


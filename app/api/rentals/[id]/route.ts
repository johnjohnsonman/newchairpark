import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"

// GET /api/rentals/[id] - 특정 렌탈 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("rentals")
      .select(`
        *,
        brands (
          id,
          name,
          slug
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "렌탈을 찾을 수 없습니다." },
          { status: 404 }
        )
      }
      console.error("Error fetching rental:", error)
      return NextResponse.json(
        { error: "렌탈 정보를 가져오는데 실패했습니다." },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error in GET /api/rentals/[id]:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// PUT /api/rentals/[id] - 렌탈 수정 (관리자만)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()
    const adminSupabase = getSupabaseAdminClient()

    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    // 관리자 권한 확인
    const { data: userRole } = await adminSupabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (userRole?.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name,
      slug,
      brand_id,
      category,
      type,
      price_monthly,
      price_daily,
      original_price,
      description,
      image_url,
      images,
      specifications,
      available,
      featured,
      min_rental_period
    } = body

    // 타입 검증
    if (type && !["rental", "demo"].includes(type)) {
      return NextResponse.json(
        { error: "유효하지 않은 타입입니다." },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (brand_id !== undefined) updateData.brand_id = brand_id
    if (category !== undefined) updateData.category = category
    if (type !== undefined) updateData.type = type
    if (price_monthly !== undefined) updateData.price_monthly = price_monthly
    if (price_daily !== undefined) updateData.price_daily = price_daily
    if (original_price !== undefined) updateData.original_price = original_price
    if (description !== undefined) updateData.description = description
    if (image_url !== undefined) updateData.image_url = image_url
    if (images !== undefined) updateData.images = images
    if (specifications !== undefined) updateData.specifications = specifications
    if (available !== undefined) updateData.available = available
    if (featured !== undefined) updateData.featured = featured
    if (min_rental_period !== undefined) updateData.min_rental_period = min_rental_period

    updateData.updated_at = new Date().toISOString()

    const { data, error } = await adminSupabase
      .from("rentals")
      .update(updateData)
      .eq("id", params.id)
      .select(`
        *,
        brands (
          id,
          name,
          slug
        )
      `)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "렌탈을 찾을 수 없습니다." },
          { status: 404 }
        )
      }
      console.error("Error updating rental:", error)
      return NextResponse.json(
        { error: "렌탈 수정에 실패했습니다." },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error in PUT /api/rentals/[id]:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// DELETE /api/rentals/[id] - 렌탈 삭제 (관리자만)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createServerClient()
    const adminSupabase = getSupabaseAdminClient()

    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    // 관리자 권한 확인
    const { data: userRole } = await adminSupabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (userRole?.role !== "admin") {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 }
      )
    }

    const { error } = await adminSupabase
      .from("rentals")
      .delete()
      .eq("id", params.id)

    if (error) {
      console.error("Error deleting rental:", error)
      return NextResponse.json(
        { error: "렌탈 삭제에 실패했습니다." },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: "렌탈이 성공적으로 삭제되었습니다." })
  } catch (error) {
    console.error("Error in DELETE /api/rentals/[id]:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}


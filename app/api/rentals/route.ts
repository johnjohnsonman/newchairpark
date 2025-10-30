import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"

// GET /api/rentals - 렌탈 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const type = searchParams.get("type")
    const featured = searchParams.get("featured")
    const available = searchParams.get("available")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    const supabase = await createServerClient()

    let query = supabase
      .from("rentals")
      .select(`
        *,
        brands (
          id,
          name,
          slug
        )
      `)
      .order("created_at", { ascending: false })

    // 필터 적용
    if (category) {
      query = query.eq("category", category)
    }
    if (type) {
      query = query.eq("type", type)
    }
    if (featured === "true") {
      query = query.eq("featured", true)
    }
    if (available === "true") {
      query = query.eq("available", true)
    }

    // 페이지네이션
    if (limit) {
      query = query.limit(parseInt(limit))
    }
    if (offset) {
      query = query.range(parseInt(offset), parseInt(offset) + (parseInt(limit || "10") - 1))
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching rentals:", error)
      return NextResponse.json(
        { error: "렌탈 목록을 가져오는데 실패했습니다." },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error in GET /api/rentals:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// POST /api/rentals - 새 렌탈 생성 (관리자만)
export async function POST(request: NextRequest) {
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

    // 필수 필드 검증
    if (!name || !slug || !category || !type || !image_url) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다." },
        { status: 400 }
      )
    }

    // 타입 검증
    if (!["rental", "demo"].includes(type)) {
      return NextResponse.json(
        { error: "유효하지 않은 타입입니다." },
        { status: 400 }
      )
    }

    const { data, error } = await adminSupabase
      .from("rentals")
      .insert({
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
        images: images || [],
        specifications: specifications || {},
        available: available ?? true,
        featured: featured ?? false,
        min_rental_period: min_rental_period || 3
      })
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
      console.error("Error creating rental:", error)
      return NextResponse.json(
        { error: "렌탈 생성에 실패했습니다." },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/rentals:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}


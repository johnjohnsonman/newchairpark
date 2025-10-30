import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"

// GET /api/rental-requests - 렌탈 요청 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const user_id = searchParams.get("user_id")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

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

    const isAdmin = userRole?.role === "admin"

    let query = adminSupabase
      .from("rental_requests")
      .select(`
        *,
        rentals (
          id,
          name,
          slug,
          image_url,
          type,
          price_monthly,
          price_daily
        ),
        auth.users (
          id,
          email,
          user_metadata
        )
      `)
      .order("created_at", { ascending: false })

    // 일반 사용자는 자신의 요청만 조회 가능
    if (!isAdmin) {
      query = query.eq("user_id", user.id)
    }

    // 필터 적용
    if (status) {
      query = query.eq("status", status)
    }
    if (user_id && isAdmin) {
      query = query.eq("user_id", user_id)
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
      console.error("Error fetching rental requests:", error)
      return NextResponse.json(
        { error: "렌탈 요청 목록을 가져오는데 실패했습니다." },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error in GET /api/rental-requests:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// POST /api/rental-requests - 새 렌탈 요청 생성
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // 사용자 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      rental_id,
      service_type,
      name,
      company,
      phone,
      email,
      quantity,
      rental_period,
      preferred_date,
      message
    } = body

    // 필수 필드 검증
    if (!rental_id || !service_type || !name || !phone) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다." },
        { status: 400 }
      )
    }

    // 서비스 타입 검증
    if (!["rental", "demo"].includes(service_type)) {
      return NextResponse.json(
        { error: "유효하지 않은 서비스 타입입니다." },
        { status: 400 }
      )
    }

    // 렌탈 존재 확인
    const { data: rental, error: rentalError } = await supabase
      .from("rentals")
      .select("id, name, available")
      .eq("id", rental_id)
      .single()

    if (rentalError || !rental) {
      return NextResponse.json(
        { error: "렌탈을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    if (!rental.available) {
      return NextResponse.json(
        { error: "현재 이용할 수 없는 렌탈입니다." },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("rental_requests")
      .insert({
        rental_id,
        user_id: user.id,
        service_type,
        name,
        company,
        phone,
        email,
        quantity: quantity || 1,
        rental_period,
        preferred_date,
        message,
        status: "pending"
      })
      .select(`
        *,
        rentals (
          id,
          name,
          slug,
          image_url,
          type
        )
      `)
      .single()

    if (error) {
      console.error("Error creating rental request:", error)
      return NextResponse.json(
        { error: "렌탈 요청 생성에 실패했습니다." },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/rental-requests:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}




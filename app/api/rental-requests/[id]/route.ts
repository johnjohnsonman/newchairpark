import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"

// GET /api/rental-requests/[id] - 특정 렌탈 요청 조회
export async function GET(
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
      .eq("id", params.id)

    // 일반 사용자는 자신의 요청만 조회 가능
    if (!isAdmin) {
      query = query.eq("user_id", user.id)
    }

    const { data, error } = await query.single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "렌탈 요청을 찾을 수 없습니다." },
          { status: 404 }
        )
      }
      console.error("Error fetching rental request:", error)
      return NextResponse.json(
        { error: "렌탈 요청 정보를 가져오는데 실패했습니다." },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error in GET /api/rental-requests/[id]:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// PUT /api/rental-requests/[id] - 렌탈 요청 수정
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

    const isAdmin = userRole?.role === "admin"

    const body = await request.json()
    const {
      service_type,
      name,
      company,
      phone,
      email,
      quantity,
      rental_period,
      preferred_date,
      message,
      status
    } = body

    // 기존 요청 조회
    const { data: existingRequest, error: fetchError } = await adminSupabase
      .from("rental_requests")
      .select("*")
      .eq("id", params.id)
      .single()

    if (fetchError || !existingRequest) {
      return NextResponse.json(
        { error: "렌탈 요청을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 권한 확인: 일반 사용자는 자신의 pending 요청만 수정 가능
    if (!isAdmin && existingRequest.user_id !== user.id) {
      return NextResponse.json(
        { error: "권한이 없습니다." },
        { status: 403 }
      )
    }

    if (!isAdmin && existingRequest.status !== "pending") {
      return NextResponse.json(
        { error: "승인 대기 중인 요청만 수정할 수 있습니다." },
        { status: 400 }
      )
    }

    // 서비스 타입 검증
    if (service_type && !["rental", "demo"].includes(service_type)) {
      return NextResponse.json(
        { error: "유효하지 않은 서비스 타입입니다." },
        { status: 400 }
      )
    }

    // 상태 검증 (관리자만 상태 변경 가능)
    if (status && !isAdmin) {
      return NextResponse.json(
        { error: "상태 변경 권한이 없습니다." },
        { status: 403 }
      )
    }

    if (status && !["pending", "approved", "rejected", "completed"].includes(status)) {
      return NextResponse.json(
        { error: "유효하지 않은 상태입니다." },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (service_type !== undefined) updateData.service_type = service_type
    if (name !== undefined) updateData.name = name
    if (company !== undefined) updateData.company = company
    if (phone !== undefined) updateData.phone = phone
    if (email !== undefined) updateData.email = email
    if (quantity !== undefined) updateData.quantity = quantity
    if (rental_period !== undefined) updateData.rental_period = rental_period
    if (preferred_date !== undefined) updateData.preferred_date = preferred_date
    if (message !== undefined) updateData.message = message
    if (status !== undefined) updateData.status = status

    updateData.updated_at = new Date().toISOString()

    const { data, error } = await adminSupabase
      .from("rental_requests")
      .update(updateData)
      .eq("id", params.id)
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
      console.error("Error updating rental request:", error)
      return NextResponse.json(
        { error: "렌탈 요청 수정에 실패했습니다." },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error in PUT /api/rental-requests/[id]:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

// DELETE /api/rental-requests/[id] - 렌탈 요청 삭제 (관리자만)
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
      .from("rental_requests")
      .delete()
      .eq("id", params.id)

    if (error) {
      console.error("Error deleting rental request:", error)
      return NextResponse.json(
        { error: "렌탈 요청 삭제에 실패했습니다." },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: "렌탈 요청이 성공적으로 삭제되었습니다." })
  } catch (error) {
    console.error("Error in DELETE /api/rental-requests/[id]:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}




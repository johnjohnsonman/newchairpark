import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { getSupabaseAdminClient } from "@/lib/supabase/admin"

// PUT /api/rental-requests/[id]/status - 렌탈 요청 상태 변경 (관리자만)
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
    const { status, admin_notes } = body

    // 상태 검증
    if (!status || !["pending", "approved", "rejected", "completed"].includes(status)) {
      return NextResponse.json(
        { error: "유효하지 않은 상태입니다." },
        { status: 400 }
      )
    }

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

    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    // 관리자 메모 추가 (선택사항)
    if (admin_notes) {
      updateData.admin_notes = admin_notes
    }

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
        ),
        auth.users (
          id,
          email,
          user_metadata
        )
      `)
      .single()

    if (error) {
      console.error("Error updating rental request status:", error)
      return NextResponse.json(
        { error: "렌탈 요청 상태 변경에 실패했습니다." },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      data,
      message: `렌탈 요청이 ${status === 'approved' ? '승인' : status === 'rejected' ? '거절' : status === 'completed' ? '완료' : '대기'}되었습니다.`
    })
  } catch (error) {
    console.error("Error in PUT /api/rental-requests/[id]/status:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}




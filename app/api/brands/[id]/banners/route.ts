import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 환경 변수를 런타임에 가져오기
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "서버 설정 오류가 발생했습니다" },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { id } = await params
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Brand ID is required" }, { status: 400 })
    }

    const { banner_images, banner_titles, banner_descriptions } = body

    // 브랜드 배너 정보 업데이트
    const { data, error } = await supabase
      .from('brands')
      .update({
        banner_images: banner_images || [],
        banner_titles: banner_titles || [],
        banner_descriptions: banner_descriptions || [],
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error("Error updating brand banners:", error)
      return NextResponse.json({ error: "Failed to update brand banners" }, { status: 500 })
    }

    return NextResponse.json({ 
      message: "Brand banners updated successfully",
      brand: data
    })
  } catch (error) {
    console.error("Update brand banners error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Update failed" 
    }, { status: 500 })
  }
}

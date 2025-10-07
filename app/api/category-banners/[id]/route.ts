import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nejjxccatspqlkujxlnd.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lamp4Y2NhdHNwcWxrdWp4bG5kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTY0NjI5MSwiZXhwIjoyMDc1MjIyMjkxfQ.Zn_Wt2uHj7FquDTvayo74AaDKb-DHbygAcqLXW-dY7E'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Banner ID is required" }, { status: 400 })
    }

    const { title, description, order_index } = body

    // 배너 정보 업데이트
    const { data, error } = await supabase
      .from('category_banners')
      .update({
        title: title || '',
        description: description || '',
        order_index: order_index || 0,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error("Error updating banner:", error)
      return NextResponse.json({ error: "Failed to update banner" }, { status: 500 })
    }

    return NextResponse.json({ 
      message: "Banner updated successfully",
      banner: data
    })
  } catch (error) {
    console.error("Update banner error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Update failed" 
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Banner ID is required" }, { status: 400 })
    }

    // 먼저 배너 정보를 가져와서 이미지 파일 경로 확인
    const { data: banner, error: fetchError } = await supabase
      .from('category_banners')
      .select('image_url')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error("Error fetching banner:", fetchError)
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    // 데이터베이스에서 배너 삭제
    const { error: deleteError } = await supabase
      .from('category_banners')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error("Error deleting banner from database:", deleteError)
      return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 })
    }

    // 이미지 파일도 삭제 (파일 경로 추출)
    if (banner.image_url) {
      try {
        const url = new URL(banner.image_url)
        const filePath = url.pathname.split('/').slice(3).join('/') // /storage/v1/object/public/images/ 부분 제거
        
        const { error: storageError } = await supabase.storage
          .from('images')
          .remove([filePath])

        if (storageError) {
          console.error("Error deleting image from storage:", storageError)
          // 스토리지 삭제 실패해도 DB는 이미 삭제되었으므로 성공으로 처리
        }
      } catch (urlError) {
        console.error("Error parsing image URL:", urlError)
        // URL 파싱 실패해도 DB는 이미 삭제되었으므로 성공으로 처리
      }
    }

    return NextResponse.json({ 
      message: "Banner deleted successfully",
      id: id
    })
  } catch (error) {
    console.error("Delete banner error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Delete failed" 
    }, { status: 500 })
  }
}

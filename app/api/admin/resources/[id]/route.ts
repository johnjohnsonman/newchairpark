import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nejjxccatspqlkujxlnd.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lamp4Y2NhdHNwcWxrdWp4bG5kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTY0NjI5MSwiZXhwIjoyMDc1MjIyMjkxfQ.Zn_Wt2uHj7FquDTvayo74AaDKb-DHbygAcqLXW-dY7E'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resourceId = params.id

    if (!resourceId) {
      return NextResponse.json({ error: "Resource ID is required" }, { status: 400 })
    }

    // 먼저 자료 정보를 가져와서 파일 URL 확인
    const { data: resource, error: fetchError } = await supabase
      .from("resources")
      .select("file_url")
      .eq("id", resourceId)
      .single()

    if (fetchError) {
      console.error("Fetch resource error:", fetchError)
      return NextResponse.json({ 
        error: fetchError.message || "Failed to fetch resource",
        details: fetchError 
      }, { status: 500 })
    }

    // 데이터베이스에서 자료 삭제
    const { error: deleteError } = await supabase
      .from("resources")
      .delete()
      .eq("id", resourceId)

    if (deleteError) {
      console.error("Delete resource error:", deleteError)
      return NextResponse.json({ 
        error: deleteError.message || "Failed to delete resource",
        details: deleteError 
      }, { status: 500 })
    }

    // 파일이 있는 경우 스토리지에서도 삭제
    if (resource?.file_url) {
      try {
        // URL에서 파일 경로 추출
        const urlParts = resource.file_url.split('/')
        const fileName = urlParts[urlParts.length - 1]
        const filePath = `resources/${fileName}`

        const { error: storageError } = await supabase.storage
          .from('files')
          .remove([filePath])

        if (storageError) {
          console.error("Storage delete error:", storageError)
          // 스토리지 삭제 실패해도 데이터베이스는 이미 삭제되었으므로 성공으로 처리
        }
      } catch (storageError) {
        console.error("Storage delete error:", storageError)
        // 스토리지 삭제 실패해도 데이터베이스는 이미 삭제되었으므로 성공으로 처리
      }
    }

    return NextResponse.json({ 
      success: true,
      message: "Resource deleted successfully" 
    })
  } catch (error) {
    console.error("Delete resource error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Delete failed",
      details: error 
    }, { status: 500 })
  }
}

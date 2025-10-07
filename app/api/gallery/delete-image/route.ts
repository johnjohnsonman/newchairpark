import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    // URL에서 파일 경로 추출
    const urlParts = url.split('/')
    const fileName = urlParts[urlParts.length - 1]
    const filePath = `gallery/${fileName}`

    // Supabase Storage에서 파일 삭제
    const { error } = await supabase.storage
      .from('images')
      .remove([filePath])

    if (error) {
      console.error("Supabase delete error:", error)
      return NextResponse.json({ 
        error: error.message || "Delete failed",
        details: error 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: "Image deleted successfully" 
    })
  } catch (error) {
    console.error("Gallery delete error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Delete failed",
      details: error 
    }, { status: 500 })
  }
}

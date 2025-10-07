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

import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nejjxccatspqlkujxlnd.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lamp4Y2NhdHNwcWxrdWp4bG5kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTY0NjI5MSwiZXhwIjoyMDc1MjIyMjkxfQ.Zn_Wt2uHj7FquDTvayo74AaDKb-DHbygAcqLXW-dY7E'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // 파일 크기 제한 (50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size too large (max 50MB)" }, { status: 400 })
    }

    // 파일 타입 검증
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only PDF, Word, Excel, PowerPoint files are allowed." }, { status: 400 })
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop() || 'pdf'
    const fileName = `resource-${timestamp}-${randomId}.${fileExtension}`
    const filePath = `resources/${fileName}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('files')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error("Supabase upload error:", error)
      return NextResponse.json({ 
        error: error.message || "Upload failed",
        details: error 
      }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('files')
      .getPublicUrl(filePath)

    return NextResponse.json({
      url: urlData.publicUrl,
      filename: fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
      path: filePath
    })
  } catch (error) {
    console.error("Resource upload error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Upload failed",
      details: error 
    }, { status: 500 })
  }
}

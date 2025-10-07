import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { logEnvironmentStatus } from "@/lib/env-check"

export async function POST(request: NextRequest) {
  try {
    // 환경 변수 상태 로깅
    const envStatus = logEnvironmentStatus()
    
    if (!envStatus.isValid) {
      return NextResponse.json(
        { 
          error: "서버 설정 오류가 발생했습니다. 환경 변수를 확인해주세요.",
          details: envStatus.issues
        },
        { status: 500 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const formData = await request.formData()
    const file = formData.get("file") as File

    console.log("File upload attempt:", {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type
    })

    if (!file) {
      return NextResponse.json({ error: "파일이 제공되지 않았습니다" }, { status: 400 })
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "파일 크기는 5MB 이하여야 합니다" }, { status: 400 })
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "이미지 파일만 업로드 가능합니다" }, { status: 400 })
    }

    // 고유한 파일명 생성
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`
    const filePath = `review_images/${fileName}`

    // ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Storage 버킷 확인 및 생성
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error("Bucket list error:", bucketsError)
      return NextResponse.json({ error: `스토리지 접근 오류: ${bucketsError.message}` }, { status: 500 })
    }

    const imagesBucket = buckets?.find(bucket => bucket.name === 'images')
    
    if (!imagesBucket) {
      console.log("Creating images bucket...")
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      })
      
      if (createError) {
        console.error("Bucket creation error:", createError)
        return NextResponse.json({ error: `스토리지 버킷 생성 실패: ${createError.message}` }, { status: 500 })
      }
    }

    // Supabase Storage에 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error("Supabase upload error:", uploadError)
      return NextResponse.json({ error: `업로드 실패: ${uploadError.message}` }, { status: 500 })
    }

    // 공개 URL 생성
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return NextResponse.json({
      url: urlData.publicUrl,
      filename: file.name,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "업로드 실패" },
      { status: 500 }
    )
  }
}

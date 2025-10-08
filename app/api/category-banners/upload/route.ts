import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { logEnvironmentStatus } from "@/lib/env-check"

export async function POST(request: NextRequest) {
  try {
    // 환경 변수 직접 확인 및 상세 로깅
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log("=== Environment Variables Check ===")
    console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅ Set" : "❌ Missing")
    console.log("SUPABASE_SERVICE_ROLE_KEY:", supabaseServiceKey ? "✅ Set" : "❌ Missing")
    console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✅ Set" : "❌ Missing")
    
    if (!supabaseUrl || !supabaseServiceKey) {
      const missing = []
      if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL")
      if (!supabaseServiceKey) missing.push("SUPABASE_SERVICE_ROLE_KEY")
      
      return NextResponse.json(
        { 
          error: "서버 설정 오류가 발생했습니다. 환경 변수를 확인해주세요.",
          details: `Missing variables: ${missing.join(", ")}`,
          debug: {
            hasUrl: !!supabaseUrl,
            hasServiceKey: !!supabaseServiceKey,
            hasAnonKey: !!supabaseAnonKey
          }
        },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!category || !category.startsWith('brand-')) {
      return NextResponse.json({ error: "Invalid category provided" }, { status: 400 })
    }

    // 브랜드 ID 추출 (brand-{brandId} 형식에서)
    const brandId = category.replace('brand-', '')
    
    console.log('Processing upload for brand ID:', brandId)
    
    // 임시 브랜드 ID인 경우 처리
    if (brandId === 'temp') {
      return NextResponse.json({ 
        error: "새 브랜드 생성 중입니다. 브랜드 저장 후 배너를 업로드해주세요.",
        code: "TEMP_BRAND_ID"
      }, { status: 400 })
    }

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File size too large. Maximum 5MB allowed." }, { status: 400 })
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 })
    }

    // Generate unique filename
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}-${file.name}`
    const filePath = `category-banners/${category}/${fileName}`

    // Convert File to ArrayBuffer
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

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error("Supabase upload error:", error)
      return NextResponse.json({ error: `업로드 실패: ${error.message}` }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    // 기존 브랜드 정보 가져오기
    const { data: existingBrand, error: brandFetchError } = await supabase
      .from('brands')
      .select('banner_images, banner_titles, banner_descriptions')
      .eq('id', brandId)
      .single()

    if (brandFetchError) {
      console.error("Brand fetch error:", brandFetchError)
      // 파일은 업로드되었지만 DB 저장 실패 시 파일 삭제
      await supabase.storage.from('images').remove([filePath])
      return NextResponse.json({ error: `Brand not found: ${brandFetchError.message}` }, { status: 404 })
    }

    // 기존 배너 배열에 새 배너 추가
    const existingImages = existingBrand.banner_images || []
    const existingTitles = existingBrand.banner_titles || []
    const existingDescriptions = existingBrand.banner_descriptions || []

    const newImages = [...existingImages, urlData.publicUrl]
    const newTitles = [...existingTitles, '']
    const newDescriptions = [...existingDescriptions, '']

    // 브랜드 정보 업데이트
    const { data: updatedBrand, error: updateError } = await supabase
      .from('brands')
      .update({
        banner_images: newImages,
        banner_titles: newTitles,
        banner_descriptions: newDescriptions,
        updated_at: new Date().toISOString()
      })
      .eq('id', brandId)
      .select()
      .single()

    if (updateError) {
      console.error("Brand update error:", updateError)
      // 파일은 업로드되었지만 DB 저장 실패 시 파일 삭제
      await supabase.storage.from('images').remove([filePath])
      return NextResponse.json({ error: `Database error: ${updateError.message}` }, { status: 500 })
    }

    return NextResponse.json({
      id: `${brandId}-${newImages.length - 1}`, // 임시 ID 생성
      url: urlData.publicUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
      category: category,
      index: newImages.length - 1
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Upload failed" 
    }, { status: 500 })
  }
}

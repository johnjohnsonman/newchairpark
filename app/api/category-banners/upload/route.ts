import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
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
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!category) {
      return NextResponse.json({ error: "No category provided" }, { status: 400 })
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
      return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    // 브랜드 ID 추출 (brand-{brandId} 형식에서)
    const brandId = category.replace('brand-', '')
    
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

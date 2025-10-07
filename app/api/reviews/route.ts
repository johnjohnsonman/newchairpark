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
    const body = await request.json()
    
    const {
      brand_id,
      product_name,
      title,
      comment,
      rating,
      user_name,
      user_email,
      age,
      occupation,
      sitting_style,
      satisfaction_score,
      design_score,
      comfort_score,
      value_score,
      verified_purchase,
      images,
      user_id
    } = body

    // 필수 필드 검증
    if (!brand_id || !product_name || !title || !comment || !rating || !user_name) {
      return NextResponse.json(
        { error: "필수 필드가 누락되었습니다" },
        { status: 400 }
      )
    }

    // 브랜드 존재 확인
    const { data: brand, error: brandError } = await supabase
      .from("brands")
      .select("id, name")
      .eq("id", brand_id)
      .single()

    if (brandError || !brand) {
      return NextResponse.json(
        { error: "존재하지 않는 브랜드입니다" },
        { status: 400 }
      )
    }

    // 평점 검증
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "평점은 1-5 사이여야 합니다" },
        { status: 400 }
      )
    }

    // 리뷰 생성
    const { data: review, error: reviewError } = await supabase
      .from("reviews")
      .insert([
        {
          brand_id,
          brand: brand.name, // 브랜드명도 함께 저장
          product_name,
          title,
          comment,
          rating,
          user_name,
          user_email: user_email || null,
          age: age ? parseInt(age) : null,
          occupation: occupation || null,
          sitting_style: sitting_style || null,
          satisfaction_score: satisfaction_score || null,
          design_score: design_score || null,
          comfort_score: comfort_score || null,
          value_score: value_score || null,
          verified_purchase: verified_purchase || false,
          images: images || [],
          user_id: user_id || null,
          view_count: 0,
          helpful_count: 0,
          featured: false,
        }
      ])
      .select()
      .single()

    if (reviewError) {
      console.error("Review creation error:", reviewError)
      return NextResponse.json(
        { error: "리뷰 작성에 실패했습니다" },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      id: review.id,
      message: "리뷰가 성공적으로 작성되었습니다" 
    })
  } catch (error) {
    console.error("Review API error:", error)
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    )
  }
}

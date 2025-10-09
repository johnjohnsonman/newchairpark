import { createServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    
    const exclude = searchParams.get('exclude')
    const brandId = searchParams.get('brand_id')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '8')

    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        original_price,
        images,
        image_url,
        in_stock,
        featured,
        category,
        brand_id,
        brands!inner(name)
      `)
      .eq('in_stock', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit * 2) // 더 많이 가져와서 필터링 후 정확한 개수 맞추기

    // 현재 제품 제외
    if (exclude) {
      query = query.neq('id', exclude)
    }

    // 같은 브랜드 제품 우선
    if (brandId) {
      query = query.or(`brand_id.eq.${brandId},brand_id.neq.${brandId}`)
    }

    // 같은 카테고리 제품 우선
    if (category) {
      query = query.or(`category.eq.${category},category.neq.${category}`)
    }

    const { data: products, error } = await query

    if (error) {
      console.error('Error fetching recommended products:', error)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }

    if (!products || products.length === 0) {
      return NextResponse.json({ products: [] })
    }

    // 추천 로직: 같은 브랜드 > 같은 카테고리 > 기타
    const sortedProducts = products.sort((a, b) => {
      let scoreA = 0
      let scoreB = 0

      // 브랜드 매칭 점수
      if (brandId) {
        if (a.brand_id === brandId) scoreA += 3
        if (b.brand_id === brandId) scoreB += 3
      }

      // 카테고리 매칭 점수
      if (category) {
        if (a.category === category) scoreA += 2
        if (b.category === category) scoreB += 2
      }

      // 추천 제품 점수
      if (a.featured) scoreA += 1
      if (b.featured) scoreB += 1

      return scoreB - scoreA
    })

    // 정확한 개수만 반환
    const limitedProducts = sortedProducts.slice(0, limit)

    return NextResponse.json({ 
      products: limitedProducts,
      total: limitedProducts.length
    })

  } catch (error) {
    console.error('Recommended products API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductFormWrapper } from "@/components/admin/product-form-wrapper"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServerClient()

    console.log('🔍 Fetching product with ID:', id)

    // 제품 데이터 가져오기 (더 자세한 에러 로깅)
    const { data: product, error: productError } = await supabase
      .from("products")
      .select(`
        *,
        brands (
          id,
          name
        )
      `)
      .eq("id", id)
      .single()

    console.log('📦 Product fetch result:', { product, productError })

    if (productError) {
      console.error('❌ Product fetch error:', productError)
      if (productError.code === 'PGRST116') {
        // 제품이 존재하지 않음
        console.log('🚫 Product not found')
        notFound()
      } else {
        console.error('🔥 Database error:', productError)
        throw new Error(`Failed to fetch product: ${productError.message}`)
      }
    }

    if (!product) {
      console.log('🚫 No product data returned')
      notFound()
    }

    // 브랜드 데이터 가져오기 (브랜드 관리 페이지와 동일한 방식)
    const brandsPromise = supabase
      .from("brands")
      .select("id, name, slug")
      .order("name")
      .limit(30) // 최대 30개로 제한

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Brands fetch timeout')), 3000)
    )

    let brands: any[] = []
    let brandsError: any = null

    try {
      const brandsResult = await Promise.race([brandsPromise, timeoutPromise]) as any
      brands = brandsResult.data || []
      brandsError = brandsResult.error
      console.log('🏷️ Brands fetched for edit:', brands.length, brands)
    } catch (brandsTimeoutError) {
      console.error('⚠️ Brands fetch timeout:', brandsTimeoutError)
      brandsError = brandsTimeoutError
    }

    if (brandsError) {
      console.error('❌ Brands fetch error:', brandsError)
    }

    console.log('✅ Product page data loaded successfully')

    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Product</h1>
          {product.name && (
            <p className="text-gray-600 mt-2">Editing: {product.name}</p>
          )}
          {brands.length > 0 && (
            <p className="text-sm text-green-600 mt-1">
              {brands.length}개의 브랜드를 불러왔습니다: {brands.map(b => b.name).join(', ')}
            </p>
          )}
        </div>
        <ProductFormWrapper product={product} brands={brands} />
      </div>
    )
  } catch (error) {
    console.error('💥 Edit product page error:', error)
    notFound()
  }
}

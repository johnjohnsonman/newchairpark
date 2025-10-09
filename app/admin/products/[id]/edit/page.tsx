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

    // 브랜드 데이터 가져오기 (실패해도 계속 진행)
    let brands: any[] = []
    try {
      const { data: brandsData, error: brandsError } = await supabase
        .from("brands")
        .select("id, name, slug")
        .order("name")
      
      if (brandsError) {
        console.error('⚠️ Brands fetch error:', brandsError)
      } else {
        brands = brandsData || []
        console.log('🏷️ Brands fetched:', brands.length)
      }
    } catch (brandsErr) {
      console.error('⚠️ Brands fetch exception:', brandsErr)
    }

    console.log('✅ Product page data loaded successfully')

    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Product</h1>
          {product.name && (
            <p className="text-gray-600 mt-2">Editing: {product.name}</p>
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

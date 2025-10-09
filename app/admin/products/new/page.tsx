import { createServerClient } from "@/lib/supabase/server"
import { ProductFormWrapper } from "@/components/admin/product-form-wrapper"

export default async function NewProductPage() {
  const supabase = await createServerClient()

  console.log('🆕 Loading new product page...')

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
  let error: any = null

  try {
    const result = await Promise.race([brandsPromise, timeoutPromise]) as any
    brands = result.data || []
    error = result.error
    console.log('🏷️ Brands fetched for new product:', brands.length, brands)
  } catch (timeoutError) {
    console.error('⚠️ Brands fetch timeout:', timeoutError)
    error = timeoutError
  }

  if (error) {
    console.error('❌ Brands fetch error:', error)
  }

  console.log('✅ New product page data loaded')

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <p className="text-gray-600 mt-2">새로운 제품을 추가합니다.</p>
        {brands.length > 0 && (
          <p className="text-sm text-green-600 mt-1">
            {brands.length}개의 브랜드를 불러왔습니다: {brands.map(b => b.name).join(', ')}
          </p>
        )}
      </div>
      <ProductFormWrapper brands={brands} />
    </div>
  )
}

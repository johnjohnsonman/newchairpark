import { createServerClient } from "@/lib/supabase/server"
import { RentalFormWrapper } from "@/components/admin/rental-form-wrapper"

export default async function NewRentalPage() {
  const supabase = await createServerClient()

  // 브랜드 데이터 가져오기
  const brandsPromise = supabase
    .from("brands")
    .select("id, name, slug")
    .order("name")
    .limit(30)

  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Brands fetch timeout')), 3000)
  )

  let brands: any[] = []
  let error: any = null

  try {
    const result = await Promise.race([brandsPromise, timeoutPromise]) as any
    brands = result.data || []
    error = result.error
  } catch (timeoutError) {
    console.error('⚠️ Brands fetch timeout:', timeoutError)
    error = timeoutError
  }

  if (error) {
    console.error('❌ Brands fetch error:', error)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">렌탈/데모 추가</h1>
        <p className="text-gray-600 mt-2">새로운 렌탈 또는 데모 상품을 추가합니다.</p>
        {brands.length > 0 && (
          <p className="text-sm text-green-600 mt-1">
            {brands.length}개의 브랜드를 불러왔습니다
          </p>
        )}
      </div>
      <RentalFormWrapper brands={brands} />
    </div>
  )
}








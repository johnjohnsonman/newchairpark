import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { RentalFormWrapper } from "@/components/admin/rental-form-wrapper"

export default async function EditRentalPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServerClient()

    // 렌탈 데이터 가져오기
    const { data: rental, error: rentalError } = await supabase
      .from("rentals")
      .select(`
        *,
        brands (
          id,
          name
        )
      `)
      .eq("id", id)
      .single()

    if (rentalError) {
      console.error('❌ Rental fetch error:', rentalError)
      if (rentalError.code === 'PGRST116') {
        notFound()
      } else {
        throw new Error(`Failed to fetch rental: ${rentalError.message}`)
      }
    }

    if (!rental) {
      notFound()
    }

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
    let brandsError: any = null

    try {
      const brandsResult = await Promise.race([brandsPromise, timeoutPromise]) as any
      brands = brandsResult.data || []
      brandsError = brandsResult.error
    } catch (brandsTimeoutError) {
      console.error('⚠️ Brands fetch timeout:', brandsTimeoutError)
      brandsError = brandsTimeoutError
    }

    if (brandsError) {
      console.error('❌ Brands fetch error:', brandsError)
    }

    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">렌탈/데모 수정</h1>
          {rental.name && (
            <p className="text-gray-600 mt-2">수정 중: {rental.name}</p>
          )}
          {brands.length > 0 && (
            <p className="text-sm text-green-600 mt-1">
              {brands.length}개의 브랜드를 불러왔습니다
            </p>
          )}
        </div>
        <RentalFormWrapper rental={rental} brands={brands} />
      </div>
    )
  } catch (error) {
    console.error('💥 Edit rental page error:', error)
    notFound()
  }
}








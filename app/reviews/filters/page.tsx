import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ReviewFilters from "@/components/review-filters"

export default async function ReviewFiltersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await createServerClient()

  const productId = searchParams.product ? Number(searchParams.product) : null
  const brandSlug = searchParams.brand ? String(searchParams.brand) : null

  let productInfo = null
  let brandInfo = null

  if (productId) {
    const { data } = await supabase.from("products").select("id, name, brands(name, slug)").eq("id", productId).single()
    productInfo = data
  } else if (brandSlug) {
    const { data } = await supabase.from("brands").select("name, slug").eq("slug", brandSlug).single()
    brandInfo = data
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">리뷰 필터</h1>
            <p className="text-muted-foreground">원하는 조건으로 리뷰를 필터링하세요</p>
          </div>

          <ReviewFilters productInfo={productInfo} brandInfo={brandInfo} />
        </div>
      </div>
    </div>
  )
}

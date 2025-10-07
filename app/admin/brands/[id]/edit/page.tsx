import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { BrandForm } from "@/components/admin/brand-form"

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // 브랜드 정보를 먼저 가져오기
    const { data: brand, error: brandError } = await supabase
      .from("brands")
      .select("*")
      .eq("id", id)
      .single()

    if (brandError || !brand) {
      console.error('Brand not found:', { id, brandError })
      notFound()
    }

    // 브랜드 ID를 알았으니 배너 정보를 가져오기
    const { data: banners, error: bannersError } = await supabase
      .from("category_banners")
      .select("*")
      .eq("category", `brand-${brand.id}`)
      .order("order_index")

    if (bannersError) {
      console.error('Banners fetch error:', bannersError)
    }

    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Brand</h1>
        </div>
        <BrandForm brand={brand} initialBanners={banners || []} />
      </div>
    )
  } catch (error) {
    console.error('Edit brand page error:', error)
    notFound()
  }
}

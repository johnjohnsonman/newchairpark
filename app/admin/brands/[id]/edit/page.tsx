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

    // 브랜드 정보에서 배너 데이터 추출
    const banners = []
    if (brand.banner_images && Array.isArray(brand.banner_images)) {
      for (let i = 0; i < brand.banner_images.length; i++) {
        banners.push({
          id: `${brand.id}-${i}`,
          image_url: brand.banner_images[i],
          title: brand.banner_titles?.[i] || '',
          description: brand.banner_descriptions?.[i] || '',
          order_index: i
        })
      }
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

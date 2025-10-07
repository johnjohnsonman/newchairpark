import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import CategoryBannerForm from "@/components/admin/category-banner-form"

export default async function EditCategoryBannerPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServerClient()
    const { data: banner, error: bannerError } = await supabase.from("category_banners").select("*").eq("id", id).single()

    if (bannerError || !banner) {
      console.error('Banner not found:', { id, bannerError })
      notFound()
    }

    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">카테고리 배너 수정</h1>
        </div>
        <CategoryBannerForm banner={banner} />
      </div>
    )
  } catch (error) {
    console.error('Edit banner page error:', error)
    notFound()
  }
}

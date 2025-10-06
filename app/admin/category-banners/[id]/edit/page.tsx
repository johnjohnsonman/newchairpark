import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import CategoryBannerForm from "@/components/admin/category-banner-form"

export default async function EditCategoryBannerPage({ params }: { params: { id: string } }) {
  const supabase = await createServerClient()
  const { data: banner } = await supabase.from("category_banners").select("*").eq("id", params.id).single()

  if (!banner) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold">카테고리 배너 수정</h1>
        <CategoryBannerForm banner={banner} />
      </div>
    </div>
  )
}

import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { CategoryBannerEditForm } from "@/components/admin/category-banner-edit-form"

interface EditCategoryBannerPageProps {
  params: {
    id: string
  }
}

export default async function EditCategoryBannerPage({ params }: EditCategoryBannerPageProps) {
  const supabase = await createServerClient()
  const { data: banner } = await supabase
    .from("category_banners")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!banner) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">카테고리 배너 수정</h1>
          <p className="mt-2 text-muted-foreground">스토어 카테고리별 배너 이미지와 설명을 수정합니다</p>
        </div>

        <CategoryBannerEditForm banner={banner} />
      </div>
    </div>
  )
}
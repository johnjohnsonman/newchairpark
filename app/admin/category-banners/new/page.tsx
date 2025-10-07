import { CategoryBannerForm } from "@/components/admin/category-banner-form"

export default function NewCategoryBannerPage() {
  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">새 카테고리 배너 추가</h1>
          <p className="mt-2 text-muted-foreground">스토어 카테고리별 배너 이미지와 설명을 추가합니다</p>
        </div>

        <CategoryBannerForm />
      </div>
    </div>
  )
}

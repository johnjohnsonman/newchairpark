import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ReviewForm } from "@/components/review-form"

export default async function NewReviewPage() {
  const supabase = await createClient()

  // 로그인 여부 확인 (선택사항)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 제품 목록 가져오기 (리뷰 작성 시 선택용)
  const { data: products } = await supabase
    .from("products")
    .select("id, name, brands(name)")
    .order("name")

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold sm:text-4xl">리뷰 작성</h1>
            <p className="text-muted-foreground">
              {user ? `${user.email}님, ` : ""}솔직한 사용 후기를 남겨주세요
            </p>
          </div>

          <ReviewForm products={products || []} user={user} />
        </div>
      </div>
    </div>
  )
}

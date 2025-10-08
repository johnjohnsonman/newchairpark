import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ReviewForm } from "@/components/review-form"

export const dynamic = 'force-dynamic'

export default async function NewReviewPage() {
  const supabase = await createServerClient()

  // 로그인 여부 확인 (선택사항)
  const {
    data: { user },
  } = await supabase.auth.getUser()

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

          <ReviewForm user={user} />
        </div>
      </div>
    </div>
  )
}

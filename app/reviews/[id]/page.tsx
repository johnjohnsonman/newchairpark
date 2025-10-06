import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Star, Eye, ThumbsUp, User, Briefcase, Armchair } from "lucide-react"
import Link from "next/link"
import type { Review } from "@/types/database"
import RecommendButton from "@/components/recommend-button"

export default async function ReviewDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createServerClient()

  const { data: review } = await supabase.from("reviews").select("*").eq("id", params.id).single()

  if (!review) {
    notFound()
  }

  await supabase.rpc("increment_view_count", { review_id: params.id })

  const typedReview = review as Review

  const reviewImages =
    typedReview.images && typedReview.images.length > 0
      ? typedReview.images.slice(0, 4)
      : [
          `/placeholder.svg?height=600&width=600&query=office chair review main ${typedReview.user_name}`,
          `/placeholder.svg?height=600&width=600&query=ergonomic chair detail`,
          `/placeholder.svg?height=600&width=600&query=office chair side view`,
          `/placeholder.svg?height=600&width=600&query=chair comfort features`,
        ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Link href="/reviews" className="text-sm text-muted-foreground hover:text-primary">
            ← 리뷰 목록으로 돌아가기
          </Link>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="grid gap-4 md:grid-cols-2">
              {reviewImages.map((image, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${typedReview.title} - 이미지 ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 rounded-lg border bg-card p-8">
            <div className="mb-6 flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${i < typedReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  {typedReview.verified_purchase && (
                    <span className="rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-800">구매 인증</span>
                  )}
                </div>
                <h1 className="mb-4 text-3xl font-bold">{typedReview.title}</h1>
              </div>
            </div>

            <div className="mb-6 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {(typedReview.view_count + 1).toLocaleString()} 조회
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {typedReview.helpful_count} 추천
              </div>
              <div>{new Date(typedReview.created_at).toLocaleDateString("ko-KR")}</div>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-6 rounded-lg bg-muted/50 p-6 md:grid-cols-4">
              {typedReview.satisfaction_score && (
                <div className="text-center">
                  <div className="mb-1 text-3xl font-bold text-primary">{typedReview.satisfaction_score}</div>
                  <div className="text-sm text-muted-foreground">만족도</div>
                </div>
              )}
              {typedReview.design_score && (
                <div className="text-center">
                  <div className="mb-1 text-3xl font-bold text-primary">{typedReview.design_score}</div>
                  <div className="text-sm text-muted-foreground">디자인</div>
                </div>
              )}
              {typedReview.comfort_score && (
                <div className="text-center">
                  <div className="mb-1 text-3xl font-bold text-primary">{typedReview.comfort_score}</div>
                  <div className="text-sm text-muted-foreground">편안함</div>
                </div>
              )}
              {typedReview.value_score && (
                <div className="text-center">
                  <div className="mb-1 text-3xl font-bold text-primary">{typedReview.value_score}</div>
                  <div className="text-sm text-muted-foreground">가성비</div>
                </div>
              )}
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">{typedReview.comment}</p>
            </div>
          </div>

          <div className="mb-8 rounded-lg border bg-card p-8">
            <h2 className="mb-6 text-xl font-semibold">작성자 정보</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <User className="mt-1 h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="mb-1 text-sm font-medium text-muted-foreground">작성자</div>
                  <div className="font-medium">{typedReview.user_name}</div>
                </div>
              </div>

              {typedReview.age && (
                <div className="flex items-start gap-3">
                  <User className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="mb-1 text-sm font-medium text-muted-foreground">나이</div>
                    <div className="font-medium">{typedReview.age}세</div>
                  </div>
                </div>
              )}

              {typedReview.height && typedReview.weight && (
                <div className="flex items-start gap-3">
                  <User className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="mb-1 text-sm font-medium text-muted-foreground">체형</div>
                    <div className="font-medium">
                      {typedReview.height}cm / {typedReview.weight}kg
                    </div>
                  </div>
                </div>
              )}

              {typedReview.occupation && (
                <div className="flex items-start gap-3">
                  <Briefcase className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="mb-1 text-sm font-medium text-muted-foreground">직업</div>
                    <div className="font-medium">{typedReview.occupation}</div>
                  </div>
                </div>
              )}

              {typedReview.sitting_style && (
                <div className="flex items-start gap-3">
                  <Armchair className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="mb-1 text-sm font-medium text-muted-foreground">앉는 스타일</div>
                    <div className="font-medium">{typedReview.sitting_style}</div>
                  </div>
                </div>
              )}

              {typedReview.previous_chair && (
                <div className="flex items-start gap-3">
                  <Armchair className="mt-1 h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="mb-1 text-sm font-medium text-muted-foreground">이전 의자</div>
                    <div className="font-medium">{typedReview.previous_chair}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <RecommendButton reviewId={typedReview.id} initialCount={typedReview.helpful_count} />
          </div>
        </div>
      </div>
    </div>
  )
}

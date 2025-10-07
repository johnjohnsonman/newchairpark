import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Star, Eye, ThumbsUp, Calendar, User, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TouchOptimizedButton } from "@/components/ui/touch-optimized-button"
import Link from "next/link"

interface ReviewDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ReviewDetailPage({ params }: ReviewDetailPageProps) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // 리뷰 정보 가져오기
    const { data: review, error: reviewError } = await supabase
      .from("reviews")
      .select(`
        *,
        products (
          id,
          name,
          brands (
            name,
            slug
          )
        )
      `)
      .eq("id", id)
      .single()

    if (reviewError || !review) {
      console.error('Review not found:', { id, reviewError })
      notFound()
    }

    // 조회수 증가
    await supabase
      .from("reviews")
      .update({ view_count: review.view_count + 1 })
      .eq("id", id)

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="mx-auto max-w-4xl">
            {/* 뒤로가기 버튼 */}
            <div className="mb-6">
              <TouchOptimizedButton variant="ghost" asChild>
                <Link href="/reviews">
                  ← 리뷰 목록으로 돌아가기
                </Link>
              </TouchOptimizedButton>
            </div>

            {/* 리뷰 헤더 */}
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                {review.verified_purchase && (
                  <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                    구매 인증
                  </span>
                )}
              </div>
              
              <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{review.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {review.user_name}
                </div>
                {review.age && (
                  <div>{review.age}세</div>
                )}
                {review.occupation && (
                  <div>{review.occupation}</div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(review.created_at).toLocaleDateString("ko-KR")}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {review.view_count.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  {review.helpful_count}
                </div>
              </div>
            </div>

            {/* 제품 정보 */}
            {review.products && (
              <div className="mb-8 rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  리뷰한 제품
                </div>
                <Link 
                  href={`/store/${review.products.id}`}
                  className="mt-1 text-lg font-semibold hover:text-primary"
                >
                  {review.products.brands?.name} {review.products.name}
                </Link>
              </div>
            )}

            {/* 세부 평점 */}
            {(review.satisfaction_score ||
              review.design_score ||
              review.comfort_score ||
              review.value_score) && (
              <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {review.satisfaction_score && (
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{review.satisfaction_score}</div>
                    <div className="text-sm text-muted-foreground">전체 만족도</div>
                  </div>
                )}
                {review.design_score && (
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{review.design_score}</div>
                    <div className="text-sm text-muted-foreground">디자인</div>
                  </div>
                )}
                {review.comfort_score && (
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{review.comfort_score}</div>
                    <div className="text-sm text-muted-foreground">편안함</div>
                  </div>
                )}
                {review.value_score && (
                  <div className="rounded-lg border p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{review.value_score}</div>
                    <div className="text-sm text-muted-foreground">가성비</div>
                  </div>
                )}
              </div>
            )}

            {/* 리뷰 내용 */}
            <div className="mb-8">
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-lg leading-relaxed">{review.comment}</p>
              </div>
            </div>

            {/* 이미지 갤러리 */}
            {review.images && review.images.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-xl font-semibold">첨부 이미지</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {review.images.map((image: string, index: number) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                      <Image
                        src={image}
                        alt={`Review image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 추가 정보 */}
            {review.sitting_style && (
              <div className="mb-8 rounded-lg border p-4">
                <h3 className="mb-2 text-lg font-semibold">앉는 스타일</h3>
                <p className="text-muted-foreground">{review.sitting_style}</p>
              </div>
            )}

            {/* 액션 버튼 */}
            <div className="flex gap-4">
              <TouchOptimizedButton asChild>
                <Link href="/reviews/new">
                  나도 리뷰 작성하기
                </Link>
              </TouchOptimizedButton>
              <TouchOptimizedButton variant="outline" asChild>
                <Link href={`/store/${review.products?.id}`}>
                  제품 자세히 보기
                </Link>
              </TouchOptimizedButton>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Review detail page error:', error)
    notFound()
  }
}
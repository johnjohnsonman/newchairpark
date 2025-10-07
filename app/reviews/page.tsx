import { createServerClient } from "@/lib/supabase/server"
import FeaturedReviewsCarousel from "@/components/featured-reviews-carousel"
import ReviewFilters from "@/components/review-filters"
import Link from "next/link"
import Image from "next/image"
import { Star, Eye, ThumbsUp, Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TouchOptimizedButton } from "@/components/ui/touch-optimized-button"
import type { Review } from "@/types/database"

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await createServerClient()

  const productId = searchParams.product ? Number(searchParams.product) : null
  const brandSlug = searchParams.brand ? String(searchParams.brand) : null

  const ratings = searchParams.ratings
    ? String(searchParams.ratings)
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n))
    : []
  const ageMin = searchParams.ageMin ? Number(searchParams.ageMin) : null
  const ageMax = searchParams.ageMax ? Number(searchParams.ageMax) : null
  const occupations = searchParams.occupations ? String(searchParams.occupations).split(",") : []
  const sittingStyles = searchParams.sittingStyles ? String(searchParams.sittingStyles).split(",") : []
  const sortBy = searchParams.sortBy || "recent"

  let productInfo = null
  let brandInfo = null

  if (productId) {
    const { data } = await supabase.from("products").select("id, name, brands(name, slug)").eq("id", productId).single()
    productInfo = data
  } else if (brandSlug) {
    const { data } = await supabase.from("brands").select("name, slug").eq("slug", brandSlug).single()
    brandInfo = data
  }

  const { data: featuredReviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("featured", true)
    .order("view_count", { ascending: false })
    .limit(4)

  let query = supabase.from("reviews").select("*")

  if (productId) {
    query = query.eq("product_id", productId)
  }

  if (brandSlug && !productId) {
    const { data: brandProducts } = await supabase.from("products").select("id").eq("brands.slug", brandSlug)

    if (brandProducts && brandProducts.length > 0) {
      const productIds = brandProducts.map((p) => p.id)
      query = query.in("product_id", productIds)
    }
  }

  // Apply rating filter
  if (ratings.length > 0) {
    query = query.in("rating", ratings)
  }

  // Apply age filter
  if (ageMin !== null && ageMax !== null) {
    query = query.gte("age", ageMin).lte("age", ageMax)
  }

  // Apply occupation filter
  if (occupations.length > 0) {
    query = query.in("occupation", occupations)
  }

  // Apply sitting style filter
  if (sittingStyles.length > 0) {
    query = query.in("sitting_style", sittingStyles)
  }

  // Apply sorting
  switch (sortBy) {
    case "helpful":
      query = query.order("helpful_count", { ascending: false })
      break
    case "rating-high":
      query = query.order("rating", { ascending: false })
      break
    case "rating-low":
      query = query.order("rating", { ascending: true })
      break
    case "views":
      query = query.order("view_count", { ascending: false })
      break
    case "recent":
    default:
      query = query.order("created_at", { ascending: false })
      break
  }

  const { data: allReviews } = await query

  return (
    <div className="min-h-screen bg-background">
      <FeaturedReviewsCarousel reviews={(featuredReviews as Review[]) || []} />

      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold sm:text-4xl">고객 리뷰</h1>
              <p className="text-muted-foreground">실제 사용자들의 솔직한 의자 사용 후기를 확인하세요</p>
            </div>
            <TouchOptimizedButton asChild className="w-full sm:w-auto">
              <Link href="/reviews/new">
                <Plus className="mr-2 h-4 w-4" />
                리뷰 작성하기
              </Link>
            </TouchOptimizedButton>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <div className="sticky top-4">
              <ReviewFilters productInfo={productInfo} brandInfo={brandInfo} />
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{allReviews?.length || 0}개의 리뷰</p>
              <Button variant="outline" size="sm" className="lg:hidden" asChild>
                <Link href="/reviews/filters">
                  <Filter className="mr-2 h-4 w-4" />
                  필터
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {allReviews?.map((review: Review) => {
                const mainImage =
                  review.images && review.images.length > 0
                    ? review.images[0]
                    : `/placeholder.svg?height=400&width=400&query=office chair ${review.user_name}`

                return (
                  <Link
                    key={review.id}
                    href={`/reviews/${review.id}`}
                    className="block rounded-lg border bg-card transition-shadow hover:shadow-lg"
                  >
                    <div className="grid gap-6 p-6 md:grid-cols-[200px_1fr]">
                      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={mainImage || "/placeholder.svg"}
                          alt={review.title}
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                      </div>

                      <div>
                        <div className="mb-4 flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                  />
                                ))}
                              </div>
                              {review.verified_purchase && (
                                <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                  구매 인증
                                </span>
                              )}
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">{review.title}</h3>
                            <p className="line-clamp-2 text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>

                        <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">작성자:</span> {review.user_name}
                          </div>
                          {review.brand && (
                            <div>
                              <span className="font-medium">브랜드:</span> {review.brand}
                            </div>
                          )}
                          {review.product_name && (
                            <div>
                              <span className="font-medium">제품:</span> {review.product_name}
                            </div>
                          )}
                          {review.age && (
                            <div>
                              <span className="font-medium">나이:</span> {review.age}세
                            </div>
                          )}
                          {review.occupation && (
                            <div>
                              <span className="font-medium">직업:</span> {review.occupation}
                            </div>
                          )}
                        </div>

                        {(review.satisfaction_score ||
                          review.design_score ||
                          review.comfort_score ||
                          review.value_score) && (
                          <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                            {review.satisfaction_score && (
                              <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{review.satisfaction_score}</div>
                                <div className="text-xs text-muted-foreground">만족도</div>
                              </div>
                            )}
                            {review.design_score && (
                              <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{review.design_score}</div>
                                <div className="text-xs text-muted-foreground">디자인</div>
                              </div>
                            )}
                            {review.comfort_score && (
                              <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{review.comfort_score}</div>
                                <div className="text-xs text-muted-foreground">편안함</div>
                              </div>
                            )}
                            {review.value_score && (
                              <div className="text-center">
                                <div className="text-2xl font-bold text-primary">{review.value_score}</div>
                                <div className="text-xs text-muted-foreground">가성비</div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {review.view_count.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            {review.helpful_count}
                          </div>
                          <div>{new Date(review.created_at).toLocaleDateString("ko-KR")}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

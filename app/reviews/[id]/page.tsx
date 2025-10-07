import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ReviewDetail } from "@/components/review-detail"
import type { Metadata } from "next"

interface ReviewPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    const supabase = await createClient()
    const { data: review } = await supabase
      .from("reviews")
      .select("title, brand, product_name, user_name, rating, comment")
      .eq("id", id)
      .single()

    if (!review) {
      return {
        title: "리뷰를 찾을 수 없습니다 | 체어파크",
      }
    }

    return {
      title: `${review.title} - ${review.brand} ${review.product_name} 리뷰 | 체어파크`,
      description: `${review.user_name}님이 작성한 ${review.brand} ${review.product_name} 리뷰입니다. ${review.comment.substring(0, 150)}...`,
      openGraph: {
        title: `${review.title} - ${review.brand} ${review.product_name} 리뷰`,
        description: `${review.user_name}님이 작성한 ${review.brand} ${review.product_name} 리뷰입니다.`,
        type: "article",
        images: review.images && review.images.length > 0 ? [review.images[0]] : [],
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "리뷰 상세 | 체어파크",
    }
  }
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { id } = await params
  
  try {
    const supabase = await createClient()
    
    // 리뷰 데이터 가져오기
    const { data: review, error: reviewError } = await supabase
      .from("reviews")
      .select(`
        *,
        brands:brand_id (
          id,
          name,
          logo_url
        )
      `)
      .eq("id", id)
      .single()

    if (reviewError || !review) {
      console.error("Review fetch error:", reviewError)
      notFound()
    }

    // 조회수 증가
    await supabase
      .from("reviews")
      .update({ view_count: (review.view_count || 0) + 1 })
      .eq("id", id)

    return <ReviewDetail review={review} />
  } catch (error) {
    console.error("Error fetching review:", error)
    notFound()
  }
}
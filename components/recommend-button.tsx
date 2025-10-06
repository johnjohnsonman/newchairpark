"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"

interface RecommendButtonProps {
  reviewId: string
  initialCount: number
}

export default function RecommendButton({ reviewId, initialCount }: RecommendButtonProps) {
  const [count, setCount] = useState(initialCount)
  const [isRecommended, setIsRecommended] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRecommend = async () => {
    if (isRecommended || isLoading) return

    setIsLoading(true)
    const supabase = createBrowserClient()

    try {
      const userIdentifier = `user_${Date.now()}_${Math.random()}`

      const { error } = await supabase.from("review_recommendations").insert({
        review_id: reviewId,
        user_identifier: userIdentifier,
      })

      if (!error) {
        setCount(count + 1)
        setIsRecommended(true)

        await supabase
          .from("reviews")
          .update({ helpful_count: count + 1 })
          .eq("id", reviewId)
      }
    } catch (error) {
      console.error("Failed to recommend:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      size="lg"
      variant={isRecommended ? "secondary" : "default"}
      onClick={handleRecommend}
      disabled={isRecommended || isLoading}
      className="gap-2"
    >
      <ThumbsUp className={`h-5 w-5 ${isRecommended ? "fill-current" : ""}`} />
      {isRecommended ? "추천했습니다" : "이 리뷰가 도움이 되었나요?"} ({count})
    </Button>
  )
}

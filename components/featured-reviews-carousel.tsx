"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Eye, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import type { Review } from "@/types/database"

interface FeaturedReviewsCarouselProps {
  reviews: Review[]
}

export default function FeaturedReviewsCarousel({ reviews }: FeaturedReviewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying || reviews.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, reviews])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }

  if (reviews.length === 0) {
    return null
  }

  const currentReview = reviews[currentIndex]
  const mainImage =
    currentReview.images && currentReview.images.length > 0
      ? currentReview.images[0]
      : `/placeholder.svg?height=600&width=600&query=office chair review ${currentReview.user_name}`

  return (
    <div className="relative mb-12 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h2 className="mb-2 font-serif text-2xl font-light tracking-wide text-white">Featured Reviews</h2>
          <div className="mx-auto h-px w-24 bg-white/30"></div>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <Link href={`/reviews/${currentReview.id}`} className="block">
            <div className="grid gap-6 rounded-lg bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 md:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-700">
                <Image
                  src={mainImage || "/placeholder.svg"}
                  alt={currentReview.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < currentReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                        />
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold text-white">{currentReview.title}</h3>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {currentReview.view_count.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {currentReview.helpful_count}
                    </div>
                  </div>
                </div>

                <p className="mb-4 line-clamp-3 leading-relaxed text-gray-300">{currentReview.comment}</p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <div>
                    <span className="text-gray-500">작성자:</span> {currentReview.user_name}
                  </div>
                  {currentReview.age && (
                    <div>
                      <span className="text-gray-500">나이:</span> {currentReview.age}세
                    </div>
                  )}
                  {currentReview.occupation && (
                    <div>
                      <span className="text-gray-500">직업:</span> {currentReview.occupation}
                    </div>
                  )}
                  {currentReview.satisfaction_score && (
                    <div>
                      <span className="text-gray-500">만족도:</span> {currentReview.satisfaction_score}/5
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-x-12 -translate-y-1/2 text-white hover:bg-white/10"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-white hover:bg-white/10"
            onClick={goToNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index)
                setIsAutoPlaying(false)
              }}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

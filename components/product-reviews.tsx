"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, ThumbsUp, X } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface Review {
  id: string
  user_name: string
  rating: number
  title: string
  comment: string
  created_at: string
  helpful_count: number
  verified_purchase: boolean
  images?: string[]
}

interface ProductReviewsProps {
  productId: number
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

export function ProductReviews({ productId, reviews, averageRating, totalReviews }: ProductReviewsProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [user, setUser] = useState<User | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    comment: "",
  })
  const [currentImageUrl, setCurrentImageUrl] = useState("")
  const supabase = createBrowserClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase.auth])

  const handleAddImage = () => {
    if (currentImageUrl && imagePreviewUrls.length < 4) {
      setImagePreviewUrls([...imagePreviewUrls, currentImageUrl])
      setCurrentImageUrl("")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remainingSlots = 4 - imageFiles.length
    const filesToAdd = files.slice(0, remainingSlots)

    setImageFiles([...imageFiles, ...filesToAdd])

    // Create preview URLs
    filesToAdd.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviewUrls((prev) => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index))
    setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert("리뷰를 작성하려면 로그인이 필요합니다.")
      return
    }

    if (rating === 0) {
      alert("별점을 선택해주세요.")
      return
    }

    setIsUploading(true)

    try {
      let uploadedImageUrls: string[] = []

      // Upload images if any
      if (imageFiles.length > 0) {
        const formData = new FormData()
        imageFiles.forEach((file) => {
          formData.append("files", file)
        })

        const uploadResponse = await fetch("/api/upload-review-images", {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error("이미지 업로드에 실패했습니다")
        }

        const uploadData = await uploadResponse.json()
        uploadedImageUrls = uploadData.urls
      }

      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        user_id: user.id,
        user_name: user.email?.split("@")[0] || "익명",
        rating,
        title: formData.title,
        comment: formData.comment,
        images: uploadedImageUrls,
      })

      if (error) throw error

      alert("리뷰가 등록되었습니다.")
      setShowReviewForm(false)
      setRating(0)
      setImageFiles([])
      setImagePreviewUrls([])
      setFormData({ title: "", comment: "" })
      window.location.reload()
    } catch (error) {
      console.error("[v0] Error submitting review:", error)
      alert("리뷰 등록 중 오류가 발생했습니다.")
    } finally {
      setIsUploading(false)
    }
  }

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    percentage: totalReviews > 0 ? (reviews.filter((r) => r.rating === star).length / totalReviews) * 100 : 0,
  }))

  return (
    <div className="mt-16 border-t pt-16">
      <h2 className="mb-8 text-2xl font-bold">고객 리뷰</h2>

      <div className="mb-12 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-lg border p-6">
            <div className="mb-2 text-5xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="mb-4 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"
                  }`}
                />
              ))}
            </div>
            <p className="mb-6 text-sm text-muted-foreground">{totalReviews}개의 리뷰</p>

            <div className="space-y-2">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{star}점</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200">
                    <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="w-8 text-right text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>

            <Button onClick={() => setShowReviewForm(!showReviewForm)} className="mt-6 w-full">
              리뷰 작성하기
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {showReviewForm && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold">리뷰 작성</h3>
                {!user ? (
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center">
                    <p className="mb-3 text-sm text-yellow-800">리뷰를 작성하려면 로그인이 필요합니다.</p>
                    <Button onClick={() => (window.location.href = "/auth/login")} size="sm">
                      로그인하기
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label>평점</Label>
                      <div className="mt-2 flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="title">제목</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="comment">리뷰 내용</Label>
                      <Textarea
                        id="comment"
                        rows={4}
                        value={formData.comment}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <Label>이미지 추가 (최대 4개)</Label>
                      <div className="mt-2 space-y-3">
                        {imageFiles.length < 4 && (
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handleFileChange}
                              className="flex-1"
                            />
                            <div className="text-sm text-muted-foreground">{imageFiles.length}/4</div>
                          </div>
                        )}
                        {imagePreviewUrls.length > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                            {imagePreviewUrls.map((url, index) => (
                              <div
                                key={index}
                                className="group relative aspect-square overflow-hidden rounded-lg border"
                              >
                                <Image
                                  src={url || "/placeholder.svg"}
                                  alt={`Preview ${index + 1}`}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 50vw, 25vw"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute right-1 top-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" disabled={isUploading}>
                        {isUploading ? "업로드 중..." : "리뷰 등록"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                        취소
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-semibold">{review.user_name}</span>
                        {review.verified_purchase && (
                          <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                            구매 인증
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h4 className="mb-2 font-semibold">{review.title}</h4>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{review.comment}</p>

                  {review.images && review.images.length > 0 && (
                    <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {review.images.map((image, index) => (
                        <div key={index} className="relative aspect-square overflow-hidden rounded-lg border">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Review ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 50vw, 25vw"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ThumbsUp className="h-4 w-4" />
                    <span>도움이 됐어요 ({review.helpful_count})</span>
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

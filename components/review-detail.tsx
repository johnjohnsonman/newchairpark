"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowLeft, Heart, MessageCircle, Share2, Clock, User, Ruler, Users, Briefcase } from "lucide-react"
import { TouchOptimizedButton } from "@/components/ui/touch-optimized-button"
import { ReviewImageCarousel } from "@/components/review-image-carousel"
import Image from "next/image"

interface ReviewDetailProps {
  review: any
}

export function ReviewDetail({ review }: ReviewDetailProps) {
  const router = useRouter()
  const [isHelpful, setIsHelpful] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0)

  const handleHelpful = async () => {
    if (isHelpful) return
    
    setIsHelpful(true)
    setHelpfulCount(prev => prev + 1)
    
    // TODO: API 호출로 도움됨 카운트 증가
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: review.title,
          text: review.comment.substring(0, 100) + "...",
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // 폴백: URL 복사
      navigator.clipboard.writeText(window.location.href)
      alert("링크가 복사되었습니다!")
    }
  }

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-sm text-muted-foreground">({rating}/5)</span>
    </div>
  )

  const getGenderText = (gender: string) => {
    switch (gender) {
      case "male": return "남성"
      case "female": return "여성"
      case "other": return "기타"
      default: return ""
    }
  }

  const getSittingDurationText = (duration: string) => {
    switch (duration) {
      case "under-4": return "4시간 미만"
      case "4-6": return "4-6시간"
      case "6-8": return "6-8시간"
      case "8-10": return "8-10시간"
      case "over-10": return "10시간 이상"
      default: return ""
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* 뒤로가기 버튼 */}
        <TouchOptimizedButton
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로가기
        </TouchOptimizedButton>

        <div className="mx-auto max-w-4xl">
          {/* 리뷰 헤더 */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{review.brand}</Badge>
                    <Badge variant="outline">{review.product_name}</Badge>
                    {review.verified_purchase && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        구매인증
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl mb-2">{review.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {review.user_name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(review.created_at).toLocaleDateString('ko-KR')}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      조회 {review.view_count || 0}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TouchOptimizedButton
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="flex items-center gap-1"
                  >
                    <Share2 className="h-4 w-4" />
                    공유
                  </TouchOptimizedButton>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* 메인 콘텐츠 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 이미지 캐러셀 */}
              {review.images && review.images.length > 0 && (
                <Card>
                  <CardContent className="p-0">
                    <ReviewImageCarousel images={review.images} />
                  </CardContent>
                </Card>
              )}

              {/* 리뷰 내용 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">리뷰 내용</CardTitle>
                    {renderStars(review.rating)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-base leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 세부 평점 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">세부 평점</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">전체 만족도</span>
                      {renderStars(review.satisfaction_score || 0)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">디자인</span>
                      {renderStars(review.design_score || 0)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">편안함</span>
                      {renderStars(review.comfort_score || 0)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">가성비</span>
                      {renderStars(review.value_score || 0)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 사이드바 */}
            <div className="space-y-6">
              {/* 작성자 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">작성자 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{review.user_name}</span>
                  </div>
                  {review.age && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{review.age}세</span>
                    </div>
                  )}
                  {review.height && (
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{review.height}cm</span>
                    </div>
                  )}
                  {review.gender && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{getGenderText(review.gender)}</span>
                    </div>
                  )}
                  {review.occupation && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{review.occupation}</span>
                    </div>
                  )}
                  {review.sitting_duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">하루 {getSittingDurationText(review.sitting_duration)}</span>
                    </div>
                  )}
                  {review.sitting_style && (
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-1">앉는 스타일</p>
                      <p className="text-sm">{review.sitting_style}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 도움됨 버튼 */}
              <Card>
                <CardContent className="pt-6">
                  <TouchOptimizedButton
                    variant={isHelpful ? "default" : "outline"}
                    onClick={handleHelpful}
                    disabled={isHelpful}
                    className="w-full flex items-center gap-2"
                  >
                    <Heart className={`h-4 w-4 ${isHelpful ? "fill-red-500 text-red-500" : ""}`} />
                    도움됨 ({helpfulCount})
                  </TouchOptimizedButton>
                </CardContent>
              </Card>

              {/* 관련 제품 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">관련 제품</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {review.brands?.logo_url && (
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg border">
                          <Image
                            src={review.brands.logo_url}
                            alt={review.brands.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{review.brands?.name || review.brand}</p>
                        <p className="text-xs text-muted-foreground">{review.product_name}</p>
                      </div>
                    </div>
                    <TouchOptimizedButton
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push(`/brand/${review.brands?.name?.toLowerCase().replace(/\s+/g, '-') || review.brand.toLowerCase().replace(/\s+/g, '-')}`)}
                    >
                      브랜드 페이지 보기
                    </TouchOptimizedButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

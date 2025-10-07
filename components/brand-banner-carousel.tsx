"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TouchOptimizedButton } from "@/components/ui/touch-optimized-button"
import { cn } from "@/lib/utils"

import type { CategoryBanner } from "@/types/database"

interface BrandBanner {
  id: string
  image_url: string
  title?: string
  description?: string
  link_url?: string
  order_index: number
}

interface BrandBannerCarouselProps {
  banners: BrandBanner[]
  brandName: string
  className?: string
}

export function BrandBannerCarousel({ banners, brandName, className }: BrandBannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // 자동 슬라이드 기능
  useEffect(() => {
    if (!isAutoPlaying || banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
    }, 5000) // 5초마다 자동 슬라이드

    return () => clearInterval(interval)
  }, [isAutoPlaying, banners.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length)
    setIsAutoPlaying(false) // 수동 조작 시 자동 재생 중지
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
    setIsAutoPlaying(false) // 수동 조작 시 자동 재생 중지
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false) // 수동 조작 시 자동 재생 중지
  }

  // 터치 스와이프 처리
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && banners.length > 1) {
      goToNext()
    }
    if (isRightSwipe && banners.length > 1) {
      goToPrevious()
    }
  }

  if (!banners || banners.length === 0) {
    return (
      <div className={cn("relative h-64 bg-gray-100 rounded-lg flex items-center justify-center sm:h-80", className)}>
        <div className="text-center text-gray-500 px-4">
          <div className="text-base font-medium sm:text-lg">{brandName} 배너</div>
          <div className="text-xs sm:text-sm">등록된 배너가 없습니다</div>
        </div>
      </div>
    )
  }

  if (banners.length === 1) {
    return (
      <div className={cn("relative h-64 rounded-lg overflow-hidden sm:h-80", className)}>
        <Image
          src={banners[0].image_url}
          alt={banners[0].title || `${brandName} 배너`}
          fill
          className="object-cover"
          priority
        />
        {(banners[0].title || banners[0].description) && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center text-white p-4 sm:p-6">
              {banners[0].title && <h3 className="text-lg font-bold mb-2 sm:text-2xl">{banners[0].title}</h3>}
              {banners[0].description && <p className="text-sm opacity-90 sm:text-lg">{banners[0].description}</p>}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div 
      className={cn("relative h-64 rounded-lg overflow-hidden group sm:h-80", className)}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 메인 이미지 */}
      <div className="relative h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              index === currentIndex ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={banner.image_url}
              alt={banner.title || `${brandName} 배너 ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {(banner.title || banner.description) && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white p-4 max-w-2xl sm:p-6">
                  {banner.title && <h3 className="text-lg font-bold mb-2 sm:text-2xl">{banner.title}</h3>}
                  {banner.description && <p className="text-sm opacity-90 sm:text-lg">{banner.description}</p>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 네비게이션 버튼 */}
      {banners.length > 1 && (
        <>
          <TouchOptimizedButton
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity sm:left-4"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </TouchOptimizedButton>
          <TouchOptimizedButton
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity sm:right-4"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </TouchOptimizedButton>
        </>
      )}

      {/* 인디케이터 도트 */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:bottom-4 sm:gap-2">
          {banners.map((_, index) => (
            <TouchOptimizedButton
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300 p-0",
                index === currentIndex 
                  ? "bg-white scale-125" 
                  : "bg-white/50 hover:bg-white/75"
              )}
            />
          ))}
        </div>
      )}

      {/* 슬라이드 카운터 */}
      {banners.length > 1 && (
        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full sm:top-4 sm:right-4 sm:text-sm sm:px-3">
          {currentIndex + 1} / {banners.length}
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TouchOptimizedButton } from "@/components/ui/touch-optimized-button"

interface GalleryViewerProps {
  images: string[]
  title: string
  initialIndex?: number
}

export function GalleryViewer({ images, title, initialIndex = 0 }: GalleryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious()
    if (e.key === "ArrowRight") goToNext()
    if (e.key === "Escape") setIsFullscreen(false)
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

    if (isLeftSwipe && images.length > 1) {
      goToNext()
    }
    if (isRightSwipe && images.length > 1) {
      goToPrevious()
    }
  }

  // 키보드 네비게이션을 위한 포커스 관리
  useEffect(() => {
    const handleKeyDownGlobal = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious()
      if (e.key === "ArrowRight") goToNext()
      if (e.key === "Escape") setIsFullscreen(false)
    }

    document.addEventListener("keydown", handleKeyDownGlobal)
    return () => document.removeEventListener("keydown", handleKeyDownGlobal)
  }, [])

  return (
    <>
      {/* 메인 갤러리 뷰 */}
      <section className="py-8 px-4 bg-gradient-to-b from-slate-50 to-white sm:py-16 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* 메인 이미지 프레임 */}
          <div 
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* 미술관 스타일 프레임 */}
            <div className="relative bg-white p-4 shadow-2xl mx-auto max-w-5xl sm:p-8 md:p-12">
              {/* 내부 프레임 */}
              <div className="relative border-4 border-slate-100 sm:border-8">
                {/* 이미지 컨테이너 */}
                <div className="relative aspect-[4/3] bg-slate-50">
                  <Image
                    src={images[currentIndex]}
                    alt={`${title} - ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  />
                  
                  {/* 확대 버튼 */}
                  <TouchOptimizedButton
                    onClick={() => setIsFullscreen(true)}
                    className="absolute top-2 right-2 bg-white/90 text-slate-900 hover:bg-white shadow-lg sm:top-4 sm:right-4"
                    size="sm"
                  >
                    <ZoomIn className="w-3 h-3 mr-1 sm:w-4 sm:h-4 sm:mr-2" />
                    <span className="hidden sm:inline">확대</span>
                  </TouchOptimizedButton>
                </div>
              </div>

              {/* 작품 플레이트 (프레임 하단) */}
              <div className="mt-4 text-center sm:mt-6">
                <p className="text-slate-600 text-xs sm:text-sm">
                  {currentIndex + 1} / {images.length}
                </p>
              </div>
            </div>

            {/* 네비게이션 버튼 - 모바일에서는 더 크게 */}
            {images.length > 1 && (
              <>
                <TouchOptimizedButton
                  onClick={goToPrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full w-12 h-12 shadow-xl bg-white text-slate-900 hover:bg-slate-100 sm:left-0 sm:w-14 sm:h-14"
                  size="icon"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </TouchOptimizedButton>
                <TouchOptimizedButton
                  onClick={goToNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full w-12 h-12 shadow-xl bg-white text-slate-900 hover:bg-slate-100 sm:right-0 sm:w-14 sm:h-14"
                  size="icon"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </TouchOptimizedButton>
              </>
            )}
          </div>

          {/* 썸네일 갤러리 */}
          {images.length > 1 && (
            <div className="mt-8 sm:mt-12">
              <div className="flex gap-2 justify-center flex-wrap max-w-4xl mx-auto sm:gap-4">
                {images.map((image, index) => (
                  <TouchOptimizedButton
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative group transition-all duration-300 p-0 ${
                      index === currentIndex
                        ? "ring-4 ring-slate-900 scale-105"
                        : "ring-2 ring-slate-200 hover:ring-slate-400"
                    }`}
                  >
                    {/* 미니 프레임 효과 */}
                    <div className="bg-white p-1 shadow-lg sm:p-2">
                      <div className="relative w-16 h-16 border-2 border-slate-100 sm:w-24 sm:h-24">
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    </div>
                    {/* 번호 표시 */}
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium shadow-lg sm:-bottom-2 sm:-right-2 sm:w-6 sm:h-6 ${
                      index === currentIndex
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-600"
                    }`}>
                      {index + 1}
                    </div>
                  </TouchOptimizedButton>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 전체화면 모드 */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm"
          onClick={() => setIsFullscreen(false)}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          tabIndex={0}
        >
          {/* 닫기 버튼 */}
          <TouchOptimizedButton
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 text-white hover:bg-white/20 sm:top-6 sm:right-6"
            size="icon"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </TouchOptimizedButton>

          {/* 이미지 카운터 */}
          <div className="absolute top-4 left-4 z-10 text-white text-base sm:top-6 sm:left-6 sm:text-lg">
            {currentIndex + 1} / {images.length}
          </div>

          {/* 메인 이미지 */}
          <div className="relative h-full flex items-center justify-center p-4 sm:p-6">
            <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
              <Image
                src={images[currentIndex]}
                alt={`${title} - ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {/* 네비게이션 */}
          {images.length > 1 && (
            <>
              <TouchOptimizedButton
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full w-12 h-12 bg-white/10 text-white hover:bg-white/20 sm:left-6 sm:w-16 sm:h-16"
                size="icon"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </TouchOptimizedButton>
              <TouchOptimizedButton
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full w-12 h-12 bg-white/10 text-white hover:bg-white/20 sm:right-6 sm:w-16 sm:h-16"
                size="icon"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </TouchOptimizedButton>
            </>
          )}

          {/* 썸네일 스트립 */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 sm:bottom-6">
              <div className="flex gap-1 bg-white/10 backdrop-blur-md p-2 rounded-full sm:gap-2 sm:p-3">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentIndex(index)
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-white w-6 sm:w-8"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}


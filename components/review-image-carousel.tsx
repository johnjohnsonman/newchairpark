"use client"

import React, { useState } from "react"
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react"
import { TouchOptimizedButton } from "@/components/ui/touch-optimized-button"
import Image from "next/image"

interface ReviewImageCarouselProps {
  images: string[]
}

export function ReviewImageCarousel({ images }: ReviewImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const openFullscreen = () => {
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
  }

  if (images.length === 0) return null

  return (
    <>
      {/* 메인 캐러셀 */}
      <div className="relative">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={images[currentIndex]}
            alt={`Review image ${currentIndex + 1}`}
            fill
            className="object-cover"
            priority
          />
          
          {/* 네비게이션 버튼 */}
          {images.length > 1 && (
            <>
              <TouchOptimizedButton
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </TouchOptimizedButton>
              
              <TouchOptimizedButton
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={goToNext}
              >
                <ChevronRight className="h-4 w-4" />
              </TouchOptimizedButton>
            </>
          )}

          {/* 확대 버튼 */}
          <TouchOptimizedButton
            variant="secondary"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70"
            onClick={openFullscreen}
          >
            <Maximize2 className="h-4 w-4" />
          </TouchOptimizedButton>

          {/* 이미지 카운터 */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* 썸네일 네비게이션 */}
        {images.length > 1 && (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  index === currentIndex 
                    ? "border-primary ring-2 ring-primary/20" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 풀스크린 모달 */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="relative h-full w-full">
            {/* 닫기 버튼 */}
            <TouchOptimizedButton
              variant="secondary"
              size="icon"
              className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={closeFullscreen}
            >
              <X className="h-5 w-5" />
            </TouchOptimizedButton>

            {/* 메인 이미지 */}
            <div className="flex h-full items-center justify-center p-4">
              <div className="relative h-full w-full max-w-4xl">
                <Image
                  src={images[currentIndex]}
                  alt={`Review image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* 풀스크린 네비게이션 */}
            {images.length > 1 && (
              <>
                <TouchOptimizedButton
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-6 w-6" />
                </TouchOptimizedButton>
                
                <TouchOptimizedButton
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </TouchOptimizedButton>

                {/* 풀스크린 썸네일 */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <div className="flex gap-2 overflow-x-auto rounded-lg bg-black/50 p-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`relative h-12 w-12 flex-shrink-0 overflow-hidden rounded border-2 transition-all ${
                          index === currentIndex 
                            ? "border-white" 
                            : "border-gray-400 hover:border-gray-200"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* 풀스크린 카운터 */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 rounded-full bg-black/50 px-4 py-2 text-white">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

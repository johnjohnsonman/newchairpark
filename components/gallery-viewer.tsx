"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GalleryViewerProps {
  images: string[]
  title: string
  initialIndex?: number
}

export function GalleryViewer({ images, title, initialIndex = 0 }: GalleryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isFullscreen, setIsFullscreen] = useState(false)

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

  return (
    <>
      {/* 메인 갤러리 뷰 */}
      <section className="py-16 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          {/* 메인 이미지 프레임 */}
          <div className="relative">
            {/* 미술관 스타일 프레임 */}
            <div className="relative bg-white p-8 md:p-12 shadow-2xl mx-auto max-w-5xl">
              {/* 내부 프레임 */}
              <div className="relative border-8 border-slate-100">
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
                  <Button
                    onClick={() => setIsFullscreen(true)}
                    className="absolute top-4 right-4 bg-white/90 text-slate-900 hover:bg-white shadow-lg"
                    size="sm"
                  >
                    <ZoomIn className="w-4 h-4 mr-2" />
                    확대
                  </Button>
                </div>
              </div>

              {/* 작품 플레이트 (프레임 하단) */}
              <div className="mt-6 text-center">
                <p className="text-slate-600 text-sm">
                  {currentIndex + 1} / {images.length}
                </p>
              </div>
            </div>

            {/* 네비게이션 버튼 */}
            {images.length > 1 && (
              <>
                <Button
                  onClick={goToPrevious}
                  className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full w-14 h-14 shadow-xl bg-white text-slate-900 hover:bg-slate-100"
                  size="icon"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  onClick={goToNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full w-14 h-14 shadow-xl bg-white text-slate-900 hover:bg-slate-100"
                  size="icon"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
          </div>

          {/* 썸네일 갤러리 */}
          {images.length > 1 && (
            <div className="mt-12">
              <div className="flex gap-4 justify-center flex-wrap max-w-4xl mx-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative group transition-all duration-300 ${
                      index === currentIndex
                        ? "ring-4 ring-slate-900 scale-105"
                        : "ring-2 ring-slate-200 hover:ring-slate-400"
                    }`}
                  >
                    {/* 미니 프레임 효과 */}
                    <div className="bg-white p-2 shadow-lg">
                      <div className="relative w-24 h-24 border-2 border-slate-100">
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
                    <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shadow-lg ${
                      index === currentIndex
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-600"
                    }`}>
                      {index + 1}
                    </div>
                  </button>
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
          tabIndex={0}
        >
          {/* 닫기 버튼 */}
          <Button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 z-10 rounded-full bg-white/10 text-white hover:bg-white/20"
            size="icon"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* 이미지 카운터 */}
          <div className="absolute top-6 left-6 z-10 text-white text-lg">
            {currentIndex + 1} / {images.length}
          </div>

          {/* 메인 이미지 */}
          <div className="relative h-full flex items-center justify-center p-6">
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
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full w-16 h-16 bg-white/10 text-white hover:bg-white/20"
                size="icon"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full w-16 h-16 bg-white/10 text-white hover:bg-white/20"
                size="icon"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          {/* 썸네일 스트립 */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
              <div className="flex gap-2 bg-white/10 backdrop-blur-md p-3 rounded-full">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentIndex(index)
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-white w-8"
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


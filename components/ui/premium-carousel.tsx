"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface CarouselImage {
  src: string
  alt: string
  title: string
  description: string
}

const carouselImages: CarouselImage[] = [
  {
    src: "/premium-office-workspace.jpg",
    alt: "프리미엄 홈 오피스 - 허먼밀러 에어론과 자연광이 가득한 현대적 공간",
    title: "프리미엄 홈 오피스",
    description: "허먼밀러 에어론과 함께하는 완벽한 작업 환경"
  },
  {
    src: "/modern-office-with-city-view.jpg", 
    alt: "도시 전망이 펼쳐지는 모던 오피스 - 프리미엄 체어와 함께하는 비즈니스 공간",
    title: "비즈니스 오피스",
    description: "스틸케이스 제스처와 함께하는 전문적인 업무 공간"
  },
  {
    src: "/minimal-home-office.jpg",
    alt: "미니멀 홈 오피스 - 깔끔한 디자인과 프리미엄 체어가 만나는 세련된 공간",
    title: "미니멀 오피스",
    description: "허먼밀러 엠보디와 함께하는 세련된 작업 공간"
  },
  {
    src: "/modern-meeting-room.jpg",
    alt: "현대적 회의실 - 도시 스카이라인이 보이는 프리미엄 미팅 공간",
    title: "프리미엄 회의실",
    description: "스틸케이스 립으로 완성하는 전문적인 회의 환경"
  },
  {
    src: "/executive-office-space.jpg",
    alt: "임원진 오피스 - 프리미엄 체어와 함께하는 고급 업무 공간",
    title: "임원진 오피스",
    description: "월드 클래스 체어로 완성하는 프리미엄 업무 환경"
  }
]

export function PremiumCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // 자동 재생 기능
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      )
    }, 5000) // 5초마다 변경

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? carouselImages.length - 1 : currentIndex - 1)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === carouselImages.length - 1 ? 0 : currentIndex + 1)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="relative w-full h-full overflow-hidden">
      {/* 메인 이미지 */}
      <div className="relative w-full h-full">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover object-center"
              quality={95}
              priority={index === 0}
              sizes="100vw"
            />
            {/* 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            
            {/* 텍스트 오버레이 */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6">
                <div className="max-w-4xl">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-6 py-3 text-base font-medium text-white shadow-lg">
                    <Sparkles className="h-5 w-5" />
                    <span>월드 프리미엄 체어 스토어</span>
                  </div>
                  <h1 className="mb-6 text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight">
                    chairpark
                    <br />
                    <span className="text-primary">world premium chair store</span>
                  </h1>
                  <h2 className="mb-6 text-2xl md:text-4xl font-semibold text-white/95 leading-relaxed">
                    {image.title}
                  </h2>
                  <p className="mb-10 text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
                    {image.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-xl px-8 py-4 text-lg" asChild>
                      <Link href="/store">
                        제품 둘러보기 <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 text-lg" asChild>
                      <Link href="/gallery">갤러리 보기</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 네비게이션 화살표 */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 shadow-lg"
        aria-label="이전 이미지"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 shadow-lg"
        aria-label="다음 이미지"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* 인디케이터 도트 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 shadow-lg ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`${index + 1}번째 이미지로 이동`}
          />
        ))}
      </div>

      {/* 자동재생 토글 */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-8 right-8 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all duration-200 shadow-lg"
        aria-label={isAutoPlaying ? "자동재생 정지" : "자동재생 시작"}
      >
        <div className={`w-5 h-5 rounded-full ${isAutoPlaying ? 'bg-red-500' : 'bg-green-500'}`} />
      </button>
    </section>
  )
}

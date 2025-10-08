import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GalleryViewer } from "@/components/gallery-viewer"
import { NaverBookingButton } from "@/components/naver-booking-button"
import type { Metadata } from "next"
import { StructuredData } from "@/components/structured-data"
import { GalleryRelatedContent } from "@/components/gallery-related-content"

interface GalleryDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: GalleryDetailPageProps): Promise<Metadata> {
  try {
    const { id } = await params
    const supabase = await createServerClient()
    
    const { data: galleryItem } = await supabase
      .from("gallery")
      .select("*")
      .eq("id", id)
      .single()

    if (!galleryItem) {
      return {
        title: "갤러리 작품을 찾을 수 없습니다 | 체어파크",
        description: "요청하신 갤러리 작품을 찾을 수 없습니다.",
      }
    }

    const title = `${galleryItem.title} | ${galleryItem.brand || ''} ${galleryItem.product_name || ''} | 체어파크 갤러리`
    const description = galleryItem.description || `${galleryItem.brand} ${galleryItem.product_name} 프리미엄 가구 작품입니다. 체어파크에서 직접 체험해보세요.`
    const imageUrl = galleryItem.images?.[0] || galleryItem.image_url || "/herman-miller-aeron.png"

    return {
      title,
      description,
      keywords: [
        galleryItem.title,
        galleryItem.brand,
        galleryItem.product_name,
        "프리미엄 가구",
        "오피스 체어",
        "체어파크",
        "갤러리"
      ].filter(Boolean),
      openGraph: {
        title,
        description,
        type: "article",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${galleryItem.title} - ${galleryItem.brand} ${galleryItem.product_name}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `https://chairpark.co.kr/gallery/${id}`,
      },
    }
  } catch (error) {
    return {
      title: "갤러리 작품 | 체어파크",
      description: "프리미엄 가구 갤러리 작품을 확인하세요.",
    }
  }
}

export default async function GalleryDetailPage({ params }: GalleryDetailPageProps) {
  try {
    const { id } = await params
    
    const supabase = await createServerClient()
    
    // 갤러리 아이템 조회
    const { data: galleryItem, error: galleryError } = await supabase
      .from("gallery")
      .select("*")
      .eq("id", id)
      .single()

    if (galleryError || !galleryItem) {
      console.error('Gallery item not found:', { id, galleryError })
      notFound()
    }

    // 이미지 배열 준비 (images가 있으면 사용, 없으면 image_url 사용)
    const images = galleryItem.images && galleryItem.images.length > 0 
      ? galleryItem.images 
      : [galleryItem.image_url]
    
    const featuredIndex = galleryItem.featured_image_index || 0

    return (
    <>
      <StructuredData 
        type="product" 
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          "name": galleryItem.title,
          "description": galleryItem.description,
          "brand": {
            "@type": "Brand",
            "name": galleryItem.brand
          },
          "image": images.map(img => ({
            "@type": "ImageObject",
            "url": img,
            "name": galleryItem.title
          })),
          "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "체어파크"
            }
          },
          "category": "Office Furniture"
        }}
      />
      <StructuredData type="breadcrumb" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* 네비게이션 바 */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/gallery">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                갤러리로 돌아가기
              </Button>
            </Link>
            
            <div className="flex items-center gap-3">
              {galleryItem.brand && (
                <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                  {galleryItem.brand}
                </Badge>
              )}
              {galleryItem.product_name && (
                <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                  {galleryItem.product_name}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 메인 갤러리 뷰어 */}
      <GalleryViewer 
        images={images}
        title={galleryItem.title}
        initialIndex={featuredIndex}
      />

      {/* 작품 정보 섹션 */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-light text-slate-900 mb-4 tracking-wide">
              {galleryItem.title}
            </h1>
            {galleryItem.description && (
              <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                {galleryItem.description}
              </p>
            )}
          </div>

          {/* 작품 상세 정보 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-slate-200">
            {galleryItem.brand && (
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-2 uppercase tracking-wider">브랜드</p>
                <p className="text-slate-900 font-light text-lg">{galleryItem.brand}</p>
              </div>
            )}
            {galleryItem.product_name && (
              <div className="text-center">
                <p className="text-sm text-slate-500 mb-2 uppercase tracking-wider">제품명</p>
                <p className="text-slate-900 font-light text-lg">{galleryItem.product_name}</p>
              </div>
            )}
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-2 uppercase tracking-wider">전시일</p>
              <p className="text-slate-900 font-light text-lg">
                {new Date(galleryItem.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long'
                })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-2 uppercase tracking-wider">이미지 수</p>
              <p className="text-slate-900 font-light text-lg">{images.length}점</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-light text-slate-900 mb-6">
            이 작품에 관심이 있으신가요?
          </h2>
          <p className="text-slate-600 mb-8 text-lg">
            전문 상담을 통해 더 자세한 정보를 받아보실 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NaverBookingButton size="lg">
              네이버 예약으로 매장 체험하기
            </NaverBookingButton>
            <Button size="lg" variant="outline" asChild>
              <Link href="/bulk-inquiry">구매 문의하기</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/store">온라인 스토어</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 관련 갤러리 컨텐츠 */}
      <GalleryRelatedContent currentGalleryId={galleryItem.id} />
      </div>
    </>
  )
  } catch (error) {
    console.error('Gallery detail page error:', error)
    notFound()
  }
}

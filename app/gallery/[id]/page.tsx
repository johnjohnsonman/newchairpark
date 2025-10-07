import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Share2, Heart, ShoppingCart, Calendar, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface GalleryDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function GalleryDetailPage({ params }: GalleryDetailPageProps) {
  try {
    const { id } = await params
    const supabase = createClient()
    
    // 갤러리 아이템 조회
    const { data: galleryItem, error: galleryError } = await supabase
      .from("gallery")
      .select("*")
      .eq("id", id)
      .single()

    if (galleryError || !galleryItem) {
      console.error('Gallery item not found:', galleryError)
      notFound()
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section - 미술관 스타일 */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 배경 이미지 */}
        <div className="absolute inset-0 z-0">
          <Image
            src={galleryItem.image_url}
            alt={galleryItem.title}
            fill
            className="object-cover"
            priority
          />
          {/* 아티스틱 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
          
          {/* 미술관 조명 효과 */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-white/3 rounded-full blur-2xl animate-pulse delay-1000" />
        </div>

        {/* 네비게이션 */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6">
          <div className="flex items-center justify-between">
            <Link href="/gallery">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                갤러리로 돌아가기
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/20">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/20">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <div className="mb-8">
            {(galleryItem.brand || galleryItem.product_name) && (
              <div className="flex justify-center gap-3 mb-8">
                {galleryItem.brand && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-6 py-3 text-sm font-light backdrop-blur-sm">
                    {galleryItem.brand}
                  </Badge>
                )}
                {galleryItem.product_name && (
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-6 py-3 text-sm font-light backdrop-blur-sm">
                    {galleryItem.product_name}
                  </Badge>
                )}
              </div>
            )}
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-thin tracking-wider mb-8 leading-tight drop-shadow-2xl">
              {galleryItem.title}
            </h1>
            
            {galleryItem.description && (
              <p className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed max-w-4xl mx-auto opacity-90 drop-shadow-lg">
                {galleryItem.description}
              </p>
            )}
          </div>

          {/* 메타 정보 */}
          <div className="flex justify-center items-center gap-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(galleryItem.created_at).toLocaleDateString('ko-KR')}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Chairpark Gallery
            </div>
          </div>
        </div>

        {/* 스크롤 인디케이터 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* 작품 정보 섹션 */}
      <section className="py-24 px-6 relative">
        {/* 배경 장식 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50/50 to-transparent" />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-slate-100/30 to-transparent rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* 메인 정보 */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-4xl font-thin mb-12 text-slate-800 tracking-wide">작품 정보</h2>
                <div className="space-y-8 text-slate-600 leading-relaxed">
                  {galleryItem.description && (
                    <p className="text-xl font-light leading-relaxed">{galleryItem.description}</p>
                  )}
                  
                  <Separator className="my-8" />
                  
                  <div className="grid grid-cols-2 gap-8 pt-6">
                    {galleryItem.brand && (
                      <div className="group">
                        <h3 className="font-light text-slate-800 mb-3 text-lg tracking-wide">브랜드</h3>
                        <p className="text-slate-600 font-light group-hover:text-slate-800 transition-colors">
                          {galleryItem.brand}
                        </p>
                      </div>
                    )}
                    {galleryItem.product_name && (
                      <div className="group">
                        <h3 className="font-light text-slate-800 mb-3 text-lg tracking-wide">제품명</h3>
                        <p className="text-slate-600 font-light group-hover:text-slate-800 transition-colors">
                          {galleryItem.product_name}
                        </p>
                      </div>
                    )}
                    <div className="group">
                      <h3 className="font-light text-slate-800 mb-3 text-lg tracking-wide">전시일</h3>
                      <p className="text-slate-600 font-light group-hover:text-slate-800 transition-colors">
                        {new Date(galleryItem.created_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="group">
                      <h3 className="font-light text-slate-800 mb-3 text-lg tracking-wide">카테고리</h3>
                      <p className="text-slate-600 font-light group-hover:text-slate-800 transition-colors">
                        {galleryItem.category || '일반'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 사이드바 */}
            <div className="space-y-10">
              {/* 구매 문의 */}
              <Card className="p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-0 shadow-2xl relative overflow-hidden">
                {/* 배경 장식 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/3 rounded-full blur-xl" />
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-thin mb-6 tracking-wide">구매 문의</h3>
                  <p className="text-slate-300 mb-8 text-base leading-relaxed font-light">
                    이 작품에 관심이 있으시다면 언제든지 문의해주세요.
                  </p>
                  <div className="space-y-4">
                    <Button className="w-full bg-white text-slate-800 hover:bg-slate-100 font-light py-3 transition-all duration-300 hover:scale-[1.02]" asChild>
                      <Link href="/bulk-inquiry">
                        <Users className="w-4 h-4 mr-2" />
                        대량 구매 문의
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 font-light py-3 transition-all duration-300 hover:scale-[1.02]" asChild>
                      <Link href="/store">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        온라인 스토어
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>

              {/* 갤러리 정보 */}
              <Card className="p-8 bg-white/90 backdrop-blur-sm border-slate-200/50 shadow-xl">
                <h3 className="text-2xl font-thin mb-6 text-slate-800 tracking-wide">갤러리 정보</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-slate-600" />
                    <span className="text-slate-600 font-light">Chairpark Gallery</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-600" />
                    <span className="text-slate-600 font-light">
                      {new Date(galleryItem.created_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <div className="pt-4">
                    <p className="text-sm text-slate-500 font-light leading-relaxed">
                      이 작품은 Chairpark Gallery에서 전시되고 있습니다. 
                      더 많은 작품을 보시려면 갤러리 페이지를 방문해주세요.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 관련 작품 섹션 */}
      <section className="py-24 px-6 relative">
        {/* 배경 장식 */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50/50 to-transparent" />
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-slate-100/20 to-transparent rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl font-thin mb-16 text-center text-slate-800 tracking-wide">다른 작품</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* 여기에 관련 갤러리 아이템들을 표시 */}
            <div className="col-span-full text-center py-16">
              <div className="inline-block p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50">
                <p className="text-slate-600 text-lg font-light">더 많은 작품을 준비 중입니다.</p>
                <p className="text-slate-500 text-sm mt-2">곧 새로운 작품들을 만나보실 수 있습니다.</p>
                <Button className="mt-4" variant="outline" asChild>
                  <Link href="/gallery">갤러리 둘러보기</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
  } catch (error) {
    console.error('Gallery detail page error:', error)
    notFound()
  }
}
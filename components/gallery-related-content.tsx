"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SlidersHorizontal } from "lucide-react"

interface GalleryItem {
  id: string
  title: string
  description: string
  brand: string
  product_name: string
  images: string[]
  featured_image_index: number
  created_at: string
}

interface GalleryRelatedContentProps {
  currentGalleryId: string
}

export function GalleryRelatedContent({ currentGalleryId }: GalleryRelatedContentProps) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [brands, setBrands] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    { id: "all", name: "전체" },
    { id: "office-chair", name: "오피스 체어" },
    { id: "executive-chair", name: "임원용 체어" },
    { id: "lounge-chair", name: "라운지 체어" },
    { id: "conference-chair", name: "회의용 체어" },
    { id: "dining-chair", name: "다이닝 체어" },
    { id: "design-chair", name: "디자인 체어" },
  ]

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [galleryItems, selectedBrand, selectedCategory])

  const fetchGalleryItems = async () => {
    try {
      const supabase = createBrowserClient()
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .neq("id", currentGalleryId) // 현재 갤러리 아이템 제외
        .order("created_at", { ascending: false })

      if (error) throw error

      setGalleryItems(data || [])
      
      // 브랜드 목록 추출
      const uniqueBrands = Array.from(new Set(data?.map(item => item.brand).filter(Boolean))) as string[]
      setBrands(uniqueBrands)
    } catch (error) {
      console.error("갤러리 아이템 로드 실패:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = galleryItems

    // 브랜드 필터
    if (selectedBrand !== "all") {
      filtered = filtered.filter(item => item.brand === selectedBrand)
    }

    // 카테고리 필터 (product_name 기반으로 간단히 분류)
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => {
        const productName = item.product_name?.toLowerCase() || ""
        const categoryKeywords = {
          "office-chair": ["office", "오피스", "체어"],
          "executive-chair": ["executive", "임원", "체어"],
          "lounge-chair": ["lounge", "라운지", "체어"],
          "conference-chair": ["conference", "회의", "체어"],
          "dining-chair": ["dining", "다이닝", "체어", "테이블"],
          "design-chair": ["design", "디자인", "체어"]
        }
        
        const keywords = categoryKeywords[selectedCategory as keyof typeof categoryKeywords] || []
        return keywords.some(keyword => productName.includes(keyword))
      })
    }

    setFilteredItems(filtered)
  }

  const getDisplayImage = (item: GalleryItem) => {
    if (item.images && item.images.length > 0) {
      const featuredIndex = item.featured_image_index || 0
      return item.images[featuredIndex] || item.images[0]
    }
    return "/placeholder.svg"
  }

  if (loading) {
    return (
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">관련 갤러리 작품을 불러오는 중...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-light text-slate-900 mb-4">
            다른 갤러리 작품들
          </h2>
          <p className="text-slate-600">
            체어파크의 다양한 프리미엄 가구 작품을 둘러보세요
          </p>
        </div>

        {/* 필터 섹션 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-900">작품 필터</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? "필터 숨기기" : "필터 보기"}
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  브랜드
                </label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger>
                    <SelectValue placeholder="브랜드를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 브랜드</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  카테고리
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* 결과 개수 */}
        <div className="mb-6">
          <p className="text-slate-600">
            총 <span className="font-medium text-slate-900">{filteredItems.length}개</span>의 작품이 있습니다
          </p>
        </div>

        {/* 갤러리 그리드 */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Link key={item.id} href={`/gallery/${item.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={getDisplayImage(item)}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-medium text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      
                      {item.brand && (
                        <Badge variant="secondary" className="text-xs">
                          {item.brand}
                        </Badge>
                      )}
                      
                      {item.product_name && (
                        <Badge variant="outline" className="text-xs">
                          {item.product_name}
                        </Badge>
                      )}
                      
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>
                          {new Date(item.created_at).toLocaleDateString('ko-KR')}
                        </span>
                        <span>
                          {item.images?.length || 1}개 이미지
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">선택한 조건에 맞는 작품이 없습니다.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedBrand("all")
                setSelectedCategory("all")
              }}
              className="mt-4"
            >
              필터 초기화
            </Button>
          </div>
        )}

        {/* 더 많은 작품 보기 */}
        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href="/gallery">
              전체 갤러리 보기
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

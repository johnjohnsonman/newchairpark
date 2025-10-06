"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
import { useParams } from "next/navigation"

const allProducts = [
  {
    id: 1,
    name: "에어론 체어",
    category: "의자",
    brand: "허먼밀러",
    price: 1890000,
    image: "/herman-miller-aeron-chair-black.jpg",
    description: "인체공학적 메쉬 오피스 체어",
    features: ["12년 보증", "완전 조절 가능", "통기성 메쉬", "요추 지지대"],
  },
  {
    id: 2,
    name: "엠보디 체어",
    category: "의자",
    brand: "허먼밀러",
    price: 2190000,
    image: "/herman-miller-embody-chair.jpg",
    description: "건강한 자세를 위한 프리미엄 체어",
    features: ["12년 보증", "백픽셀 기술", "동적 지지", "압력 분산"],
  },
  {
    id: 3,
    name: "리프 체어",
    category: "의자",
    brand: "스틸케이스",
    price: 1650000,
    image: "/steelcase-leap-chair.jpg",
    description: "다이나믹한 움직임을 지원하는 체어",
    features: ["라이브백 기술", "4D 팔걸이", "시트 슬라이드", "요추 조절"],
  },
  {
    id: 4,
    name: "제스처 체어",
    category: "의자",
    brand: "스틸케이스",
    price: 1850000,
    image: "/steelcase-gesture-chair-blue.jpg",
    description: "다양한 자세를 지원하는 혁신적 체어",
    features: ["360도 팔걸이", "싱크로 틸트", "시트 깊이 조절", "인터페이스 지원"],
  },
  {
    id: 5,
    name: "높이조절 책상",
    category: "책상",
    brand: "스틸케이스",
    price: 1200000,
    image: "/electric-standing-desk-white.jpg",
    description: "전동 높이조절 스탠딩 데스크",
    features: ["전동 높이조절", "메모리 설정", "케이블 관리", "견고한 구조"],
  },
  {
    id: 6,
    name: "이임스 데스크",
    category: "책상",
    brand: "허먼밀러",
    price: 980000,
    image: "/eames-desk-walnut-wood.jpg",
    description: "클래식한 디자인의 원목 책상",
    features: ["월넛 원목", "서랍 2개", "케이블 홀", "타임리스 디자인"],
  },
]

const brands = ["허먼밀러", "스틸케이스"]

export default function CategoryPage() {
  const params = useParams()
  const category = decodeURIComponent(params.category as string)

  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [showBrandFilter, setShowBrandFilter] = useState(true)

  const categoryProducts = allProducts.filter((p) => p.category === category)
  const filteredProducts = categoryProducts.filter((product) => {
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
    return brandMatch
  })

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <aside className="w-64 border-r bg-background p-6">
        <Link
          href="/store"
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          모든 제품
        </Link>

        <h2 className="mb-6 text-xl font-bold">{category}</h2>

        {/* Brand Filter */}
        <div className="mb-6">
          <button
            onClick={() => setShowBrandFilter(!showBrandFilter)}
            className="mb-3 flex w-full items-center justify-between text-sm font-semibold"
          >
            브랜드
            {showBrandFilter ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showBrandFilter && (
            <div className="space-y-3">
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand}
                    checked={selectedBrands.includes(brand)}
                    onCheckedChange={() => toggleBrand(brand)}
                  />
                  <Label htmlFor={brand} className="text-sm font-normal cursor-pointer">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button variant="outline" className="w-full bg-transparent" onClick={() => setSelectedBrands([])}>
          필터 초기화
        </Button>
      </aside>

      {/* Main Content - Herman Miller Style */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold">{category}</h1>
          <p className="text-muted-foreground">{filteredProducts.length}개의 제품</p>
        </div>

        <div className="space-y-12">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/store/${category}/${product.id}`}>
              <Card className="group overflow-hidden transition-shadow hover:shadow-xl">
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>

                  {/* Product Info */}
                  <CardContent className="flex flex-col justify-center p-8">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">{product.brand}</p>
                    <h2 className="mb-4 text-3xl font-bold">{product.name}</h2>
                    <p className="mb-6 text-lg text-muted-foreground">{product.description}</p>

                    <div className="mb-6">
                      <h3 className="mb-3 text-sm font-semibold">주요 특징</h3>
                      <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">₩{product.price.toLocaleString()}</p>
                      <Button size="lg">자세히 보기</Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">선택한 필터에 맞는 제품이 없습니다.</p>
          </div>
        )}
      </main>
    </div>
  )
}

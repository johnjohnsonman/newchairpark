"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ChevronUp, SlidersHorizontal, Calendar, Package, ArrowRight } from "lucide-react"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Rental } from "@/types/rental"

interface Brand {
  id: string
  name: string
  slug: string
}

interface RentalsClientPageProps {
  initialRentals: Rental[]
  initialBrands: Brand[]
}

export default function RentalsClientPage({ 
  initialRentals = [],
  initialBrands = []
}: RentalsClientPageProps) {
  const supabase = createBrowserClient()
  
  const [rentals, setRentals] = useState<Rental[]>(initialRentals)
  const [brands, setBrands] = useState<Brand[]>(initialBrands)
  const [loading, setLoading] = useState(false)
  
  const [selectedType, setSelectedType] = useState<"all" | "rental" | "demo">("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 2000000])
  const [periodRange, setPeriodRange] = useState([1, 24])
  const [depositRange, setDepositRange] = useState<[number, number]>([0, 3000000])
  const [showFilters, setShowFilters] = useState({
    type: true,
    category: true,
    brand: true,
    price: true,
    period: true,
    deposit: true,
  })

  const categories = [
    { id: "all", displayName: "전체" },
    { id: "office-chair", displayName: "오피스 체어" },
    { id: "executive-chair", displayName: "임원용 체어" },
    { id: "lounge-chair", displayName: "라운지 체어" },
    { id: "conference-chair", displayName: "회의용 체어" },
    { id: "dining-chair", displayName: "다이닝 체어" },
    { id: "design-chair", displayName: "디자인 체어" },
    { id: "desk", displayName: "데스크" },
    { id: "office-accessories", displayName: "오피스 악세서리" },
  ]

  useEffect(() => {
    if (initialRentals.length === 0) {
      const fetchRentals = async () => {
        setLoading(true)
        const { data, error } = await supabase
          .from("rentals")
          .select("*, brands(name, slug)")
          .order("created_at", { ascending: false })

        if (data) {
          setRentals(data as Rental[])
        }
        setLoading(false)
      }

      fetchRentals()
    }
  }, [initialRentals.length])

  const filteredRentals = rentals.filter((rental) => {
    const typeMatch = selectedType === "all" || rental.type === selectedType
    const categoryMatch = selectedCategory === "all" || rental.category === selectedCategory
    const brandMatch = selectedBrands.length === 0 || selectedBrands.some((b) => rental.brands?.name === b)
    
    // Price filtering based on type
    const price = rental.type === "rental" 
      ? Number(rental.price_monthly) || 0 
      : Number(rental.price_daily) || 0
    const priceMatch = price >= priceRange[0] && price <= priceRange[1]

    // Period filter: min_rental_period 기준으로 하한선 매칭
    const periodMatch = rental.type === "rental"
      ? (rental.min_rental_period || 0) <= periodRange[1]
      : true

    // Deposit filter: 컬럼이 없을 경우 통과, 있으면 범위 체크
    const deposit = (rental as any).deposit ?? null
    const depositMatch = deposit == null
      ? true
      : Number(deposit) >= depositRange[0] && Number(deposit) <= depositRange[1]
    
    return typeMatch && categoryMatch && brandMatch && priceMatch && periodMatch && depositMatch
  })

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">렌탈 & 데모</h1>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            프리미엄 가구를 부담없이 체험하고 렌탈하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/rental">
              <Button size="lg" variant="outline" className="border-2 border-white bg-transparent text-white hover:bg-white/10">
                <Package className="mr-2 h-5 w-5" />
                렌탈/데모 신청하기
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Filters Sidebar */}
        <aside className="hidden w-72 border-r bg-background p-6 lg:block sticky top-24 h-[calc(100vh-6rem)] overflow-auto">
          <div className="mb-6 flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            <h2 className="text-sm font-bold uppercase tracking-wide">필터</h2>
          </div>

          {/* Type Filter */}
          <div className="mb-8">
            <button
              onClick={() => setShowFilters((prev) => ({ ...prev, type: !prev.type }))}
              className="mb-3 flex w-full items-center justify-between text-xs font-bold uppercase tracking-wide"
            >
              서비스 타입
              {showFilters.type ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showFilters.type && (
              <div className="space-y-2.5">
                <button
                  onClick={() => setSelectedType("all")}
                  className={`block w-full text-left text-sm transition-colors ${
                    selectedType === "all"
                      ? "font-semibold text-neutral-900"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => setSelectedType("rental")}
                  className={`block w-full text-left text-sm transition-colors ${
                    selectedType === "rental"
                      ? "font-semibold text-neutral-900"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  렌탈 (장기 이용)
                </button>
                <button
                  onClick={() => setSelectedType("demo")}
                  className={`block w-full text-left text-sm transition-colors ${
                    selectedType === "demo"
                      ? "font-semibold text-neutral-900"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  데모 (단기 체험)
                </button>
              </div>
            )}
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <button
              onClick={() => setShowFilters((prev) => ({ ...prev, category: !prev.category }))}
              className="mb-3 flex w-full items-center justify-between text-xs font-bold uppercase tracking-wide"
            >
              카테고리
              {showFilters.category ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showFilters.category && (
              <div className="space-y-2.5">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`block w-full text-left text-sm transition-colors ${
                      selectedCategory === category.id
                        ? "font-semibold text-neutral-900"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    {category.displayName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Brand Filter */}
          <div className="mb-8">
            <button
              onClick={() => setShowFilters((prev) => ({ ...prev, brand: !prev.brand }))}
              className="mb-3 flex w-full items-center justify-between text-xs font-bold uppercase tracking-wide"
            >
              브랜드
              {showFilters.brand ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showFilters.brand && (
              <div className="space-y-3">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand.slug}
                      checked={selectedBrands.includes(brand.name)}
                      onCheckedChange={() => toggleBrand(brand.name)}
                      className="rounded-sm"
                    />
                    <Label htmlFor={brand.slug} className="cursor-pointer text-sm font-normal text-neutral-700">
                      {brand.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Filter */}
          <div className="mb-8">
            <button
              onClick={() => setShowFilters((prev) => ({ ...prev, price: !prev.price }))}
              className="mb-3 flex w-full items-center justify-between text-xs font-bold uppercase tracking-wide"
            >
              가격
              {showFilters.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showFilters.price && (
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={2000000}
                  step={50000}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span>₩{priceRange[0].toLocaleString()}</span>
                  <span>₩{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Period Filter */}
          <div className="mb-8">
            <button
              onClick={() => setShowFilters((prev) => ({ ...prev, period: !prev.period }))}
              className="mb-3 flex w-full items-center justify-between text-xs font-bold uppercase tracking-wide"
            >
              최소 이용 기간
              {showFilters.period ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showFilters.period && (
              <div className="space-y-4">
                <Slider
                  value={periodRange}
                  onValueChange={setPeriodRange}
                  max={36}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span>{periodRange[0]}개월</span>
                  <span>{periodRange[1]}개월</span>
                </div>
                <p className="text-[11px] text-neutral-500">표기는 상품 최소 이용 개월 기준입니다.</p>
              </div>
            )}
          </div>

          {/* Deposit Filter (optional) */}
          <div className="mb-8">
            <button
              onClick={() => setShowFilters((prev) => ({ ...prev, deposit: !prev.deposit }))}
              className="mb-3 flex w-full items-center justify-between text-xs font-bold uppercase tracking-wide"
            >
              보증금
              {showFilters.deposit ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {showFilters.deposit && (
              <div className="space-y-4">
                <Slider
                  value={depositRange}
                  onValueChange={(v:any)=>setDepositRange(v)}
                  max={3000000}
                  step={50000}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span>₩{depositRange[0].toLocaleString()}</span>
                  <span>₩{depositRange[1].toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-neutral-500">일부 상품은 보증금이 없을 수 있습니다.</p>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            className="w-full border-neutral-300 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 bg-transparent"
            onClick={() => {
              setSelectedType("all")
              setSelectedCategory("all")
              setSelectedBrands([])
              setPriceRange([0, 2000000])
              setPeriodRange([1, 24])
              setDepositRange([0, 3000000])
            }}
          >
            필터 초기화
          </Button>
        </aside>

        {/* Products Grid */}
        <main className="flex-1 bg-background p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <SlidersHorizontal className="h-5 w-5 lg:hidden" />
              <p className="text-sm font-semibold">
                <span className="font-bold">{filteredRentals.length}</span> 결과
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <p className="text-neutral-600">렌탈 상품을 불러오는 중...</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredRentals.map((rental) => {
                const mainImage = rental.images?.[0]?.url || rental.image_url || "/placeholder.svg"
                const displayPrice = rental.type === "rental" 
                  ? rental.price_monthly 
                  : rental.price_daily

                return (
                  <Card
                    key={rental.id}
                    className="group h-full overflow-hidden border-neutral-200 transition-shadow hover:shadow-lg bg-card"
                  >
                    <div className="relative aspect-square overflow-hidden bg-neutral-50">
                      <Image
                        src={(mainImage && mainImage.trim()) || "/placeholder.svg"}
                        alt={rental.name}
                        fill
                        className="object-contain p-4 transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          rental.type === "rental" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {rental.type === "rental" ? "렌탈" : "데모"}
                        </span>
                      </div>
                    </div>
                    <CardContent className="flex flex-col p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex-1">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            {rental.brands?.name || "브랜드 없음"}
                          </p>
                          <h3 className="mb-1 text-base font-bold text-neutral-900 line-clamp-2">
                            {rental.name}
                          </h3>
                          <p className="text-xs text-neutral-600">{rental.category}</p>
                        </div>
                      </div>
                      <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-neutral-900">
                            ₩{Number(displayPrice).toLocaleString()}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {rental.type === "rental" ? "/월" : "/일"}
                          </p>
                        </div>
                        <Link href="/rental">
                          <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                            <Calendar className="h-4 w-4" />
                            신청
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {filteredRentals.length === 0 && !loading && (
            <div className="py-12 text-center">
              <p className="text-neutral-600">선택한 필터에 맞는 렌탈 상품이 없습니다.</p>
            </div>
          )}
        </main>
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">렌탈/데모 신청하기</h2>
          <p className="text-lg opacity-90 mb-8">원하는 제품을 선택하고 신청서를 작성해보세요</p>
          <Link href="/rental">
            <Button size="lg" variant="outline" className="border-2 border-white bg-transparent text-white hover:bg-white/10">
              신청서 작성하기 <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}


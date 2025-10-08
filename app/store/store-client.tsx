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
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, SlidersHorizontal, Star, ShoppingCart, ArrowRight, Store, Award, Package } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { NaverBookingButtonWhite } from "@/components/naver-booking-button"
import { useSearchParams } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"

interface Category {
  id: string
  name: string
  displayName: string
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  category: string
  featured: boolean
  image_url?: string
  images?: { url: string }[]
  brands?: { name: string; slug: string }
}

interface Brand {
  id: string
  name: string
  slug: string
}

interface ReviewStat {
  count: number
  average: number
}

interface CategoryBanner {
  id: string
  category_id: string
  title: string
  description: string
  background_image?: string
  images?: string[]
  featured_image_index?: number
}

interface StoreClientPageProps {
  categories: Category[]
  initialProducts?: Product[]
  initialBrands?: Brand[]
  categoryBanners?: CategoryBanner[]
}

export default function StoreClientPage({ 
  categories, 
  initialProducts = [],
  initialBrands = [],
  categoryBanners = []
}: StoreClientPageProps) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const supabase = createBrowserClient()
  
  // 초기화 상태 관리
  const [isInitialized, setIsInitialized] = useState(false)

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    // URL 파라미터에서 카테고리 설정
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    } else {
      setSelectedCategory("all")
    }
    
    setIsInitialized(true)
  }, [categoryParam])

  // 카테고리별 설명 문구 (배너 데이터에서 가져오거나 기본값)
  const getCategoryDescription = (categoryId: string | null) => {
    if (!categoryId) return "최고의 품질과 디자인을 경험하세요"
    
    // "all" 카테고리는 "all-chairs" 배너에서 설명 가져오기
    const searchCategoryId = categoryId === "all" ? "all-chairs" : categoryId
    
    // 현재 카테고리에 맞는 배너에서 설명 가져오기
    const currentBanner = categoryBanners.find(banner => banner.category_id === searchCategoryId)
    if (currentBanner && currentBanner.description) {
      return currentBanner.description
    }
    
    // 배너가 없으면 기본 설명
    switch (categoryId) {
      case "all":
        return "체어파크의 모든 프리미엄 제품을 만나보세요"
      case "office-chair":
        return "장시간 업무에 최적화된 인체공학적 오피스 체어 컬렉션"
      case "executive-chair":
        return "임원실과 고급 사무공간을 위한 프리미엄 임원용 체어"
      case "lounge-chair":
        return "편안한 휴식과 대화를 위한 세련된 라운지 체어"
      case "conference-chair":
        return "회의실과 프레젠테이션 공간에 최적화된 회의용 체어"
      case "dining-chair":
        return "다이닝룸과 식사 공간을 아름답게 만드는 다이닝 체어"
      case "design-chair":
        return "독특한 디자인과 예술적 가치를 지닌 디자인 체어"
      default:
        return "최고의 품질과 디자인을 경험하세요"
    }
  }

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 5000000])
  const [showFilters, setShowFilters] = useState({
    category: true,
    brand: true,
    price: true,
  })

  // 현재 카테고리에 맞는 배너들 찾기
  const getCurrentBanners = () => {
    if (selectedCategory === "all") {
      // 전체 카테고리일 때는 "all-chairs" 카테고리 배너 표시
      return categoryBanners.filter(banner => banner.category_id === "all-chairs")
    }
    // 특정 카테고리일 때는 해당 카테고리 배너만 표시
    return categoryBanners.filter(banner => banner.category_id === selectedCategory)
  }

  const currentBanners = getCurrentBanners()
  const [sortBy, setSortBy] = useState("featured")
  const [reviewStats, setReviewStats] = useState<Record<string, ReviewStat>>({})
  const [heroCarouselIndex, setHeroCarouselIndex] = useState(0)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [brands, setBrands] = useState<Brand[]>(initialBrands)
  const [loading, setLoading] = useState(false)

  // 초기 데이터가 없을 때만 로드
  useEffect(() => {
    if (initialProducts.length === 0) {
      const fetchProducts = async () => {
        setLoading(true)
        const { data, error } = await supabase
          .from("products")
          .select("*, brands(name, slug)")
          .order("created_at", { ascending: false })

        if (data) {
          setProducts(data)
        }
        setLoading(false)
      }

      fetchProducts()
    }
  }, [initialProducts.length])

  useEffect(() => {
    if (initialBrands.length === 0) {
      const fetchBrands = async () => {
        const { data } = await supabase.from("brands").select("*").order("name")

        if (data) {
          setBrands(data)
        }
      }

      fetchBrands()
    }
  }, [initialBrands.length])

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    } else {
      // 기본값을 전체 체어로 설정
      setSelectedCategory("all")
    }
  }, [categoryParam])


  useEffect(() => {
    if (!selectedCategory && categoryBanners.length > 0) {
      const interval = setInterval(() => {
        setHeroCarouselIndex((prev) => (prev + 1) % categoryBanners.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [selectedCategory, categoryBanners.length])

  useEffect(() => {
    const fetchReviewStats = async () => {
      const { data: reviews } = await supabase.from("reviews").select("product_id, rating")

      if (reviews) {
        const stats: Record<string, ReviewStat> = {}
        reviews.forEach((review) => {
          const productId = review.product_id.toString()
          if (!stats[productId]) {
            stats[productId] = { count: 0, average: 0 }
          }
          stats[productId].count++
        })

        for (const productId in stats) {
          const productReviews = reviews.filter((r) => r.product_id.toString() === productId)
          const sum = productReviews.reduce((acc, r) => acc + r.rating, 0)
          stats[productId].average = sum / productReviews.length
        }

        setReviewStats(stats)
      }
    }

    fetchReviewStats()
  }, [])

  const filteredProducts = products.filter((product) => {
    const categoryMatch = !selectedCategory || selectedCategory === "all" || product.category === selectedCategory
    const brandMatch = selectedBrands.length === 0 || selectedBrands.some((b) => product.brands?.name === b)
    const price = Number(product.price) || 0
    const priceMatch = price >= priceRange[0] && price <= priceRange[1]
    return categoryMatch && brandMatch && priceMatch
  })

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  const featuredProducts = filteredProducts.filter((p) => p.featured).slice(0, 5)
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : filteredProducts.slice(0, 5)

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("로그인이 필요합니다.")
      window.location.href = "/auth/login"
      return
    }

    const { error } = await supabase.from("cart_items").upsert(
      {
        user_id: user.id,
        product_id: productId,
        quantity: 1,
      },
      {
        onConflict: "user_id,product_id",
      },
    )

    if (error) {
      alert("장바구니 추가에 실패했습니다. 다시 시도해주세요.")
    } else {
      alert("장바구니에 추가되었습니다!")
    }
  }

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="relative h-[calc(100vh-4rem)] overflow-hidden bg-neutral-900">
          {categoryBanners.length > 0 && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
                style={{
                  backgroundImage: categoryBanners[heroCarouselIndex]?.background_image
                    ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${categoryBanners[heroCarouselIndex].background_image})`
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              />

              <div className="relative z-10 flex h-full items-center">
                <div className="container mx-auto px-4">
                  <div className="mx-auto max-w-4xl text-center text-white">
                    <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/80">
                      {categoryBanners[heroCarouselIndex]?.category_id?.replace("-", " ")}
                    </p>
                    <h1 className="mb-6 text-5xl font-bold leading-tight md:text-7xl">
                      {categoryBanners[heroCarouselIndex]?.title}
                    </h1>
                    <p className="mb-8 text-xl text-white/90 md:text-2xl">
                      {categoryBanners[heroCarouselIndex]?.description}
                    </p>
                    <Link href={`/store?category=${categoryBanners[heroCarouselIndex]?.category_id}`}>
                      <Button size="lg" className="bg-white text-neutral-900 hover:bg-white/90 px-8 py-6 text-lg">
                        둘러보기
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {categoryBanners.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setHeroCarouselIndex((prev) => (prev - 1 + categoryBanners.length) % categoryBanners.length)
                    }
                    className="absolute left-8 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-4 backdrop-blur-sm transition-all hover:bg-white/30"
                    aria-label="Previous category"
                  >
                    <ChevronLeft className="h-8 w-8 text-white" />
                  </button>
                  <button
                    onClick={() => setHeroCarouselIndex((prev) => (prev + 1) % categoryBanners.length)}
                    className="absolute right-8 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-4 backdrop-blur-sm transition-all hover:bg-white/30"
                    aria-label="Next category"
                  >
                    <ChevronRight className="h-8 w-8 text-white" />
                  </button>

                  <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 gap-3">
                    {categoryBanners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setHeroCarouselIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === heroCarouselIndex ? "w-12 bg-white" : "w-2 bg-white/50"
                        }`}
                        aria-label={`Go to category ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="container mx-auto px-4 py-16">
          <h2 className="mb-8 text-center text-3xl font-bold">카테고리별 둘러보기</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories
              .filter((c) => c.id !== "all")
              .map((category) => (
                <Link key={category.id} href={`/store?category=${category.id}`}>
                  <Card className="group overflow-hidden transition-shadow hover:shadow-xl">
                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
                      <div className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-2xl font-bold text-neutral-700">{category.displayName}</h3>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>
    )
  }

  // 초기화되지 않았으면 로딩 화면 표시
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">스토어를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 카테고리 배너 캐러셀 */}
      {currentBanners.length > 0 && (
        <div className="bg-white">
          <div className="w-full">
            <Carousel>
              <CarouselContent>
                {currentBanners.map((banner) => {
                  // 각 카테고리별로 배너의 이미지들을 가져오기
                  const bannerImages = banner.images && banner.images.length > 0 
                    ? banner.images 
                    : banner.background_image 
                    ? [banner.background_image] 
                    : []

                  // 이 카테고리의 이미지들을 캐러셀 아이템으로 표시
                  return bannerImages.map((imageUrl, imageIndex) => (
                    <CarouselItem key={`${banner.id}-${imageIndex}`}>
                      <div 
                        className="relative h-80 w-full overflow-hidden bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${imageUrl})`
                        }}
                      >
                      </div>
                    </CarouselItem>
                  ))
                })}
              </CarouselContent>
              {(() => {
                // 현재 카테고리의 총 이미지 수 계산
                const totalImages = currentBanners.reduce((total, banner) => {
                  const bannerImages = banner.images && banner.images.length > 0 
                    ? banner.images 
                    : banner.background_image 
                    ? [banner.background_image] 
                    : []
                  return total + bannerImages.length
                }, 0)
                
                // 이미지가 2개 이상이면 화살표 표시
                return totalImages > 1 ? (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                ) : null
              })()}
            </Carousel>
          </div>
        </div>
      )}
      
      {/* 제품 헤더 */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-neutral-900">
                {(() => {
                  if (!selectedCategory) return "전체 제품"
                  
                  // "all" 카테고리는 "all-chairs" 배너에서 제목 가져오기
                  const searchCategoryId = selectedCategory === "all" ? "all-chairs" : selectedCategory
                  
                  // 배너에서 제목 가져오기
                  const currentBanner = categoryBanners.find(banner => banner.category_id === searchCategoryId)
                  if (currentBanner && currentBanner.title) {
                    return currentBanner.title
                  }
                  
                  // 배너가 없으면 기본 제목
                  return categories.find((c) => c.id === selectedCategory)?.displayName || "제품"
                })()}
              </h1>
              <p className="mt-2 text-base text-muted-foreground">
                {getCategoryDescription(selectedCategory)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        <aside className="hidden w-72 border-r bg-white p-6 lg:block">
          <div className="mb-6 flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            <h2 className="text-sm font-bold uppercase tracking-wide">필터</h2>
          </div>

          <div className="mb-8">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide">검색</h3>
            <input
              type="text"
              placeholder="제품 검색..."
              className="w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
            />
          </div>

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
                  max={5000000}
                  step={100000}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-xs text-neutral-600">
                  <span>₩{priceRange[0].toLocaleString()}</span>
                  <span>₩{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            className="w-full border-neutral-300 text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 bg-transparent"
            onClick={() => {
              setSelectedCategory("all")
              setSelectedBrands([])
              setPriceRange([0, 5000000])
            }}
          >
            필터 초기화
          </Button>
        </aside>

        <main className="flex-1 bg-white p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <SlidersHorizontal className="h-5 w-5 lg:hidden" />
              <p className="text-sm font-semibold">
                <span className="font-bold">{filteredProducts.length}</span> 결과
              </p>
              <button className="text-sm text-neutral-600 hover:text-neutral-900 hover:underline">Most Relevant</button>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded border border-neutral-300 px-3 py-1.5 text-sm focus:border-neutral-900 focus:outline-none"
            >
              <option value="featured">추천순</option>
              <option value="price-low">가격 낮은순</option>
              <option value="price-high">가격 높은순</option>
              <option value="name">이름순</option>
            </select>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <p className="text-neutral-600">제품을 불러오는 중...</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => {
                const stats = reviewStats[product.id] || { count: 0, average: 0 }
                const mainImage = product.images?.[0]?.url || product.image_url || "/placeholder.svg"

                return (
                  <Card
                    key={product.id}
                    className="group h-full overflow-hidden border-neutral-200 transition-shadow hover:shadow-lg"
                  >
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative aspect-square overflow-hidden bg-neutral-50">
                        <Image
                          src={mainImage || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <CardContent className="flex flex-col p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex-1">
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                            {product.brands?.name || "브랜드 없음"}
                          </p>
                          <Link href={`/products/${product.slug}`}>
                            <h3 className="mb-1 text-base font-bold text-neutral-900 hover:underline line-clamp-2">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-neutral-600">{product.category}</p>
                          <div className="mt-2 flex items-center gap-1">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${
                                    star <= Math.round(stats.average)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-neutral-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">({stats.count})</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-neutral-900">₩{Number(product.price).toLocaleString()}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 bg-transparent"
                          onClick={(e) => handleAddToCart(product.id, e)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          담기
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-neutral-600">선택한 필터에 맞는 제품이 없습니다.</p>
            </div>
          )}
        </main>
      </div>

      {/* 매장 방문 유도 섹션 */}
      <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">온라인으로는 부족하다면?</h2>
          <p className="text-lg opacity-90 mb-8">직접 앉아보고 느껴보는 것이 가장 확실합니다</p>
          
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-white/10 p-3">
                  <Store className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="font-semibold mb-2">실제 체험</h3>
              <p className="text-sm opacity-80">모든 제품을 직접 앉아보고 비교해보세요</p>
            </div>
            
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-white/10 p-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="font-semibold mb-2">전문 상담</h3>
              <p className="text-sm opacity-80">인체공학 전문가의 맞춤형 솔루션</p>
            </div>
            
            <div className="text-center">
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-white/10 p-3">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="font-semibold mb-2">특별 혜택</h3>
              <p className="text-sm opacity-80">매장 방문 고객 전용 특가 및 당일 배송</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <NaverBookingButtonWhite>
              네이버 예약으로 바로 예약하기 <ArrowRight className="ml-2 h-5 w-5" />
            </NaverBookingButtonWhite>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <Link href="tel:02-1234-5678">
                전화 상담: 02-1234-5678
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { TouchOptimizedButton } from "@/components/ui/touch-optimized-button"
import { X, ArrowLeft } from "lucide-react"

interface ReviewFiltersProps {
  productInfo?: {
    id: string
    name: string
    brands?: {
      name: string
      slug: string
    }
  } | null
  brandInfo?: {
    name: string
    slug: string
  } | null
  availableBrands?: Array<{ id: string; name: string; slug: string }>
  availableProducts?: Array<{ id: number; name: string; brandId: string }>
}

export default function ReviewFilters({ productInfo, brandInfo, availableBrands = [], availableProducts = [] }: ReviewFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentRatings = searchParams.get("ratings")?.split(",").filter(Boolean).map(Number) || []
  const currentAgeMin = Number(searchParams.get("ageMin")) || 20
  const currentAgeMax = Number(searchParams.get("ageMax")) || 60
  const currentHeightMin = Number(searchParams.get("heightMin")) || 150
  const currentHeightMax = Number(searchParams.get("heightMax")) || 200
  const currentWeightMin = Number(searchParams.get("weightMin")) || 40
  const currentWeightMax = Number(searchParams.get("weightMax")) || 100
  const currentGender = searchParams.get("gender") || ""
  const currentOccupations = searchParams.get("occupations")?.split(",").filter(Boolean) || []
  const currentSittingStyles = searchParams.get("sittingStyles")?.split(",").filter(Boolean) || []
  const currentSortBy = searchParams.get("sortBy") || "recent"
  const currentBrand = searchParams.get("brand") || ""
  const currentProduct = searchParams.get("product") || ""

  const updateURL = (updates: Record<string, string | string[] | number | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
        params.delete(key)
      } else if (Array.isArray(value)) {
        params.set(key, value.join(","))
      } else {
        params.set(key, String(value))
      }
    })

    router.push(`/reviews?${params.toString()}`)
  }

  const toggleRating = (rating: number) => {
    const newRatings = currentRatings.includes(rating)
      ? currentRatings.filter((r) => r !== rating)
      : [...currentRatings, rating]
    updateURL({ ratings: newRatings })
  }

  const toggleOccupation = (occupation: string) => {
    const newOccupations = currentOccupations.includes(occupation)
      ? currentOccupations.filter((o) => o !== occupation)
      : [...currentOccupations, occupation]
    updateURL({ occupations: newOccupations })
  }

  const toggleSittingStyle = (style: string) => {
    const newStyles = currentSittingStyles.includes(style)
      ? currentSittingStyles.filter((s) => s !== style)
      : [...currentSittingStyles, style]
    updateURL({ sittingStyles: newStyles })
  }

  const handleGenderChange = (gender: string) => {
    if (gender === currentGender) {
      updateURL({ gender: null })
    } else {
      updateURL({ gender })
    }
  }

  const handleBrandChange = (brandSlug: string) => {
    if (brandSlug === currentBrand) {
      updateURL({ brand: null, product: null })
    } else {
      updateURL({ brand: brandSlug, product: null })
    }
  }

  const handleProductChange = (productId: string) => {
    if (productId === currentProduct) {
      updateURL({ product: null })
    } else {
      updateURL({ product: productId })
    }
  }

  // 선택된 브랜드에 맞는 제품 목록 필터링
  const filteredProducts = currentBrand
    ? availableProducts.filter((p) => {
        const brand = availableBrands.find((b) => b.slug === currentBrand)
        return brand && p.brandId === brand.id
      })
    : availableProducts

  const resetFilters = () => {
    router.push("/reviews")
  }

  const clearProductFilter = () => {
    updateURL({ product: null, brand: null })
  }

  return (
    <div className="space-y-6">
      {/* 모바일에서 뒤로가기 버튼 */}
      <div className="flex items-center gap-4 lg:hidden">
        <TouchOptimizedButton
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </TouchOptimizedButton>
        <h2 className="text-lg font-semibold">필터</h2>
      </div>

      {(productInfo || brandInfo) && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex-1">
              {productInfo && (
                <>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {productInfo.brands?.name || "브랜드"}
                  </p>
                  <p className="mt-1 font-semibold">{productInfo.name}</p>
                </>
              )}
              {brandInfo && !productInfo && (
                <>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">브랜드</p>
                  <p className="mt-1 font-semibold">{brandInfo.name}</p>
                </>
              )}
            </div>
            <TouchOptimizedButton
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={clearProductFilter}
              title="필터 제거"
            >
              <X className="h-4 w-4" />
            </TouchOptimizedButton>
          </div>
          <p className="text-xs text-muted-foreground">이 제품의 리뷰만 표시 중</p>
        </div>
      )}

      {availableBrands.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">브랜드</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableBrands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={currentBrand === brand.slug}
                  onCheckedChange={() => handleBrandChange(brand.slug)}
                />
                <Label htmlFor={`brand-${brand.id}`} className="text-sm cursor-pointer">
                  {brand.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      {(filteredProducts.length > 0 || currentProduct) && (
        <div className="border-t pt-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">제품명</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`product-${product.id}`}
                    checked={currentProduct === String(product.id)}
                    onCheckedChange={() => handleProductChange(String(product.id))}
                  />
                  <Label htmlFor={`product-${product.id}`} className="text-sm cursor-pointer">
                    {product.name}
                  </Label>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">브랜드를 선택하면 제품이 표시됩니다.</p>
            )}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">정렬</h3>
        <select
          value={currentSortBy}
          onChange={(e) => updateURL({ sortBy: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="recent">최신순</option>
          <option value="helpful">추천순</option>
          <option value="rating-high">평점 높은순</option>
          <option value="rating-low">평점 낮은순</option>
          <option value="views">조회수순</option>
        </select>
      </div>

      <div className="border-t pt-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">평점</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${rating}`}
                checked={currentRatings.includes(rating)}
                onCheckedChange={() => toggleRating(rating)}
              />
              <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1 text-sm">
                {"⭐".repeat(rating)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">나이대</h3>
        <div className="space-y-4">
          <Slider
            min={20}
            max={60}
            step={5}
            value={[currentAgeMin, currentAgeMax]}
            onValueChange={(value) => updateURL({ ageMin: value[0], ageMax: value[1] })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{currentAgeMin}세</span>
            <span>{currentAgeMax}세</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">성별</h3>
        <div className="space-y-2">
          {["남자", "여자"].map((gender) => (
            <div key={gender} className="flex items-center space-x-2">
              <Checkbox
                id={`gender-${gender}`}
                checked={currentGender === gender}
                onCheckedChange={() => handleGenderChange(gender)}
              />
              <Label htmlFor={`gender-${gender}`} className="text-sm cursor-pointer">
                {gender}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">키</h3>
        <div className="space-y-4">
          <Slider
            min={150}
            max={200}
            step={5}
            value={[currentHeightMin, currentHeightMax]}
            onValueChange={(value) => updateURL({ heightMin: value[0], heightMax: value[1] })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{currentHeightMin}cm</span>
            <span>{currentHeightMax}cm</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">몸무게</h3>
        <div className="space-y-4">
          <Slider
            min={40}
            max={100}
            step={5}
            value={[currentWeightMin, currentWeightMax]}
            onValueChange={(value) => updateURL({ weightMin: value[0], weightMax: value[1] })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{currentWeightMin}kg</span>
            <span>{currentWeightMax}kg</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">직업</h3>
        <div className="space-y-2">
          {["개발자", "디자이너", "마케터", "작가", "학생", "CEO", "변호사"].map((occupation) => (
            <div key={occupation} className="flex items-center space-x-2">
              <Checkbox
                id={`occupation-${occupation}`}
                checked={currentOccupations.includes(occupation)}
                onCheckedChange={() => toggleOccupation(occupation)}
              />
              <Label htmlFor={`occupation-${occupation}`} className="text-sm">
                {occupation}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide">앉는 스타일</h3>
        <div className="space-y-2">
          {["장시간 앉아서 작업", "자주 자세를 바꿈", "바른 자세 유지", "다리를 꼬고 앉음", "장시간 회의"].map(
            (style) => (
              <div key={style} className="flex items-center space-x-2">
                <Checkbox
                  id={`style-${style}`}
                  checked={currentSittingStyles.includes(style)}
                  onCheckedChange={() => toggleSittingStyle(style)}
                />
                <Label htmlFor={`style-${style}`} className="text-sm">
                  {style}
                </Label>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="border-t pt-6">
        <TouchOptimizedButton variant="outline" className="w-full bg-transparent" onClick={resetFilters}>
          필터 초기화
        </TouchOptimizedButton>
      </div>
    </div>
  )
}

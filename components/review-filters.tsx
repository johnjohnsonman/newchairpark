"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { X } from "lucide-react"

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
}

export default function ReviewFilters({ productInfo, brandInfo }: ReviewFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentRatings = searchParams.get("ratings")?.split(",").filter(Boolean).map(Number) || []
  const currentAgeMin = Number(searchParams.get("ageMin")) || 20
  const currentAgeMax = Number(searchParams.get("ageMax")) || 60
  const currentOccupations = searchParams.get("occupations")?.split(",").filter(Boolean) || []
  const currentSittingStyles = searchParams.get("sittingStyles")?.split(",").filter(Boolean) || []
  const currentSortBy = searchParams.get("sortBy") || "recent"

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

  const resetFilters = () => {
    router.push("/reviews")
  }

  const clearProductFilter = () => {
    updateURL({ product: null, brand: null })
  }

  return (
    <div className="space-y-6">
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
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={clearProductFilter}
              title="필터 제거"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">이 제품의 리뷰만 표시 중</p>
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
        <Button variant="outline" className="w-full bg-transparent" onClick={resetFilters}>
          필터 초기화
        </Button>
      </div>
    </div>
  )
}

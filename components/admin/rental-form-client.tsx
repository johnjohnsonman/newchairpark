"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Rental } from "@/types/rental"
import type { Brand } from "@/types/database"
import Link from "next/link"
import { ImageUpload } from "@/components/admin/image-upload"
import { cn } from "@/lib/utils"

interface RentalFormClientProps {
  rental?: Rental
  brands: Brand[]
}

const categories = [
  { value: "office-chair", label: "Office Chair" },
  { value: "executive-chair", label: "Executive Chair" },
  { value: "lounge-chair", label: "Lounge Chair" },
  { value: "conference-chair", label: "Conference Chair" },
  { value: "dining-chair", label: "Dining Chair" },
  { value: "design-chair", label: "Design Chair" },
  { value: "desk", label: "Desk" },
  { value: "office-accessories", label: "Office Accessories" },
]

export function RentalFormClient({ rental, brands }: RentalFormClientProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isClientReady, setIsClientReady] = useState(true)
  
  // 슬러그 중복 체크 상태
  const [slugStatus, setSlugStatus] = useState<'checking' | 'available' | 'taken' | null>(null)

  // images를 안전하게 초기화
  const [images, setImages] = useState<Array<{ url: string; order: number }>>(() => {
    try {
      if (rental?.images) {
        if (typeof rental.images === 'string') {
          const parsed = JSON.parse(rental.images)
          return Array.isArray(parsed) ? parsed : []
        }
        if (Array.isArray(rental.images)) {
          return rental.images
        }
      }
      return []
    } catch (e) {
      console.error('Failed to parse rental images:', e)
      return []
    }
  })

  // 폼 데이터 초기화
  const [formData, setFormData] = useState({
    name: rental?.name || "",
    slug: rental?.slug || "",
    brand_id: rental?.brand_id || "no-brand",
    category: rental?.category || "office-chair",
    type: rental?.type || "rental",
    price_monthly: rental?.price_monthly || 0,
    price_daily: rental?.price_daily || 0,
    original_price: rental?.original_price || 0,
    description: rental?.description || "",
    min_rental_period: rental?.min_rental_period || 3,
    available: rental?.available ?? true,
    featured: rental?.featured ?? false,
  })

  // 제품명 변경 시 슬러그 자동 업데이트
  useEffect(() => {
    if (formData.name && !rental) {
      const autoSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      
      if (autoSlug !== formData.slug) {
        setFormData(prev => ({ ...prev, slug: autoSlug }))
      }
    }
  }, [formData.name, rental])

  // 슬러그 중복 실시간 체크
  useEffect(() => {
    if (!isClientReady) return

    const checkSlugAvailability = async () => {
      if (!formData.slug || (rental && formData.slug === rental.slug)) {
        setSlugStatus(null)
        return
      }
      
      setSlugStatus('checking')
      
      try {
        const supabase = createBrowserClient()
        const { data: existingRental } = await supabase
          .from('rentals')
          .select('id')
          .eq('slug', formData.slug)
          .maybeSingle()
        
        setSlugStatus(existingRental ? 'taken' : 'available')
      } catch (error) {
        console.error('Error checking slug:', error)
        setSlugStatus(null)
      }
    }
    
    const timeoutId = setTimeout(checkSlugAvailability, 500)
    return () => clearTimeout(timeoutId)
  }, [formData.slug, rental, isClientReady])

  const generateSlug = async () => {
    const supabase = createBrowserClient()
    
    const baseSlug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    
    let slug = baseSlug
    let counter = 1
    
    while (true) {
      const { data: existingRental } = await supabase
        .from('rentals')
        .select('id')
        .eq('slug', slug)
        .maybeSingle()
      
      if (!existingRental || (rental && existingRental.id === rental.id)) {
        break
      }
      
      slug = `${baseSlug}-${counter}`
      counter++
    }
    
    setFormData({ ...formData, slug })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (slugStatus === 'taken') {
      setError('이미 사용 중인 슬러그입니다. 다른 슬러그를 입력해주세요.')
      return
    }
    
    if (slugStatus === 'checking') {
      setError('슬러그 중복 체크 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }
    
    setIsLoading(true)
    setError(null)

    try {
      const dataToSave = {
        name: formData.name,
        slug: formData.slug,
        brand_id: formData.brand_id === "no-brand" ? null : formData.brand_id,
        category: formData.category,
        type: formData.type,
        price_monthly: formData.price_monthly || null,
        price_daily: formData.price_daily || null,
        original_price: formData.original_price || null,
        description: formData.description,
        min_rental_period: formData.min_rental_period,
        available: formData.available,
        featured: formData.featured,
        images: images,
        image_url: images.length > 0 ? images[0].url : "/placeholder.svg",
      }

      let response;
      
      if (rental) {
        // 수정
        response = await fetch(`/api/rentals/${rental.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSave),
        })
      } else {
        // 생성
        response = await fetch("/api/rentals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSave),
        })
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "렌탈 저장에 실패했습니다.")
      }
      
      alert('렌탈/데모 상품이 성공적으로 저장되었습니다!')
      router.push("/admin/rentals")
      router.refresh()
    } catch (err) {
      console.error('❌ Rental save error:', err)
      
      let errorMessage = "오류가 발생했습니다"

      if (err instanceof Error) {
        errorMessage = err.message
      } else {
        errorMessage = String(err)
      }

      setError(errorMessage)
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">상품명 *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 허먼밀러 에어론 체어"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="slug">슬러그 *</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={generateSlug}
                  disabled={!formData.name}
                >
                  이름에서 생성
                </Button>
              </div>
              <div className="relative">
                <Input
                  id="slug"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="aeron-chair"
                  className={cn(
                    slugStatus === 'taken' && 'border-red-500',
                    slugStatus === 'available' && 'border-green-500'
                  )}
                />
                {slugStatus && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    {slugStatus === 'checking' && (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                    )}
                    {slugStatus === 'available' && (
                      <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-xs text-white">✓</span>
                      </div>
                    )}
                    {slugStatus === 'taken' && (
                      <div className="h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
                        <span className="text-xs text-white">✗</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">서비스 타입 *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as "rental" | "demo" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rental">렌탈 (장기 이용)</SelectItem>
                  <SelectItem value="demo">데모 (단기 체험)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="brand">브랜드</Label>
              <Select
                value={formData.brand_id || "no-brand"}
                onValueChange={(value) => setFormData({ ...formData, brand_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="브랜드를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-brand">브랜드 없음</SelectItem>
                  {brands && brands.length > 0 ? (
                    brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-brands" disabled>
                      브랜드가 없습니다
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">카테고리 *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price_monthly">월 렌탈료</Label>
                <Input
                  id="price_monthly"
                  type="number"
                  step="1"
                  value={formData.price_monthly || ""}
                  onChange={(e) => setFormData({ ...formData, price_monthly: Number.parseFloat(e.target.value) || 0 })}
                  placeholder="100000"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price_daily">일 데모료</Label>
                <Input
                  id="price_daily"
                  type="number"
                  step="1"
                  value={formData.price_daily || ""}
                  onChange={(e) => setFormData({ ...formData, price_daily: Number.parseFloat(e.target.value) || 0 })}
                  placeholder="10000"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="original_price">구매가 (참고용)</Label>
                <Input
                  id="original_price"
                  type="number"
                  step="1"
                  value={formData.original_price || ""}
                  onChange={(e) => setFormData({ ...formData, original_price: Number.parseFloat(e.target.value) || 0 })}
                  placeholder="1500000"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="min_rental_period">최소 렌탈 기간 (개월)</Label>
              <Input
                id="min_rental_period"
                type="number"
                min="1"
                value={formData.min_rental_period}
                onChange={(e) => setFormData({ ...formData, min_rental_period: Number.parseInt(e.target.value) || 3 })}
              />
            </div>

            <div className="grid gap-2">
              <Label>이미지 업로드 *</Label>
              <ImageUpload images={images} onChange={setImages} />
              <p className="text-xs text-muted-foreground">
                첫 번째 이미지가 대표 이미지로 사용됩니다. 드래그하여 순서를 변경할 수 있습니다.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="상품 설명..."
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">대여 가능</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">추천 상품</span>
              </label>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              <p className="font-semibold">오류:</p>
              <p>{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "저장 중..." : rental ? "렌탈/데모 수정" : "렌탈/데모 추가"}
            </Button>
            <Link href="/admin/rentals">
              <Button type="button" variant="outline">
                취소
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}


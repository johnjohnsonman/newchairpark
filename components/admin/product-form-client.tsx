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
import type { Product, Brand } from "@/types/database"
import Link from "next/link"
import { ImageUpload } from "@/components/admin/image-upload"
import { UnifiedAutocompleteInput } from "@/components/ui/unified-autocomplete-input"
import { ProductOptionsManager } from "@/components/admin/product-options-manager"

interface ProductFormClientProps {
  product?: Product
  brands: Brand[]
}

const categories = [
  { value: "office-chair", label: "Office Chair" },
  { value: "executive-chair", label: "Executive Chair" },
  { value: "lounge-chair", label: "Lounge Chair" },
  { value: "conference-chair", label: "Conference Chair" },
  { value: "dining-chair", label: "Dining Chair" },
  { value: "design-chair", label: "Design Chair" },
]

export function ProductFormClient({ product, brands }: ProductFormClientProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isClientReady, setIsClientReady] = useState(true)
  
  // 브랜드 이름 표시용
  const [selectedBrandName, setSelectedBrandName] = useState("")
  
  // 제품 옵션 상태
  const [productOptions, setProductOptions] = useState<any[]>([])
  
  // 슬러그 중복 체크 상태
  const [slugStatus, setSlugStatus] = useState<'checking' | 'available' | 'taken' | null>(null)

  // images를 안전하게 초기화
  const [images, setImages] = useState<Array<{ url: string; order: number }>>(() => {
    try {
      if (product?.images) {
        if (typeof product.images === 'string') {
          const parsed = JSON.parse(product.images)
          return Array.isArray(parsed) ? parsed : []
        }
        if (Array.isArray(product.images)) {
          return product.images
        }
      }
      return []
    } catch (e) {
      console.error('Failed to parse product images:', e)
      return []
    }
  })

  // 클라이언트 준비 상태 설정 (제거)

  // 폼 데이터 초기화
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    category: product?.category || "",
    brand_id: product?.brand_id || "",
    slug: product?.slug || "",
    images: images,
    product_options: product?.product_options || [],
    specifications: product?.specifications || "",
    features: product?.features || "",
    dimensions: product?.dimensions || "",
    materials: product?.materials || "",
    warranty: product?.warranty || "",
    availability: product?.availability || "in-stock",
    tags: product?.tags || "",
    meta_title: product?.meta_title || "",
    meta_description: product?.meta_description || "",
  })

  // 브랜드 이름 설정
  useEffect(() => {
    if (product?.brand_id) {
      const brand = brands.find(b => b.id === product.brand_id)
      if (brand) {
        setSelectedBrandName(brand.name)
      }
    }
  }, [product?.brand_id, brands])

  // 제품명 변경 시 슬러그 자동 업데이트
  useEffect(() => {
    if (formData.name && !product) {
      const autoSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      
      if (autoSlug !== formData.slug) {
        setFormData(prev => ({ ...prev, slug: autoSlug }))
      }
    }
  }, [formData.name, product])

  // 슬러그 중복 실시간 체크
  useEffect(() => {
    if (!isClientReady) return

    const checkSlugAvailability = async () => {
      if (!formData.slug || (product && formData.slug === product.slug)) {
        setSlugStatus(null)
        return
      }
      
      setSlugStatus('checking')
      
      try {
        const supabase = createBrowserClient()
        const { data: existingProduct } = await supabase
          .from('products')
          .select('id')
          .eq('slug', formData.slug)
          .maybeSingle()
        
        setSlugStatus(existingProduct ? 'taken' : 'available')
      } catch (error) {
        console.error('Error checking slug:', error)
        setSlugStatus(null)
      }
    }
    
    const timeoutId = setTimeout(checkSlugAvailability, 500)
    return () => clearTimeout(timeoutId)
  }, [formData.slug, product, isClientReady])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createBrowserClient()
      
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        brand_id: formData.brand_id,
        slug: formData.slug,
        images: JSON.stringify(images),
        product_options: JSON.stringify(formData.product_options),
        specifications: formData.specifications,
        features: formData.features,
        dimensions: formData.dimensions,
        materials: formData.materials,
        warranty: formData.warranty,
        availability: formData.availability,
        tags: formData.tags,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
      }

      if (product) {
        // 제품 수정
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id)
        
        if (error) throw error
      } else {
        // 새 제품 생성
        const { error } = await supabase
          .from('products')
          .insert(productData)
        
        if (error) throw error
      }

      router.push('/admin/products')
      router.refresh()
    } catch (error) {
      console.error('Error saving product:', error)
      setError('제품 저장에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isClientReady) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">폼을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">제품명 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">슬러그 *</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  required
                  className={slugStatus === 'taken' ? 'border-red-500' : slugStatus === 'available' ? 'border-green-500' : ''}
                />
                {slugStatus === 'checking' && <span className="text-sm text-gray-500">확인 중...</span>}
                {slugStatus === 'taken' && <span className="text-sm text-red-500">이미 사용 중</span>}
                {slugStatus === 'available' && <span className="text-sm text-green-500">사용 가능</span>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">가격</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">브랜드</Label>
              <UnifiedAutocompleteInput
                label="브랜드"
                value={selectedBrandName}
                onChange={(value) => {
                  setSelectedBrandName(value)
                  const brand = brands.find(b => b.name === value)
                  if (brand) {
                    setFormData(prev => ({ ...prev, brand_id: brand.id }))
                  }
                }}
                type="brand"
                placeholder="브랜드 선택"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">재고 상태</Label>
              <Select value={formData.availability} onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-stock">재고 있음</SelectItem>
                  <SelectItem value="out-of-stock">품절</SelectItem>
                  <SelectItem value="pre-order">예약 주문</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="mt-6 space-y-2">
            <Label>제품 이미지</Label>
            <ImageUpload
              images={images || []}
              onChange={setImages}
            />
          </div>

          <div className="mt-6">
            <ProductOptionsManager
              productId={product?.id || 'new'}
              initialOptions={formData.product_options || []}
              onOptionsChange={(options) => setFormData(prev => ({ ...prev, product_options: options }))}
            />
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="specifications">제품 사양</Label>
              <Textarea
                id="specifications"
                value={formData.specifications}
                onChange={(e) => setFormData(prev => ({ ...prev, specifications: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">주요 특징</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dimensions">치수</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="materials">재질</Label>
                <Input
                  id="materials"
                  value={formData.materials}
                  onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warranty">보증 기간</Label>
                <Input
                  id="warranty"
                  value={formData.warranty}
                  onChange={(e) => setFormData(prev => ({ ...prev, warranty: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">태그</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="태그를 쉼표로 구분"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_title">SEO 제목</Label>
              <Input
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description">SEO 설명</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Link href="/admin/products">
          <Button type="button" variant="outline">취소</Button>
        </Link>
        <Button type="submit" disabled={isLoading || slugStatus === 'taken'}>
          {isLoading ? "저장 중..." : product ? "수정" : "생성"}
        </Button>
      </div>
    </form>
  )
}

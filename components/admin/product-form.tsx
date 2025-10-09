"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
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
import { SafeAutocompleteInput } from "@/components/ui/safe-autocomplete-input"
import { useUnifiedBrandProduct } from "@/hooks/use-unified-brand-product"
import { ProductOptionsManager } from "@/components/admin/product-options-manager"

interface ProductFormProps {
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

export function ProductForm({ product, brands }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isClientReady, setIsClientReady] = useState(false)
  
  // 브랜드 이름 표시용
  const [selectedBrandName, setSelectedBrandName] = useState("")
  
  // 제품 옵션 상태
  const [productOptions, setProductOptions] = useState<any[]>([])
  
  // 슬러그 중복 체크 상태
  const [slugStatus, setSlugStatus] = useState<'checking' | 'available' | 'taken' | null>(null)
  
  // 통합 브랜드/제품 데이터 훅
  const { brands: allBrands, products: allProducts, searchBrands, searchProducts } = useUnifiedBrandProduct()
  
  // 제품명 변경 시 슬러그 자동 업데이트
  useEffect(() => {
    if (formData.name && !product) {
      // 새 제품 생성 시에만 자동 슬러그 생성
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
      }, [formData.slug, product])

  // images를 JSON 파싱하여 초기화
  const [images, setImages] = useState<Array<{ url: string; order: number }>>(() => {
    if (product?.images) {
      // images가 string이면 파싱, 아니면 그대로 사용
      if (typeof product.images === 'string') {
        try {
          return JSON.parse(product.images)
        } catch (e) {
          console.error('Failed to parse product images:', e)
          return []
        }
      }
      if (Array.isArray(product.images)) {
        return product.images as Array<{ url: string; order: number }>
      }
    }
    return []
  })

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    brand_id: product?.brand_id || "no-brand",
    category: product?.category || "office-chair",
    price: product?.price || 0,
    original_price: product?.original_price || 0,
    description: product?.description || "",
    in_stock: product?.in_stock ?? true,
    featured: product?.featured ?? false,
  })

  // 통합 자동완성 시스템으로 브랜드와 제품 제안이 자동으로 처리됨
  useEffect(() => {
    const brand = brands.find(b => b.id === formData.brand_id)
    const brandName = brand ? brand.name : ""
    setSelectedBrandName(brandName)
    console.log('🏷️ Brand selected:', { brand_id: formData.brand_id, brand_name: brandName })
  }, [formData.brand_id, brands])

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        
        // 슬러그 중복 체크
        if (slugStatus === 'taken') {
          setError('이미 사용 중인 슬러그입니다. 다른 슬러그를 입력해주세요.')
          return
        }
        
        // 슬러그 체크 중인 경우 대기
        if (slugStatus === 'checking') {
          setError('슬러그 중복 체크 중입니다. 잠시 후 다시 시도해주세요.')
          return
        }
        
        setIsLoading(true)
        setError(null)

    try {
      const supabase = createBrowserClient()
      
      // images를 JSONB 형식으로 변환
      const dataToSave = {
        ...formData,
        brand_id: formData.brand_id === "no-brand" ? null : formData.brand_id,
        images: JSON.stringify(images), // JSONB로 저장
        image_url: images.length > 0 ? images[0].url : "",
        updated_at: new Date().toISOString(),
      }

      // 빈 문자열이나 null 값 처리
      if (dataToSave.brand_id === "" || dataToSave.brand_id === "no-brand" || dataToSave.brand_id === "new-brand") {
        dataToSave.brand_id = null
      }

      console.log('💾 Saving product data:', dataToSave)

      let savedProduct;
      
      if (product) {
        console.log('🔄 Updating existing product:', product.id)
        const { data, error } = await supabase
          .from("products")
          .update(dataToSave)
          .eq("id", product.id)
          .select()
          .single()
        
        console.log('✅ Update result:', { data, error })
        if (error) throw error
        savedProduct = data
      } else {
        console.log('✨ Creating new product')
        const { data, error } = await supabase
          .from("products")
          .insert([dataToSave])
          .select()
          .single()
        
        console.log('✅ Insert result:', { data, error })
        if (error) throw error
        savedProduct = data
      }

      console.log('🎉 Product saved successfully!', savedProduct)
      
      // 성공 메시지 표시
      alert('제품이 성공적으로 저장되었습니다!')
      
      // 리다이렉트
      router.push("/admin/products")
      router.refresh()
    } catch (err) {
      console.error('❌ Product save error:', err)
      let errorMessage = "An error occurred"

      if (err instanceof Error) {
        if (err.message.includes("duplicate key value violates unique constraint")) {
          if (err.message.includes("products_slug_key")) {
            errorMessage = `이 슬러그(${formData.slug})는 이미 사용 중입니다. 다른 슬러그를 사용해주세요.`
          } else {
            errorMessage = "중복된 값이 있습니다. 다른 값을 입력해주세요."
          }
        } else {
          errorMessage = err.message
        }
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

      const generateSlug = async () => {
        const supabase = createBrowserClient()
        
        const baseSlug = formData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
        
        let slug = baseSlug
        let counter = 1
        
        // 중복 체크하여 고유한 슬러그 생성
        while (true) {
          const { data: existingProduct } = await supabase
            .from('products')
            .select('id')
            .eq('slug', slug)
            .maybeSingle()
          
          if (!existingProduct || (product && existingProduct.id === product.id)) {
            break // 사용 가능한 슬러그
          }
          
          slug = `${baseSlug}-${counter}`
          counter++
        }
        
        setFormData({ ...formData, slug })
      }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <SafeAutocompleteInput
              label="Product Name *"
              placeholder="예: Aeron Chair, Gesture Chair"
              value={formData.name}
              onChange={useCallback((value) => setFormData(prev => ({ ...prev, name: value })), [])}
              suggestions={searchProducts(formData.name, selectedBrandName)}
              isLoading={false}
            />

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="slug">Slug *</Label>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={generateSlug}
                  disabled={!formData.name}
                >
                  Generate from name
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
              {slugStatus === 'taken' && (
                <p className="text-sm text-red-600">이 슬러그는 이미 사용 중입니다.</p>
              )}
              {slugStatus === 'available' && (
                <p className="text-sm text-green-600">사용 가능한 슬러그입니다.</p>
              )}
            </div>

            <SafeAutocompleteInput
              label="Brand"
              placeholder="예: Herman Miller, Steelcase"
              value={selectedBrandName || ""}
              onChange={useCallback((value) => {
                console.log('🏷️ Brand input changed:', value)
                // 브랜드 이름으로 브랜드 ID 찾기
                const brand = brands.find(b => b.name === value)
                const brandId = brand ? brand.id : (value ? "new-brand" : null)
                console.log('🏷️ Brand ID set:', brandId)
                setFormData(prev => ({ ...prev, brand_id: brandId }))
              }, [brands])}
              suggestions={searchBrands(selectedBrandName)}
              isLoading={false}
            />

            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                  placeholder="1299.99"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="original_price">Original Price</Label>
                <Input
                  id="original_price"
                  type="number"
                  step="0.01"
                  value={formData.original_price || ""}
                  onChange={(e) => setFormData({ ...formData, original_price: Number.parseFloat(e.target.value) || 0 })}
                  placeholder="1499.99"
                />
              </div>
            </div>

            <ImageUpload images={images} onChange={setImages} />

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description..."
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.in_stock}
                  onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">In Stock</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Featured</span>
              </label>
            </div>
          </div>

              {/* 제품 옵션 관리 */}
              {product && (
                <ProductOptionsManager
                  productId={product.id}
                  onOptionsChange={setProductOptions}
                />
              )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </Button>
            <Link href="/admin/products">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

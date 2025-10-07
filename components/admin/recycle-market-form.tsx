"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import type { RecycleMarket } from "@/types/database"
import Link from "next/link"
import { SingleImageUpload } from "@/components/admin/single-image-upload"
import { AutocompleteInput } from "@/components/ui/autocomplete-input"
import { useBrandProductData } from "@/hooks/use-brand-product-data"

interface RecycleMarketFormProps {
  recycleItem?: RecycleMarket
  brands: { id: string; name: string }[]
}

export function RecycleMarketForm({ recycleItem, brands }: RecycleMarketFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 브랜드 및 제품 데이터 로드
  const { brands: allBrands, getProductsByBrand, loadingBrands } = useBrandProductData()
  const [productSuggestions, setProductSuggestions] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: recycleItem?.title || "",
    description: recycleItem?.description || "",
    price: recycleItem?.price || 0,
    brand: recycleItem?.brand || "",
    image_url: recycleItem?.image_url || "",
    status: recycleItem?.status || "available",
    contact_info: recycleItem?.contact_info || "",
  })

  // 브랜드 변경 시 해당 브랜드의 제품 목록 업데이트
  useEffect(() => {
    if (formData.brand) {
      const products = getProductsByBrand(formData.brand)
      setProductSuggestions(products)
    } else {
      setProductSuggestions([])
    }
  }, [formData.brand, getProductsByBrand])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      if (recycleItem) {
        // Update existing item
        const { error } = await supabase
          .from("recycle_market")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", recycleItem.id)

        if (error) throw error
      } else {
        // Create new item
        const { error } = await supabase.from("recycle_market").insert([formData])

        if (error) throw error
      }

      router.push("/admin/recycle-market")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
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
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Herman Miller Aeron Chair"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="brand">
                  브랜드
                  {loadingBrands && <span className="text-xs text-muted-foreground ml-2">(로딩중...)</span>}
                </Label>
                <AutocompleteInput
                  id="brand"
                  value={formData.brand}
                  onChange={(value) => setFormData({ ...formData, brand: value })}
                  suggestions={allBrands}
                  placeholder="예: Herman Miller, Steelcase"
                  allowCustom={true}
                  disabled={loadingBrands}
                />
                <p className="text-xs text-muted-foreground">
                  기존 브랜드 선택 또는 새 브랜드 입력 가능
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="title_autocomplete">
                  제품명 (자동완성)
                  {formData.brand && productSuggestions.length > 0 && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({productSuggestions.length}개 제안)
                    </span>
                  )}
                </Label>
                <AutocompleteInput
                  id="title_autocomplete"
                  value={formData.title}
                  onChange={(value) => setFormData({ ...formData, title: value })}
                  suggestions={productSuggestions}
                  placeholder={
                    formData.brand 
                      ? `${formData.brand}의 제품 선택 또는 입력`
                      : "브랜드 선택 후 제품명 입력"
                  }
                  allowCustom={true}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.brand 
                    ? "해당 브랜드의 기존 제품 선택 또는 새 제품 입력"
                    : "먼저 브랜드를 선택하면 제품 제안이 나타납니다"
                  }
                </p>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">Price (₩) *</Label>
              <Input
                id="price"
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="500000"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Image *</Label>
              <SingleImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                aspectRatio="video"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Item description..."
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact_info">Contact Information</Label>
              <Input
                id="contact_info"
                value={formData.contact_info}
                onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
                placeholder="Email or phone number"
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : recycleItem ? "Update Item" : "Add Item"}
            </Button>
            <Link href="/admin/recycle-market">
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

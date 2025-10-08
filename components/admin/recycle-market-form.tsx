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
import { createBrowserClient } from "@/lib/supabase/client"
import type { RecycleMarket } from "@/types/database"
import Link from "next/link"
import { SingleImageUpload } from "@/components/admin/single-image-upload"
import { UnifiedAutocompleteInput } from "@/components/ui/unified-autocomplete-input"

interface RecycleMarketFormProps {
  recycleItem?: RecycleMarket
  brands: { id: string; name: string }[]
}

export function RecycleMarketForm({ recycleItem, brands }: RecycleMarketFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 통합 자동완성 시스템으로 브랜드와 제품 제안이 자동으로 처리됨

  const [formData, setFormData] = useState({
    title: recycleItem?.title || "",
    description: recycleItem?.description || "",
    price: recycleItem?.price || 0,
    brand: recycleItem?.brand || "",
    image_url: recycleItem?.image_url || "",
    status: recycleItem?.status || "available",
    contact_info: recycleItem?.contact_info || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createBrowserClient()

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
              <UnifiedAutocompleteInput
                label="브랜드"
                placeholder="예: Herman Miller, Steelcase"
                value={formData.brand}
                onChange={(value) => setFormData({ ...formData, brand: value })}
                type="brand"
              />

              <UnifiedAutocompleteInput
                label="제품명"
                placeholder="예: Aeron Chair, Gesture Chair"
                value={formData.title}
                onChange={(value) => setFormData({ ...formData, title: value })}
                type="product"
                selectedBrand={formData.brand}
              />
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

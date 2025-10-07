"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import type { Brand } from "@/types/database"
import Link from "next/link"
import { SingleImageUpload } from "@/components/admin/single-image-upload"
import { BrandBannerUpload } from "@/components/admin/brand-banner-upload"

interface BrandFormProps {
  brand?: Brand
  initialBanners?: any[]
}

export function BrandForm({ brand, initialBanners = [] }: BrandFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [banners, setBanners] = useState<any[]>(initialBanners)

  const [formData, setFormData] = useState({
    name: brand?.name || "",
    slug: brand?.slug || "",
    logo_url: brand?.logo_url || "",
    description: brand?.description || "",
    hero_image_url: brand?.hero_image_url || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      if (brand) {
        // Update existing brand
        const { error } = await supabase
          .from("brands")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", brand.id)

        if (error) throw error
      } else {
        // Create new brand
        const { data: newBrand, error: brandError } = await supabase
          .from("brands")
          .insert([formData])
          .select()
          .single()

        if (brandError) throw brandError

        // 새 브랜드 생성 후 배너도 저장
        if (newBrand && banners.length > 0) {
          const bannerPromises = banners.map(async (banner, index) => {
            // 임시 URL인 경우 실제 파일 업로드
            let imageUrl = banner.image_url
            
            if (banner.image_url.startsWith('blob:')) {
              try {
                // Blob URL을 File 객체로 변환
                const response = await fetch(banner.image_url)
                const blob = await response.blob()
                const file = new File([blob], `banner-${index}.jpg`, { type: blob.type })
                
                // 실제 파일 업로드
                const formData = new FormData()
                formData.append('file', file)
                formData.append('category', `brand-${newBrand.id}`)
                
                const uploadResponse = await fetch('/api/category-banners/upload', {
                  method: 'POST',
                  body: formData,
                })
                
                if (uploadResponse.ok) {
                  const uploadData = await uploadResponse.json()
                  imageUrl = uploadData.url
                } else {
                  throw new Error('File upload failed')
                }
              } catch (uploadError) {
                console.error('Banner upload error:', uploadError)
                throw uploadError
              }
            }
            
            return supabase
              .from("category_banners")
              .insert({
                category: `brand-${newBrand.id}`,
                image_url: imageUrl,
                title: banner.title || '',
                description: banner.description || '',
                order_index: index,
                is_active: true
              })
          })

          const bannerResults = await Promise.all(bannerPromises)
          const bannerErrors = bannerResults.filter(result => result.error)
          
          if (bannerErrors.length > 0) {
            console.error('Some banners failed to save:', bannerErrors)
            // 브랜드는 생성되었으므로 경고만 표시
            setError("브랜드는 생성되었지만 일부 배너 저장에 실패했습니다.")
          }
        }
      }

      router.push("/admin/brands")
      router.refresh()
    } catch (err) {
      console.error('Brand form submission error:', err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    setFormData({ ...formData, slug })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Brand Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Herman Miller"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="slug">Slug *</Label>
                <Button type="button" variant="ghost" size="sm" onClick={generateSlug}>
                  Generate from name
                </Button>
              </div>
              <Input
                id="slug"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="herman-miller"
              />
            </div>

            <div className="grid gap-2">
              <Label>Logo</Label>
              <SingleImageUpload
                value={formData.logo_url}
                onChange={(url) => setFormData({ ...formData, logo_url: url })}
                aspectRatio="square"
              />
            </div>

            <div className="grid gap-2">
              <Label>Hero Image</Label>
              <SingleImageUpload
                value={formData.hero_image_url}
                onChange={(url) => setFormData({ ...formData, hero_image_url: url })}
                aspectRatio="video"
              />
            </div>

            {/* 브랜드 배너 관리 */}
            <div className="grid gap-2">
              <BrandBannerUpload
                brandId={brand?.id || 'temp'}
                initialBanners={initialBanners}
                onBannersChange={setBanners}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brand description..."
                rows={4}
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : brand ? "Update Brand" : "Create Brand"}
            </Button>
            <Link href="/admin/brands">
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

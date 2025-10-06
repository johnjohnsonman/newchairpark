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
import type { Gallery } from "@/types/database"
import Link from "next/link"
import { MultipleImageUpload } from "@/components/admin/multiple-image-upload"

interface GalleryFormProps {
  galleryItem?: Gallery
}

export function GalleryForm({ galleryItem }: GalleryFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 기존 데이터가 있으면 images 배열 또는 image_url을 사용
  const initialImages = galleryItem?.images && galleryItem.images.length > 0 
    ? galleryItem.images 
    : galleryItem?.image_url 
      ? [galleryItem.image_url] 
      : []
  
  const initialFeaturedIndex = galleryItem?.featured_image_index ?? 0

  const [formData, setFormData] = useState({
    title: galleryItem?.title || "",
    description: galleryItem?.description || "",
    images: initialImages,
    featuredIndex: initialFeaturedIndex,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.images.length === 0) {
      setError("최소 1개의 이미지를 업로드해주세요.")
      return
    }

    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const dataToSubmit: any = {
        title: formData.title,
        description: formData.description,
        image_url: formData.images[formData.featuredIndex], // 대표 이미지를 image_url에 저장
      }

      // images와 featured_image_index는 선택적으로 추가 (DB에 컬럼이 있을 경우에만)
      if (formData.images.length > 0) {
        dataToSubmit.images = formData.images
        dataToSubmit.featured_image_index = formData.featuredIndex
      }

      console.log('Submitting gallery data:', dataToSubmit)

      if (galleryItem) {
        // Update existing gallery item
        const { data, error } = await supabase
          .from("gallery")
          .update({
            ...dataToSubmit,
            updated_at: new Date().toISOString(),
          })
          .eq("id", galleryItem.id)
          .select()

        console.log('Update response:', { data, error })
        if (error) throw error
      } else {
        // Create new gallery item
        const { data, error } = await supabase.from("gallery").insert([dataToSubmit]).select()

        console.log('Insert response:', { data, error })
        if (error) throw error
      }

      router.push("/admin/gallery")
      router.refresh()
    } catch (err) {
      console.error('Gallery form error:', err)
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
                placeholder="Beautiful workspace setup"
              />
            </div>

            <div className="grid gap-2">
              <Label>Images * (다중 업로드 가능)</Label>
              <MultipleImageUpload
                images={formData.images}
                featuredIndex={formData.featuredIndex}
                onChange={(images, featuredIndex) => 
                  setFormData({ ...formData, images, featuredIndex })
                }
                maxImages={10}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Image description..."
                rows={4}
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : galleryItem ? "Update Image" : "Add Image"}
            </Button>
            <Link href="/admin/gallery">
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

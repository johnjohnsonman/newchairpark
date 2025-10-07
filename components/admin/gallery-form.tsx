"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import type { Gallery } from "@/types/database"
import Link from "next/link"
import { GalleryImageUpload } from "@/components/admin/gallery-image-upload"
import { UnifiedAutocompleteInput } from "@/components/ui/unified-autocomplete-input"

interface GalleryFormProps {
  galleryItem?: Gallery
}

export function GalleryForm({ galleryItem }: GalleryFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // 통합 브랜드 및 제품 데이터 로드 (더 이상 필요 없음)

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
    brand: galleryItem?.brand || "",
    product_name: galleryItem?.product_name || "",
    images: initialImages,
    featuredIndex: initialFeaturedIndex,
  })

  // 통합 자동완성 시스템으로 제품 제안이 자동으로 처리됨

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.images.length === 0) {
      setError("최소 1개의 이미지를 업로드해주세요.")
      return
    }

    if (!formData.title.trim()) {
      setError("제목을 입력해주세요.")
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const supabase = createClient()

    try {
      const dataToSubmit: any = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        brand: formData.brand.trim(),
        product_name: formData.product_name.trim(),
        image_url: formData.images[formData.featuredIndex], // 대표 이미지를 image_url에 저장
      }

      // images와 featured_image_index는 선택적으로 추가 (DB에 컬럼이 있을 경우에만)
      if (formData.images.length > 0) {
        dataToSubmit.images = formData.images
        dataToSubmit.featured_image_index = formData.featuredIndex
      }

      console.log('Submitting gallery data:', dataToSubmit)

      // 타임아웃 설정 (1분 30초)
      const submitPromise = galleryItem 
        ? supabase
            .from("gallery")
            .update({
              ...dataToSubmit,
              updated_at: new Date().toISOString(),
            })
            .eq("id", galleryItem.id)
            .select()
        : supabase.from("gallery").insert([dataToSubmit]).select()

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('제출 시간이 초과되었습니다. 파일 크기가 클 수 있습니다. 다시 시도해주세요.')), 90000) // 1분 30초
      )

      const { data, error } = await Promise.race([submitPromise, timeoutPromise]) as any

      console.log('Submit response:', { data, error })
      
      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || '데이터베이스 오류가 발생했습니다.')
      }

      if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new Error('데이터 저장에 실패했습니다.')
      }

      // 성공 메시지 표시
      console.log('Gallery saved successfully:', data)
      setSuccess(galleryItem ? "갤러리가 성공적으로 수정되었습니다!" : "갤러리가 성공적으로 등록되었습니다!")
      
      // 잠시 대기 후 리다이렉트
      setTimeout(() => {
        window.location.href = "/admin/gallery"
      }, 2000)

    } catch (err) {
      console.error('Gallery form error:', err)
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      setError(errorMessage)
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
                placeholder="갤러리 제목을 입력하세요"
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
                value={formData.product_name}
                onChange={(value) => setFormData({ ...formData, product_name: value })}
                type="product"
                selectedBrand={formData.brand}
              />
            </div>

            <div className="grid gap-2">
              <Label>Images * (다중 업로드 가능)</Label>
              <GalleryImageUpload
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
          {success && <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">{success}</div>}

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={isLoading || formData.images.length === 0 || !formData.title.trim()} 
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  저장 중...
                </div>
              ) : (
                galleryItem ? "갤러리 수정" : "갤러리 등록"
              )}
            </Button>
            <Link href="/admin/gallery">
              <Button type="button" variant="outline" disabled={isLoading}>
                취소
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

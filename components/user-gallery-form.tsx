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
import { MultipleImageUpload } from "@/components/admin/multiple-image-upload"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Gallery {
  id: string
  title: string
  description: string | null
  image_url: string | null
  user_id: string | null
}

interface UserGalleryFormProps {
  userId: string
  galleryItem?: Gallery
}

export function UserGalleryForm({ userId, galleryItem }: UserGalleryFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 기존 데이터가 있으면 images 배열 또는 image_url을 사용
  const initialImages = galleryItem?.image_url ? [galleryItem.image_url] : []
  
  const initialFeaturedIndex = 0

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
        user_id: userId,
      }

      // images와 featured_image_index는 선택적으로 추가 (DB에 컬럼이 있을 경우에만)
      if (formData.images.length > 0) {
        dataToSubmit.images = formData.images
        dataToSubmit.featured_image_index = formData.featuredIndex
      }

      console.log('Submitting user gallery data:', dataToSubmit)

      if (galleryItem) {
        // Update existing gallery item
        const { data, error } = await supabase
          .from("gallery")
          .update({
            ...dataToSubmit,
            updated_at: new Date().toISOString(),
          })
          .eq("id", galleryItem.id)
          .eq("user_id", userId)
          .select()

        console.log('Update response:', { data, error })
        if (error) throw error
      } else {
        // Create new gallery item
        const { data, error } = await supabase.from("gallery").insert([dataToSubmit]).select()

        console.log('Insert response:', { data, error })
        if (error) throw error
      }

      router.push("/my-page")
      router.refresh()
    } catch (err) {
      console.error('User gallery form error:', err)
      setError(err instanceof Error ? err.message : "오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!galleryItem) return

    setIsDeleting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("gallery").delete().eq("id", galleryItem.id).eq("user_id", userId)

      if (error) throw error

      router.push("/my-page")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다")
      setIsDeleting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">제목 *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="갤러리 제목을 입력하세요"
              />
            </div>

            <div className="grid gap-2">
              <Label>이미지 * (다중 업로드 가능)</Label>
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
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="이미지 설명을 입력하세요..."
                rows={4}
              />
            </div>
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "저장 중..." : galleryItem ? "수정" : "추가"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              취소
            </Button>
            {galleryItem && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive" size="icon" disabled={isDeleting}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
                    <AlertDialogDescription>
                      이 작업은 되돌릴 수 없습니다. 갤러리 항목이 영구적으로 삭제됩니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                      {isDeleting ? "삭제 중..." : "삭제"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

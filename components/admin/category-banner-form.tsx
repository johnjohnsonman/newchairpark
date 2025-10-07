"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { MultipleImageUpload } from "./multiple-image-upload"

const categories = [
  { id: "all-chairs", name: "전체체어" },
  { id: "office-chair", name: "오피스 체어" },
  { id: "executive-chair", name: "임원용 체어" },
  { id: "lounge-chair", name: "라운지 체어" },
  { id: "conference-chair", name: "회의용 체어" },
  { id: "dining-chair", name: "다이닝 체어" },
  { id: "design-chair", name: "디자인 체어" },
]

export function CategoryBannerForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    category_id: "",
    title: "",
    description: "",
    images: [] as string[],
    featured_image_index: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      // 데이터베이스 스키마에 따라 다른 방식으로 삽입
      const insertData: any = {
        category_id: formData.category_id,
        title: formData.title,
        description: formData.description,
      }

      // images 컬럼이 있는지 확인하고 적절한 필드 사용
      if (formData.images && formData.images.length > 0) {
        insertData.images = formData.images
        insertData.featured_image_index = formData.featured_image_index
        // 하위 호환성을 위해 첫 번째 이미지를 background_image에도 저장
        insertData.background_image = formData.images[formData.featured_image_index] || formData.images[0]
      }

      const { data, error } = await supabase
        .from("category_banners")
        .insert([insertData])
        .select()
        .single()

      if (error) throw error

      router.push("/admin/category-banners")
      router.refresh()
    } catch (err) {
      console.error("Banner save error:", err)
      setError(err instanceof Error ? err.message : "배너 저장에 실패했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>카테고리 배너 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category_id">카테고리 *</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData({ ...formData, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">배너 제목 *</Label>
              <Input
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="예: Herman Miller Aeron"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">배너 설명 *</Label>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="예: 장시간 업무에 최적화된 인체공학적 오피스 체어"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label>배너 이미지들 * (최대 5개)</Label>
              <MultipleImageUpload
                images={formData.images}
                featuredIndex={formData.featured_image_index}
                maxImages={5}
                onChange={(images, featuredIndex) => setFormData({ ...formData, images, featured_image_index: featuredIndex })}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "저장 중..." : "배너 추가"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
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
import { SingleImageUpload } from "./single-image-upload"

const categories = [
  { id: "office-chair", name: "오피스 체어" },
  { id: "executive-chair", name: "임원용 체어" },
  { id: "lounge-chair", name: "라운지 체어" },
  { id: "conference-chair", name: "회의용 체어" },
  { id: "dining-chair", name: "다이닝 체어" },
  { id: "design-chair", name: "디자인 체어" },
]

interface CategoryBannerEditFormProps {
  banner: {
    id: string
    category_id: string
    title: string
    description: string
    background_image: string
  }
}

export function CategoryBannerEditForm({ banner }: CategoryBannerEditFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    category_id: banner.category_id,
    title: banner.title,
    description: banner.description,
    background_image: banner.background_image,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("category_banners")
        .update(formData)
        .eq("id", banner.id)
        .select()
        .single()

      if (error) throw error

      router.push("/admin/category-banners")
      router.refresh()
    } catch (err) {
      console.error("Banner update error:", err)
      setError(err instanceof Error ? err.message : "배너 수정에 실패했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>카테고리 배너 정보 수정</CardTitle>
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
              <Label>배경 이미지 *</Label>
              <SingleImageUpload
                image={formData.background_image}
                onChange={(url) => setFormData({ ...formData, background_image: url })}
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
              {isLoading ? "수정 중..." : "배너 수정"}
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

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { createBrowserClient } from "@/lib/supabase/client"
import { SingleImageUpload } from "@/components/admin/single-image-upload"

interface CategoryBannerFormProps {
  banner: any
}

export default function CategoryBannerForm({ banner }: CategoryBannerFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: banner.title || "",
    description: banner.description || "",
    background_image: banner.background_image || "",
    featured_image: banner.featured_image || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const supabase = createBrowserClient()
    const { error } = await supabase
      .from("category_banners")
      .update({
        ...formData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", banner.id)

    if (error) {
      alert("오류가 발생했습니다: " + error.message)
    } else {
      alert("배너가 수정되었습니다!")
      router.push("/admin/category-banners")
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div>
            <Label htmlFor="category">카테고리</Label>
            <Input id="category" value={banner.category_name} disabled className="bg-neutral-100" />
          </div>

          <div>
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label>배경 이미지</Label>
            <SingleImageUpload
              value={formData.background_image}
              onChange={(url) => setFormData({ ...formData, background_image: url })}
              aspectRatio="video"
            />
          </div>

          <div>
            <Label>제품 이미지</Label>
            <SingleImageUpload
              value={formData.featured_image}
              onChange={(url) => setFormData({ ...formData, featured_image: url })}
              aspectRatio="square"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "저장 중..." : "배너 수정"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              취소
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

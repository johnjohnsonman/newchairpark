"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { SingleImageUpload } from "@/components/admin/single-image-upload"
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

interface RecycleItem {
  id: string
  title: string
  description: string | null
  price: number | null
  brand: string | null
  image_url: string | null
  condition: string | null
  category: string | null
  location: string | null
  seller_name: string | null
  seller_contact: string | null
  status: string | null
  user_id: string | null
}

interface Profile {
  display_name: string | null
  phone: string | null
  address: string | null
}

interface UserRecycleFormProps {
  userId: string
  profile: Profile | null
  recycleItem?: RecycleItem
}

export function UserRecycleForm({ userId, profile, recycleItem }: UserRecycleFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: recycleItem?.title || "",
    description: recycleItem?.description || "",
    price: recycleItem?.price || 0,
    brand: recycleItem?.brand || "",
    condition: recycleItem?.condition || "good",
    category: recycleItem?.category || "",
    location: recycleItem?.location || profile?.address || "",
    seller_name: recycleItem?.seller_name || profile?.display_name || "",
    seller_contact: recycleItem?.seller_contact || profile?.phone || "",
    image_url: recycleItem?.image_url || "",
    status: recycleItem?.status || "available",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      if (recycleItem) {
        // Update existing item
        const { error } = await supabase
          .from("recycle_items")
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", recycleItem.id)
          .eq("user_id", userId)

        if (error) throw error
      } else {
        // Create new item
        const { error } = await supabase.from("recycle_items").insert([
          {
            ...formData,
            user_id: userId,
          },
        ])

        if (error) throw error
      }

      router.push("/my-page")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!recycleItem) return

    setIsDeleting(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.from("recycle_items").delete().eq("id", recycleItem.id).eq("user_id", userId)

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
                placeholder="예: 허먼밀러 에어론 의자"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="brand">브랜드</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="예: 허먼밀러"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">카테고리</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="예: 의자"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price">가격 (원) *</Label>
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
              <Label htmlFor="condition">상태 *</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => setFormData({ ...formData, condition: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">새 상품</SelectItem>
                  <SelectItem value="like-new">거의 새것</SelectItem>
                  <SelectItem value="good">좋음</SelectItem>
                  <SelectItem value="fair">보통</SelectItem>
                  <SelectItem value="poor">나쁨</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">판매 상태 *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">판매중</SelectItem>
                  <SelectItem value="reserved">예약중</SelectItem>
                  <SelectItem value="sold">판매완료</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>이미지 *</Label>
              <SingleImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                aspectRatio="video"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">상세 설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="상품에 대한 자세한 설명을 입력하세요..."
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">거래 지역</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="예: 서울 강남구"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="seller_name">판매자 이름 *</Label>
              <Input
                id="seller_name"
                required
                value={formData.seller_name}
                onChange={(e) => setFormData({ ...formData, seller_name: e.target.value })}
                placeholder="이름"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="seller_contact">연락처 *</Label>
              <Input
                id="seller_contact"
                required
                value={formData.seller_contact}
                onChange={(e) => setFormData({ ...formData, seller_contact: e.target.value })}
                placeholder="전화번호 또는 이메일"
              />
            </div>
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "저장 중..." : recycleItem ? "수정" : "등록"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              취소
            </Button>
            {recycleItem && (
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
                      이 작업은 되돌릴 수 없습니다. 중고상품이 영구적으로 삭제됩니다.
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

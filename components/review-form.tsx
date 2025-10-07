"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Upload, X } from "lucide-react"
import { TouchOptimizedButton } from "@/components/ui/touch-optimized-button"
import Image from "next/image"

interface ReviewFormProps {
  products: Array<{
    id: string
    name: string
    brands?: { name: string } | null
  }>
  user?: any
}

export function ReviewForm({ products, user }: ReviewFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])

  const [formData, setFormData] = useState({
    product_id: "",
    title: "",
    comment: "",
    rating: 5,
    user_name: user?.email?.split("@")[0] || "",
    user_email: user?.email || "",
    age: "",
    occupation: "",
    sitting_style: "",
    satisfaction_score: 5,
    design_score: 5,
    comfort_score: 5,
    value_score: 5,
    verified_purchase: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          images,
          user_id: user?.id || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "리뷰 작성에 실패했습니다")
      }

      const result = await response.json()
      router.push(`/reviews/${result.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "리뷰 작성 중 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (images.length >= 5) {
      setError("최대 5개의 이미지만 업로드할 수 있습니다")
      return
    }

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/reviews/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("이미지 업로드 실패")

      const data = await response.json()
      setImages([...images, data.url])
    } catch (err) {
      setError("이미지 업로드 중 오류가 발생했습니다")
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const renderStarRating = (value: number, onChange: (value: number) => void, label: string) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-colors hover:text-yellow-400"
          >
            <Star
              className={`h-6 w-6 ${
                star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">{value}/5</span>
      </div>
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>리뷰 작성</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">{error}</div>
          )}

          {/* 제품 선택 */}
          <div className="space-y-2">
            <Label htmlFor="product">리뷰할 제품 *</Label>
            <Select value={formData.product_id} onValueChange={(value) => setFormData({ ...formData, product_id: value })}>
              <SelectTrigger>
                <SelectValue placeholder="제품을 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.brands?.name} {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 리뷰 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title">리뷰 제목 *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="리뷰 제목을 입력해주세요"
            />
          </div>

          {/* 전체 평점 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">전체 평점 *</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="transition-colors hover:text-yellow-400"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-lg font-medium">{formData.rating}/5</span>
            </div>
          </div>

          {/* 리뷰 내용 */}
          <div className="space-y-2">
            <Label htmlFor="comment">리뷰 내용 *</Label>
            <Textarea
              id="comment"
              required
              rows={6}
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="사용 후기를 자세히 작성해주세요"
            />
          </div>

          {/* 세부 평점 */}
          <div className="grid gap-4 sm:grid-cols-2">
            {renderStarRating(
              formData.satisfaction_score,
              (value) => setFormData({ ...formData, satisfaction_score: value }),
              "전체 만족도"
            )}
            {renderStarRating(
              formData.design_score,
              (value) => setFormData({ ...formData, design_score: value }),
              "디자인"
            )}
            {renderStarRating(
              formData.comfort_score,
              (value) => setFormData({ ...formData, comfort_score: value }),
              "편안함"
            )}
            {renderStarRating(
              formData.value_score,
              (value) => setFormData({ ...formData, value_score: value }),
              "가성비"
            )}
          </div>

          {/* 작성자 정보 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="user_name">작성자 이름 *</Label>
              <Input
                id="user_name"
                required
                value={formData.user_name}
                onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                placeholder="닉네임 또는 이름"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user_email">이메일 {!user && "*"}</Label>
              <Input
                id="user_email"
                type="email"
                required={!user}
                value={formData.user_email}
                onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                placeholder="이메일 주소"
                disabled={!!user}
              />
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">나이</Label>
              <Input
                id="age"
                type="number"
                min="10"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="나이"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">직업</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="직업"
              />
            </div>
          </div>

          {/* 앉는 스타일 */}
          <div className="space-y-2">
            <Label htmlFor="sitting_style">앉는 스타일</Label>
            <Select value={formData.sitting_style} onValueChange={(value) => setFormData({ ...formData, sitting_style: value })}>
              <SelectTrigger>
                <SelectValue placeholder="앉는 스타일을 선택해주세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="장시간 앉아서 작업">장시간 앉아서 작업</SelectItem>
                <SelectItem value="자주 자세를 바꿈">자주 자세를 바꿈</SelectItem>
                <SelectItem value="바른 자세 유지">바른 자세 유지</SelectItem>
                <SelectItem value="다리를 꼬고 앉음">다리를 꼬고 앉음</SelectItem>
                <SelectItem value="장시간 회의">장시간 회의</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 구매 인증 */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="verified_purchase"
              checked={formData.verified_purchase}
              onChange={(e) => setFormData({ ...formData, verified_purchase: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="verified_purchase" className="text-sm">
              이 제품을 실제로 구매했습니다
            </Label>
          </div>

          {/* 이미지 업로드 */}
          <div className="space-y-2">
            <Label>사진 첨부 (선택사항)</Label>
            <div className="space-y-4">
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="relative aspect-square overflow-hidden rounded-lg border">
                        <Image src={image} alt={`Review image ${index + 1}`} fill className="object-cover" />
                      </div>
                      <TouchOptimizedButton
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -right-2 -top-2 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </TouchOptimizedButton>
                    </div>
                  ))}
                </div>
              )}
              
              {images.length < 5 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`cursor-pointer flex flex-col items-center gap-2 ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-75'
                    }`}
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">사진 업로드</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (최대 5개)</p>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-3">
            <TouchOptimizedButton
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  작성 중...
                </div>
              ) : (
                "리뷰 작성하기"
              )}
            </TouchOptimizedButton>
            <TouchOptimizedButton
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              취소
            </TouchOptimizedButton>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

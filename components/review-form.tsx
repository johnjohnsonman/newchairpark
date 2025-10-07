"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Upload, X } from "lucide-react"
import { TouchOptimizedButton } from "@/components/ui/touch-optimized-button"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

interface ReviewFormProps {
  user?: any
}

export function ReviewForm({ user }: ReviewFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([])
  const [loadingBrands, setLoadingBrands] = useState(true)

  const [formData, setFormData] = useState({
    brand_id: "",
    product_name: "",
    title: "",
    comment: "",
    rating: 5,
    user_name: user?.email?.split("@")[0] || "",
    user_email: user?.email || "",
    age: "",
    occupation: "",
    height: "",
    gender: "",
    sitting_duration: "",
    sitting_style: "",
    satisfaction_score: 5,
    design_score: 5,
    comfort_score: 5,
    value_score: 5,
    verified_purchase: false,
  })

  // 브랜드 목록 가져오기
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("brands")
          .select("id, name")
          .order("name")

        if (error) throw error
        setBrands(data || [])
      } catch (err) {
        console.error("브랜드 목록 가져오기 실패:", err)
        setError("브랜드 목록을 불러오는데 실패했습니다")
      } finally {
        setLoadingBrands(false)
      }
    }

    fetchBrands()
  }, [])

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
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files)
    const totalImages = images.length + newFiles.length

    if (totalImages > 5) {
      setError("최대 5개의 이미지만 업로드 가능합니다.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const uploadPromises = newFiles.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/reviews/upload-image", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          let errorMessage = "이미지 업로드에 실패했습니다"
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } catch (parseError) {
            console.error("Error parsing response:", parseError)
            errorMessage = `서버 오류 (${response.status}): ${response.statusText}`
          }
          throw new Error(errorMessage)
        }

        const data = await response.json()
        return data.url
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      setImages((prevImages) => [...prevImages, ...uploadedUrls])
    } catch (err) {
      console.error("Image upload error:", err)
      setError(err instanceof Error ? err.message : "이미지 업로드 중 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
      // 파일 입력 초기화
      e.target.value = ""
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const renderStarRating = (value: number, onChange: (value: number) => void, label: string) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star: number) => (
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

          {/* 브랜드 선택 */}
          <div className="space-y-2">
            <Label htmlFor="brand">브랜드 *</Label>
            <Select 
              value={formData.brand_id} 
              onValueChange={(value: string) => setFormData({ ...formData, brand_id: value })}
              disabled={loadingBrands}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingBrands ? "브랜드 목록 로딩 중..." : "브랜드를 선택해주세요"} />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand: { id: string; name: string }) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              체어파크에서 등록된 브랜드만 선택 가능합니다
            </p>
          </div>

          {/* 제품명 입력 */}
          <div className="space-y-2">
            <Label htmlFor="product_name">제품명 *</Label>
            <Input
              id="product_name"
              required
              value={formData.product_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, product_name: e.target.value })}
              placeholder="제품명을 입력하세요 (예: Aeron Chair)"
            />
            <p className="text-xs text-muted-foreground">
              자유롭게 제품명을 입력해주세요
            </p>
          </div>

          {/* 리뷰 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title">리뷰 제목 *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
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
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, comment: e.target.value })}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, user_name: e.target.value })}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, user_email: e.target.value })}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, age: e.target.value })}
                placeholder="나이"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">키 (cm)</Label>
              <Input
                id="height"
                type="number"
                min="100"
                max="250"
                value={formData.height}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, height: e.target.value })}
                placeholder="키 (cm)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">성별</Label>
              <Select 
                value={formData.gender} 
                onValueChange={(value: string) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="성별을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">남성</SelectItem>
                  <SelectItem value="female">여성</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="occupation">직업</Label>
              <Input
                id="occupation"
                value={formData.occupation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, occupation: e.target.value })}
                placeholder="직업"
              />
            </div>
          </div>

          {/* 앉는 스타일 및 시간 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sitting_style">앉는 스타일</Label>
              <Input
                id="sitting_style"
                value={formData.sitting_style}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, sitting_style: e.target.value })}
                placeholder="앉는 스타일을 입력하세요 (예: 장시간 앉아서 작업)"
                list="sitting-styles"
              />
              <datalist id="sitting-styles">
                <option value="장시간 앉아서 작업" />
                <option value="자주 자세를 바꿈" />
                <option value="바른 자세 유지" />
                <option value="다리를 꼬고 앉음" />
                <option value="장시간 회의" />
              </datalist>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sitting_duration">하루 앉는 시간</Label>
              <Select 
                value={formData.sitting_duration} 
                onValueChange={(value: string) => setFormData({ ...formData, sitting_duration: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="하루 앉는 시간을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-4">4시간 미만</SelectItem>
                  <SelectItem value="4-6">4-6시간</SelectItem>
                  <SelectItem value="6-8">6-8시간</SelectItem>
                  <SelectItem value="8-10">8-10시간</SelectItem>
                  <SelectItem value="over-10">10시간 이상</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 구매 인증 */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="verified_purchase"
              checked={formData.verified_purchase}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, verified_purchase: e.target.checked })}
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
                  {images.map((image: string, index: number) => (
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
                    multiple
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageUpload(e)}
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
                      <p className="text-sm font-medium text-gray-700">
                        {isLoading ? "업로드 중..." : "사진 업로드"}
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF (최대 5개) {images.length > 0 && `- ${images.length}/5`}
                      </p>
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

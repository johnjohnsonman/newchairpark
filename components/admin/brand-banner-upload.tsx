"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Image as ImageIcon, GripVertical } from "lucide-react"
import Image from "next/image"

import type { CategoryBanner } from "@/types/database"

interface BrandBanner {
  id?: string
  image_url: string
  title?: string
  description?: string
  order_index: number
}

interface BrandBannerUploadProps {
  brandId: string
  initialBanners?: BrandBanner[]
  onBannersChange?: (banners: BrandBanner[]) => void
}

export function BrandBannerUpload({ brandId, initialBanners = [], onBannersChange }: BrandBannerUploadProps) {
  const [banners, setBanners] = useState<BrandBanner[]>(initialBanners)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  // 임시 브랜드 ID인 경우 업로드 비활성화
  const isTemporaryBrand = brandId === 'temp'

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 임시 브랜드 ID인 경우 로컬 상태에만 저장 (실제 업로드 없음)
    if (isTemporaryBrand) {
      console.log('New brand - storing banner locally:', file.name)
      
      const newBanner: BrandBanner = {
        image_url: URL.createObjectURL(file), // 임시 URL
        title: '',
        description: '',
        order_index: banners.length,
      }

      const updatedBanners = [...banners, newBanner]
      setBanners(updatedBanners)
      onBannersChange?.(updatedBanners)
      return
    }

    console.log('Starting file upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      brandId,
      category: `brand-${brandId}`
    })

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("파일 크기는 5MB 이하여야 합니다.")
      return
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      setUploadError("이미지 파일만 업로드 가능합니다.")
      return
    }

    if (banners.length >= 5) {
      setUploadError("최대 5개의 배너만 업로드 가능합니다.")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', `brand-${brandId}`)

      console.log('Sending upload request to:', '/api/category-banners/upload')

      const response = await fetch('/api/category-banners/upload', {
        method: 'POST',
        body: formData,
      })

      console.log('Upload response status:', response.status)
      console.log('Upload response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        let errorMessage = 'Upload failed'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError)
          errorMessage = `Upload failed with status: ${response.status}`
        }
        throw new Error(errorMessage)
      }

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error('Failed to parse success response:', parseError)
        throw new Error('Invalid response from server')
      }
      
      const newBanner: BrandBanner = {
        id: data.id,
        image_url: data.url,
        title: '',
        description: '',
        order_index: banners.length,
      }

      const updatedBanners = [...banners, newBanner]
      setBanners(updatedBanners)
      onBannersChange?.(updatedBanners)

    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(error instanceof Error ? error.message : '업로드에 실패했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const removeBanner = async (index: number) => {
    const bannerToRemove = banners[index]
    
    // 데이터베이스에서 삭제 (ID가 있는 경우)
    if (bannerToRemove.id) {
      try {
        const response = await fetch(`/api/category-banners/${bannerToRemove.id}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          console.error('Failed to delete banner from database')
        }
      } catch (error) {
        console.error('Error deleting banner:', error)
      }
    }
    
    // 로컬 상태에서 제거
    const updatedBanners = banners.filter((_, i) => i !== index)
      .map((banner, i) => ({ ...banner, order_index: i }))
    setBanners(updatedBanners)
    onBannersChange?.(updatedBanners)
  }

  const updateBanner = async (index: number, field: keyof BrandBanner, value: string) => {
    const banner = banners[index]
    const updatedBanners = [...banners]
    updatedBanners[index] = { ...updatedBanners[index], [field]: value }
    setBanners(updatedBanners)
    onBannersChange?.(updatedBanners)

    // 데이터베이스 업데이트 (ID가 있는 경우)
    if (banner.id) {
      try {
        await fetch(`/api/category-banners/${banner.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: field === 'title' ? value : banner.title,
            description: field === 'description' ? value : banner.description,
            order_index: updatedBanners[index].order_index,
          }),
        })
      } catch (error) {
        console.error('Error updating banner:', error)
      }
    }
  }

  const moveBanner = (fromIndex: number, toIndex: number) => {
    const updatedBanners = [...banners]
    const [movedBanner] = updatedBanners.splice(fromIndex, 1)
    updatedBanners.splice(toIndex, 0, movedBanner)
    
    // order_index 재정렬
    const reorderedBanners = updatedBanners.map((banner, index) => ({
      ...banner,
      order_index: index
    }))
    
    setBanners(reorderedBanners)
    onBannersChange?.(reorderedBanners)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">브랜드 배너 ({banners.length}/5)</Label>
        <Badge variant={banners.length >= 5 ? "destructive" : "secondary"}>
          {banners.length >= 5 ? "최대 5개" : `${5 - banners.length}개 추가 가능`}
        </Badge>
      </div>

      {/* 업로드 영역 */}
      {banners.length < 5 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            id="banner-upload"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
          <label
            htmlFor="banner-upload"
            className={`cursor-pointer flex flex-col items-center gap-2 ${
              isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-75'
            }`}
          >
            <div className="p-3 bg-gray-100 rounded-full">
              <Upload className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isUploading ? "업로드 중..." : "배너 이미지 업로드"}
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP (최대 5MB)</p>
              {isTemporaryBrand && (
                <p className="text-xs text-blue-600 mt-1">
                  새 브랜드 생성 시 함께 저장됩니다
                </p>
              )}
            </div>
          </label>
        </div>
      )}

      {/* 에러 메시지 */}
      {uploadError && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {uploadError}
        </div>
      )}

      {/* 배너 목록 */}
      {banners.length > 0 && (
        <div className="space-y-4">
          {banners.map((banner, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* 이미지 미리보기 */}
                  <div className="relative w-32 h-20 flex-shrink-0">
                    <Image
                      src={banner.image_url}
                      alt={`배너 ${index + 1}`}
                      fill
                      className="object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => removeBanner(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* 배너 정보 입력 */}
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`title-${index}`} className="text-sm">
                          제목 (선택사항)
                        </Label>
                        <Input
                          id={`title-${index}`}
                          value={banner.title || ''}
                          onChange={(e) => updateBanner(index, 'title', e.target.value)}
                          placeholder="배너 제목"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`description-${index}`} className="text-sm">
                          설명 (선택사항)
                        </Label>
                        <Input
                          id={`description-${index}`}
                          value={banner.description || ''}
                          onChange={(e) => updateBanner(index, 'description', e.target.value)}
                          placeholder="배너 설명"
                          className="text-sm"
                        />
                      </div>
                    </div>

                    {/* 순서 조절 버튼 */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">순서:</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveBanner(index, Math.max(0, index - 1))}
                        disabled={index === 0}
                        className="h-6 px-2"
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => moveBanner(index, Math.min(banners.length - 1, index + 1))}
                        disabled={index === banners.length - 1}
                        className="h-6 px-2"
                      >
                        ↓
                      </Button>
                      <span className="text-xs text-gray-500 ml-2">
                        {index + 1}번째
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 안내 메시지 */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
        <p className="font-medium mb-1">배너 관리 안내:</p>
        <ul className="space-y-1 text-xs">
          <li>• 최대 5개의 배너를 업로드할 수 있습니다</li>
          <li>• 첫 번째 배너가 기본 배너로 표시됩니다</li>
          <li>• 순서를 조절하여 배너 표시 순서를 변경할 수 있습니다</li>
          <li>• 제목과 설명은 캐러셀에서 오버레이로 표시됩니다</li>
        </ul>
      </div>
    </div>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Upload, Star, GripVertical, AlertCircle } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface GalleryImageUploadProps {
  images: string[]
  featuredIndex: number
  onChange: (images: string[], featuredIndex: number) => void
  maxImages?: number
}

export function GalleryImageUpload({ 
  images, 
  featuredIndex, 
  onChange, 
  maxImages = 10 
}: GalleryImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const remainingSlots = maxImages - images.length
    const filesToUpload = Array.from(files).slice(0, remainingSlots)

    if (filesToUpload.length === 0) {
      toast.error(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`)
      return
    }

    setUploading(true)
    setUploadProgress({})

    try {
      // 순차적으로 업로드하여 진행률 표시
      const newUrls: string[] = []
      
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i]
        const fileId = `${Date.now()}-${i}`
        
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))
        
        const formData = new FormData()
        formData.append("file", file)

        // 업로드 진행률 시뮬레이션 (더 세밀하게)
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [fileId]: Math.min((prev[fileId] || 0) + Math.random() * 10, 85)
          }))
        }, 500)

        const response = await fetch("/api/gallery/upload-image", {
          method: "POST",
          body: formData,
          // 타임아웃 설정 (10분)
          signal: AbortSignal.timeout(600000)
        })

        clearInterval(progressInterval)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Upload failed")
        }

        const data = await response.json()
        newUrls.push(data.url)
        
        setUploadProgress(prev => ({ ...prev, [fileId]: 100 }))
        
        // 잠시 대기 후 진행률 제거
        setTimeout(() => {
          setUploadProgress(prev => {
            const { [fileId]: _, ...rest } = prev
            return rest
          })
        }, 500)
      }

      const updatedImages = [...images, ...newUrls]
      onChange(updatedImages, featuredIndex)
      
      toast.success(`${filesToUpload.length}개의 이미지가 업로드되었습니다.`)
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.")
    } finally {
      setUploading(false)
      setUploadProgress({})
    }
  }

  const handleDelete = async (index: number) => {
    const imageUrl = images[index]
    
    try {
      const response = await fetch("/api/gallery/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageUrl }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Delete failed")
      }

      const newImages = images.filter((_, i) => i !== index)
      let newFeaturedIndex = featuredIndex

      // 대표 이미지가 삭제된 경우
      if (index === featuredIndex) {
        newFeaturedIndex = 0
      } else if (index < featuredIndex) {
        newFeaturedIndex = featuredIndex - 1
      }

      onChange(newImages, newFeaturedIndex)
      toast.success("이미지가 삭제되었습니다.")
    } catch (error) {
      console.error("Delete error:", error)
      toast.error(error instanceof Error ? error.message : "이미지 삭제에 실패했습니다.")
    }
  }

  const handleSetFeatured = (index: number) => {
    onChange(images, index)
    toast.success("대표 이미지로 설정되었습니다.")
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      setDragOverIndex(null)
      return
    }

    const newImages = [...images]
    const [removed] = newImages.splice(draggedIndex, 1)
    newImages.splice(dropIndex, 0, removed)

    // 대표 이미지 인덱스 업데이트
    let newFeaturedIndex = featuredIndex
    if (draggedIndex === featuredIndex) {
      newFeaturedIndex = dropIndex
    } else if (draggedIndex < featuredIndex && dropIndex >= featuredIndex) {
      newFeaturedIndex = featuredIndex - 1
    } else if (draggedIndex > featuredIndex && dropIndex <= featuredIndex) {
      newFeaturedIndex = featuredIndex + 1
    }

    onChange(newImages, newFeaturedIndex)
    setDraggedIndex(null)
    setDragOverIndex(null)
    toast.success("이미지 순서가 변경되었습니다.")
  }

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div
              key={url}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              className={cn(
                "relative group cursor-move border-2 rounded-lg overflow-hidden transition-all",
                dragOverIndex === index && "border-primary scale-105",
                draggedIndex === index && "opacity-50",
                featuredIndex === index ? "border-primary ring-2 ring-primary" : "border-transparent"
              )}
            >
              <div className="aspect-square relative">
                <Image 
                  src={url || "/placeholder.svg"} 
                  alt={`Gallery Image ${index + 1}`} 
                  fill 
                  className="object-cover" 
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </div>

              {/* 드래그 핸들 */}
              <div className="absolute top-2 left-2 bg-black/60 rounded p-1 cursor-move">
                <GripVertical className="h-4 w-4 text-white" />
              </div>

              {/* 대표 이미지 표시 */}
              {featuredIndex === index && (
                <div className="absolute top-2 right-2 bg-primary rounded-full p-1.5">
                  <Star className="h-4 w-4 text-white fill-white" />
                </div>
              )}

              {/* 호버 시 버튼들 */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {featuredIndex !== index && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleSetFeatured(index)}
                    title="대표 이미지로 설정"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(index)}
                  title="삭제"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* 순서 번호 */}
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-neutral-400" />
            <p className="mb-2 text-sm text-neutral-500">
              <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
            </p>
            <p className="text-xs text-neutral-400">
              PNG, JPG, GIF, WebP (최대 {maxImages}개, {images.length}/{maxImages})
            </p>
            <p className="text-xs text-neutral-400">
              파일 크기: 최대 50MB
            </p>
            {images.length > 0 && (
              <p className="text-xs text-primary mt-2">
                ✨ 드래그하여 순서 변경, 별 아이콘으로 대표 이미지 선택
              </p>
            )}
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            multiple
            onChange={handleFileChange} 
            disabled={uploading || images.length >= maxImages} 
          />
        </label>
      )}

      {uploading && (
        <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-sm text-blue-700 font-medium">대용량 파일 업로드 중...</p>
          </div>
          <p className="text-xs text-blue-600">
            파일이 큰 경우 시간이 오래 걸릴 수 있습니다. 페이지를 닫지 마세요.
          </p>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="space-y-1">
              <div className="flex justify-between text-xs text-blue-700">
                <span>업로드 진행률</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !uploading && (
        <p className="text-sm text-muted-foreground text-center">
          여러 이미지를 추가하고 드래그하여 순서를 변경할 수 있습니다.
        </p>
      )}

      {/* 에러 메시지 표시 */}
      {images.length >= maxImages && (
        <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span>최대 {maxImages}개의 이미지까지 업로드할 수 있습니다.</span>
        </div>
      )}
    </div>
  )
}

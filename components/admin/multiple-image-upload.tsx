"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Upload, Star, GripVertical } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface MultipleImageUploadProps {
  images: string[]
  featuredIndex: number
  onChange: (images: string[], featuredIndex: number) => void
  maxImages?: number
}

export function MultipleImageUpload({ 
  images, 
  featuredIndex, 
  onChange, 
  maxImages = 10 
}: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const remainingSlots = maxImages - images.length
    const filesToUpload = Array.from(files).slice(0, remainingSlots)

    if (filesToUpload.length === 0) {
      alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`)
      return
    }

    setUploading(true)
    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/products/upload-image", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) throw new Error("Upload failed")

        const data = await response.json()
        return data.url
      })

      const newUrls = await Promise.all(uploadPromises)
      const updatedImages = [...images, ...newUrls]
      onChange(updatedImages, featuredIndex)
    } catch (error) {
      console.error("Upload error:", error)
      alert("이미지 업로드에 실패했습니다.")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (index: number) => {
    const imageUrl = images[index]
    
    try {
      await fetch("/api/products/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageUrl }),
      })

      const newImages = images.filter((_, i) => i !== index)
      let newFeaturedIndex = featuredIndex

      // 대표 이미지가 삭제된 경우
      if (index === featuredIndex) {
        newFeaturedIndex = 0
      } else if (index < featuredIndex) {
        newFeaturedIndex = featuredIndex - 1
      }

      onChange(newImages, newFeaturedIndex)
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  const handleSetFeatured = (index: number) => {
    onChange(images, index)
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
                  alt={`Image ${index + 1}`} 
                  fill 
                  className="object-cover" 
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
              PNG, JPG, GIF (최대 {maxImages}개, {images.length}/{maxImages})
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
        <p className="text-sm text-neutral-500 text-center">업로드 중...</p>
      )}

      {images.length === 0 && (
        <p className="text-sm text-muted-foreground text-center">
          여러 이미지를 추가하고 드래그하여 순서를 변경할 수 있습니다.
        </p>
      )}
    </div>
  )
}


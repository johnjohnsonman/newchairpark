"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Star, GripVertical } from "lucide-react"
import Image from "next/image"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

interface MultipleImageUploadProps {
  images: string[]
  featuredIndex: number
  maxImages: number
  onChange: (images: string[], featuredIndex: number) => void
}

export function MultipleImageUpload({ 
  images, 
  featuredIndex, 
  maxImages, 
  onChange 
}: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState<number | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    const targetIndex = index !== undefined ? index : images.length
    
    if (targetIndex >= maxImages) {
      alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다.`)
      return
    }

    setUploading(targetIndex)
    
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/products/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      
      const newImages = [...images]
      if (index !== undefined) {
        // 기존 이미지 교체
        newImages[index] = data.url
      } else {
        // 새 이미지 추가
        newImages.push(data.url)
      }
      
      onChange(newImages, featuredIndex)
    } catch (error) {
      console.error("Upload error:", error)
      alert("이미지 업로드에 실패했습니다.")
    } finally {
      setUploading(null)
    }
  }

  const handleDelete = async (index: number) => {
    if (!images[index]) return

    try {
      await fetch("/api/products/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: images[index] }),
      })
      
      const newImages = images.filter((_, i) => i !== index)
      const newFeaturedIndex = featuredIndex > index ? featuredIndex - 1 : 
                               featuredIndex === index ? Math.max(0, newImages.length - 1) : 
                               featuredIndex
      
      onChange(newImages, newFeaturedIndex)
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  const handleSetFeatured = (index: number) => {
    onChange(images, index)
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(images)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // featured index도 함께 업데이트
    const newFeaturedIndex = featuredIndex === result.source.index 
      ? result.destination.index 
      : featuredIndex > result.source.index && featuredIndex <= result.destination.index
      ? featuredIndex - 1
      : featuredIndex < result.source.index && featuredIndex >= result.destination.index
      ? featuredIndex + 1
      : featuredIndex

    onChange(items, newFeaturedIndex)
  }

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              {images.map((image, index) => (
                <Draggable key={image} draggableId={image} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`relative group ${
                        snapshot.isDragging ? "shadow-lg" : ""
                      } ${featuredIndex === index ? "ring-2 ring-blue-500" : ""}`}
                    >
                      <CardContent className="p-2">
                        <div className="aspect-square relative rounded-lg overflow-hidden">
                          <Image
                            src={image}
                            alt={`Banner image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          
                          {/* 업로드 중 표시 */}
                          {uploading === index && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="text-white text-sm">업로드 중...</div>
                            </div>
                          )}
                          
                          {/* 컨트롤 버튼들 */}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleDelete(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* 대표 이미지 표시 */}
                          {featuredIndex === index && (
                            <div className="absolute top-2 left-2">
                              <div className="bg-blue-500 text-white rounded-full p-1">
                                <Star className="h-3 w-3 fill-current" />
                              </div>
                            </div>
                          )}
                          
                          {/* 드래그 핸들 */}
                          <div
                            {...provided.dragHandleProps}
                            className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <div className="bg-black/50 text-white rounded p-1">
                              <GripVertical className="h-3 w-3" />
                            </div>
                          </div>
                        </div>
                        
                        {/* 대표 이미지 설정 버튼 */}
                        <Button
                          type="button"
                          variant={featuredIndex === index ? "default" : "outline"}
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => handleSetFeatured(index)}
                        >
                          {featuredIndex === index ? "대표 이미지" : "대표로 설정"}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              
              {/* 새 이미지 추가 버튼 */}
              {images.length < maxImages && (
                <Card className="aspect-square">
                  <CardContent className="p-2 h-full">
                    <label className="flex flex-col items-center justify-center h-full border-2 border-dashed rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                      <div className="flex flex-col items-center justify-center">
                        {uploading === images.length ? (
                          <div className="text-sm text-neutral-500">업로드 중...</div>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 mb-2 text-neutral-400" />
                            <p className="text-xs text-neutral-500 text-center">
                              이미지 추가
                            </p>
                          </>
                        )}
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleFileChange(e)}
                        disabled={uploading !== null}
                      />
                    </label>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      {images.length > 0 && (
        <div className="text-sm text-neutral-500">
          • 드래그하여 순서 변경 • 첫 번째 이미지가 기본 대표 이미지입니다
        </div>
      )}
    </div>
  )
}
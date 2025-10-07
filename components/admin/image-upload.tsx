"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, Upload, GripVertical } from "lucide-react"
import { Label } from "@/components/ui/label"

interface ImageItem {
  url: string
  order: number
}

interface ImageUploadProps {
  images: ImageItem[]
  onChange: (images: ImageItem[]) => void
}

export function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
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

      const uploadedUrls = await Promise.all(uploadPromises)
      const newImages = uploadedUrls.map((url, index) => ({
        url,
        order: images.length + index,
      }))

      onChange([...images, ...newImages])
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload images")
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDelete = async (index: number) => {
    const imageToDelete = images[index]

    try {
      // POST 메서드 사용 (API에서 POST만 처리)
      const response = await fetch("/api/products/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageToDelete.url }),
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      const newImages = images
        .filter((_, i) => i !== index)
        .map((img, i) => ({
          ...img,
          order: i,
        }))
      onChange(newImages)
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete image")
    }
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)

    if (draggedIndex === null || draggedIndex === index) return

    const newImages = [...images]
    const draggedItem = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedItem)

    const reorderedImages = newImages.map((img, i) => ({
      ...img,
      order: i,
    }))

    onChange(reorderedImages)
    setDraggedIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Product Images</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploading ? "Uploading..." : "Upload Images"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images
            .sort((a, b) => a.order - b.order)
            .map((image, index) => (
              <div
                key={image.url}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
                className={`relative group cursor-move border-2 border-dashed rounded-lg overflow-hidden transition-all ${
                  draggedIndex === index
                    ? "opacity-50 scale-95 border-blue-400"
                    : dragOverIndex === index
                      ? "border-blue-500 scale-105"
                      : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs z-10">
                  {index + 1}
                </div>
                <div className="absolute top-2 right-2 flex gap-1 z-10">
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white p-1 rounded z-10">
                  <GripVertical className="w-4 h-4" />
                </div>
                {draggedIndex === index && (
                  <div className="absolute inset-0 bg-blue-500/20 z-[5] flex items-center justify-center">
                    <p className="text-white font-semibold text-sm bg-black/50 px-3 py-1 rounded">Dragging...</p>
                  </div>
                )}
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={`Product ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No images uploaded yet</p>
          <p className="text-xs text-gray-400 mt-1">Click "Upload Images" to add product images</p>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Drag and drop images to reorder. The first image will be the main product image.
      </p>
    </div>
  )
}

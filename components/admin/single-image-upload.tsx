"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Upload } from "lucide-react"
import Image from "next/image"

interface SingleImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
  aspectRatio?: "square" | "video" | "auto"
}

export function SingleImageUpload({ value, onChange, label, aspectRatio = "auto" }: SingleImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/products/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      onChange(data.url)
    } catch (error) {
      console.error("Upload error:", error)
      alert("이미지 업로드에 실패했습니다.")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!value) return

    try {
      await fetch("/api/products/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      })
      onChange("")
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "h-48",
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium">{label}</p>}

      {value ? (
        <div className="relative group">
          <div className={`relative w-full ${aspectClasses[aspectRatio]} overflow-hidden rounded-lg border`}>
            <Image src={value || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDelete}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-neutral-400" />
            <p className="mb-2 text-sm text-neutral-500">
              <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
            </p>
            <p className="text-xs text-neutral-400">PNG, JPG, GIF (최대 10MB)</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
        </label>
      )}

      {uploading && <p className="text-sm text-neutral-500">업로드 중...</p>}
    </div>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import type { Database } from "@/types/database"
import Link from "next/link"
import { Upload, FileText, AlertCircle } from "lucide-react"
import { toast } from "sonner"

type Brand = {
  id: string
  name: string
  logo_url?: string
}

type Resource = Database['public']['Tables']['resources']['Row']

interface ResourceFormProps {
  resource?: Resource
  brands: Brand[]
}

export function ResourceForm({ resource, brands }: ResourceFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [formData, setFormData] = useState({
    title: resource?.title || "",
    description: resource?.description || "",
    brand_id: resource?.brand_id || "",
    file: null as File | null,
    file_url: resource?.file_url || "",
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 제한 (100MB로 증가)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      toast.error("파일 크기가 너무 큽니다. 최대 100MB까지 업로드 가능합니다.")
      return
    }

    // 파일 타입 검증
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ]

    if (!allowedTypes.includes(file.type)) {
      toast.error("지원하지 않는 파일 형식입니다. PDF, Word, Excel, PowerPoint 파일만 업로드 가능합니다.")
      return
    }

    setFormData({ ...formData, file })
  }

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch("/api/resources/upload", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "파일 업로드에 실패했습니다.")
    }

    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      setError("제목을 입력해주세요.")
      return
    }

    if (!formData.brand_id) {
      setError("브랜드를 선택해주세요.")
      return
    }

    if (!resource && !formData.file && !formData.file_url) {
      setError("파일을 업로드해주세요.")
      return
    }

    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      let fileUrl = formData.file_url

      // 새 파일이 업로드된 경우
      if (formData.file) {
        setUploading(true)
        setUploadProgress(0)

        // 업로드 진행률 시뮬레이션
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + Math.random() * 20, 90))
        }, 200)

        try {
          fileUrl = await uploadFile(formData.file)
          clearInterval(progressInterval)
          setUploadProgress(100)
        } catch (uploadError) {
          clearInterval(progressInterval)
          throw uploadError
        } finally {
          setUploading(false)
        }
      }

      const dataToSubmit = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        brand_id: formData.brand_id,
        file_url: fileUrl,
        file_type: formData.file?.type.split('/')[1] || resource?.file_type,
        file_size: formData.file?.size || resource?.file_size,
      }

      console.log('Submitting resource data:', dataToSubmit)

      if (resource) {
        // Update existing resource
        const { data, error } = await supabase
          .from("resources")
          .update({
            ...dataToSubmit,
            updated_at: new Date().toISOString(),
          })
          .eq("id", resource.id)
          .select()

        console.log('Update response:', { data, error })
        if (error) throw error
      } else {
        // Create new resource
        const { data, error } = await supabase.from("resources").insert([dataToSubmit]).select()

        console.log('Insert response:', { data, error })
        if (error) throw error
      }

      toast.success(resource ? "자료가 수정되었습니다." : "자료가 추가되었습니다.")
      
      // 잠시 대기 후 리다이렉트
      setTimeout(() => {
        router.push("/admin/resources")
        router.refresh()
      }, 1000)

    } catch (err) {
      console.error('Resource form error:', err)
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      setError(errorMessage)
    } finally {
      setIsLoading(false)
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
                placeholder="예: 허먼밀러 에어론 체어 제품 카탈로그"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="brand">브랜드 *</Label>
              <Select value={formData.brand_id} onValueChange={(value) => setFormData({ ...formData, brand_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="브랜드를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>파일 업로드 *</Label>
              {!resource && (
                <div className="space-y-2">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-neutral-400" />
                      <p className="mb-2 text-sm text-neutral-500">
                        <span className="font-semibold">클릭하여 파일 업로드</span>
                      </p>
                      <p className="text-xs text-neutral-400">
                        PDF, Word, Excel, PowerPoint (최대 100MB)
                      </p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </label>

                  {formData.file && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-green-900">{formData.file.name}</p>
                        <p className="text-xs text-green-700">
                          {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
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
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-blue-700">
                          <span>업로드 진행률</span>
                          <span>{Math.round(uploadProgress)}%</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {resource && formData.file_url && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">현재 파일</p>
                    <a 
                      href={formData.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-700 hover:underline"
                    >
                      파일 보기
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">설명</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="자료에 대한 설명을 입력하세요..."
                rows={4}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={isLoading || uploading || !formData.title.trim() || !formData.brand_id} 
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  저장 중...
                </div>
              ) : (
                resource ? "자료 수정" : "자료 추가"
              )}
            </Button>
            <Link href="/admin/resources">
              <Button type="button" variant="outline" disabled={isLoading}>
                취소
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

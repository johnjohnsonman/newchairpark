import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText, Calendar, Building2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"

export default async function ResourcesPage() {
  const supabase = await createClient()

  // 자료와 브랜드 정보를 가져오기
  const [resourcesResult, brandsResult] = await Promise.all([
    supabase
      .from("resources")
      .select(`
        id,
        title,
        description,
        file_url,
        file_type,
        file_size,
        brand_id,
        created_at,
        brands (
          id,
          name,
          logo_url
        )
      `)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("brands")
      .select("id, name, logo_url")
      .order("name")
  ])

  const resources = resourcesResult.data || []
  const brands = brandsResult.data || []

  // 브랜드별로 자료 그룹화
  const resourcesByBrand = resources.reduce((acc, resource) => {
    const brandName = resource.brands?.name || "기타"
    if (!acc[brandName]) {
      acc[brandName] = []
    }
    acc[brandName].push(resource)
    return acc
  }, {} as Record<string, any[]>)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileTypeIcon = (fileType: string) => {
    if (fileType === "pdf") return "📄"
    if (fileType === "doc" || fileType === "docx") return "📝"
    if (fileType === "xls" || fileType === "xlsx") return "📊"
    if (fileType === "ppt" || fileType === "pptx") return "📊"
    return "📁"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              브랜드 자료실
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              허먼밀러, 스틸케이스 등 프리미엄 브랜드의 상세 자료를 확인하세요
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="자료 검색..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {brands.map((brand) => (
              <Badge key={brand.id} variant="outline" className="whitespace-nowrap">
                {brand.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Resources by Brand */}
        <div className="space-y-8">
          {Object.entries(resourcesByBrand).map(([brandName, brandResources]) => (
            <div key={brandName}>
              <div className="flex items-center gap-3 mb-4">
                {brands.find(b => b.name === brandName)?.logo_url && (
                  <div className="relative w-8 h-8">
                    <Image
                      src={brands.find(b => b.name === brandName)?.logo_url || "/placeholder.svg"}
                      alt={brandName}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <h2 className="text-2xl font-bold text-gray-900">{brandName}</h2>
                <Badge variant="secondary">{brandResources.length}개 자료</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brandResources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getFileTypeIcon(resource.file_type)}</span>
                          <div>
                            <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(resource.created_at).toLocaleDateString("ko-KR")}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {resource.file_type?.toUpperCase()}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {resource.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {resource.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          {resource.file_size && formatFileSize(resource.file_size)}
                        </div>
                        <Button
                          size="sm"
                          asChild
                          className="gap-2"
                        >
                          <a
                            href={resource.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <Download className="h-4 w-4" />
                            다운로드
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {resources.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              아직 업로드된 자료가 없습니다
            </h3>
            <p className="text-gray-500">
              관리자가 브랜드 자료를 업로드하면 여기에 표시됩니다.
            </p>
          </div>
        )}

        {/* Admin Link */}
        <div className="mt-8 text-center">
          <Link href="/admin/resources">
            <Button variant="outline" className="gap-2">
              <Building2 className="h-4 w-4" />
              관리자 자료실 관리
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

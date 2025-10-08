import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Download, FileText, Calendar, Building2 } from "lucide-react"
import { DeleteResourceButton } from "@/components/admin/delete-resource-button"

export default async function ResourcesManagementPage() {
  const supabase = await createServerClient()

  // 자료와 브랜드 정보를 가져오기 (타임아웃 설정)
  const dataPromise = Promise.allSettled([
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
        updated_at,
        brands (
          id,
          name,
          logo_url
        )
      `)
      .order("created_at", { ascending: false })
      .limit(50), // 최대 50개로 줄임
    supabase
      .from("brands")
      .select("id, name, logo_url")
      .order("name")
      .limit(30) // 브랜드도 30개로 제한
  ])

  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Resources fetch timeout')), 4000)
  )

  let resources: any[] = []
  let brands: any[] = []

  try {
    const results = await Promise.race([dataPromise, timeoutPromise]) as PromiseSettledResult<any>[]
    
    if (results[0].status === 'fulfilled' && results[0].value.data) {
      resources = results[0].value.data
    }
    
    if (results[1].status === 'fulfilled' && results[1].value.data) {
      brands = results[1].value.data
    }
  } catch (error) {
    console.error('Resources/Brands fetch error:', error)
  }

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
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm">
                ← Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">자료실 관리</h1>
          </div>
          <Link href="/admin/resources/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              자료 추가
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {!resources || resources.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">아직 업로드된 자료가 없습니다</p>
              <Link href="/admin/resources/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  첫 번째 자료 추가
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{getFileTypeIcon(resource.file_type)}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {resource.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            {new Date(resource.created_at).toLocaleDateString("ko-KR")}
                            {resource.brands && (
                              <>
                                <span>•</span>
                                <Building2 className="h-4 w-4" />
                                {resource.brands.name}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {resource.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {resource.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <Badge variant="outline">
                          {resource.file_type?.toUpperCase()}
                        </Badge>
                        {resource.file_size && (
                          <span>{formatFileSize(resource.file_size)}</span>
                        )}
                        <a
                          href={resource.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <Download className="h-4 w-4" />
                          다운로드
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Link href={`/admin/resources/${resource.id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          수정
                        </Button>
                      </Link>
                      <DeleteResourceButton 
                        resourceId={resource.id} 
                        resourceTitle={resource.title} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 통계 정보 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">총 자료 수</p>
                  <p className="text-2xl font-bold">{resources.length}개</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">브랜드 수</p>
                  <p className="text-2xl font-bold">{brands.length}개</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Download className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">PDF 자료</p>
                  <p className="text-2xl font-bold">
                    {resources.filter(r => r.file_type === 'pdf').length}개
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

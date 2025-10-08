import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit } from "lucide-react"
import { DeleteBrandButton } from "@/components/admin/delete-brand-button"

export default async function BrandsManagementPage() {
  const supabase = await createServerClient()

  // 브랜드 데이터 가져오기 (타임아웃 설정)
  const brandsPromise = supabase
    .from("brands")
    .select("id, name, logo_url, description, created_at")
    .order("name")
    .limit(30) // 최대 30개로 줄임

  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Brands fetch timeout')), 3000)
  )

  let brands: any[] = []
  let error: any = null

  try {
    const result = await Promise.race([brandsPromise, timeoutPromise]) as any
    brands = result.data || []
    error = result.error
  } catch (timeoutError) {
    console.error('Brands fetch timeout:', timeoutError)
    error = timeoutError
  }

  if (error) {
    console.error('Brands fetch error:', error)
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
            <h1 className="text-2xl font-bold">Brand Management</h1>
          </div>
          <Link href="/admin/brands/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Brand
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {!brands || brands.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">No brands yet</p>
              <Link href="/admin/brands/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Brand
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <Card key={brand.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative bg-white flex items-center justify-center p-6 border-b">
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url || "/placeholder.svg"}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-2xl font-bold text-gray-300">{brand.name}</div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{brand.name}</h3>
                  {brand.description && <p className="text-sm text-gray-500 line-clamp-2 mb-4">{brand.description}</p>}
                  <div className="flex gap-2">
                    <Link href={`/admin/brands/${brand.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <DeleteBrandButton brandId={brand.id} brandName={brand.name} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

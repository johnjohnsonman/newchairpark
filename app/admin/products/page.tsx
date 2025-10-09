import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Edit } from "lucide-react"
import { DeleteProductButton } from "@/components/admin/delete-product-button"

// 캐시 무효화 설정
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProductsManagementPage() {
  const supabase = await createServerClient()

  let products: any[] = []
  
  try {
    // 제품 데이터 가져오기 (타임아웃 설정)
    const productsPromise = supabase
      .from("products")
      .select("id, name, price, image_url, in_stock, brand_id, created_at")
      .order("created_at", { ascending: false })
      .limit(50) // 최대 50개로 줄임

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Products fetch timeout')), 3000)
    )

    const result = await Promise.race([productsPromise, timeoutPromise]) as any

    if (result.error) {
      console.error('Products fetch error:', result.error)
    } else {
      products = result.data || []
      
      // brands 데이터는 별도로 가져오기 (실패해도 계속 진행)
      try {
        const brandsPromise = supabase.from("brands").select("id, name")
        const brandsResult = await Promise.race([
          brandsPromise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Brands timeout')), 2000))
        ]) as any

        if (brandsResult.data) {
          const brandsMap = new Map(brandsResult.data.map((b: any) => [b.id, b]))
          products = products.map(p => ({
            ...p,
            brands: p.brand_id ? brandsMap.get(p.brand_id) : null
          }))
        }
      } catch (brandError) {
        console.error('Brands fetch error:', brandError)
        // brands 없이 계속 진행
      }
    }
  } catch (error) {
    console.error('Products page error:', error)
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
            <h1 className="text-2xl font-bold">Product Management</h1>
          </div>
          <Link href="/admin/products/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {!products || products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">No products yet</p>
              <Link href="/admin/products/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                  {!product.in_stock && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Out of Stock
                    </div>
                  )}
                  {product.featured && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.brands?.name || "No brand"}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-lg font-bold">₩{product.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {(product.category || product.category_id || 'uncategorized').replace("-", " ")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${product.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <DeleteProductButton productId={product.id} productName={product.name} />
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

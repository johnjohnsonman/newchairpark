import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import dynamic from "next/dynamic"

// ProductForm을 동적으로 로드하여 초기화 문제 방지
const ProductForm = dynamic(() => import("@/components/admin/product-form").then(mod => ({ default: mod.ProductForm })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-neutral-600">폼을 불러오는 중...</p>
      </div>
    </div>
  )
})

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    console.log('Edit product page - ID:', id)
    
    const supabase = await createClient()

    const { data: product, error: productError } = await supabase.from("products").select("*").eq("id", id).single()

    console.log('Product fetch result:', { product, productError })

    if (productError || !product) {
      console.error('Product not found:', { id, productError })
      notFound()
    }

    const { data: brands } = await supabase.from("brands").select("*").order("name")

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>
      <ProductForm product={product} brands={brands || []} />
    </div>
  )
  } catch (error) {
    console.error('Edit product page error:', error)
    notFound()
  }
}

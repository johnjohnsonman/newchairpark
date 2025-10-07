import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"

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

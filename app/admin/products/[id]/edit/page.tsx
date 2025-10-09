import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductFormWrapper } from "@/components/admin/product-form-wrapper"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServerClient()

    const { data: product, error: productError } = await supabase.from("products").select("*").eq("id", id).single()

    if (productError || !product) {
      notFound()
    }

    const { data: brands, error: brandsError } = await supabase.from("brands").select("*").order("name")

    if (brandsError) {
      console.error('Brands fetch error:', brandsError)
    }

    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Product</h1>
        </div>
        <ProductFormWrapper product={product} brands={brands || []} />
      </div>
    )
  } catch (error) {
    console.error('Edit product page error:', error)
    notFound()
  }
}

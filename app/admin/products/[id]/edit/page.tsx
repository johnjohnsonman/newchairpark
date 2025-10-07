import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase.from("products").select("*").eq("id", id).single()

  if (!product) {
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
}

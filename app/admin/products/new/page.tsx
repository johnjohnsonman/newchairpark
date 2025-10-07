import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/product-form"

export default async function NewProductPage() {
  const supabase = await createClient()

  const { data: brands } = await supabase.from("brands").select("*").order("name")

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>
      <ProductForm brands={brands || []} />
    </div>
  )
}

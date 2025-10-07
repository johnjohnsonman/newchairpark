import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { BrandForm } from "@/components/admin/brand-form"

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: brand } = await supabase.from("brands").select("*").eq("id", id).single()

  if (!brand) {
    notFound()
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Brand</h1>
      </div>
      <BrandForm brand={brand} />
    </div>
  )
}

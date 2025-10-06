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
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Edit Brand</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <BrandForm brand={brand} />
      </div>
    </div>
  )
}

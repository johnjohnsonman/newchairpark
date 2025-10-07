import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { BrandForm } from "@/components/admin/brand-form"

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: brand, error: brandError } = await supabase.from("brands").select("*").eq("id", id).single()

    if (brandError || !brand) {
      console.error('Brand not found:', { id, brandError })
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
  } catch (error) {
    console.error('Edit brand page error:', error)
    notFound()
  }
}

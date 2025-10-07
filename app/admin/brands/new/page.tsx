import { createClient } from "@/lib/supabase/server"
import { BrandForm } from "@/components/admin/brand-form"

export default async function NewBrandPage() {
  const supabase = await createClient()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Brand</h1>
      </div>
      <BrandForm />
    </div>
  )
}

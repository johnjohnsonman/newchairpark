import { createClient } from "@/lib/supabase/server"
import { BrandForm } from "@/components/admin/brand-form"

export default async function NewBrandPage() {
  const supabase = await createClient()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Add New Brand</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <BrandForm />
      </div>
    </div>
  )
}

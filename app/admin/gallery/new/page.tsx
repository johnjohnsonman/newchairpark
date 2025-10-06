import { createClient } from "@/lib/supabase/server"
import { GalleryForm } from "@/components/admin/gallery-form"

export default async function NewGalleryPage() {
  const supabase = await createClient()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Add Gallery Image</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <GalleryForm />
      </div>
    </div>
  )
}

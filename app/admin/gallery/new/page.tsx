import { createClient } from "@/lib/supabase/server"
import { GalleryForm } from "@/components/admin/gallery-form"

export default async function NewGalleryPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add Gallery Image</h1>
      </div>
      <GalleryForm />
    </div>
  )
}

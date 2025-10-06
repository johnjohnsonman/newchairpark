import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { GalleryForm } from "@/components/admin/gallery-form"

export default async function EditGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: galleryItem } = await supabase.from("gallery").select("*").eq("id", id).single()

  if (!galleryItem) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold">Edit Gallery Image</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <GalleryForm galleryItem={galleryItem} />
      </div>
    </div>
  )
}

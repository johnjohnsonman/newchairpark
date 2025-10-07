import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { GalleryForm } from "@/components/admin/gallery-form"

export default async function EditGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: galleryItem, error: galleryError } = await supabase.from("gallery").select("*").eq("id", id).single()

    if (galleryError || !galleryItem) {
      console.error('Gallery item not found:', { id, galleryError })
      notFound()
    }

    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Edit Gallery Image</h1>
        </div>
        <GalleryForm galleryItem={galleryItem} />
      </div>
    )
  } catch (error) {
    console.error('Edit gallery page error:', error)
    notFound()
  }
}

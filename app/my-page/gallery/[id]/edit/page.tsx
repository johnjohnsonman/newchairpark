import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UserGalleryForm } from "@/components/user-gallery-form"

export const dynamic = 'force-dynamic'

export default async function EditGalleryPage({ params }: { params: { id: string } }) {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch gallery item
  const { data: galleryItem, error } = await supabase
    .from("gallery")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (error || !galleryItem) {
    redirect("/my-page")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">갤러리 수정</h1>
        <UserGalleryForm userId={user.id} galleryItem={galleryItem} />
      </div>
    </div>
  )
}

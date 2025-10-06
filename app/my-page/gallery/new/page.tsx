import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UserGalleryForm } from "@/components/user-gallery-form"

export default async function NewGalleryPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">갤러리 추가</h1>
        <UserGalleryForm userId={user.id} />
      </div>
    </div>
  )
}

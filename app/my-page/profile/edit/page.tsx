import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileEditForm } from "@/components/profile-edit-form"

// This page requires authentication and should not be prerendered
export const dynamic = 'force-dynamic'

export default async function ProfileEditPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">프로필 수정</h1>
        <ProfileEditForm profile={profile} userId={user.id} />
      </div>
    </div>
  )
}

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UserRecycleForm } from "@/components/user-recycle-form"

export const dynamic = 'force-dynamic'

export default async function NewRecyclePage() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile for default seller info
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">중고상품 등록</h1>
        <UserRecycleForm userId={user.id} profile={profile} />
      </div>
    </div>
  )
}

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UserRecycleForm } from "@/components/user-recycle-form"

export default async function EditRecyclePage({ params }: { params: { id: string } }) {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  // Fetch recycle item
  const { data: recycleItem, error } = await supabase
    .from("recycle_items")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single()

  if (error || !recycleItem) {
    redirect("/my-page")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">중고상품 수정</h1>
        <UserRecycleForm userId={user.id} profile={profile} recycleItem={recycleItem} />
      </div>
    </div>
  )
}

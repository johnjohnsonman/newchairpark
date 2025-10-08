import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function POST() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/admin/login")
}

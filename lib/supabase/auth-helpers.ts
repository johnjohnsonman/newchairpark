import { createServerClient } from "./server"
import { createBrowserClient } from "./client"

export async function isAdmin() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return false
  }

  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single()

  if (roleError) {
    console.error("[v0] Error checking admin role:", roleError)
    return false
  }

  return roleData?.role === "admin"
}

// Server-side: Get current user with role
export async function getCurrentUserWithRole() {
  const supabase = await createServerClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single()

  return {
    ...user,
    role: roleData?.role || "user",
  }
}

// Client-side: Check if user is admin
export async function isAdminClient() {
  const supabase = createBrowserClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return false
  }

  const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single()

  return roleData?.role === "admin"
}

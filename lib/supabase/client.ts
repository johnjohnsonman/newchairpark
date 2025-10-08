import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables not found in client")
    throw new Error("Supabase environment variables are not configured")
  }

  return createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey)
}

export const createClient = createBrowserClient

import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createSupabaseBrowserClient> | null = null

export function createBrowserClient() {
  // 싱글톤 패턴으로 클라이언트 재사용
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables not found in client")
    console.error("URL:", supabaseUrl ? "✓" : "✗")
    console.error("Key:", supabaseAnonKey ? "✓" : "✗")
    
    // 오류 대신 더미 클라이언트 반환하여 앱이 크래시되지 않도록 함
    return createSupabaseBrowserClient("https://dummy.supabase.co", "dummy-key")
  }

  supabaseClient = createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

export const createClient = createBrowserClient

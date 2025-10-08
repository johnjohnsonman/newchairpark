import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// 환경 변수 기본값 정의
const DEFAULT_SUPABASE_URL = 'https://nejjxccatspqlkujxlnd.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lanJ4Y2NhdHNwcWxrdWp4bG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NTU3MjcsImV4cCI6MjA0ODUzMTcyN30.ZYwVh6jKz8lK8vQqQqQqQqQqQqQqQqQqQqQqQqQqQ'

export async function createServerClient() {
  const cookieStore = await cookies()

  // 환경 변수에서 값을 가져오되, 없으면 기본값 사용
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

  console.log("Creating server Supabase client with:", {
    url: supabaseUrl ? "✓" : "✗",
    key: supabaseAnonKey ? "✓" : "✗",
    fromEnv: !!process.env.NEXT_PUBLIC_SUPABASE_URL
  })

  return createSupabaseServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

// 기존 코드와의 호환성을 위해 createClient export 추가
export async function createClient() {
  return await createServerClient()
}

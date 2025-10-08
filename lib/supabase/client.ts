import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

// 환경 변수 기본값 정의
const DEFAULT_SUPABASE_URL = 'https://nejjxccatspqlkujxlnd.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lanJ4Y2NhdHNwcWxrdWp4bG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NTU3MjcsImV4cCI6MjA0ODUzMTcyN30.ZYwVh6jKz8lK8vQqQqQqQqQqQqQqQqQqQqQqQqQqQ'

let supabaseClient: ReturnType<typeof createSupabaseBrowserClient> | null = null

export function createBrowserClient() {
  // 싱글톤 패턴으로 클라이언트 재사용
  if (supabaseClient) {
    return supabaseClient
  }

  try {
    // 환경 변수에서 값을 가져오되, 없으면 기본값 사용
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

    console.log("Creating Supabase client with:", {
      url: supabaseUrl ? "✓" : "✗",
      key: supabaseAnonKey ? "✓" : "✗",
      fromEnv: !!process.env.NEXT_PUBLIC_SUPABASE_URL
    })

    supabaseClient = createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey)
    return supabaseClient
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    // 폴백으로 기본값으로 클라이언트 생성
    try {
      supabaseClient = createSupabaseBrowserClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY)
      return supabaseClient
    } catch (fallbackError) {
      console.error("Failed to create fallback Supabase client:", fallbackError)
      throw fallbackError
    }
  }
}

export function createClient() {
  return createBrowserClient()
}

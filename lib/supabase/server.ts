import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// 서버 사이드 클라이언트 캐시
let serverClient: ReturnType<typeof createSupabaseClient> | null = null

export async function createServerClient() {
  // 이미 생성된 클라이언트가 있으면 재사용
  if (serverClient) {
    return serverClient
  }

  const cookieStore = await cookies()
  const authToken = cookieStore.get("sb-access-token")?.value

  // 환경 변수에서 Supabase 설정 로드
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nejjxccatspqlkujxlnd.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lamp4Y2NhdHNwcWxrdWp4bG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDYyOTEsImV4cCI6MjA3NTIyMjI5MX0.5YIOWXRDYoRl2BaJ8pZdzvjncnfnCkLB_ZQnZgbAdMk'

  serverClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: authToken
        ? {
            Authorization: `Bearer ${authToken}`,
          }
        : {},
    },
  })

  return serverClient
}

export const createClient = createServerClient

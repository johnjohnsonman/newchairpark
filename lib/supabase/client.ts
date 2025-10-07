import { createClient as createSupabaseClient } from "@supabase/supabase-js"

// 싱글톤 패턴으로 클라이언트 인스턴스 관리
let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null

export function createBrowserClient() {
  // 이미 생성된 클라이언트가 있으면 재사용
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nejjxccatspqlkujxlnd.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lamp4Y2NhdHNwcWxrdWp4bG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDYyOTEsImV4cCI6MjA3NTIyMjI5MX0.5YIOWXRDYoRl2BaJ8pZdzvjncnfnCkLB_ZQnZgbAdMk'
  
  supabaseClient = createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
    global: {
      headers: {
        'x-client-info': 'chairpark-web',
      },
    },
  })

  return supabaseClient
}

export const createClient = createBrowserClient

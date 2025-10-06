import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

export async function createServerClient() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get("sb-access-token")?.value

  // 환경 변수를 직접 로드
  const supabaseUrl = 'https://nejjxccatspqlkujxlnd.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lamp4Y2NhdHNwcWxrdWp4bG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2NDYyOTEsImV4cCI6MjA3NTIyMjI5MX0.5YIOWXRDYoRl2BaJ8pZdzvjncnfnCkLB_ZQnZgbAdMk'

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: authToken
        ? {
            Authorization: `Bearer ${authToken}`,
          }
        : {},
    },
  })
}

export const createClient = createServerClient

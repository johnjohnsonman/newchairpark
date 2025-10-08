import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// 환경 변수 기본값 정의
const DEFAULT_SUPABASE_URL = 'https://nejjxccatspqlkujxlnd.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lanJ4Y2NhdHNwcWxrdWp4bG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NTU3MjcsImV4cCI6MjA0ODUzMTcyN30.ZYwVh6jKz8lK8vQqQqQqQqQqQqQqQqQqQqQqQqQqQ'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  // 환경 변수에서 값을 가져오되, 없으면 기본값 사용
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY

  console.log("Middleware: Using Supabase with:", {
    url: supabaseUrl ? "✓" : "✗",
    key: supabaseAnonKey ? "✓" : "✗",
    fromEnv: !!process.env.NEXT_PUBLIC_SUPABASE_URL
  })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // IMPORTANT: You *must* return the response object as-is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const response = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    response.cookies.setAll(request.cookies.getAll())
  // 3. Change the response object in the setAll call above to the new one.

  return response
}

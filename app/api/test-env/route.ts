import { NextResponse } from "next/server"

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return NextResponse.json({
    status: "Environment Variables Test",
    variables: {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? "✅ Set" : "❌ Missing",
      SUPABASE_SERVICE_ROLE_KEY: supabaseServiceKey ? "✅ Set" : "❌ Missing", 
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? "✅ Set" : "❌ Missing"
    },
    debug: {
      hasUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      hasAnonKey: !!supabaseAnonKey,
      urlLength: supabaseUrl?.length || 0,
      serviceKeyLength: supabaseServiceKey?.length || 0,
      anonKeyLength: supabaseAnonKey?.length || 0
    }
  })
}

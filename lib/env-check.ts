/**
 * 환경 변수 확인 유틸리티
 */

export function checkSupabaseEnv() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const issues: string[] = []

  if (!supabaseUrl) {
    issues.push("NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다")
  } else if (!supabaseUrl.startsWith('https://')) {
    issues.push("NEXT_PUBLIC_SUPABASE_URL이 올바른 형식이 아닙니다")
  }

  if (!supabaseServiceKey) {
    issues.push("SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다")
  } else if (!supabaseServiceKey.startsWith('eyJ')) {
    issues.push("SUPABASE_SERVICE_ROLE_KEY가 올바른 형식이 아닙니다")
  }

  if (!supabaseAnonKey) {
    issues.push("NEXT_PUBLIC_SUPABASE_ANON_KEY가 설정되지 않았습니다")
  }

  return {
    isValid: issues.length === 0,
    issues,
    hasUrl: !!supabaseUrl,
    hasServiceKey: !!supabaseServiceKey,
    hasAnonKey: !!supabaseAnonKey
  }
}

export function logEnvironmentStatus() {
  const envCheck = checkSupabaseEnv()
  
  console.log("=== Supabase Environment Check ===")
  console.log("Valid:", envCheck.isValid)
  console.log("Has URL:", envCheck.hasUrl)
  console.log("Has Service Key:", envCheck.hasServiceKey)
  console.log("Has Anon Key:", envCheck.hasAnonKey)
  
  if (envCheck.issues.length > 0) {
    console.error("Environment Issues:")
    envCheck.issues.forEach(issue => console.error("-", issue))
  }
  
  console.log("=================================")
  
  return envCheck
}

/**
 * 환경 변수 검증 및 설정
 * 프로덕션 환경에서 필수 환경 변수들이 올바르게 설정되었는지 확인
 */

export function validateEnvironmentVariables(): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // 필수 환경 변수 검증
  const requiredEnvVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      errors.push(`${key} 환경 변수가 설정되지 않았습니다.`)
    }
  }

  // Supabase URL 형식 검증
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (supabaseUrl && !supabaseUrl.startsWith("https://")) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL은 HTTPS로 시작해야 합니다.")
  }

  // 개발 환경 경고
  if (process.env.NODE_ENV === "development") {
    if (supabaseUrl?.includes("localhost")) {
      warnings.push("개발 환경에서 localhost Supabase를 사용하고 있습니다.")
    }
  }

  // 프로덕션 환경 검증
  if (process.env.NODE_ENV === "production") {
    if (!process.env.NEXTAUTH_SECRET) {
      warnings.push("프로덕션 환경에서 NEXTAUTH_SECRET이 설정되지 않았습니다.")
    }

    if (supabaseUrl?.includes("localhost") || supabaseUrl?.includes("127.0.0.1")) {
      errors.push("프로덕션 환경에서 localhost Supabase URL을 사용할 수 없습니다.")
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * 환경 변수 검증 및 초기화
 * 앱 시작 시 호출하여 환경 변수 상태를 확인
 */
export function initializeEnvironment(): void {
  const validation = validateEnvironmentVariables()

  if (validation.errors.length > 0) {
    console.error("❌ 환경 변수 오류:")
    validation.errors.forEach((error) => console.error(`  - ${error}`))
    
    if (process.env.NODE_ENV === "production") {
      throw new Error("필수 환경 변수가 설정되지 않았습니다.")
    }
  }

  if (validation.warnings.length > 0) {
    console.warn("⚠️ 환경 변수 경고:")
    validation.warnings.forEach((warning) => console.warn(`  - ${warning}`))
  }

  if (validation.isValid) {
    console.log("✅ 환경 변수 검증 완료")
  }
}

/**
 * Supabase 클라이언트 설정 검증
 */
export function validateSupabaseConfig(): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (supabaseUrl && !supabaseUrl.match(/^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/)) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL 형식이 올바르지 않습니다.")
  }

  if (supabaseAnonKey && !supabaseAnonKey.startsWith("eyJ")) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY 형식이 올바르지 않습니다.")
  }

  if (serviceRoleKey && !serviceRoleKey.startsWith("eyJ")) {
    errors.push("SUPABASE_SERVICE_ROLE_KEY 형식이 올바르지 않습니다.")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}




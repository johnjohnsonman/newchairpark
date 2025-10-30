/**
 * 앱 초기화 및 설정
 * 앱 시작 시 필요한 초기화 작업들을 수행
 */

import { initializeEnvironment, validateSupabaseConfig } from "./env-validation"

let isInitialized = false

/**
 * 앱 초기화
 * 서버 시작 시 한 번만 실행되어야 함
 */
export function initializeApp(): void {
  if (isInitialized) {
    return
  }

  try {
    // 환경 변수 검증
    initializeEnvironment()

    // Supabase 설정 검증
    const supabaseValidation = validateSupabaseConfig()
    if (!supabaseValidation.isValid) {
      console.error("❌ Supabase 설정 오류:")
      supabaseValidation.errors.forEach((error) => console.error(`  - ${error}`))
      
      if (process.env.NODE_ENV === "production") {
        throw new Error("Supabase 설정이 올바르지 않습니다.")
      }
    }

    console.log("🚀 앱 초기화 완료")
    isInitialized = true
  } catch (error) {
    console.error("❌ 앱 초기화 실패:", error)
    
    if (process.env.NODE_ENV === "production") {
      throw error
    }
  }
}

/**
 * 초기화 상태 확인
 */
export function isAppInitialized(): boolean {
  return isInitialized
}




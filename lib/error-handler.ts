/**
 * 에러 처리 유틸리티
 * 프로덕션 환경에서 일관된 에러 처리를 위한 유틸리티 함수들
 */

export interface AppError {
  code: string
  message: string
  details?: any
  statusCode?: number
}

/**
 * 에러 타입 정의
 */
export const ERROR_CODES = {
  // 인증 관련
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  
  // 데이터 관련
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  DUPLICATE_ENTRY: "DUPLICATE_ENTRY",
  
  // 서버 관련
  INTERNAL_ERROR: "INTERNAL_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  
  // 렌탈 관련
  RENTAL_NOT_AVAILABLE: "RENTAL_NOT_AVAILABLE",
  INVALID_RENTAL_PERIOD: "INVALID_RENTAL_PERIOD",
  RENTAL_REQUEST_EXISTS: "RENTAL_REQUEST_EXISTS",
} as const

/**
 * 에러 메시지 매핑
 */
const ERROR_MESSAGES: Record<string, string> = {
  [ERROR_CODES.UNAUTHORIZED]: "인증이 필요합니다.",
  [ERROR_CODES.FORBIDDEN]: "권한이 없습니다.",
  [ERROR_CODES.INVALID_CREDENTIALS]: "잘못된 인증 정보입니다.",
  [ERROR_CODES.NOT_FOUND]: "요청한 리소스를 찾을 수 없습니다.",
  [ERROR_CODES.VALIDATION_ERROR]: "입력 데이터가 올바르지 않습니다.",
  [ERROR_CODES.DUPLICATE_ENTRY]: "이미 존재하는 데이터입니다.",
  [ERROR_CODES.INTERNAL_ERROR]: "서버 내부 오류가 발생했습니다.",
  [ERROR_CODES.DATABASE_ERROR]: "데이터베이스 오류가 발생했습니다.",
  [ERROR_CODES.NETWORK_ERROR]: "네트워크 오류가 발생했습니다.",
  [ERROR_CODES.RENTAL_NOT_AVAILABLE]: "현재 이용할 수 없는 렌탈입니다.",
  [ERROR_CODES.INVALID_RENTAL_PERIOD]: "유효하지 않은 렌탈 기간입니다.",
  [ERROR_CODES.RENTAL_REQUEST_EXISTS]: "이미 신청된 렌탈 요청이 있습니다.",
}

/**
 * 앱 에러 생성
 */
export function createAppError(
  code: keyof typeof ERROR_CODES,
  details?: any,
  statusCode?: number
): AppError {
  return {
    code,
    message: ERROR_MESSAGES[code] || "알 수 없는 오류가 발생했습니다.",
    details,
    statusCode,
  }
}

/**
 * Supabase 에러를 앱 에러로 변환
 */
export function convertSupabaseError(error: any): AppError {
  if (!error) {
    return createAppError("INTERNAL_ERROR")
  }

  // Supabase 에러 코드 매핑
  const errorCodeMap: Record<string, keyof typeof ERROR_CODES> = {
    "PGRST116": "NOT_FOUND", // No rows returned
    "23505": "DUPLICATE_ENTRY", // Unique constraint violation
    "23503": "VALIDATION_ERROR", // Foreign key constraint violation
    "42501": "FORBIDDEN", // Insufficient privilege
    "PGRST301": "UNAUTHORIZED", // JWT expired
  }

  const appErrorCode = errorCodeMap[error.code] || "INTERNAL_ERROR"
  
  return createAppError(appErrorCode, {
    supabaseCode: error.code,
    supabaseMessage: error.message,
    supabaseDetails: error.details,
  })
}

/**
 * 네트워크 에러 처리
 */
export function handleNetworkError(error: any): AppError {
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return createAppError("NETWORK_ERROR", {
      originalError: error.message,
    })
  }

  return createAppError("INTERNAL_ERROR", {
    originalError: error,
  })
}

/**
 * 에러 로깅
 */
export function logError(error: AppError, context?: string): void {
  const logData = {
    timestamp: new Date().toISOString(),
    code: error.code,
    message: error.message,
    details: error.details,
    context,
    environment: process.env.NODE_ENV,
  }

  if (process.env.NODE_ENV === "production") {
    // 프로덕션에서는 구조화된 로깅
    console.error(JSON.stringify(logData))
  } else {
    // 개발 환경에서는 읽기 쉬운 형태로 로깅
    console.error("🚨 Error:", {
      code: error.code,
      message: error.message,
      context,
      details: error.details,
    })
  }
}

/**
 * 사용자에게 안전한 에러 메시지 반환
 */
export function getUserFriendlyMessage(error: AppError): string {
  // 프로덕션에서는 상세한 에러 정보를 숨김
  if (process.env.NODE_ENV === "production") {
    const safeErrors = [
      ERROR_CODES.UNAUTHORIZED,
      ERROR_CODES.FORBIDDEN,
      ERROR_CODES.NOT_FOUND,
      ERROR_CODES.VALIDATION_ERROR,
      ERROR_CODES.DUPLICATE_ENTRY,
    ]

    if (safeErrors.includes(error.code as any)) {
      return error.message
    }

    return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
  }

  // 개발 환경에서는 상세한 에러 정보 제공
  return error.message
}

/**
 * API 응답 에러 포맷팅
 */
export function formatApiError(error: AppError): {
  error: string
  code?: string
  details?: any
} {
  return {
    error: getUserFriendlyMessage(error),
    code: error.code,
    details: process.env.NODE_ENV === "development" ? error.details : undefined,
  }
}




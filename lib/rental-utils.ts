/**
 * 렌탈 시스템 유틸리티 함수들
 * 프로덕션 환경에서 사용할 유틸리티 함수들을 모아놓은 파일
 */

import type { Rental, RentalRequest } from "@/types/rental"

/**
 * 렌탈 가격 포맷팅
 */
export function formatRentalPrice(rental: Rental): string {
  const price = rental.type === "rental" ? rental.price_monthly : rental.price_daily
  return `₩${Number(price || 0).toLocaleString()}`
}

/**
 * 렌탈 가격 단위 반환
 */
export function getRentalPriceUnit(rental: Rental): string {
  return rental.type === "rental" ? "/월" : "/일"
}

/**
 * 렌탈 상태 한글 변환
 */
export function getRentalRequestStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    pending: "대기중",
    approved: "승인됨",
    rejected: "거절됨",
    completed: "완료됨",
  }
  return statusMap[status] || status
}

/**
 * 렌탈 타입 한글 변환
 */
export function getRentalTypeLabel(type: string): string {
  return type === "rental" ? "렌탈" : "데모"
}

/**
 * 렌탈 카테고리 한글 변환
 */
export function getRentalCategoryLabel(category: string): string {
  const categoryMap: Record<string, string> = {
    "office-chair": "오피스 체어",
    "executive-chair": "임원용 체어",
    "lounge-chair": "라운지 체어",
    "conference-chair": "회의용 체어",
    "dining-chair": "다이닝 체어",
    "design-chair": "디자인 체어",
    "desk": "데스크",
    "office-accessories": "오피스 악세서리",
  }
  return categoryMap[category] || category
}

/**
 * 렌탈 기간 유효성 검증
 */
export function validateRentalPeriod(period: string, minPeriod: number = 3): boolean {
  const months = parseInt(period.replace(/[^0-9]/g, ""))
  return months >= minPeriod
}

/**
 * 렌탈 요청 데이터 검증
 */
export function validateRentalRequest(data: Partial<RentalRequest>): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!data.name?.trim()) {
    errors.push("이름을 입력해주세요.")
  }

  if (!data.phone?.trim()) {
    errors.push("연락처를 입력해주세요.")
  }

  if (!data.service_type || !["rental", "demo"].includes(data.service_type)) {
    errors.push("유효하지 않은 서비스 타입입니다.")
  }

  if (data.service_type === "rental" && !data.rental_period) {
    errors.push("렌탈 기간을 선택해주세요.")
  }

  if (!data.preferred_date) {
    errors.push("희망 날짜를 선택해주세요.")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * 렌탈 데이터 검증
 */
export function validateRentalData(data: Partial<Rental>): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!data.name?.trim()) {
    errors.push("제품명을 입력해주세요.")
  }

  if (!data.slug?.trim()) {
    errors.push("슬러그를 입력해주세요.")
  }

  if (!data.category?.trim()) {
    errors.push("카테고리를 선택해주세요.")
  }

  if (!data.type || !["rental", "demo"].includes(data.type)) {
    errors.push("유효하지 않은 타입입니다.")
  }

  if (!data.image_url?.trim()) {
    errors.push("대표 이미지를 업로드해주세요.")
  }

  if (data.type === "rental" && !data.price_monthly) {
    errors.push("월간 렌탈 가격을 입력해주세요.")
  }

  if (data.type === "demo" && !data.price_daily) {
    errors.push("일간 데모 가격을 입력해주세요.")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * 슬러그 생성
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/**
 * 렌탈 이미지 URL 검증
 */
export function isValidImageUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * 렌탈 요청 상태 변경 가능 여부 확인
 */
export function canChangeRentalRequestStatus(
  currentStatus: string,
  newStatus: string,
  isAdmin: boolean = false
): boolean {
  if (!isAdmin) {
    return false // 일반 사용자는 상태 변경 불가
  }

  const allowedTransitions: Record<string, string[]> = {
    pending: ["approved", "rejected"],
    approved: ["completed", "rejected"],
    rejected: ["pending"], // 관리자가 재검토할 수 있음
    completed: [], // 완료된 요청은 변경 불가
  }

  return allowedTransitions[currentStatus]?.includes(newStatus) || false
}

/**
 * 렌탈 가격 범위 검증
 */
export function validatePriceRange(
  minPrice: number,
  maxPrice: number,
  rentalType: "rental" | "demo"
): boolean {
  if (rentalType === "rental") {
    return minPrice >= 0 && maxPrice <= 10000000 && minPrice <= maxPrice // 월간 최대 1천만원
  } else {
    return minPrice >= 0 && maxPrice <= 1000000 && minPrice <= maxPrice // 일간 최대 100만원
  }
}




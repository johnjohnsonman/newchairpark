export interface Rental {
  id: string
  name: string
  slug: string
  brand_id: string | null
  category: string
  type: "rental" | "demo"
  price_monthly: number | null
  price_daily: number | null
  original_price: number | null
  // 선택적: 보증금. 컬럼이 없을 수 있어 optional 처리
  deposit?: number | null
  description: string | null
  image_url: string
  images: { url: string }[]
  specifications: Record<string, any>
  available: boolean
  featured: boolean
  min_rental_period: number
  created_at: string
  updated_at: string
  brands?: {
    name: string
    slug: string
  }
}

export interface RentalRequest {
  id: string
  rental_id: string | null
  user_id: string
  service_type: "rental" | "demo"
  name: string
  company: string | null
  phone: string
  email: string | null
  quantity: number
  rental_period: string | null
  preferred_date: string | null
  message: string | null
  status: "pending" | "approved" | "rejected" | "completed"
  created_at: string
  updated_at: string
  rentals?: Rental
}



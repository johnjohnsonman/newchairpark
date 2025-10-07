export interface Brand {
  id: string
  name: string
  slug: string
  logo_url: string | null
  description: string | null
  hero_image_url: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  brand_id: string | null
  category: string
  price: number
  original_price: number | null
  description: string | null
  image_url: string
  images: string[]
  specifications: Record<string, any>
  in_stock: boolean
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Gallery {
  id: string
  title: string
  description: string | null
  image_url: string
  images: string[]
  featured_image_index: number
  category: string | null
  featured: boolean
  user_id: string | null
  created_at: string
  updated_at: string
}

export interface Resource {
  id: string
  title: string
  description: string | null
  file_url: string
  file_type: string
  file_size: number | null
  brand_id: string | null
  created_at: string
  updated_at: string
}

export interface RecycleItem {
  id: string
  title: string
  description: string
  price: number
  original_price: number | null
  condition: "excellent" | "good" | "fair"
  category: string
  brand: string | null
  image_url: string
  images: string[]
  location: string | null
  seller_name: string | null
  seller_contact: string | null
  status: "available" | "sold" | "reserved"
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  product_id: number
  user_name: string
  user_email: string
  rating: number
  title: string
  comment: string
  helpful_count: number
  verified_purchase: boolean
  age: number | null
  height: number | null
  weight: number | null
  occupation: string | null
  sitting_style: string | null
  previous_chair: string | null
  satisfaction_score: number | null
  design_score: number | null
  comfort_score: number | null
  value_score: number | null
  view_count: number
  featured: boolean
  created_at: string
  updated_at: string
}

export interface ReviewRecommendation {
  id: string
  review_id: string
  user_identifier: string
  created_at: string
}

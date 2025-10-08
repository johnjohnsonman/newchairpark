import { createServerClient } from "@/lib/supabase/server"
import StoreClientPage from "./store-client"

const categories = [
  { id: "all", name: "전체", displayName: "전체 체어" },
  { id: "office-chair", name: "Office Chair", displayName: "오피스 체어" },
  { id: "executive-chair", name: "Executive Chair", displayName: "임원용 체어" },
  { id: "lounge-chair", name: "Lounge Chair", displayName: "라운지 체어" },
  { id: "conference-chair", name: "Conference Chair", displayName: "회의용 체어" },
  { id: "dining-chair", name: "Dining Chair", displayName: "다이닝 체어" },
  { id: "design-chair", name: "Design Chair", displayName: "디자인 체어" },
]

// 동적 메타데이터 생성
export async function generateMetadata() {
  return {
    title: "스토어 | 프리미엄 오피스 가구",
    description:
      "허먼밀러, 스틸케이스 등 세계적인 프리미엄 오피스 체어와 가구를 만나보세요. 인체공학적 디자인과 최고의 품질을 경험하세요.",
    robots: {
      index: true,
      follow: true,
    },
    // 캐시 방지
    other: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  }
}

// 캐시 제어 설정
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function StorePage() {
  const supabase = await createServerClient()

  // 서버에서 미리 데이터 로드 (빠름!)
  const [productsResult, brandsResult, bannersResult] = await Promise.all([
    supabase
      .from("products")
      .select("*, brands(name, slug)")
      .order("created_at", { ascending: false }),
    supabase.from("brands").select("*").order("name"),
    supabase.from("category_banners").select("*").order("created_at", { ascending: false }),
  ])

  const initialProducts = productsResult.data || []
  const initialBrands = brandsResult.data || []
  const categoryBanners = bannersResult.data || []

  return (
    <StoreClientPage 
      categories={categories} 
      initialProducts={initialProducts}
      initialBrands={initialBrands}
      categoryBanners={categoryBanners}
    />
  )
}

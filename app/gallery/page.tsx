import { createServerClient } from "@/lib/supabase/server"
import { GalleryClient } from "@/components/gallery-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "프리미엄 가구 갤러리 | 체어파크 - 허먼밀러, 스틸케이스 작품 전시",
  description: "허먼밀러 에어론, 스틸케이스 제스처 등 세계적인 프리미엄 오피스 가구의 아름다운 작품들을 갤러리에서 만나보세요. 실제 사진과 상세 정보로 제품을 미리 체험해보실 수 있습니다.",
  keywords: [
    "프리미엄 가구 갤러리",
    "허먼밀러 갤러리",
    "스틸케이스 갤러리",
    "에어론 체어 사진",
    "제스처 체어 이미지",
    "오피스 가구 전시",
    "인체공학 의자 갤러리",
    "체어파크 갤러리"
  ],
  openGraph: {
    title: "프리미엄 가구 갤러리 | 체어파크",
    description: "허먼밀러, 스틸케이스 등 세계적인 프리미엄 오피스 가구의 아름다운 작품들을 만나보세요",
    type: "website",
    images: [
      {
        url: "/premium-chair-showroom-with-many-chairs.jpg",
        width: 1200,
        height: 630,
        alt: "체어파크 프리미엄 가구 갤러리",
      },
    ],
  },
  alternates: {
    canonical: "https://chairpark.co.kr/gallery",
  },
}

export default async function GalleryPage() {
  const supabase = await createServerClient()

  const { data: galleryItems } = await supabase.from("gallery").select("id, title, description, brand, product_name, image_url, images, featured_image_index, created_at").order("created_at", { ascending: false })

  const { data: brands } = await supabase.from("brands").select("name").order("name")

  return <GalleryClient galleryItems={galleryItems || []} brands={brands || []} />
}

import { createServerClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "프리미엄 가구 브랜드 | 체어파크 - 허먼밀러, 스틸케이스 등 세계적 브랜드",
  description: "허먼밀러, 스틸케이스, 놀 등 세계적인 프리미엄 오피스 가구 브랜드를 체어파크에서 만나보세요. 각 브랜드의 독창적인 디자인과 혁신적인 기술을 경험할 수 있습니다.",
  keywords: [
    "허먼밀러",
    "스틸케이스", 
    "놀",
    "프리미엄 가구 브랜드",
    "오피스 가구 브랜드",
    "체어파크",
    "브랜드 소개"
  ],
  openGraph: {
    title: "프리미엄 가구 브랜드 | 체어파크",
    description: "허먼밀러, 스틸케이스 등 세계적인 프리미엄 오피스 가구 브랜드를 만나보세요",
    type: "website",
    images: [
      {
        url: "/herman-miller-logo.jpg",
        width: 1200,
        height: 630,
        alt: "체어파크 프리미엄 가구 브랜드",
      },
    ],
  },
  alternates: {
    canonical: "https://chairpark.co.kr/brand",
  },
}

export default async function BrandPage() {
  const supabase = await createServerClient()

  try {
    const { data: brands, error } = await supabase.from("brands").select("*").order("name")

    if (error) {
      console.error('Brands fetch error:', error)
      return (
        <div className="bg-background">
          <div className="container mx-auto px-4 py-12">
            <div className="py-16 text-center text-neutral-500">
              <p>브랜드를 불러오는 중 오류가 발생했습니다.</p>
              <p className="mt-2 text-sm">잠시 후 다시 시도해주세요.</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">프리미엄 가구 브랜드</h1>
            <p className="text-lg text-muted-foreground">세계적인 디자인과 혁신을 추구하는 브랜드들을 만나보세요</p>
            <div className="mt-4 text-sm text-muted-foreground">{brands?.length || 0}개 브랜드</div>
          </div>

          {brands && brands.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {brands.map((brand) => (
                <Link
                  key={brand.slug}
                  href={`/brand/${brand.slug}`}
                  className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:shadow-lg hover:scale-[1.02] duration-300"
                >
                  <div className="relative aspect-square mb-4">
                    <Image
                      src={brand.logo_url || "/placeholder.svg"}
                      alt={brand.name}
                      fill
                      className="object-contain transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {brand.name}
                    </h3>
                    {brand.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {brand.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-muted-foreground">
              <div className="mb-4">
                <Image 
                  src="/placeholder.svg" 
                  alt="No brands" 
                  width={200} 
                  height={200} 
                  className="mx-auto opacity-50"
                />
              </div>
              <p className="text-lg font-medium mb-2">등록된 브랜드가 없습니다</p>
              <p className="text-sm">어드민 페이지에서 브랜드를 등록해주세요.</p>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Brand page error:', error)
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="py-16 text-center text-neutral-500">
            <p>페이지를 불러오는 중 오류가 발생했습니다.</p>
            <p className="mt-2 text-sm">잠시 후 다시 시도해주세요.</p>
          </div>
        </div>
      </div>
    )
  }
}

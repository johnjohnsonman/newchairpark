import { notFound } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { BrandBannerCarousel } from "@/components/brand-banner-carousel"
import type { Metadata } from "next"
import Link from "next/link"

interface BrandDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BrandDetailPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const supabase = await createServerClient()
    
    const { data: brand } = await supabase
      .from("brands")
      .select("*")
      .eq("slug", slug)
      .single()

    if (!brand) {
      return {
        title: "브랜드를 찾을 수 없습니다 | 체어파크",
        description: "요청하신 브랜드를 찾을 수 없습니다.",
      }
    }

    const title = `${brand.name} | 프리미엄 가구 브랜드 | 체어파크`
    const description = brand.description || `${brand.name} 브랜드의 프리미엄 오피스 가구를 체어파크에서 만나보세요.`

    return {
      title,
      description,
      keywords: [
        brand.name,
        "프리미엄 가구",
        "오피스 체어",
        "브랜드",
        "체어파크"
      ],
      openGraph: {
        title,
        description,
        type: "website",
        images: brand.logo_url ? [
          {
            url: brand.logo_url,
            width: 1200,
            height: 630,
            alt: `${brand.name} 브랜드`,
          },
        ] : undefined,
      },
      alternates: {
        canonical: `https://chairpark.co.kr/brand/${slug}`,
      },
    }
  } catch (error) {
    return {
      title: "브랜드 | 체어파크",
      description: "프리미엄 가구 브랜드를 확인하세요.",
    }
  }
}

export default async function BrandDetailPage({ params }: BrandDetailPageProps) {
  try {
    const { slug } = await params
    const supabase = await createServerClient()

    // 브랜드 정보를 먼저 가져오기
    const { data: brand, error: brandError } = await supabase
      .from("brands")
      .select("*")
      .eq("slug", slug)
      .single()

    if (brandError || !brand) {
      console.error('Brand not found:', { slug, brandError })
      notFound()
    }

    // 브랜드 ID를 알았으니 제품 정보를 가져오기
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, slug, price, category, image_url, in_stock, featured")
      .eq("brand_id", brand.id)
      .order("created_at", { ascending: false })

    if (productsError) {
      console.error('Products fetch error:', productsError)
    }

    // 브랜드 정보에서 배너 데이터 추출
    const banners = []
    if (brand.banner_images && Array.isArray(brand.banner_images)) {
      for (let i = 0; i < brand.banner_images.length; i++) {
        banners.push({
          id: `${brand.id}-${i}`,
          image_url: brand.banner_images[i],
          title: brand.banner_titles?.[i] || '',
          description: brand.banner_descriptions?.[i] || '',
          order_index: i
        })
      }
    }

    const displayProducts = products || []

    return (
      <div className="bg-white">
        {/* 브랜드 정보 섹션 */}
        <div className="relative bg-slate-100 pt-8 sm:pt-12">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2">
              <div className="flex items-center px-6 py-16 lg:px-12">
                <div>
                  <div className="mb-4 text-4xl font-bold">{brand.name}</div>
                  <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
                    {brand.description || `${brand.name}의 프리미엄 오피스 가구를 체어파크에서 만나보세요.`}
                  </p>
                </div>
              </div>
              <div className="relative h-96 lg:h-[600px] xl:h-[700px]">
                <BrandBannerCarousel 
                  banners={banners || []} 
                  brandName={brand.name}
                  className="h-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 제품 목록 섹션 */}
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{displayProducts.length}개 제품</div>
            <div className="flex items-center gap-4">
              <select className="rounded-md border border-border bg-white px-4 py-2 text-sm">
                <option>인기순</option>
                <option>최신순</option>
                <option>낮은 가격순</option>
                <option>높은 가격순</option>
              </select>
            </div>
          </div>

          {displayProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.isArray(displayProducts) && displayProducts.map((product) => (
                <Card key={product.id} className="group overflow-hidden border-border">
                  <div className="relative aspect-square overflow-hidden bg-slate-50">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition-transform group-hover:scale-105"
                    />
                    {!product.in_stock && (
                      <div className="absolute left-3 top-3 rounded bg-slate-900 px-2 py-1 text-xs font-medium text-white">
                        품절
                      </div>
                    )}
                    {product.featured && (
                      <div className="absolute left-3 top-3 rounded bg-primary px-2 py-1 text-xs font-medium text-white">
                        인기
                      </div>
                    )}
                    <div className="absolute right-3 top-3 flex gap-2">
                      <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white shadow-sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="mb-1 text-xs text-muted-foreground">{brand.name.toUpperCase()} / {product.category}</div>
                    <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-tight">{product.name}</h3>
                    <div className="text-base font-bold">{product.price?.toLocaleString()}원</div>
                    <div className="mt-2">
                      <Button size="sm" variant="outline" className="w-full" asChild>
                        <Link href={`/store/${product.slug}`}>자세히 보기</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-muted-foreground">
              <div className="mb-4">
                <Image 
                  src="/placeholder.svg" 
                  alt="No products" 
                  width={200} 
                  height={200} 
                  className="mx-auto opacity-50"
                />
              </div>
              <p className="text-lg font-medium mb-2">등록된 제품이 없습니다</p>
              <p className="text-sm">새로운 제품이 추가될 때까지 기다려주세요.</p>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Brand detail page error:', error)
    notFound()
  }
}

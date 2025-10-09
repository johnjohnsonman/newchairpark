import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductDetailView } from "@/components/product-detail-view"
import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const supabase = await createServerClient()
    const { data: product } = await supabase
      .from("products")
      .select(`
        name,
        description,
        images,
        brand_id,
        brands(name)
      `)
      .eq("slug", slug)
      .single()

    if (!product) {
      return {
        title: "제품을 찾을 수 없습니다",
        description: "요청하신 제품을 찾을 수 없습니다.",
      }
    }

    const title = `${product.name} | ${product.brands?.name || ''} - 체어파크`
    const description = product.description?.substring(0, 150) + "..."
    const imageUrl = Array.isArray(product.images) && product.images[0] 
      ? product.images[0] 
      : "/placeholder.jpg"

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: imageUrl }],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "제품 정보",
      description: "제품 정보를 불러오는 중 오류가 발생했습니다.",
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const { slug } = await params
    const supabase = await createServerClient()

    const { data: product, error } = await supabase
      .from("products")
      .select(`
        *,
        brands(name, description, logo_url),
        product_options(*),
        product_variants(*)
      `)
      .eq("slug", slug)
      .single()

    if (error || !product) {
      console.error("Error fetching product:", error?.message || "Product not found")
      notFound()
    }

    // 데이터 안전성 검증 및 정규화
    const normalizedProduct = {
      ...product,
      images: Array.isArray(product.images) ? product.images : [],
      product_options: Array.isArray(product.product_options) ? product.product_options : [],
      product_variants: Array.isArray(product.product_variants) ? product.product_variants : [],
    }

    // 조회수 증가 (에러 무시) - 비동기로 처리하여 페이지 렌더링을 차단하지 않음
    try {
      await supabase.rpc("increment_product_view_count", { product_slug: slug })
    } catch (viewError) {
      console.warn("Failed to increment view count:", viewError)
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* 브레드크럼 */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <a href="/" className="hover:text-primary transition-colors">홈</a>
            <span>/</span>
            <a href="/store" className="hover:text-primary transition-colors">스토어</a>
            <span>/</span>
            <a href={`/brand/${product.brands?.name?.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary transition-colors">
              {product.brands?.name}
            </a>
            <span>/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="container mx-auto px-4 py-8">
        <ProductDetailView product={normalizedProduct} />
      </div>

      {/* JSON-LD 구조화 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": normalizedProduct.name,
            "description": normalizedProduct.description,
            "image": normalizedProduct.images,
            "brand": {
              "@type": "Brand",
              "name": normalizedProduct.brands?.name
            },
            "offers": {
              "@type": "Offer",
              "price": normalizedProduct.price,
              "priceCurrency": "KRW",
              "availability": normalizedProduct.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          })
        }}
      />
    </div>
  )
  } catch (error) {
    console.error("Error in ProductPage:", error)
    notFound()
  }
}

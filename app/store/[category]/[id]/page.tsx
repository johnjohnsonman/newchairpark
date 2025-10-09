import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Share2, ArrowLeft, Check, Star } from "lucide-react"
import { ProductReviews } from "@/components/product-reviews"
import { createServerClient } from "@/lib/supabase/server"

const allProducts = [
  {
    id: "1",
    name: "에어론 체어",
    slug: "aeron-chair",
    category: "office-chair",
    brand: "허먼밀러",
    price: 1890000,
    image: "/herman-miller-aeron.png",
    images: ["/herman-miller-aeron.png", "/herman-miller-aeron-chair-black.jpg", "/herman-miller-embody-chair.jpg"],
    description:
      "에어론 체어는 인체공학적 디자인의 선구자입니다. 혁신적인 8Z 펠리클 서스펜션 소재로 제작되어 최적의 통기성과 지지력을 제공합니다.",
    longDescription:
      "1994년 출시 이후 오피스 체어의 기준을 새롭게 정의한 에어론 체어는 인체공학, 디자인, 환경을 고려한 혁신적인 제품입니다. 8Z 펠리클 메쉬는 8개의 다른 긴장 영역으로 구성되어 신체의 각 부위를 최적으로 지지합니다.",
    features: [
      "12년 보증",
      "8Z 펠리클 서스펜션",
      "PostureFit 요추 지지대",
      "완전 조절 가능한 팔걸이",
      "틸트 리미터 및 시트 각도 조절",
      "통기성 메쉬 소재",
      "3가지 사이즈 (A, B, C)",
      "재활용 가능 소재 93%",
    ],
    specifications: {
      크기: "A, B, C 사이즈 선택 가능",
      무게: "약 20kg",
      소재: "8Z 펠리클 메쉬, 재활용 알루미늄",
      색상: "그라파이트, 미네랄, 카본",
      보증: "12년",
      원산지: "미국",
    },
    warranty: "12년 보증 - 구조, 메커니즘, 공압 실린더 포함",
    shipping: "무료 배송 및 설치 서비스 제공 (서울/경기 지역)",
  },
  {
    id: "2",
    name: "엠보디 체어",
    slug: "embody-chair",
    category: "office-chair",
    brand: "허먼밀러",
    price: 2190000,
    image: "/herman-miller-embody-chair.jpg",
    images: ["/herman-miller-embody-chair.jpg", "/herman-miller-aeron.png"],
    description: "건강한 자세를 위한 프리미엄 체어. 백픽셀 기술로 척추를 자연스럽게 지지합니다.",
    longDescription:
      "엠보디 체어는 의학 전문가들과 협력하여 개발된 혁신적인 오피스 체어입니다. 백픽셀 기술은 척추의 자연스러운 곡선을 따라 움직이며, 장시간 앉아있어도 건강한 자세를 유지할 수 있도록 도와줍니다.",
    features: [
      "12년 보증",
      "백픽셀 기술",
      "동적 매트릭스 시트",
      "틸트 리미터",
      "4D 팔걸이",
      "압력 분산 시트",
      "자동 척추 정렬",
      "혈액 순환 촉진",
    ],
    specifications: {
      크기: "원 사이즈",
      무게: "약 22kg",
      소재: "백픽셀 패브릭, 알루미늄",
      색상: "다양한 색상 선택 가능",
      보증: "12년",
      원산지: "미국",
    },
    warranty: "12년 보증 - 구조, 메커니즘, 공압 실린더 포함",
    shipping: "무료 배송 및 설치 서비스 제공 (서울/경기 지역)",
  },
]

export default async function ProductDetailPage({
  params,
}: {
  params: { category: string; id: string }
}) {
  const product = allProducts.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  const supabase = await createServerClient()
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", Number.parseInt(params.id))
    .order("created_at", { ascending: false })

  const reviewList = reviews || []
  const totalReviews = reviewList.length
  const averageRating = totalReviews > 0 ? reviewList.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.brand === product.brand || p.category === product.category))
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              홈
            </Link>
            <span>/</span>
            <Link href="/store" className="hover:text-foreground">
              스토어
            </Link>
            <span>/</span>
            <Link href={`/store?category=${product.category}`} className="hover:text-foreground">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <Link
          href="/store"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          스토어로 돌아가기
        </Link>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-50">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain p-8" />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className="relative aspect-square overflow-hidden rounded-lg border-2 border-transparent hover:border-neutral-900"
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {product.brand}
            </div>
            <h1 className="mb-4 text-4xl font-bold lg:text-5xl">{product.name}</h1>

            {totalReviews > 0 && (
              <div className="mb-4 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold">{averageRating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({totalReviews}개 리뷰)</span>
              </div>
            )}

            <p className="mb-6 text-lg text-muted-foreground">{product.description}</p>

            <div className="mb-8 border-y py-6">
              <div className="text-3xl font-bold">₩{product.price.toLocaleString()}</div>
              <p className="mt-2 text-sm text-muted-foreground">부가세 포함</p>
            </div>

            <div className="mb-8">
              <h3 className="mb-4 text-lg font-semibold">주요 특징</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.isArray(product.features) && product.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <Button size="lg" className="w-full text-base">
                구매 문의하기
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" size="lg" className="flex-1 bg-transparent">
                  <Heart className="mr-2 h-5 w-5" />
                  위시리스트
                </Button>
                <Button variant="outline" size="lg" className="flex-1 bg-transparent">
                  <Share2 className="mr-2 h-5 w-5" />
                  공유하기
                </Button>
              </div>
            </div>

            <div className="mt-8 space-y-2 border-t pt-6 text-sm text-muted-foreground">
              <p>✓ {product.shipping}</p>
              <p>✓ {product.warranty}</p>
              <p>✓ 전문 상담 서비스 제공</p>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent"
              >
                상세 설명
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent"
              >
                제품 사양
              </TabsTrigger>
              <TabsTrigger
                value="warranty"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent"
              >
                보증 및 배송
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent"
              >
                리뷰 ({totalReviews})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-8">
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed">{product.longDescription}</p>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="mt-8">
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex border-b pb-3">
                    <div className="w-32 font-semibold">{key}</div>
                    <div className="flex-1 text-muted-foreground">{value}</div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="warranty" className="mt-8">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">보증 정보</h3>
                  <p className="text-muted-foreground">{product.warranty}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">배송 정보</h3>
                  <p className="text-muted-foreground">{product.shipping}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">A/S 문의</h3>
                  <p className="text-muted-foreground">
                    제품 관련 문의사항은 고객센터(02-532-1113) 또는 카카오톡 상담을 이용해주세요.
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-8">
              <ProductReviews
                productId={Number.parseInt(params.id)}
                reviews={reviewList}
                averageRating={averageRating}
                totalReviews={totalReviews}
              />
            </TabsContent>
          </Tabs>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 text-2xl font-bold">관련 제품</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/store/${relatedProduct.category}/${relatedProduct.id}`}>
                  <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                    <div className="relative aspect-square overflow-hidden bg-neutral-50">
                      <Image
                        src={relatedProduct.image || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        fill
                        className="object-contain p-6 transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {relatedProduct.brand}
                      </p>
                      <h3 className="mb-2 text-sm font-bold">{relatedProduct.name}</h3>
                      <p className="text-sm font-bold">₩{relatedProduct.price.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

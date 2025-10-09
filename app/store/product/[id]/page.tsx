import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, Minus, Plus, ShoppingCart, Truck, RefreshCw, Utensils } from "lucide-react"

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  const { data: product, error } = await supabase
    .from("products")
    .select("*, brands(name, slug, description)")
    .eq("id", params.id)
    .single()

  if (!product) {
    notFound()
  }

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", Number.parseInt(params.id))
    .order("created_at", { ascending: false })

  const reviewStats = reviews
    ? {
        count: reviews.length,
        average: reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length,
      }
    : { count: 0, average: 0 }

  const mainImage = product.images?.[0]?.url || product.image_url || "/placeholder.svg"
  const thumbnailImages = Array.isArray(product.images) ? product.images : []

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-neutral-50">
              <Image src={mainImage || "/placeholder.svg"} alt={product.name} fill className="object-contain p-8" />
            </div>
            {Array.isArray(thumbnailImages) && thumbnailImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {thumbnailImages.slice(0, 4).map((img: any, idx: number) => (
                  <div
                    key={idx}
                    className="relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 border-neutral-200 bg-neutral-50 hover:border-neutral-400"
                  >
                    <Image
                      src={img.url || "/placeholder.svg"}
                      alt={`${product.name} ${idx + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            <div>
              <p className="mb-2 inline-block rounded bg-neutral-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                {product.brands?.name || "브랜드"}
              </p>
              <h1 className="mb-2 text-3xl font-bold text-neutral-900">{product.name}</h1>
              <p className="text-sm text-neutral-600">{product.description}</p>
            </div>

            {reviewStats.count > 0 && (
              <div className="flex items-center gap-2 border-b pb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(reviewStats.average) ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-600">
                  {reviewStats.average.toFixed(1)} ({reviewStats.count} 리뷰)
                </span>
              </div>
            )}

            <div className="border-b pb-6">
              <div className="mb-4 flex items-baseline gap-3">
                <p className="text-3xl font-bold text-neutral-900">₩{Number(product.price).toLocaleString()}</p>
                {product.original_price && Number(product.original_price) > Number(product.price) && (
                  <p className="text-lg text-neutral-400 line-through">
                    ₩{Number(product.original_price).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Size/Option Selector */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-neutral-700">옵션 선택</label>
                <select className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm focus:border-neutral-900 focus:outline-none">
                  <option>옵션을 선택해주세요</option>
                  <option>기본 옵션</option>
                </select>
              </div>

              {/* Quantity Selector */}
              <div className="mb-4 flex items-center justify-between rounded-lg border border-neutral-300 p-4">
                <span className="text-sm font-semibold">수량</span>
                <div className="flex items-center gap-3">
                  <button className="flex h-8 w-8 items-center justify-center rounded border border-neutral-300 hover:bg-neutral-100">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-semibold">1</span>
                  <button className="flex h-8 w-8 items-center justify-center rounded border border-neutral-300 hover:bg-neutral-100">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="mb-6 flex items-center justify-between rounded-lg bg-neutral-50 p-4">
                <span className="font-semibold text-neutral-700">총 상품금액</span>
                <span className="text-2xl font-bold text-neutral-900">₩{Number(product.price).toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button variant="outline" size="lg" className="flex-1 gap-2 bg-transparent">
                  <ShoppingCart className="h-5 w-5" />
                  장바구니
                </Button>
                <Button size="lg" className="flex-1 bg-neutral-900 hover:bg-neutral-800">
                  구매하기
                </Button>
              </div>
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 bg-[#03C75A] text-white hover:bg-[#02B350] hover:text-white"
              >
                <Image src="/naver-pay-logo.png" alt="Naver Pay" width={20} height={20} />
                네이버페이 구매
              </Button>
              <Button variant="outline" size="lg" className="w-full gap-2 bg-transparent">
                <Heart className="h-5 w-5" />
                찜하기
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="space-y-2 border-t pt-6 text-sm text-neutral-600">
              <p className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                배송비: 무료배송
              </p>
              <p className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                교환 및 환불: 구매 후 7일 이내 가능
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full justify-start border-b">
              <TabsTrigger value="info" className="px-8 py-3">
                상품정보
              </TabsTrigger>
              <TabsTrigger value="reviews" className="px-8 py-3">
                리뷰/사용기 ({reviewStats.count})
              </TabsTrigger>
              <TabsTrigger value="qna" className="px-8 py-3">
                Q&A (0)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="py-12">
              {/* Brand Story Section */}
              <div className="mb-16 text-center">
                <div className="mb-8 inline-block">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-neutral-900" />
                    <span className="text-xl font-bold">CHAIRPARK</span>
                  </div>
                  <p className="text-sm text-neutral-600">World Premium Chair Store</p>
                </div>
              </div>

              {/* Why CHAIRPARK Section */}
              <div className="mb-16 grid gap-8 lg:grid-cols-2">
                <div className="flex flex-col justify-center rounded-lg bg-neutral-900 p-12 text-white">
                  <h2 className="mb-4 text-3xl font-bold">"WHY CHAIRPARK?"</h2>
                  <p className="mb-2 text-lg font-semibold">체어파크가 특별한 이유</p>
                  <p className="text-sm leading-relaxed text-neutral-300">
                    체어파크는 세계 프리미엄 의자 브랜드의 정식 딜러로서, 고객의 건강과 업무 효율을 최우선으로
                    생각합니다. 20년 이상의 노하우와 전문성으로 최고의 제품과 서비스를 제공합니다.
                  </p>
                </div>
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <Image
                    src="/modern-office-with-premium-chairs.jpg"
                    alt="Chairpark Office"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Offline Store Section */}
              <div className="mb-16">
                <h3 className="mb-4 text-center text-2xl font-bold">세계 가능한 오프라인 매장</h3>
                <p className="mb-8 text-center text-neutral-600">
                  전국 어디서나 가까운 체어파크 매장에서 직접 체험하고, 전문가의 상담을 받으실 수 있습니다.
                </p>
                <div className="relative aspect-[2/1] overflow-hidden rounded-lg">
                  <Image
                    src="/premium-chair-showroom-with-many-chairs.jpg"
                    alt="Chairpark Showroom"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Service Features */}
              <div className="mb-16 grid gap-6 md:grid-cols-3">
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="mb-4 flex justify-center">
                      <Truck className="h-12 w-12 text-blue-600" />
                    </div>
                    <h4 className="mb-2 font-bold text-blue-600">안전한 택배 및 설치 배송</h4>
                    <p className="text-sm text-neutral-600">전문 배송팀이 안전하게 배송하고 설치해드립니다</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="mb-4 flex justify-center">
                      <RefreshCw className="h-12 w-12 text-blue-600" />
                    </div>
                    <h4 className="mb-2 font-bold text-blue-600">안전한 물류 및 보관 시스템</h4>
                    <p className="text-sm text-neutral-600">체계적인 물류 시스템으로 제품을 안전하게 보관합니다</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="mb-4 flex justify-center">
                      <Utensils className="h-12 w-12 text-blue-600" />
                    </div>
                    <h4 className="mb-2 font-bold text-blue-600">자체 A/S시스템 운영</h4>
                    <p className="text-sm text-neutral-600">신속하고 정확한 A/S 서비스를 제공합니다</p>
                  </CardContent>
                </Card>
              </div>

              {/* Brand Promise Section */}
              <div className="rounded-lg bg-neutral-900 p-12 text-center text-white">
                <p className="mb-4 text-sm uppercase tracking-wider text-neutral-400">World Premium Chair Store</p>
                <h2 className="mb-6 text-4xl font-bold">CHAIRPARK</h2>
                <p className="mb-12 text-lg">체어파크는 고객님의 건강과 성공을 응원합니다.</p>

                <div className="mb-12 grid gap-4 md:grid-cols-3">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                    <Image src="/chairpark-store-exterior.jpg" alt="Store 1" fill className="object-cover" />
                  </div>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                    <Image src="/chairpark-store-sign.jpg" alt="Store 2" fill className="object-cover" />
                  </div>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                    <Image src="/chairpark-store-interior.jpg" alt="Store 3" fill className="object-cover" />
                  </div>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                  <div>
                    <p className="mb-2 text-sm text-orange-400">연혁</p>
                    <p className="text-4xl font-bold">24년간</p>
                  </div>
                  <div>
                    <p className="mb-2 text-sm text-green-400">누적 판매량</p>
                    <p className="text-4xl font-bold">30만 대</p>
                  </div>
                  <div>
                    <p className="mb-2 text-sm text-red-400">직각 수리</p>
                    <p className="text-4xl font-bold">3천 건</p>
                  </div>
                </div>
              </div>

              {/* Product Specifications */}
              {product.specifications && (
                <div className="mt-16">
                  <h3 className="mb-6 text-2xl font-bold">제품 사양</h3>
                  <Card>
                    <CardContent className="p-6">
                      <dl className="space-y-3">
                        {Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between border-b pb-3">
                            <dt className="font-semibold text-neutral-700">{key}</dt>
                            <dd className="text-neutral-600">{value as string}</dd>
                          </div>
                        ))}
                      </dl>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="reviews" className="py-12">
              {reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                  <div className="mb-8 text-center">
                    <div className="mb-4 flex items-center justify-center gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-6 w-6 ${
                              star <= Math.round(reviewStats.average)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-neutral-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-2xl font-bold">{reviewStats.average.toFixed(1)}</span>
                    </div>
                    <p className="text-neutral-600">총 {reviewStats.count}개의 리뷰</p>
                  </div>

                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-6">
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-neutral-500">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="mb-2 font-semibold">{review.title}</h4>
                          <p className="mb-3 text-sm text-neutral-700">{review.comment}</p>
                          <p className="text-xs text-neutral-500">- {review.user_name}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center text-neutral-500">
                  <p>아직 작성된 리뷰가 없습니다.</p>
                  <p className="mt-2 text-sm">첫 번째 리뷰를 작성해보세요!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="qna" className="py-12">
              <div className="py-16 text-center text-neutral-500">
                <p>아직 등록된 문의가 없습니다.</p>
                <p className="mt-2 text-sm">궁금한 점이 있으시면 문의해주세요.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

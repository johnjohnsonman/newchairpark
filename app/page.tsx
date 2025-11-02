import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Store, Award, Wrench, Recycle, Newspaper, Sparkles, TrendingUp, Package } from "lucide-react"
import Image from "next/image"
import { StructuredData } from "@/components/structured-data"
import { NaverBookingButtonWhite } from "@/components/naver-booking-button"
import { PremiumCarousel } from "@/components/ui/premium-carousel"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "체어파크 | 월드 프리미엄 체어 스토어 - 허먼밀러, 스틸케이스 정품",
  description: "허먼밀러 에어론, 스틸케이스 제스처 등 세계적인 프리미엄 오피스 체어를 합리적인 가격에 만나보세요. 정품 보증, 전국 매장, 렌탈 서비스, 중고 거래까지 원스톱 체어 솔루션을 제공합니다.",
  keywords: [
    "허먼밀러",
    "스틸케이스", 
    "에어론 체어",
    "제스처 체어",
    "프리미엄 오피스 체어",
    "인체공학 의자",
    "오피스 체어",
    "에르고노믹 체어",
    "체어 렌탈",
    "중고 체어",
    "체어파크"
  ],
  openGraph: {
    title: "체어파크 | 프리미엄 오피스 가구 전문점",
    description: "허먼밀러, 스틸케이스 등 세계적인 프리미엄 오피스 체어를 합리적인 가격에",
    type: "website",
    locale: "ko_KR",
    siteName: "체어파크",
    images: [
      {
        url: "/herman-miller-aeron.png",
        width: 1200,
        height: 630,
        alt: "체어파크 프리미엄 오피스 체어",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "체어파크 | 프리미엄 오피스 가구 전문점",
    description: "허먼밀러, 스틸케이스 등 세계적인 프리미엄 오피스 체어를 합리적인 가격에",
    images: ["/herman-miller-aeron.png"],
  },
  alternates: {
    canonical: "https://newchairpark.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function Home() {
  return (
    <>
      <StructuredData type="organization" />
      <StructuredData type="website" />
      <div className="flex flex-col">
      {/* 헤더 배너 캐러셀 */}
      <section className="relative h-[60vh] md:h-[70vh] lg:h-[75vh] overflow-hidden">
        <PremiumCarousel />
      </section>


      <section className="px-4 py-8 sm:py-12">
        <div className="container mx-auto">
          <div className="mb-8 text-center sm:mb-10">
            <h2 className="mb-2 text-2xl font-bold sm:text-3xl">월드 프리미엄 체어 컬렉션</h2>
            <p className="text-sm text-muted-foreground sm:text-base">세계 최고의 프리미엄 체어 브랜드들</p>
          </div>
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <Link href="/store?category=office-chair" className="group relative overflow-hidden rounded-2xl shadow-lg">
              <div className="relative h-64 sm:h-80">
                <Image
                  src="/herman-miller-aeron.png"
                  alt="월드 프리미엄 체어"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white">
                  <h3 className="mb-2 text-xl font-bold sm:text-2xl">월드 프리미엄 체어</h3>
                  <p className="mb-3 text-xs sm:text-sm opacity-90">허먼밀러, 스틸케이스 월드 클래스 체어</p>
                  <span className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 transition-transform group-hover:translate-x-1">
                    자세히 보기 <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>

            <Link href="/recycle" className="group relative overflow-hidden rounded-2xl shadow-lg">
              <div className="relative h-64 sm:h-80">
                <Image
                  src="/steelcase-gesture-chair.jpg"
                  alt="프리미엄 중고 체어"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white">
                  <h3 className="mb-2 text-xl font-bold sm:text-2xl">프리미엄 중고 체어</h3>
                  <p className="mb-3 text-xs sm:text-sm opacity-90">월드 클래스 브랜드의 합리적 중고 체어</p>
                  <span className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 transition-transform group-hover:translate-x-1">
                    지도에서 보기 <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-12 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto">
          <div className="mb-8 text-center sm:mb-12">
            <h2 className="mb-2 text-2xl font-bold sm:text-3xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">스토어 카테고리</h2>
            <p className="text-sm text-muted-foreground sm:text-base">프리미엄 체어를 카테고리별로 만나보세요</p>
          </div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/store?category=office-chair" className="group">
              <Card className="overflow-hidden border-0 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-white h-full">
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-50">
                  <Image
                    src="/herman-miller-aeron.png"
                    alt="오피스 체어"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="rounded-lg bg-blue-100 p-2 group-hover:bg-blue-200 transition-colors">
                      <Store className="h-5 w-5 text-blue-700" />
                    </div>
                    <h3 className="text-lg font-bold sm:text-xl">오피스 체어</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">장시간 업무에 최적화된 인체공학 체어</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/store?category=executive-chair" className="group">
              <Card className="overflow-hidden border-0 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-amber-50 to-white h-full">
                <div className="relative h-48 bg-gradient-to-br from-amber-100 to-amber-50">
                  <Image
                    src="/herman-miller-embody-chair.jpg"
                    alt="임원용 체어"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="rounded-lg bg-amber-100 p-2 group-hover:bg-amber-200 transition-colors">
                      <Award className="h-5 w-5 text-amber-700" />
                    </div>
                    <h3 className="text-lg font-bold sm:text-xl">임원용 체어</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">프리미엄 디자인의 고급스러운 체어</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/store?category=lounge-chair" className="group">
              <Card className="overflow-hidden border-0 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-white h-full">
                <div className="relative h-48 bg-gradient-to-br from-purple-100 to-purple-50">
                  <Image
                    src="/steelcase-gesture-chair.jpg"
                    alt="라운지 체어"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="rounded-lg bg-purple-100 p-2 group-hover:bg-purple-200 transition-colors">
                      <Sparkles className="h-5 w-5 text-purple-700" />
                    </div>
                    <h3 className="text-lg font-bold sm:text-xl">라운지 체어</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">휴식과 편안함을 위한 럭셔리 체어</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/store?category=conference-chair" className="group">
              <Card className="overflow-hidden border-0 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-emerald-50 to-white h-full">
                <div className="relative h-48 bg-gradient-to-br from-emerald-100 to-emerald-50">
                  <Image
                    src="/steelcase-leap-chair.jpg"
                    alt="회의용 체어"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="rounded-lg bg-emerald-100 p-2 group-hover:bg-emerald-200 transition-colors">
                      <TrendingUp className="h-5 w-5 text-emerald-700" />
                    </div>
                    <h3 className="text-lg font-bold sm:text-xl">회의용 체어</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">효율적인 회의 공간을 위한 체어</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/store?category=dining-chair" className="group">
              <Card className="overflow-hidden border-0 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-rose-50 to-white h-full">
                <div className="relative h-48 bg-gradient-to-br from-rose-100 to-rose-50">
                  <Image
                    src="/herman-miller-aeron.png"
                    alt="다이닝 체어"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="rounded-lg bg-rose-100 p-2 group-hover:bg-rose-200 transition-colors">
                      <Package className="h-5 w-5 text-rose-700" />
                    </div>
                    <h3 className="text-lg font-bold sm:text-xl">다이닝 체어</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">식사 공간을 아름답게 만드는 체어</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/store?category=design-chair" className="group">
              <Card className="overflow-hidden border-0 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-indigo-50 to-white h-full">
                <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-indigo-50">
                  <Image
                    src="/herman-miller-embody-chair.jpg"
                    alt="디자인 체어"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="rounded-lg bg-indigo-100 p-2 group-hover:bg-indigo-200 transition-colors">
                      <Sparkles className="h-5 w-5 text-indigo-700" />
                    </div>
                    <h3 className="text-lg font-bold sm:text-xl">디자인 체어</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">아이코닉한 디자인의 특별한 체어</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/store?category=desk" className="group">
              <Card className="overflow-hidden border-0 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-teal-50 to-white h-full">
                <div className="relative h-48 bg-gradient-to-br from-teal-100 to-teal-50">
                  <Image
                    src="/steelcase-gesture-chair.jpg"
                    alt="데스크"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="rounded-lg bg-teal-100 p-2 group-hover:bg-teal-200 transition-colors">
                      <Package className="h-5 w-5 text-teal-700" />
                    </div>
                    <h3 className="text-lg font-bold sm:text-xl">데스크</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">업무 효율을 높이는 프리미엄 데스크</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/store?category=office-accessories" className="group">
              <Card className="overflow-hidden border-0 shadow-lg transition-all hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-white h-full">
                <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-50">
                  <Image
                    src="/herman-miller-aeron.png"
                    alt="오피스 악세서리"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="rounded-lg bg-orange-100 p-2 group-hover:bg-orange-200 transition-colors">
                      <Package className="h-5 w-5 text-orange-700" />
                    </div>
                    <h3 className="text-lg font-bold sm:text-xl">오피스 악세서리</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">오피스 공간을 완성하는 필수 아이템</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 sm:py-12">
        <div className="container mx-auto">
          <div className="mb-8 text-center sm:mb-10">
            <h2 className="mb-2 text-2xl font-bold sm:text-3xl">체어파크의 강점</h2>
            <p className="text-sm text-muted-foreground sm:text-base">고객님께 드리는 특별한 가치</p>
          </div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            <Card className="border-0 shadow-md bg-card">
              <CardContent className="p-4 text-center sm:p-6">
                <div className="mb-3 flex justify-center sm:mb-4">
                  <div className="rounded-2xl bg-primary/10 p-2 sm:p-3">
                    <Store className="h-8 w-8 text-primary sm:h-10 sm:w-10" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold sm:text-xl">전국 매장 네트워크</h3>
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  전국 주요 도시에 위치한 체어파크 매장에서 직접 체험해보세요
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-card">
              <CardContent className="p-4 text-center sm:p-6">
                <div className="mb-3 flex justify-center sm:mb-4">
                  <div className="rounded-2xl bg-primary/10 p-2 sm:p-3">
                    <Award className="h-8 w-8 text-primary sm:h-10 sm:w-10" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold sm:text-xl">정품 보증</h3>
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  허먼밀러, 스틸케이스 등 프리미엄 브랜드 정품만을 취급합니다
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-card">
              <CardContent className="p-4 text-center sm:p-6">
                <div className="mb-3 flex justify-center sm:mb-4">
                  <div className="rounded-2xl bg-primary/10 p-2 sm:p-3">
                    <Recycle className="h-8 w-8 text-primary sm:h-10 sm:w-10" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold sm:text-xl">합리적인 가격</h3>
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  특판가 문의 및 중고 거래로 더욱 합리적인 가격에 만나보세요
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 매장 방문 유도 섹션 */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-16 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">직접 앉아보고 선택하세요</h2>
            <p className="mb-6 text-lg opacity-90 sm:text-xl">체어파크만의 특별한 경험을 만나보세요</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-white/10 p-4">
                  <Store className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">실제 체험</h3>
              <p className="text-sm opacity-80">허먼밀러, 스틸케이스 등 모든 제품을 직접 앉아보고 선택하세요</p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-white/10 p-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">전문 상담</h3>
              <p className="text-sm opacity-80">인체공학 전문가가 맞춤형 솔루션을 제안해드립니다</p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-white/10 p-4">
                  <Package className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="mb-2 text-xl font-semibold">즉시 구매</h3>
              <p className="text-sm opacity-80">마음에 드는 제품을 바로 구매하고 당일 배송도 가능합니다</p>
            </div>
          </div>

          <div className="text-center">
            <div className="mb-6">
              <p className="text-lg opacity-90">온라인으로는 느낄 수 없는 진짜 편안함을 경험해보세요</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <NaverBookingButtonWhite className="w-full sm:w-auto">
                네이버 예약으로 바로 예약하기 <ArrowRight className="ml-2 h-5 w-5" />
              </NaverBookingButtonWhite>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white bg-transparent text-white hover:bg-white/10 w-full sm:w-auto"
                asChild
              >
                <Link href="/store">온라인 스토어 보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}

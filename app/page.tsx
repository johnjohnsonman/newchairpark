import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Store, Award, Wrench, Recycle, Newspaper, Sparkles, TrendingUp, Package } from "lucide-react"
import Image from "next/image"
import type { Metadata } from "next"
import { StructuredData } from "@/components/structured-data"

export const metadata: Metadata = {
  title: "체어파크 | 프리미엄 오피스 가구 전문점 - 허먼밀러, 스틸케이스 정품",
  description: "허먼밀러 에어론, 스틸케이스 제스처 등 세계적인 프리미엄 오피스 체어를 합리적인 가격에 만나보세요. 정품 보증, 전국 매장, 렌탈 서비스, 중고 거래까지 원스톱 가구 솔루션을 제공합니다.",
  keywords: [
    "허먼밀러",
    "스틸케이스", 
    "에어론 체어",
    "제스처 체어",
    "프리미엄 오피스 체어",
    "인체공학 의자",
    "오피스 가구",
    "스탠딩 데스크",
    "가구 렌탈",
    "중고 가구",
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
    canonical: "https://chairpark.co.kr",
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
      <section className="relative bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto flex flex-col lg:flex-row">
          <div className="flex flex-1 items-center px-4 py-8 sm:px-6 lg:py-10">
            <div className="w-full max-w-2xl text-center lg:text-left">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-sm border">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>프리미엄 오피스 가구 전문</span>
              </div>
              <h1 className="mb-3 text-balance text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                chairpark
                <br />
                <span className="text-primary">world premium chair store</span>
              </h1>
              <p className="mb-5 max-w-xl mx-auto lg:mx-0 text-pretty text-sm leading-relaxed text-foreground/80 sm:text-base">
                허먼밀러, 스틸케이스 등 세계적인 브랜드부터 합리적인 중고 가구까지
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Button size="default" className="shadow-lg" asChild>
                  <Link href="/store">
                    제품 둘러보기 <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="default" variant="outline" className="bg-white shadow-sm" asChild>
                  <Link href="/gallery">갤러리 보기</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex w-56 flex-col gap-2.5 bg-slate-900 p-5 text-white">
            <div className="mb-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider opacity-60">빠른 메뉴</h3>
            </div>
            <Link
              href="/store"
              className="group flex items-center justify-between rounded-lg bg-white/10 p-4 transition-all hover:bg-white/20"
            >
              <span className="text-sm font-semibold">스토어</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/recycle"
              className="group flex items-center justify-between rounded-lg bg-white/10 p-4 transition-all hover:bg-white/20"
            >
              <span className="text-sm font-semibold">리싸이클</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/rental"
              className="group flex items-center justify-between rounded-lg bg-white/10 p-4 transition-all hover:bg-white/20"
            >
              <span className="text-sm font-semibold">렌탈</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/brand"
              className="group flex items-center justify-between rounded-lg bg-white/10 p-4 transition-all hover:bg-white/20"
            >
              <span className="text-sm font-semibold">브랜드</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            <div className="my-3 border-t border-white/20" />

            <div className="mb-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider opacity-60">인기 제품</h3>
            </div>
            <Link href="/store?category=office-chair" className="group rounded-lg bg-white/10 p-3 transition-all hover:bg-white/20">
              <div className="mb-1.5 flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">오피스 체어</span>
              </div>
              <p className="text-xs opacity-75">허먼밀러 에어론 외 다수</p>
            </Link>
            <Link href="/store/책상" className="group rounded-lg bg-white/10 p-3 transition-all hover:bg-white/20">
              <div className="mb-1.5 flex items-center gap-2">
                <Package className="h-3.5 w-3.5" />
                <span className="text-xs font-semibold">스탠딩 데스크</span>
              </div>
              <p className="text-xs opacity-75">전동 높이조절 책상</p>
            </Link>

            <div className="my-3 border-t border-white/20" />

            <Link href="/bulk-inquiry" className="rounded-lg bg-primary p-4 transition-all hover:bg-primary/90">
              <p className="text-sm font-semibold mb-0.5">특판가 문의</p>
              <p className="text-xs opacity-90">대량 구매 시 특별 할인</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-8 sm:py-12">
        <div className="container mx-auto">
          <div className="mb-8 text-center sm:mb-10">
            <h2 className="mb-2 text-2xl font-bold sm:text-3xl">인기 카테고리</h2>
            <p className="text-sm text-muted-foreground sm:text-base">체어파크에서 가장 사랑받는 제품들</p>
          </div>
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <Link href="/store?category=office-chair" className="group relative overflow-hidden rounded-2xl shadow-lg">
              <div className="relative h-64 sm:h-80">
                <Image
                  src="/herman-miller-aeron.png"
                  alt="프리미엄 오피스 체어"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white">
                  <h3 className="mb-2 text-xl font-bold sm:text-2xl">프리미엄 오피스 체어</h3>
                  <p className="mb-3 text-xs sm:text-sm opacity-90">허먼밀러, 스틸케이스 정품 의자</p>
                  <span className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 transition-transform group-hover:translate-x-1">
                    자세히 보기 <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>

            <Link href="/recycle" className="group relative overflow-hidden rounded-2xl shadow-lg">
              <div className="relative h-64 sm:h-80">
                <Image
                  src="/modern-gray-sofa.png"
                  alt="리싸이클 마켓"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 text-white">
                  <h3 className="mb-2 text-xl font-bold sm:text-2xl">리싸이클 마켓</h3>
                  <p className="mb-3 text-xs sm:text-sm opacity-90">합리적인 가격의 프리미엄 중고 가구</p>
                  <span className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 transition-transform group-hover:translate-x-1">
                    지도에서 보기 <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-8 sm:py-12">
        <div className="container mx-auto">
          <div className="mb-8 text-center sm:mb-10">
            <h2 className="mb-2 text-2xl font-bold sm:text-3xl">다양한 서비스</h2>
            <p className="text-sm text-muted-foreground sm:text-base">체어파크가 제공하는 맞춤 솔루션</p>
          </div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            <Link href="/rental" className="group">
              <Card className="overflow-hidden border-0 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-48">
                  <Image
                    src="/office-desk.png"
                    alt="가구 렌탈"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="mb-2 text-lg font-bold sm:text-xl">가구 렌탈 서비스</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">부담없이 시작하는 프리미엄 가구 렌탈</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/repair" className="group">
              <Card className="overflow-hidden border-0 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-40 sm:h-48" style={{ backgroundColor: "var(--pastel-lavender)" }}>
                  <div className="flex h-full items-center justify-center">
                    <Wrench className="h-16 w-16 text-primary sm:h-20 sm:w-20" />
                  </div>
                </div>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="mb-2 text-lg font-bold sm:text-xl">전문 수리 서비스</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">오피스 체어 전문 수리 및 A/S</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/news" className="group">
              <Card className="overflow-hidden border-0 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="relative h-40 sm:h-48" style={{ backgroundColor: "var(--warm-gray)" }}>
                  <div className="flex h-full items-center justify-center">
                    <Newspaper className="h-16 w-16 text-primary sm:h-20 sm:w-20" />
                  </div>
                </div>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="mb-2 text-lg font-bold sm:text-xl">최신 소식</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">체어파크의 새로운 소식과 이벤트</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-8 sm:py-12">
        <div className="container mx-auto">
          <div className="mb-8 text-center sm:mb-10">
            <h2 className="mb-2 text-2xl font-bold sm:text-3xl">체어파크의 강점</h2>
            <p className="text-sm text-muted-foreground sm:text-base">고객님께 드리는 특별한 가치</p>
          </div>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            <Card className="border-0 shadow-md">
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

            <Card className="border-0 shadow-md">
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

            <Card className="border-0 shadow-md">
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
              <Button size="lg" className="bg-white text-slate-900 shadow-lg hover:bg-white/90 w-full sm:w-auto" asChild>
                <Link href="/store-visit">
                  매장 방문 예약하기 <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
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

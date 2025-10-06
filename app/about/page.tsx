import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Truck, Store, Award, Users, Clock } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const features = [
    {
      icon: Truck,
      title: "당일 출고",
      description: "재고 보유 제품은 당일 출고가 가능합니다",
    },
    {
      icon: Store,
      title: "매장 전시",
      description: "실제 제품을 매장에서 직접 체험해보실 수 있습니다",
    },
    {
      icon: Award,
      title: "프리미엄 브랜드",
      description: "허먼밀러, 스틸케이스 등 세계적인 브랜드 제품 취급",
    },
    {
      icon: Users,
      title: "전문 상담",
      description: "가구 전문가의 1:1 맞춤 상담 서비스",
    },
    {
      icon: CheckCircle2,
      title: "특판가 문의",
      description: "대량 구매 시 특별 할인 혜택 제공",
    },
    {
      icon: Clock,
      title: "A/S 지원",
      description: "구매 후 전문적인 수리 및 유지보수 서비스",
    },
  ]

  const values = [
    {
      title: "품질",
      description: "세계 최고 수준의 프리미엄 가구만을 엄선하여 제공합니다",
    },
    {
      title: "신뢰",
      description: "정품 보증과 투명한 가격 정책으로 고객의 신뢰를 얻습니다",
    },
    {
      title: "서비스",
      description: "구매 전 상담부터 A/S까지 완벽한 고객 서비스를 제공합니다",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">체어파크에 오신 것을 환영합니다</h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              프리미엄 오피스 가구의 모든 것, 체어파크는 허먼밀러, 스틸케이스 등 세계적인 브랜드의 정품 가구를 합리적인
              가격에 제공하는 전문 쇼룸입니다.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/store">제품 둘러보기</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/gallery">갤러리 보기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">체어파크의 강점</h2>
            <p className="text-muted-foreground">고객 만족을 위한 체어파크만의 특별한 서비스</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <feature.icon className="mb-4 h-10 w-10 text-primary" />
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">우리의 가치</h2>
            <p className="text-muted-foreground">체어파크가 추구하는 핵심 가치</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-2xl font-bold text-primary">{index + 1}</span>
                </div>
                <h3 className="mb-3 text-2xl font-bold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold">체어파크 소개</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                체어파크는 프리미엄 오피스 가구 전문 쇼룸으로, 허먼밀러(Herman Miller), 스틸케이스(Steelcase) 등
                세계적인 브랜드의 정품 가구를 국내에 공급하고 있습니다.
              </p>
              <p>
                우리는 단순히 가구를 판매하는 것을 넘어, 고객의 업무 환경과 라이프스타일을 개선하는 것을 목표로 합니다.
                인체공학적으로 설계된 프리미엄 의자부터 기능적이고 아름다운 책상, 수납장까지 다양한 제품을 직접 체험하실
                수 있는 쇼룸을 운영하고 있습니다.
              </p>
              <p>
                재고 보유 제품은 당일 출고가 가능하며, 대량 구매 시 특별 할인 혜택을 제공합니다. 또한 구매 후에도
                전문적인 수리 및 유지보수 서비스를 통해 오랫동안 제품을 사용하실 수 있도록 지원합니다.
              </p>
              <p>
                중고 가구 매매 서비스도 운영하여, 합리적인 가격에 프리미엄 가구를 경험하실 수 있는 기회를 제공하고
                있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">지금 바로 방문하세요</h2>
          <p className="mb-8 text-lg opacity-90">매장에서 직접 제품을 체험하고 전문가의 상담을 받아보세요</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link href="/store">스토어 방문하기</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              <Link href="/recycle">중고마켓 보기</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewsPage() {
  const news = [
    {
      title: "2024 신제품 라인업 공개",
      date: "2024.03.15",
      summary: "올해의 새로운 가구 컬렉션을 만나보세요",
      image: "/new-furniture-collection.jpg",
    },
    {
      title: "봄맞이 특별 할인 이벤트",
      date: "2024.03.10",
      summary: "최대 40% 할인 혜택을 놓치지 마세요",
      image: "/spring-sale-event.jpg",
    },
    {
      title: "체어파크 분당점 오픈",
      date: "2024.03.01",
      summary: "새로운 매장에서 더 많은 제품을 만나보세요",
      image: "/furniture-store-opening.jpg",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold">소식</h1>
        <p className="text-lg text-muted-foreground">체어파크의 최신 소식과 이벤트를 확인하세요</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <Card key={item.title} className="overflow-hidden">
            <img src={item.image || "/placeholder.svg"} alt={item.title} className="h-48 w-full object-cover" />
            <CardHeader>
              <div className="mb-2 text-sm text-muted-foreground">{item.date}</div>
              <CardTitle className="text-xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{item.summary}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

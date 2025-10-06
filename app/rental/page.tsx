import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function RentalPage() {
  const plans = [
    {
      name: "베이직 플랜",
      price: "월 29,000원",
      features: ["기본 가구 3종", "무료 배송 및 설치", "6개월 최소 계약"],
    },
    {
      name: "스탠다드 플랜",
      price: "월 49,000원",
      features: ["프리미엄 가구 5종", "무료 배송 및 설치", "3개월 최소 계약", "무료 교체 1회"],
    },
    {
      name: "프리미엄 플랜",
      price: "월 79,000원",
      features: ["럭셔리 가구 무제한", "무료 배송 및 설치", "계약 기간 자유", "무료 교체 무제한"],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold">렌탈 서비스</h1>
        <p className="text-lg text-muted-foreground">부담없이 시작하는 가구 렌탈 서비스</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <p className="text-3xl font-bold text-primary">{plan.price}</p>
            </CardHeader>
            <CardContent>
              <ul className="mb-6 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full">신청하기</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

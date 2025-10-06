import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function RepairPage() {
  const services = [
    "가구 표면 복원 및 재도장",
    "의자 및 소파 쿠션 교체",
    "목재 가구 수리 및 보강",
    "금속 부품 교체 및 용접",
    "가죽 소파 복원",
    "서랍 레일 및 경첩 교체",
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold">수리 서비스</h1>
        <p className="text-lg text-muted-foreground">전문 가구 수리 및 유지보수 서비스를 제공합니다</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>수리 서비스 항목</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service} className="flex items-start gap-2">
                  <CheckCircle className="mt-1 h-5 w-5 text-green-600" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>수리 문의</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">가구 수리가 필요하신가요? 전문 상담사가 친절하게 안내해드립니다.</p>
            <div className="space-y-2">
              <p className="font-semibold">고객센터: 1588-1234</p>
              <p className="text-sm text-muted-foreground">평일 09:00 - 18:00 (주말 및 공휴일 휴무)</p>
            </div>
            <Button className="w-full">수리 신청하기</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

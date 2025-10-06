import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { XCircle } from "lucide-react"

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-12 pb-8 text-center space-y-6">
            <div className="flex justify-center">
              <XCircle className="h-20 w-20 text-destructive" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold">결제가 취소되었습니다</h1>
              <p className="text-muted-foreground">결제를 취소하셨습니다. 다시 시도해주세요.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/cart" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  장바구니로 돌아가기
                </Button>
              </Link>
              <Link href="/recycle-market" className="flex-1">
                <Button className="w-full">계속 쇼핑하기</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

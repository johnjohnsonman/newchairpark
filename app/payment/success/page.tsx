import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export default async function PaymentSuccessPage({ searchParams }: { searchParams: { orderId?: string } }) {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect("/auth/login")
  }

  if (!searchParams.orderId) {
    redirect("/my-page/orders")
  }

  // Fetch order details
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", searchParams.orderId)
    .eq("user_id", user.id)
    .single()

  if (!order) {
    redirect("/my-page/orders")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-12 pb-8 text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 className="h-20 w-20 text-green-500" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold">결제가 완료되었습니다</h1>
              <p className="text-muted-foreground">주문이 성공적으로 처리되었습니다</p>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문번호</span>
                <span className="font-mono">{order.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">결제 금액</span>
                <span className="font-bold text-lg">{order.total_amount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">결제 방법</span>
                <span>네이버페이</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link href="/my-page/orders" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  주문 내역 보기
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

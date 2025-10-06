"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { Loader2 } from "lucide-react"

interface OrderItem {
  id: string
  product_title: string
  product_price: number
  product_image_url: string | null
  quantity: number
}

interface Order {
  id: string
  total_amount: number
  status: string
  shipping_name: string | null
  shipping_phone: string | null
  shipping_address: string | null
  order_items: OrderItem[]
}

interface NaverPayButtonProps {
  order: Order
}

export function NaverPayButton({ order }: NaverPayButtonProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // In a real implementation, you would load the Naver Pay SDK here
  useEffect(() => {
    // Load Naver Pay SDK script
    const script = document.createElement("script")
    script.src = "https://nsp.pay.naver.com/sdk/js/naverpay.min.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handlePayment = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // In a real implementation, you would:
      // 1. Call your backend to create a Naver Pay payment request
      // 2. Get the payment URL or token
      // 3. Redirect to Naver Pay or open the payment window

      // For demo purposes, we'll simulate a successful payment
      // In production, this would be handled by Naver Pay callbacks

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update order status
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id)

      if (updateError) throw updateError

      // Redirect to success page
      router.push(`/payment/success?orderId=${order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "결제 처리 중 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>주문 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={item.product_image_url || "/placeholder.svg?height=80&width=80"}
                  alt={item.product_title}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{item.product_title}</h3>
                <p className="text-sm text-muted-foreground">수량: {item.quantity}</p>
                <p className="font-bold text-primary">{item.product_price.toLocaleString()}원</p>
              </div>
            </div>
          ))}

          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between">
              <span className="text-muted-foreground">받는 사람</span>
              <span>{order.shipping_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">연락처</span>
              <span>{order.shipping_phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">배송 주소</span>
              <span className="text-right">{order.shipping_address}</span>
            </div>
          </div>

          <div className="flex justify-between text-xl font-bold pt-4 border-t">
            <span>총 결제 금액</span>
            <span className="text-primary">{order.total_amount.toLocaleString()}원</span>
          </div>
        </CardContent>
      </Card>

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#03C75A] rounded flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <div>
                <h3 className="font-bold">네이버페이</h3>
                <p className="text-sm text-muted-foreground">안전하고 간편한 결제</p>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-[#03C75A] hover:bg-[#02B350]"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  결제 처리 중...
                </>
              ) : (
                "네이버페이로 결제하기"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              결제 버튼을 클릭하면 네이버페이 결제 페이지로 이동합니다
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="ghost" onClick={() => router.push("/my-page/orders")}>
          주문 내역으로 돌아가기
        </Button>
      </div>
    </div>
  )
}

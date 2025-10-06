"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Package } from "lucide-react"

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
  payment_method: string | null
  shipping_address: string | null
  created_at: string
  order_items: OrderItem[]
}

interface OrdersListProps {
  orders: Order[]
}

const statusLabels: Record<string, string> = {
  pending: "결제 대기",
  paid: "결제 완료",
  shipped: "배송 중",
  delivered: "배송 완료",
  cancelled: "취소됨",
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  paid: "secondary",
  shipped: "default",
  delivered: "default",
  cancelled: "destructive",
}

export function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">주문 내역이 없습니다</h2>
        <p className="text-muted-foreground">중고마켓에서 상품을 구매해보세요</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">주문번호: {order.id.slice(0, 8)}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(order.created_at).toLocaleDateString("ko-KR")}
                </p>
              </div>
              <Badge variant={statusColors[order.status] || "default"}>
                {statusLabels[order.status] || order.status}
              </Badge>
            </div>
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

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="font-semibold">총 결제 금액</span>
              <span className="text-xl font-bold text-primary">{order.total_amount.toLocaleString()}원</span>
            </div>

            {order.shipping_address && (
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold mb-1">배송 주소</p>
                <p>{order.shipping_address}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

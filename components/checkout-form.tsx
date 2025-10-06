"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

interface CartItem {
  id: string
  quantity: number
  product_id: string
  recycle_items: {
    id: string
    title: string
    price: number | null
    image_url: string | null
    status: string | null
  } | null
}

interface Profile {
  display_name: string | null
  phone: string | null
  address: string | null
}

interface CheckoutFormProps {
  cartItems: CartItem[]
  profile: Profile | null
  userId: string
}

export function CheckoutForm({ cartItems, profile, userId }: CheckoutFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    shipping_name: profile?.display_name || "",
    shipping_phone: profile?.phone || "",
    shipping_address: profile?.address || "",
  })

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = item.recycle_items?.price || 0
    return sum + price * item.quantity
  }, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: userId,
            total_amount: totalAmount,
            status: "pending",
            payment_method: "naver_pay",
            ...formData,
          },
        ])
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_title: item.recycle_items?.title || "",
        product_price: item.recycle_items?.price || 0,
        product_image_url: item.recycle_items?.image_url,
        quantity: item.quantity,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart
      const { error: clearError } = await supabase.from("cart_items").delete().eq("user_id", userId)

      if (clearError) throw clearError

      // Redirect to payment page
      router.push(`/payment/${order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "주문 처리 중 오류가 발생했습니다")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>배송 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shipping_name">받는 사람 *</Label>
            <Input
              id="shipping_name"
              required
              value={formData.shipping_name}
              onChange={(e) => setFormData({ ...formData, shipping_name: e.target.value })}
              placeholder="이름"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shipping_phone">연락처 *</Label>
            <Input
              id="shipping_phone"
              required
              value={formData.shipping_phone}
              onChange={(e) => setFormData({ ...formData, shipping_phone: e.target.value })}
              placeholder="010-1234-5678"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shipping_address">배송 주소 *</Label>
            <Textarea
              id="shipping_address"
              required
              value={formData.shipping_address}
              onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
              placeholder="주소를 입력하세요"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>주문 상품</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartItems.map((item) => {
            const product = item.recycle_items
            if (!product) return null

            return (
              <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={product.image_url || "/placeholder.svg?height=80&width=80"}
                    alt={product.title}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">수량: {item.quantity}</p>
                  <p className="font-bold text-primary">{product.price?.toLocaleString()}원</p>
                </div>
              </div>
            )
          })}

          <div className="flex justify-between text-lg font-bold pt-4 border-t">
            <span>총 결제 금액</span>
            <span className="text-primary">{totalAmount.toLocaleString()}원</span>
          </div>
        </CardContent>
      </Card>

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        {isLoading ? "처리 중..." : "네이버페이로 결제하기"}
      </Button>
    </form>
  )
}

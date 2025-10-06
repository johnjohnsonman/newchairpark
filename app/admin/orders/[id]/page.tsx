import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Package, User, MapPin, CreditCard, Calendar, Phone, Mail } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const supabase = await createServerClient()

  // 주문 상세 정보 조회
  const { data: order } = await supabase
    .from("orders")
    .select(`
      *,
      profiles!inner(display_name, email, phone, address),
      order_items(
        id,
        product_title,
        product_price,
        product_image_url,
        quantity
      )
    `)
    .eq("id", params.id)
    .single()

  if (!order) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "대기", className: "bg-blue-100 text-blue-700" },
      processing: { label: "처리중", className: "bg-yellow-100 text-yellow-700" },
      shipped: { label: "배송중", className: "bg-purple-100 text-purple-700" },
      completed: { label: "완료", className: "bg-green-100 text-green-700" },
      cancelled: { label: "취소", className: "bg-red-100 text-red-700" },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const handleStatusUpdate = async (newStatus: string) => {
    'use server'
    const supabase = await createServerClient()
    
    await supabase
      .from("orders")
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq("id", params.id)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              주문 상세 #{order.id.slice(-8)}
            </h1>
            <p className="text-muted-foreground mt-2">
              {new Date(order.created_at).toLocaleString("ko-KR")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(order.status)}
            <Select defaultValue={order.status}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">대기</SelectItem>
                <SelectItem value="processing">처리중</SelectItem>
                <SelectItem value="shipped">배송중</SelectItem>
                <SelectItem value="completed">완료</SelectItem>
                <SelectItem value="cancelled">취소</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 주문 정보 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 주문 상품 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                주문 상품
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 relative overflow-hidden">
                      {item.product_image_url ? (
                        <Image
                          src={item.product_image_url}
                          alt={item.product_title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product_title}</h4>
                      <p className="text-sm text-muted-foreground">수량: {item.quantity}개</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {(item.product_price * item.quantity).toLocaleString()}원
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.product_price.toLocaleString()}원 × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>총 주문 금액</span>
                  <span>{order.total_amount?.toLocaleString()}원</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 배송 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                배송 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">수령인</label>
                  <p className="font-medium">{order.shipping_name || order.profiles?.display_name || '미입력'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">연락처</label>
                  <p className="font-medium">{order.shipping_phone || order.profiles?.phone || '미입력'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">배송 주소</label>
                  <p className="font-medium">{order.shipping_address || order.profiles?.address || '미입력'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 고객 정보 및 주문 요약 */}
        <div className="space-y-6">
          {/* 고객 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                고객 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{order.profiles?.email}</span>
              </div>
              {order.profiles?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{order.profiles.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  가입일: {new Date(order.profiles?.created_at || '').toLocaleDateString("ko-KR")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 주문 요약 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                주문 요약
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문번호</span>
                <span className="font-mono text-sm">{order.id.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문일시</span>
                <span className="text-sm">
                  {new Date(order.created_at).toLocaleString("ko-KR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">결제 방법</span>
                <span className="text-sm">{order.payment_method || '미입력'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문 상태</span>
                {getStatusBadge(order.status)}
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between text-lg font-semibold">
                  <span>총 결제 금액</span>
                  <span>{order.total_amount?.toLocaleString()}원</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 액션 버튼 */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Button className="w-full" size="sm">
                  주문 상태 업데이트
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  배송 정보 수정
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  고객에게 연락
                </Button>
                {order.status === 'pending' && (
                  <Button variant="destructive" className="w-full" size="sm">
                    주문 취소
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

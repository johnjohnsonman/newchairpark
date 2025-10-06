import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default async function OrdersManagementPage() {
  const supabase = await createServerClient()

  // 주문 데이터 조회 (프로필 정보와 함께)
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      profiles!inner(display_name, email, phone),
      order_items(
        id,
        product_title,
        product_price,
        quantity,
        product_image_url
      )
    `)
    .order("created_at", { ascending: false })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "대기", className: "bg-blue-100 text-blue-700" },
      processing: { label: "처리중", className: "bg-yellow-100 text-yellow-700" },
      completed: { label: "완료", className: "bg-green-100 text-green-700" },
      cancelled: { label: "취소", className: "bg-red-100 text-red-700" },
      shipped: { label: "배송중", className: "bg-purple-100 text-purple-700" },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Package className="w-4 h-4" />
      case 'processing':
        return <Truck className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Package className="w-4 h-4" />
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">주문 관리</h1>
        <p className="text-muted-foreground mt-2">전체 주문을 관리하고 상태를 업데이트하세요</p>
      </div>

      {/* 필터 및 검색 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="주문번호, 고객명, 이메일로 검색..."
                  className="pl-10"
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="상태별 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체 주문</SelectItem>
                <SelectItem value="pending">대기 중</SelectItem>
                <SelectItem value="processing">처리 중</SelectItem>
                <SelectItem value="shipped">배송 중</SelectItem>
                <SelectItem value="completed">완료</SelectItem>
                <SelectItem value="cancelled">취소</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 주문 목록 */}
      <div className="space-y-4">
        {orders && orders.length > 0 ? (
          orders.map((order: any) => (
            <Card key={order.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      {getStatusBadge(order.status)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">주문 #{order.id.slice(-8)}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleString("ko-KR")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{order.total_amount?.toLocaleString()}원</p>
                    <p className="text-sm text-muted-foreground">
                      {order.order_items?.length || 0}개 상품
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 고객 정보 */}
                  <div>
                    <h4 className="font-medium mb-2">고객 정보</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>이름:</strong> {order.profiles?.display_name || order.shipping_name || '미입력'}</p>
                      <p><strong>이메일:</strong> {order.profiles?.email || '미입력'}</p>
                      <p><strong>연락처:</strong> {order.shipping_phone || order.profiles?.phone || '미입력'}</p>
                    </div>
                  </div>

                  {/* 배송 정보 */}
                  <div>
                    <h4 className="font-medium mb-2">배송 정보</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>수령인:</strong> {order.shipping_name || '미입력'}</p>
                      <p><strong>연락처:</strong> {order.shipping_phone || '미입력'}</p>
                      <p><strong>주소:</strong> {order.shipping_address || '미입력'}</p>
                    </div>
                  </div>

                  {/* 주문 상품 */}
                  <div>
                    <h4 className="font-medium mb-2">주문 상품</h4>
                    <div className="space-y-2">
                      {order.order_items?.slice(0, 2).map((item: any) => (
                        <div key={item.id} className="flex items-center gap-2 text-sm">
                          <div className="w-8 h-8 bg-gray-100 rounded flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="truncate">{item.product_title}</p>
                            <p className="text-muted-foreground">수량: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.order_items?.length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          외 {order.order_items.length - 2}개 상품
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/orders/${order.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      상세보기
                    </Link>
                  </Button>
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
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">주문이 없습니다</h3>
              <p className="text-muted-foreground">아직 등록된 주문이 없습니다.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

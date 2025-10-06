import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, TrendingUp, ArrowUpRight, Tag, ImageIcon, Recycle, Users, ShoppingCart, AlertTriangle, Mail } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"

export default async function AdminDashboard() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 기본 카운트 데이터
  const [{ count: productsCount }, { count: brandsCount }, { count: galleryCount }, { count: recycleCount }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("brands").select("*", { count: "exact", head: true }),
      supabase.from("gallery").select("*", { count: "exact", head: true }),
      supabase.from("recycle_items").select("*", { count: "exact", head: true }),
    ])

  // 사용자 관련 데이터
  const [{ count: usersCount }, { count: ordersCount }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
  ])

  // 매출 데이터
  const { data: salesData } = await supabase
    .from("orders")
    .select("total_amount, created_at, status")
    .eq("status", "completed")

  const totalSales = salesData?.reduce((sum, order) => sum + order.total_amount, 0) || 0

  // 주문 상태별 카운트
  const [
    { count: pendingOrders },
    { count: processingOrders },
    { count: completedOrders },
    { count: cancelledOrders }
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "processing"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "cancelled"),
  ])

  // 재고 부족 상품
  const { count: outOfStockCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("in_stock", false)

  // 최근 등록 상품
  const { data: recentProducts } = await supabase
    .from("products")
    .select("id, name, price, created_at, in_stock")
    .order("created_at", { ascending: false })
    .limit(5)

  // 최근 주문
  const { data: recentOrders } = await supabase
    .from("orders")
    .select(`
      id,
      total_amount,
      status,
      created_at,
      shipping_name,
      profiles!inner(display_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          {new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">회원수</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{usersCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              전체 회원
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">구매건수</CardTitle>
            <ShoppingCart className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{ordersCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">총 주문 수</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">매출</CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{(totalSales / 100000000).toFixed(1)}억</div>
            <p className="text-xs text-muted-foreground mt-1">완료된 주문 매출</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">상품 수</CardTitle>
            <Package className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{productsCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">등록된 상품</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className={`${(pendingOrders || 0) > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${(pendingOrders || 0) > 0 ? 'text-red-900' : 'text-green-900'}`}>
                  대기 중인 주문
                </p>
                <p className={`text-2xl font-bold mt-1 ${(pendingOrders || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {pendingOrders || 0}건
                </p>
              </div>
              <Package className={`w-8 h-8 ${(pendingOrders || 0) > 0 ? 'text-red-600' : 'text-green-600'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={`${(processingOrders || 0) > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${(processingOrders || 0) > 0 ? 'text-yellow-900' : 'text-gray-900'}`}>
                  처리 중인 주문
                </p>
                <p className={`text-2xl font-bold mt-1 ${(processingOrders || 0) > 0 ? 'text-yellow-600' : 'text-gray-600'}`}>
                  {processingOrders || 0}건
                </p>
              </div>
              <ShoppingCart className={`w-8 h-8 ${(processingOrders || 0) > 0 ? 'text-yellow-600' : 'text-gray-600'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className={`${(outOfStockCount || 0) > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${(outOfStockCount || 0) > 0 ? 'text-red-900' : 'text-green-900'}`}>
                  품절 상품
                </p>
                <p className={`text-2xl font-bold mt-1 ${(outOfStockCount || 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {outOfStockCount || 0}개
                </p>
              </div>
              <AlertTriangle className={`w-8 h-8 ${(outOfStockCount || 0) > 0 ? 'text-red-600' : 'text-green-600'}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">완료된 주문</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{completedOrders || 0}건</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">최근 주문</CardTitle>
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm" className="gap-1">
                  전체보기
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-3 border-b last:border-0 border-border/50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{order.profiles?.display_name || order.shipping_name || '고객'}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.created_at).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold">{order.total_amount?.toLocaleString()}원</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'completed' ? "bg-green-100 text-green-700" :
                          order.status === 'processing' ? "bg-yellow-100 text-yellow-700" :
                          order.status === 'pending' ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status === 'completed' ? '완료' :
                         order.status === 'processing' ? '처리중' :
                         order.status === 'pending' ? '대기' :
                         order.status === 'cancelled' ? '취소' : order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">주문이 없습니다</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">빠른 작업</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/orders">
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" size="sm">
                <ShoppingCart className="w-4 h-4" />
                주문 관리
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" size="sm">
                <Users className="w-4 h-4" />
                사용자 관리
              </Button>
            </Link>
            <Link href="/admin/products/new">
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" size="sm">
                <Package className="w-4 h-4" />
                상품 추가
              </Button>
            </Link>
            <Link href="/admin/brands/new">
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" size="sm">
                <Tag className="w-4 h-4" />
                브랜드 추가
              </Button>
            </Link>
            <Link href="/admin/gallery/new">
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" size="sm">
                <ImageIcon className="w-4 h-4" />
                갤러리 추가
              </Button>
            </Link>
            <Link href="/admin/recycle-market/new">
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" size="sm">
                <Recycle className="w-4 h-4" />
                중고상품 추가
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

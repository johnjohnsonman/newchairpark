import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, ShoppingBag, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"

interface UserDetailPageProps {
  params: {
    id: string
  }
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const supabase = await createServerClient()

  // 사용자 프로필 정보 조회
  const { data: profile } = await supabase
    .from("profiles")
    .select(`
      *,
      user_roles!left(role)
    `)
    .eq("id", params.id)
    .single()

  if (!profile) {
    notFound()
  }

  // 사용자의 주문 내역 조회
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      order_items(
        id,
        product_title,
        product_price,
        quantity
      )
    `)
    .eq("user_id", params.id)
    .order("created_at", { ascending: false })

  // 주문 통계 계산
  const totalOrders = orders?.length || 0
  const completedOrders = orders?.filter(order => order.status === 'completed') || []
  const totalSpent = completedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
  const averageOrderValue = completedOrders.length > 0 ? totalSpent / completedOrders.length : 0

  // 최근 주문 (최대 5개)
  const recentOrders = orders?.slice(0, 5) || []

  const getRoleBadge = (role: string | null) => {
    if (role === 'admin') {
      return <Badge className="bg-red-100 text-red-700">관리자</Badge>
    }
    return <Badge className="bg-blue-100 text-blue-700">일반 사용자</Badge>
  }

  const getOrderStatusBadge = (status: string) => {
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

  const getUserInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
  }

  const handleRoleUpdate = async (newRole: string) => {
    'use server'
    const supabase = await createServerClient()
    
    if (newRole === 'admin') {
      await supabase
        .from("user_roles")
        .upsert({
          user_id: params.id,
          role: 'admin'
        })
    } else {
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", params.id)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="w-4 h-4 mr-2" />
              목록으로
            </Link>
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile.avatar_url || ''} />
              <AvatarFallback className="text-lg">
                {getUserInitials(profile.display_name || profile.email || '')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {profile.display_name || '이름 없음'}
              </h1>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getRoleBadge(profile.user_roles?.role)}
            {profile.user_roles?.role !== 'admin' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleRoleUpdate('admin')}
              >
                <Shield className="w-4 h-4 mr-2" />
                관리자 권한 부여
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 사용자 정보 및 통계 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">이름</label>
                    <p className="font-medium">{profile.display_name || '미입력'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">이메일</label>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">연락처</label>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {profile.phone || '미입력'}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">주소</label>
                    <p className="font-medium flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {profile.address || '미입력'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">가입일</label>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(profile.created_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">마지막 업데이트</label>
                    <p className="font-medium">
                      {new Date(profile.updated_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 주문 내역 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                최근 주문 내역
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">주문 #{order.id.slice(-8)}</span>
                          {getOrderStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString("ko-KR")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.order_items?.length || 0}개 상품
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{order.total_amount?.toLocaleString()}원</p>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/orders/${order.id}`}>
                            상세보기
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">주문 내역이 없습니다.</p>
                  </div>
                )}
              </div>
              {orders && orders.length > 5 && (
                <div className="mt-4 pt-4 border-t text-center">
                  <Button variant="outline" size="sm">
                    전체 주문 내역 보기 ({orders.length}건)
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 통계 및 액션 */}
        <div className="space-y-6">
          {/* 구매 통계 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                구매 통계
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">총 주문 수</span>
                <span className="font-semibold">{totalOrders}건</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">완료된 주문</span>
                <span className="font-semibold">{completedOrders.length}건</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">총 구매액</span>
                <span className="font-semibold">{totalSpent.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">평균 주문액</span>
                <span className="font-semibold">{Math.round(averageOrderValue).toLocaleString()}원</span>
              </div>
            </CardContent>
          </Card>

          {/* 사용자 상태 */}
          <Card>
            <CardHeader>
              <CardTitle>사용자 상태</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">계정 상태</span>
                <Badge className="bg-green-100 text-green-700">활성</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">사용자 유형</span>
                {getRoleBadge(profile.user_roles?.role)}
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">가입 경로</span>
                <span className="text-sm">이메일</span>
              </div>
            </CardContent>
          </Card>

          {/* 액션 버튼 */}
          <Card>
            <CardHeader>
              <CardTitle>관리 액션</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm">
                이메일 발송
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                프로필 수정
              </Button>
              {profile.user_roles?.role !== 'admin' && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={() => handleRoleUpdate('admin')}
                >
                  관리자 권한 부여
                </Button>
              )}
              <Button variant="destructive" className="w-full" size="sm">
                계정 비활성화
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

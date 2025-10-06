import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Eye, UserPlus, Calendar, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default async function UsersManagementPage() {
  const supabase = await createServerClient()

  // 사용자 프로필 데이터 조회
  const { data: profiles } = await supabase
    .from("profiles")
    .select(`
      *,
      user_roles!left(role)
    `)
    .order("created_at", { ascending: false })

  // 각 사용자의 주문 통계
  const userStats = await Promise.all(
    (profiles || []).map(async (profile) => {
      const { count: orderCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("user_id", profile.id)

      const { data: orders } = await supabase
        .from("orders")
        .select("total_amount")
        .eq("user_id", profile.id)
        .eq("status", "completed")

      const totalSpent = orders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

      return {
        id: profile.id,
        orderCount: orderCount || 0,
        totalSpent
      }
    })
  )

  const getRoleBadge = (role: string | null) => {
    if (role === 'admin') {
      return <Badge className="bg-red-100 text-red-700">관리자</Badge>
    }
    return <Badge className="bg-blue-100 text-blue-700">일반 사용자</Badge>
  }

  const getUserInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">사용자 관리</h1>
        <p className="text-muted-foreground mt-2">전체 사용자를 관리하고 정보를 확인하세요</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">전체 사용자</p>
                <p className="text-2xl font-bold">{profiles?.length || 0}</p>
              </div>
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">관리자</p>
                <p className="text-2xl font-bold">
                  {profiles?.filter(p => p.user_roles?.role === 'admin').length || 0}
                </p>
              </div>
              <UserPlus className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">구매 고객</p>
                <p className="text-2xl font-bold">
                  {userStats.filter(s => s.orderCount > 0).length}
                </p>
              </div>
              <ShoppingBag className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">신규 가입자</p>
                <p className="text-2xl font-bold">
                  {profiles?.filter(p => {
                    const createdDate = new Date(p.created_at)
                    const thirtyDaysAgo = new Date()
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
                    return createdDate > thirtyDaysAgo
                  }).length || 0}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="이름, 이메일로 검색..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              관리자만 보기
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              구매 고객만 보기
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 사용자 목록 */}
      <div className="space-y-4">
        {profiles && profiles.length > 0 ? (
          profiles.map((profile) => {
            const stats = userStats.find(s => s.id === profile.id)
            return (
              <Card key={profile.id} className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={profile.avatar_url || ''} />
                        <AvatarFallback>
                          {getUserInitials(profile.display_name || profile.email || '')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{profile.display_name || '이름 없음'}</h3>
                          {getRoleBadge(profile.user_roles?.role)}
                        </div>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                        <p className="text-xs text-muted-foreground">
                          가입일: {new Date(profile.created_at).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">주문 수</p>
                          <p className="font-semibold">{stats?.orderCount || 0}건</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">총 구매액</p>
                          <p className="font-semibold">{(stats?.totalSpent || 0).toLocaleString()}원</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 추가 정보 */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">연락처</p>
                        <p className="font-medium">{profile.phone || '미입력'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">주소</p>
                        <p className="font-medium">{profile.address || '미입력'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">마지막 업데이트</p>
                        <p className="font-medium">
                          {new Date(profile.updated_at).toLocaleDateString("ko-KR")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/users/${profile.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        상세보기
                      </Link>
                    </Button>
                    {profile.user_roles?.role !== 'admin' && (
                      <Button variant="outline" size="sm">
                        관리자 권한 부여
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">사용자가 없습니다</h3>
              <p className="text-muted-foreground">아직 등록된 사용자가 없습니다.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

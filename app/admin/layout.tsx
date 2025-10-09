import type React from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { headers } from "next/headers"
import { adminCache } from "@/lib/cache"

// 캐시 무효화 설정 - 항상 최신 데이터 가져오기
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""
  
  // 로그인 페이지는 인증 체크를 건너뜀
  if (pathname.includes("/admin/login")) {
    return <>{children}</>
  }

  const supabase = await createServerClient()

  // 서버 사이드에서 인증 확인
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()

  if (sessionError || !session?.user) {
    redirect("/admin/login")
  }

  // 관리자 역할 확인
  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", session.user.id)
    .maybeSingle()

  if (roleError || !roleData || roleData.role !== "admin") {
    redirect("/admin/login")
  }

  // 관리자 인증 성공 시 대시보드 캐시 클리어
  adminCache.delete('dashboard-stats')
  console.log('Admin cache cleared for fresh data')

  return (
    <div className="admin-theme flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-background">{children}</main>
    </div>
  )
}

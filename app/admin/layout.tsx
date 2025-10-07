"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      console.log('Admin layout auth check starting:', { isLoginPage, pathname })
      
      if (isLoginPage) {
        setIsLoading(false)
        return
      }

      try {
        const supabase = createBrowserClient()
        
        // 먼저 세션 확인 (더 빠름)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        console.log('Session check result:', { session: !!session, error: sessionError })
        
        if (!mounted) return

        if (sessionError || !session?.user) {
          console.warn('No valid session found, redirecting to login')
          router.push("/admin/login")
          return
        }

        // 관리자 역할 확인 (타임아웃 설정)
        const rolePromise = supabase.from("user_roles").select("role").eq("user_id", session.user.id).maybeSingle()
        const roleTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Role check timeout')), 3000)
        )
        
        const { data: roleData, error: roleError } = await Promise.race([rolePromise, roleTimeoutPromise]) as any

        console.log('Role check result:', { roleData, roleError })

        if (!mounted) return

        if (roleError || !roleData || roleData.role !== "admin") {
          console.warn('Admin role check failed, redirecting to login:', roleError?.message || 'No admin role')
          router.push("/admin/login")
          return
        }

        console.log('Admin authentication successful')
        setIsAuthenticated(true)
      } catch (error) {
        if (mounted) {
          console.warn('Admin auth error, redirecting to login:', error)
          router.push("/admin/login")
        }
      } finally {
        if (mounted) {
          console.log('Admin layout auth check completed')
          setIsLoading(false)
        }
      }
    }

    // 약간의 지연을 두고 인증 체크 (페이지 로드 후)
    const timeoutId = setTimeout(checkAuth, 100)

    return () => {
      mounted = false
      clearTimeout(timeoutId)
    }
  }, [isLoginPage, router, pathname])

  if (isLoginPage) {
    return <div className="admin-theme">{children}</div>
  }

  if (isLoading) {
    return (
      <div className="admin-theme flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-muted-foreground">관리자 권한 확인 중...</div>
          <div className="text-xs text-muted-foreground/60 mt-2">잠시만 기다려주세요</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="admin-theme flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-background">{children}</main>
    </div>
  )
}

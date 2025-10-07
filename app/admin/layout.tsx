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
    const checkAuth = async () => {
      if (isLoginPage) {
        setIsLoading(false)
        return
      }

      try {
        const supabase = createBrowserClient()
        
        // 타임아웃 설정 (5초)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth check timeout')), 5000)
        )
        
        const authPromise = supabase.auth.getUser()
        const {
          data: { user },
        } = await Promise.race([authPromise, timeoutPromise]) as any

        if (!user) {
          router.push("/admin/login")
          return
        }

        // 역할 확인도 타임아웃 설정
        const roleTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Role check timeout')), 3000)
        )
        
        const rolePromise = supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle()
        const { data: roleData } = await Promise.race([rolePromise, roleTimeoutPromise]) as any

        if (!roleData || roleData.role !== "admin") {
          router.push("/admin/login")
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error('Admin auth error:', error)
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
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

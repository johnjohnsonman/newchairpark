"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, Tag, ImageIcon, Recycle, LayoutGrid, LogOut, ChevronRight, ShoppingCart, Users, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "주문 및 사용자 관리",
    items: [
      { title: "주문 관리", href: "/admin/orders", icon: ShoppingCart },
      { title: "사용자 관리", href: "/admin/users", icon: Users },
    ],
  },
  {
    title: "콘텐츠 관리",
    items: [
      { title: "상품 관리", href: "/admin/products", icon: Package },
      { title: "브랜드 관리", href: "/admin/brands", icon: Tag },
      { title: "갤러리 관리", href: "/admin/gallery", icon: ImageIcon },
      { title: "자료실 관리", href: "/admin/resources", icon: FileText },
      { title: "중고마켓 관리", href: "/admin/recycle-market", icon: Recycle },
    ],
  },
  {
    title: "사이트 설정",
    items: [{ title: "카테고리 배너", href: "/admin/category-banners", icon: LayoutGrid }],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const handleMenuClick = (href: string, title: string) => {
    // 메뉴 클릭 로직 (필요시 추가)
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-xl font-bold">관리자</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {menuItems.map((section, idx) => (
          <div key={idx}>
            {section.href ? (
              // Single menu item
              <Link href={section.href} onClick={() => handleMenuClick(section.href, section.title)}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                    pathname === section.href
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white",
                  )}
                >
                  {section.icon && <section.icon className="h-4 w-4" />}
                  {section.title}
                </div>
              </Link>
            ) : (
              // Section with sub-items
              <div>
                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items?.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                    return (
                      <Link key={item.href} href={item.href} onClick={() => handleMenuClick(item.href, item.title)}>
                        <div
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors cursor-pointer",
                            isActive
                              ? "bg-slate-800 text-white font-medium"
                              : "text-slate-300 hover:bg-slate-800 hover:text-white",
                          )}
                        >
                          {item.icon && <item.icon className="h-4 w-4" />}
                          <span className="flex-1">{item.title}</span>
                          {isActive && <ChevronRight className="h-4 w-4" />}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4">
        <form action="/auth/signout" method="post">
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </Button>
        </form>
      </div>
    </div>
  )
}

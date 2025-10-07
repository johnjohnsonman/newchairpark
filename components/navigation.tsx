"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import { UserNav } from "@/components/user-nav"

export default function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [storeDropdownOpen, setStoreDropdownOpen] = useState(false)

  const navItems = [
    { name: "홈", href: "/" },
    { name: "스토어", href: "/store" },
    { name: "브랜드", href: "/brand" },
    { name: "회사소개", href: "/about" },
    { name: "갤러리", href: "/gallery" },
    { name: "리뷰", href: "/reviews" },
    { name: "자료실", href: "/resources" },
    { name: "블로그", href: "https://blog.naver.com/chairforyou", external: true },
    { name: "수리", href: "/repair" },
    { name: "리싸이클", href: "/recycle" },
    { name: "렌탈", href: "/rental" },
    { name: "소식", href: "/news" },
  ]

  const storeSubMenu = [
    { name: "Office Chair", href: "/store?category=office-chair" },
    { name: "Executive Chair", href: "/store?category=executive-chair" },
    { name: "Lounge Chair", href: "/store?category=lounge-chair" },
    { name: "Conference Chair", href: "/store?category=conference-chair" },
    { name: "Dining Chair", href: "/store?category=dining-chair" },
    { name: "Design Chair", href: "/store?category=design-chair" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary">Chairpark</div>
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-1">
            {navItems.map((item) =>
              item.name === "스토어" ? (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setStoreDropdownOpen(true)}
                  onMouseLeave={() => setStoreDropdownOpen(false)}
                >
                  <Link
                    href={item.href}
                    className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                      pathname === item.href || pathname.startsWith("/store") ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                  {storeDropdownOpen && (
                    <div className="absolute left-0 top-full w-48 border border-border bg-background shadow-lg">
                      {storeSubMenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className="block px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                  className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ),
            )}
          </div>

          <div className="hidden md:flex md:items-center md:gap-3">
            <Button size="sm" variant="default" asChild>
              <Link href="/bulk-inquiry">특판가 문의</Link>
            </Button>
            <UserNav />
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                  className={`px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 pt-2">
                <Button size="sm" variant="default" className="w-full mb-2" asChild>
                  <Link href="/bulk-inquiry">특판가 문의</Link>
                </Button>
                <UserNav />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

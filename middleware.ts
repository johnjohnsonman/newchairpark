import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Temporarily disable middleware to fix site
  return
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}

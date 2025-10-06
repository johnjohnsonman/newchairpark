import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // Just pass through the request without auth checks
  // Auth checks should be done in individual pages/routes that need them
  return NextResponse.next({
    request,
  })
}

import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"

const notoSans = Noto_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://newchairpark.vercel.app'),
  title: {
    default: "체어파크 | World Premium Chair Store",
    template: "%s | 체어파크",
  },
  description:
    "허먼밀러, 스틸케이스 등 세계적인 프리미엄 오피스 가구 브랜드부터 합리적인 중고 가구까지. 체어파크에서 당신의 공간을 완성하세요.",
  keywords: [
    "체어파크",
    "chairpark",
    "허먼밀러",
    "스틸케이스",
    "오피스 체어",
    "사무용 의자",
    "중고 가구",
    "가구 렌탈",
    "프리미엄 가구",
  ],
  authors: [{ name: "체어파크" }],
  creator: "체어파크",
  publisher: "체어파크",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://newchairpark.vercel.app",
    title: "체어파크 | World Premium Chair Store",
    description: "허먼밀러, 스틸케이스 등 세계적인 프리미엄 오피스 가구 브랜드",
    siteName: "체어파크",
  },
  twitter: {
    card: "summary_large_image",
    title: "체어파크 | World Premium Chair Store",
    description: "허먼밀러, 스틸케이스 등 세계적인 프리미엄 오피스 가구 브랜드",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`font-sans ${notoSans.variable}`}>
        <ErrorBoundary>
          <Suspense fallback={
            <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                  <div className="text-2xl font-bold text-primary">Chairpark</div>
                  <div className="flex items-center gap-2">
                    <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                  </div>
                </div>
              </div>
            </nav>
          }>
            <Navigation />
          </Suspense>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}

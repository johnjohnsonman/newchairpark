"use client"

import { usePathname } from "next/navigation"

interface StructuredDataProps {
  type?: 'organization' | 'product' | 'website' | 'breadcrumb'
  data?: any
}

export function StructuredData({ type = 'organization', data }: StructuredDataProps) {
  const pathname = usePathname()

  const getOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "체어파크",
    "alternateName": "Chairpark",
    "url": "https://chairpark.co.kr",
    "logo": "https://chairpark.co.kr/placeholder-logo.png",
    "description": "허먼밀러, 스틸케이스 등 세계적인 프리미엄 오피스 가구 전문점",
    "foundingDate": "2024",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KR",
      "addressLocality": "서울",
      "addressRegion": "서울특별시"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+82-2-1234-5678",
      "contactType": "customer service",
      "areaServed": "KR",
      "availableLanguage": ["Korean"]
    },
    "sameAs": [
      "https://www.facebook.com/chairpark",
      "https://www.instagram.com/chairpark",
      "https://blog.naver.com/chairpark"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "프리미엄 오피스 가구",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "허먼밀러 에어론 체어",
            "description": "세계적으로 유명한 프리미엄 오피스 체어"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "스틸케이스 제스처 체어",
            "description": "혁신적인 인체공학 디자인 오피스 체어"
          }
        }
      ]
    }
  })

  const getWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "체어파크",
    "url": "https://chairpark.co.kr",
    "description": "프리미엄 오피스 가구 전문점",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://chairpark.co.kr/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "체어파크",
      "url": "https://chairpark.co.kr"
    }
  })

  const getBreadcrumbSchema = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const breadcrumbItems = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "홈",
        "item": "https://chairpark.co.kr"
      }
    ]

    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const segmentName = getSegmentName(segment, index)
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": segmentName,
        "item": `https://chairpark.co.kr${currentPath}`
      })
    })

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems
    }
  }

  const getSegmentName = (segment: string, index: number): string => {
    const segmentNames: Record<string, string> = {
      'store': '스토어',
      'gallery': '갤러리',
      'brand': '브랜드',
      'recycle': '리싸이클',
      'rental': '렌탈',
      'repair': '수리',
      'resources': '자료실',
      'reviews': '리뷰',
      'about': '회사소개',
      'bulk-inquiry': '특판가 문의',
      'news': '소식',
      'cart': '장바구니',
      'checkout': '결제',
      'payment': '결제완료'
    }
    return segmentNames[segment] || segment
  }

  const getSchema = () => {
    switch (type) {
      case 'organization':
        return getOrganizationSchema()
      case 'website':
        return getWebsiteSchema()
      case 'breadcrumb':
        return getBreadcrumbSchema()
      case 'product':
        return data || {}
      default:
        return getOrganizationSchema()
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getSchema(), null, 2)
      }}
    />
  )
}

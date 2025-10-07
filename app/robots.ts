import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/auth/',
        '/my-page/',
        '/checkout/',
        '/payment/',
        '/cart',
      ],
    },
    sitemap: 'https://chairpark.co.kr/sitemap.xml',
  }
}

import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = 'https://chairpark.co.kr'

  // 정적 페이지들
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/brand`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/recycle`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/rental`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/repair`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/bulk-inquiry`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  try {
    // 갤러리 페이지들
    const { data: galleryItems } = await supabase
      .from('gallery')
      .select('id, updated_at, created_at')
      .order('updated_at', { ascending: false })

    const galleryPages = (galleryItems || []).map((item) => ({
      url: `${baseUrl}/gallery/${item.id}`,
      lastModified: new Date(item.updated_at || item.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // 제품 페이지들 (만약 있다면)
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at, created_at')
      .order('updated_at', { ascending: false })

    const productPages = (products || []).map((product) => ({
      url: `${baseUrl}/store/${product.slug}`,
      lastModified: new Date(product.updated_at || product.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // 브랜드 페이지들
    const { data: brands } = await supabase
      .from('brands')
      .select('slug, updated_at, created_at')
      .order('updated_at', { ascending: false })

    const brandPages = (brands || []).map((brand) => ({
      url: `${baseUrl}/brand/${brand.slug}`,
      lastModified: new Date(brand.updated_at || brand.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    // 리싸이클 아이템 페이지들
    const { data: recycleItems } = await supabase
      .from('recycle_items')
      .select('id, updated_at, created_at')
      .order('updated_at', { ascending: false })

    const recyclePages = (recycleItems || []).map((item) => ({
      url: `${baseUrl}/recycle/${item.id}`,
      lastModified: new Date(item.updated_at || item.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...galleryPages, ...productPages, ...brandPages, ...recyclePages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // 에러가 발생해도 정적 페이지만이라도 반환
    return staticPages
  }
}

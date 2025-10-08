"use client"

import { useState, useEffect, useCallback } from "react"
import { createBrowserClient } from "@/lib/supabase/client"

interface BrandProductData {
  brands: string[]
  products: string[]
  brandProducts: Record<string, string[]>
}

export function useUnifiedBrandProduct() {
  const [data, setData] = useState<BrandProductData>({
    brands: [],
    products: [],
    brandProducts: {}
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const supabase = createBrowserClient()

        // 존재하는 테이블에서만 데이터 수집
        const [productsResult, brandsResult, galleryResult] = await Promise.allSettled([
          supabase.from("products").select("id, name, brand_id"),
          supabase.from("brands").select("id, name"),
          supabase.from("gallery").select("brand, product_name")
        ])

        if (!isMounted) return

        const products = productsResult.status === 'fulfilled' && productsResult.value.data ? productsResult.value.data : []
        const brands = brandsResult.status === 'fulfilled' && brandsResult.value.data ? brandsResult.value.data : []
        const gallery = galleryResult.status === 'fulfilled' && galleryResult.value.data ? galleryResult.value.data : []

        // 브랜드 수집
        const brandSet = new Set<string>()
        const productSet = new Set<string>()
        const brandProductMap: Record<string, Set<string>> = {}

        // Products 테이블 - brands 테이블과 조인
        if (Array.isArray(products) && Array.isArray(brands)) {
          products.forEach(item => {
            const brand = brands.find(b => b.id === item.brand_id)
            if (brand && brand.name) {
              brandSet.add(brand.name)
              if (item.name) {
                productSet.add(item.name)
                if (!brandProductMap[brand.name]) {
                  brandProductMap[brand.name] = new Set()
                }
                brandProductMap[brand.name].add(item.name)
              }
            }
          })
        }

        // Gallery 테이블
        if (Array.isArray(gallery)) {
          gallery.forEach(item => {
            if (item && item.brand) {
              brandSet.add(item.brand)
              if (item.product_name) {
                productSet.add(item.product_name)
                if (!brandProductMap[item.brand]) {
                  brandProductMap[item.brand] = new Set()
                }
                brandProductMap[item.brand].add(item.product_name)
              }
            }
          })
        }

        // Set을 Array로 변환하고 정렬
        const sortedBrands = Array.from(brandSet).sort()
        const sortedProducts = Array.from(productSet).sort()
        
        const sortedBrandProducts: Record<string, string[]> = {}
        Object.keys(brandProductMap).forEach(brand => {
          sortedBrandProducts[brand] = Array.from(brandProductMap[brand]).sort()
        })

        if (isMounted) {
          setData({
            brands: sortedBrands,
            products: sortedProducts,
            brandProducts: sortedBrandProducts
          })
        }
      } catch (err) {
        console.error('Failed to fetch unified brand/product data:', err)
        if (isMounted) {
          setError('데이터를 불러오는데 실패했습니다.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  const getProductsByBrand = useCallback((brand: string) => {
    return data.brandProducts[brand] || []
  }, [data.brandProducts])

  const searchBrands = useCallback((query: string) => {
    if (!query || !query.trim()) return data.brands
    return data.brands.filter(b => b.toLowerCase().includes(query.toLowerCase()))
  }, [data.brands])

  const searchProducts = useCallback((query: string, brand?: string) => {
    const target = brand ? (data.brandProducts[brand] || []) : data.products
    if (!query || !query.trim()) return target
    return target.filter(p => p.toLowerCase().includes(query.toLowerCase()))
  }, [data.brandProducts, data.products])

  return {
    brands: data.brands,
    products: data.products,
    brandProducts: data.brandProducts,
    isLoading,
    error,
    getProductsByBrand,
    searchBrands,
    searchProducts
  }
}

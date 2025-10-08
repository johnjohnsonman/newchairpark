"use client"

import { useState, useEffect } from "react"
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
  const [isMounted, setIsMounted] = useState(false)

  // 컴포넌트 마운트 상태 관리
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // 컴포넌트가 마운트되지 않았으면 실행하지 않음
    if (!isMounted) return

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // 안전하게 Supabase 클라이언트 생성
        let supabase
        try {
          supabase = createBrowserClient()
        } catch (clientError) {
          console.error("Failed to create Supabase client:", clientError)
          setError("데이터베이스 연결에 실패했습니다.")
          setIsLoading(false)
          return
        }

        // 존재하는 테이블에서만 브랜드와 제품명을 수집
        const [
          productsResult,
          brandsResult,
          galleryResult
        ] = await Promise.allSettled([
          supabase.from("products").select("id, name, brand_id"),
          supabase.from("brands").select("id, name"),
          supabase.from("gallery").select("brand, product_name")
        ])

        const products = productsResult.status === 'fulfilled' ? productsResult.value.data : null
        const brands = brandsResult.status === 'fulfilled' ? brandsResult.value.data : null
        const gallery = galleryResult.status === 'fulfilled' ? galleryResult.value.data : null
        const resources = null // 테이블이 존재하지 않음
        const recycleItems = null // 테이블이 존재하지 않음

        // 브랜드 수집
        const brandSet = new Set<string>()
        const productSet = new Set<string>()
        const brandProductMap: Record<string, Set<string>> = {}

        // Products 테이블 - brands 테이블과 조인하여 브랜드명 가져오기
        products?.forEach(item => {
          const brand = brands?.find(b => b.id === item.brand_id)
          if (brand) {
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

        // Gallery 테이블
        gallery?.forEach(item => {
          if (item.brand) {
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

        // Resources 테이블
        resources?.forEach(item => {
          if (item.brand) {
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

        // Recycle Items 테이블
        recycleItems?.forEach(item => {
          if (item.brand) {
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

        // Set을 Array로 변환하고 정렬
        const sortedBrands = Array.from(brandSet).sort()
        const sortedProducts = Array.from(productSet).sort()
        
        const sortedBrandProducts: Record<string, string[]> = {}
        Object.keys(brandProductMap).sort().forEach(brand => {
          sortedBrandProducts[brand] = Array.from(brandProductMap[brand]).sort()
        })

        setData({
          brands: sortedBrands,
          products: sortedProducts,
          brandProducts: sortedBrandProducts
        })
      } catch (err) {
        console.error('Failed to fetch unified brand/product data:', err)
        setError('데이터를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isMounted])

  const getProductsByBrand = (brand: string): string[] => {
    return data.brandProducts[brand] || []
  }

  const searchBrands = (query: string): string[] => {
    if (!query.trim()) return data.brands
    return data.brands.filter(brand => 
      brand.toLowerCase().includes(query.toLowerCase())
    )
  }

  const searchProducts = (query: string, brand?: string): string[] => {
    if (!query.trim()) {
      return brand ? getProductsByBrand(brand) : data.products
    }
    
    const searchTarget = brand ? getProductsByBrand(brand) : data.products
    return searchTarget.filter(product => 
      product.toLowerCase().includes(query.toLowerCase())
    )
  }

  return {
    ...data,
    isLoading,
    error,
    getProductsByBrand,
    searchBrands,
    searchProducts,
    refetch: () => {
      // 데이터를 다시 가져오는 로직은 useEffect에서 처리됨
      // 여기서는 단순히 상태만 초기화
      setError(null)
    }
  }
}

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const supabase = createBrowserClient()

        // 모든 테이블에서 브랜드와 제품명을 통합 수집
        const [
          { data: products },
          { data: gallery },
          { data: resources },
          { data: recycleItems }
        ] = await Promise.all([
          supabase.from("products").select("brand, name"),
          supabase.from("gallery").select("brand, product_name"),
          supabase.from("resources").select("brand, product_name"),
          supabase.from("recycle_items").select("brand, product_name")
        ])

        // 브랜드 수집
        const brandSet = new Set<string>()
        const productSet = new Set<string>()
        const brandProductMap: Record<string, Set<string>> = {}

        // Products 테이블
        products?.forEach(item => {
          if (item.brand) {
            brandSet.add(item.brand)
            if (item.name) {
              productSet.add(item.name)
              if (!brandProductMap[item.brand]) {
                brandProductMap[item.brand] = new Set()
              }
              brandProductMap[item.brand].add(item.name)
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
  }, [])

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
      setData({ brands: [], products: [], brandProducts: {} })
      setIsLoading(true)
      setError(null)
    }
  }
}

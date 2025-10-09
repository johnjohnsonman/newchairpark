"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"

interface UseBrandProductDataReturn {
  brands: string[]
  products: string[]
  loadingBrands: boolean
  loadingProducts: boolean
  getProductsByBrand: (brandName: string) => string[]
}

export function useBrandProductData(): UseBrandProductDataReturn {
  const [brands, setBrands] = useState<string[]>([])
  const [allProducts, setAllProducts] = useState<Array<{ brand: string; name: string }>>([])
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(true)

  const supabase = createBrowserClient()

  // 브랜드 목록 로드
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // brands 테이블에서 브랜드 이름 가져오기
        const { data: brandsData } = await supabase
          .from("brands")
          .select("name")
          .order("name")

        const brandNames = brandsData?.map(b => b.name) || []

        // 갤러리, 제품, 중고마켓에서 사용된 브랜드도 수집
        const [galleryData, productsData, recycleData] = await Promise.all([
          supabase.from("gallery").select("brand").not("brand", "is", null),
          supabase.from("products").select("brands(name)"),
          supabase.from("recycle_items").select("brand").not("brand", "is", null)
        ])

        const galleryBrands = galleryData.data?.map(g => g.brand).filter(Boolean) || []
        const productBrands = productsData.data?.map(p => p.brands?.name).filter(Boolean) || []
        const recycleBrands = recycleData.data?.map(r => r.brand).filter(Boolean) || []

        // 중복 제거하고 정렬
        const allBrandNames = Array.from(new Set([
          ...brandNames,
          ...galleryBrands,
          ...productBrands,
          ...recycleBrands
        ])).sort()

        setBrands(allBrandNames)
      } catch (error) {
        console.error("Failed to fetch brands:", error)
      } finally {
        setLoadingBrands(false)
      }
    }

    fetchBrands()
  }, [])

  // 제품 목록 로드
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 갤러리에서 브랜드-제품 조합 수집
        const { data: galleryData } = await supabase
          .from("gallery")
          .select("brand, product_name")
          .not("product_name", "is", null)

        // 제품 테이블에서 브랜드-제품 조합 수집
        const { data: productsData } = await supabase
          .from("products")
          .select("name, brands(name)")

        // 중고마켓에서 브랜드-제품 조합 수집
        const { data: recycleData } = await supabase
          .from("recycle_items")
          .select("brand, title")

        const galleryProducts = galleryData?.map(g => ({
          brand: g.brand || "",
          name: g.product_name || ""
        })).filter(p => p.brand && p.name) || []

        const productsList = productsData?.map(p => ({
          brand: p.brands?.name || "",
          name: p.name || ""
        })).filter(p => p.brand && p.name) || []

        const recycleProducts = recycleData?.map(r => ({
          brand: r.brand || "",
          name: r.title || ""
        })).filter(p => p.brand && p.name) || []

        // 모든 제품 합치기
        const combinedProducts = [
          ...galleryProducts,
          ...productsList,
          ...recycleProducts
        ]

        setAllProducts(combinedProducts)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [])

  // 특정 브랜드의 제품 목록 반환
  const getProductsByBrand = (brandName: string): string[] => {
    if (!brandName) return []

    const brandProducts = allProducts
      .filter(p => p.brand.toLowerCase() === brandName.toLowerCase())
      .map(p => p.name)

    // 중복 제거하고 정렬
    return Array.from(new Set(brandProducts)).sort()
  }

  // 모든 제품 이름 (브랜드 무관)
  const products = Array.from(new Set(allProducts.map(p => p.name))).sort()

  return {
    brands,
    products,
    loadingBrands,
    loadingProducts,
    getProductsByBrand
  }
}

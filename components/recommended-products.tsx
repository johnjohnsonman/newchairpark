"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Star, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecommendedProduct {
  id: string
  name: string
  slug: string
  price: number
  original_price?: number
  images: string[]
  in_stock: boolean
  featured: boolean
  brands?: {
    name: string
  }
}

interface RecommendedProductsProps {
  currentProductId: string
  currentBrandId?: string
  currentCategory?: string
}

export function RecommendedProducts({ 
  currentProductId, 
  currentBrandId, 
  currentCategory 
}: RecommendedProductsProps) {
  const [products, setProducts] = useState<RecommendedProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const params = new URLSearchParams()
        params.append('exclude', currentProductId)
        if (currentBrandId) params.append('brand_id', currentBrandId)
        if (currentCategory) params.append('category', currentCategory)
        params.append('limit', '8')

        const response = await fetch(`/api/products/recommended?${params}`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products || [])
        }
      } catch (error) {
        console.error('Failed to fetch recommended products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendedProducts()
  }, [currentProductId, currentBrandId, currentCategory])

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">추천 제품</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">추천 제품</h2>
          <p className="text-gray-600">고객님께 추천하는 다른 제품들</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const discountPercentage = product.original_price && product.original_price > product.price
              ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
              : 0

            return (
              <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <Link href={`/products/${product.slug}`}>
                  <CardContent className="p-0">
                    {/* 제품 이미지 */}
                    <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <span>이미지 없음</span>
                        </div>
                      )}

                      {/* 배지들 */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {discountPercentage > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            {discountPercentage}%
                          </Badge>
                        )}
                        {product.featured && (
                          <Badge variant="secondary" className="text-xs">추천</Badge>
                        )}
                        {!product.in_stock && (
                          <Badge variant="destructive" className="text-xs">품절</Badge>
                        )}
                      </div>

                      {/* 호버 액션 버튼들 */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex flex-col gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 bg-white/80 hover:bg-white"
                            onClick={(e) => {
                              e.preventDefault()
                              // TODO: 위시리스트 추가 기능
                            }}
                          >
                            <Heart className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 bg-white/80 hover:bg-white"
                            onClick={(e) => {
                              e.preventDefault()
                              // TODO: 장바구니 추가 기능
                            }}
                          >
                            <ShoppingCart className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* 제품 정보 */}
                    <div className="p-4 space-y-2">
                      {/* 브랜드명 */}
                      {product.brands?.name && (
                        <Badge variant="outline" className="text-xs">
                          {product.brands.name}
                        </Badge>
                      )}

                      {/* 제품명 */}
                      <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>

                      {/* 평점 (임시) */}
                      <div className="flex items-center gap-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">(4.8)</span>
                      </div>

                      {/* 가격 */}
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">
                          {product.price.toLocaleString()}원
                        </span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-xs text-muted-foreground line-through">
                            {product.original_price.toLocaleString()}원
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>

        {/* 더 보기 버튼 */}
        <div className="text-center mt-8">
          <Link href="/store">
            <Button variant="outline" size="lg">
              더 많은 제품 보기
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

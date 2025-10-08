"use client"

import dynamic from "next/dynamic"
import type { Product, Brand } from "@/types/database"

interface ProductFormWrapperProps {
  product?: Product
  brands: Brand[]
}

// ProductForm을 동적으로 로드하여 초기화 문제 방지
const ProductForm = dynamic(() => import("@/components/admin/product-form").then(mod => ({ default: mod.ProductForm })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-neutral-600">폼을 불러오는 중...</p>
      </div>
    </div>
  )
})

export function ProductFormWrapper({ product, brands }: ProductFormWrapperProps) {
  return <ProductForm product={product} brands={brands} />
}

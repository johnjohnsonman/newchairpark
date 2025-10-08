import type { Product, Brand } from "@/types/database"
import { ProductFormClient } from "./product-form-client"

interface ProductFormWrapperProps {
  product?: Product
  brands: Brand[]
}

export function ProductFormWrapper({ product, brands }: ProductFormWrapperProps) {
  return <ProductFormClient product={product} brands={brands} />
}

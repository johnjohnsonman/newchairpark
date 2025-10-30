import type { Rental } from "@/types/rental"
import type { Brand } from "@/types/database"
import { RentalFormClient } from "./rental-form-client"

interface RentalFormWrapperProps {
  rental?: Rental
  brands: Brand[]
}

export function RentalFormWrapper({ rental, brands }: RentalFormWrapperProps) {
  return <RentalFormClient rental={rental} brands={brands} />
}








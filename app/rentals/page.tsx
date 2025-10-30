import { createServerClient } from "@/lib/supabase/server"
import RentalsClientPage from "./rentals-client"

export const metadata = {
  title: "렌탈/데모 - 체어파크",
  description: "프리미엄 가구를 렌탈하거나 데모로 체험해보세요",
}

export default async function RentalsPage() {
  const supabase = await createServerClient()

  // Fetch rentals
  const { data: rentals } = await supabase
    .from("rentals")
    .select("*, brands(name, slug)")
    .order("created_at", { ascending: false })

  // Fetch brands for filters
  const { data: brands } = await supabase
    .from("brands")
    .select("*")
    .order("name")

  return (
    <RentalsClientPage 
      initialRentals={rentals || []} 
      initialBrands={brands || []}
    />
  )
}


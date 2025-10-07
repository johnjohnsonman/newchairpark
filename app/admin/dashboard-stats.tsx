import { createClient } from "@/lib/supabase/server"

export async function getDashboardStats() {
  const supabase = await createClient()

  try {
    // 기본 카운트만 가져오기 (가장 중요한 데이터)
    const [productsResult, brandsResult, galleryResult] = await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("brands").select("*", { count: "exact", head: true }),
      supabase.from("gallery").select("*", { count: "exact", head: true }),
    ])

    const productsCount = productsResult.count || 0
    const brandsCount = brandsResult.count || 0
    const galleryCount = galleryResult.count || 0

    // 사용자와 주문 데이터는 별도로 처리 (에러가 발생할 수 있음)
    let usersCount = 0
    let ordersCount = 0
    let totalSales = 0
    let recentOrders: any[] = []

    try {
      const [usersResult, ordersResult] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("id, total_amount, status", { count: "exact", head: true }),
      ])

      usersCount = usersResult.count || 0
      ordersCount = ordersResult.count || 0

      // 매출 계산 (완료된 주문만)
      const { data: completedOrders } = await supabase
        .from("orders")
        .select("total_amount")
        .eq("status", "completed")

      totalSales = completedOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

      // 최근 주문 (5개만)
      const { data: recentOrdersData } = await supabase
        .from("orders")
        .select("id, total_amount, status, created_at, shipping_name")
        .order("created_at", { ascending: false })
        .limit(5)

      recentOrders = recentOrdersData || []
    } catch (error) {
      console.error('Orders/Users data error:', error)
    }

    return {
      productsCount,
      brandsCount,
      galleryCount,
      usersCount,
      ordersCount,
      totalSales,
      recentOrders,
    }
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return {
      productsCount: 0,
      brandsCount: 0,
      galleryCount: 0,
      usersCount: 0,
      ordersCount: 0,
      totalSales: 0,
      recentOrders: [],
    }
  }
}

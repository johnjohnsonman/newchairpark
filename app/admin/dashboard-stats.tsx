import { createServerClient } from "@/lib/supabase/server"
import { adminCache } from "@/lib/cache"

export async function getDashboardStats() {
  // 캐시에서 데이터 확인 (1분 캐시)
  const cacheKey = 'dashboard-stats'
  const cachedData = adminCache.get(cacheKey)
  if (cachedData) {
    console.log('Using cached dashboard stats')
    return cachedData
  }

  const supabase = await createServerClient()

  try {
    // 모든 기본 카운트를 한 번에 가져오기 (타임아웃 설정)
    const statsPromise = Promise.allSettled([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("brands").select("*", { count: "exact", head: true }),
      supabase.from("gallery").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("id, total_amount, status", { count: "exact", head: true }),
    ])

    // 5초 타임아웃 설정
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Stats fetch timeout')), 5000)
    )

    const results = await Promise.race([statsPromise, timeoutPromise]) as PromiseSettledResult<any>[]
    
    const [productsResult, brandsResult, galleryResult, usersResult, ordersResult] = results.map(result => 
      result.status === 'fulfilled' ? result.value : null
    )

    const productsCount = productsResult?.count || 0
    const brandsCount = brandsResult?.count || 0
    const galleryCount = galleryResult?.count || 0
    const usersCount = usersResult?.count || 0
    const ordersCount = ordersResult?.count || 0

    // 매출과 최근 주문은 별도로 처리 (선택적)
    let totalSales = 0
    let recentOrders: any[] = []

    try {
      const [salesPromise, ordersPromise] = await Promise.allSettled([
        supabase.from("orders").select("total_amount").eq("status", "completed"),
        supabase.from("orders").select("id, total_amount, status, created_at, shipping_name")
          .order("created_at", { ascending: false }).limit(5)
      ])

      if (salesPromise.status === 'fulfilled' && salesPromise.value.data) {
        totalSales = salesPromise.value.data.reduce((sum, order) => sum + (order.total_amount || 0), 0)
      }

      if (ordersPromise.status === 'fulfilled' && ordersPromise.value.data) {
        recentOrders = ordersPromise.value.data
      }
    } catch (error) {
      console.error('Sales/Orders detail error:', error)
    }

    const statsData = {
      productsCount,
      brandsCount,
      galleryCount,
      usersCount,
      ordersCount,
      totalSales,
      recentOrders,
    }

    // 캐시에 저장 (1분)
    adminCache.set(cacheKey, statsData, 60000)
    
    return statsData
  } catch (error) {
    console.error('Dashboard stats error:', error)
    const fallbackData = {
      productsCount: 0,
      brandsCount: 0,
      galleryCount: 0,
      usersCount: 0,
      ordersCount: 0,
      totalSales: 0,
      recentOrders: [],
    }
    
    // 에러 시에도 짧은 캐시 저장 (30초)
    adminCache.set(cacheKey, fallbackData, 30000)
    
    return fallbackData
  }
}

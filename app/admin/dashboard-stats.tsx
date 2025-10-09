import { createServerClient } from "@/lib/supabase/server"
import { adminCache } from "@/lib/cache"

export async function getDashboardStats() {
  // 캐시에서 데이터 확인 (5초 캐시로 단축)
  const cacheKey = 'dashboard-stats'
  const cachedData = adminCache.get(cacheKey)
  if (cachedData) {
    console.log('Using cached dashboard stats')
    return cachedData
  }

  try {
    const supabase = await createServerClient()

    // 각 쿼리를 개별적으로 처리하여 안정성 향상
    const statsData = {
      productsCount: 0,
      brandsCount: 0,
      galleryCount: 0,
      usersCount: 0,
      ordersCount: 0,
      totalSales: 0,
      recentOrders: [],
    }

    // Products count
    try {
      const { count } = await supabase.from("products").select("*", { count: "exact", head: true })
      statsData.productsCount = count || 0
    } catch (error) {
      console.error('Products count error:', error)
    }

    // Brands count
    try {
      const { count } = await supabase.from("brands").select("*", { count: "exact", head: true })
      statsData.brandsCount = count || 0
    } catch (error) {
      console.error('Brands count error:', error)
    }

    // Gallery count
    try {
      const { count } = await supabase.from("gallery").select("*", { count: "exact", head: true })
      statsData.galleryCount = count || 0
    } catch (error) {
      console.error('Gallery count error:', error)
    }

    // Users count
    try {
      const { count } = await supabase.from("profiles").select("*", { count: "exact", head: true })
      statsData.usersCount = count || 0
    } catch (error) {
      console.error('Users count error:', error)
    }

    // Orders count
    try {
      const { count } = await supabase.from("orders").select("*", { count: "exact", head: true })
      statsData.ordersCount = count || 0
    } catch (error) {
      console.error('Orders count error:', error)
    }

    // Total sales
    try {
      const { data } = await supabase.from("orders").select("total_amount").eq("status", "completed")
      if (data) {
        statsData.totalSales = data.reduce((sum, order) => sum + (order.total_amount || 0), 0)
      }
    } catch (error) {
      console.error('Total sales error:', error)
    }

    // Recent orders
    try {
      const { data } = await supabase.from("orders")
        .select("id, total_amount, status, created_at, shipping_name")
        .order("created_at", { ascending: false })
        .limit(5)
      if (data) {
        statsData.recentOrders = data
      }
    } catch (error) {
      console.error('Recent orders error:', error)
    }

    // 캐시에 저장 (5초로 단축)
    adminCache.set(cacheKey, statsData, 5000)
    
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
    
    // 에러 시에도 짧은 캐시 저장 (5초)
    adminCache.set(cacheKey, fallbackData, 5000)
    
    return fallbackData
  }
}

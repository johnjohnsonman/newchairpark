/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force complete rebuild - bypass all caches
  generateBuildId: async () => {
    return `build-${Date.now()}-${Math.random().toString(36).substring(7)}`
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nejjxccatspqlkujxlnd.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lanJ4Y2NhdHNwcWxrdWp4bG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NTU3MjcsImV4cCI6MjA0ODUzMTcyN30.ZYwVh6jKz8lK8vQqQqQqQqQqQqQqQqQqQqQqQqQqQ',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lanJ4Y2NhdHNwcWxrdWp4bG5kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjk1NTcyNywiZXhwIjoyMDQ4NTMxNzI3fQ.ZYwVh6jKz8lK8vQqQqQqQqQqQqQqQqQqQqQqQqQqQ',
  },
  // 캐시 제어 강화
  async headers() {
    return [
      {
        source: '/store/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ]
  },
}

export default nextConfig

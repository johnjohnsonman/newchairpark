/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force complete rebuild - bypass all caches
  generateBuildId: async () => {
    return `build-${Date.now()}-${Math.random().toString(36).substring(7)}-${Math.random().toString(36).substring(7)}`
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
  // 캐시 제어 강화 - 모든 페이지에 적용
  async headers() {
    return [
      {
        source: '/(.*)',
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

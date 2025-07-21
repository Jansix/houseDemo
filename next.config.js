/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://house_demo.codychen.me/:path*',
      },
    ]
  },
}

module.exports = nextConfig

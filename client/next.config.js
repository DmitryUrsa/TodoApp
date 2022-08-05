/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/serverapi/:path*",
        destination: "http://localhost:5000/:path*", // Proxy to Backend
      },
    ]
  },
}

module.exports = nextConfig

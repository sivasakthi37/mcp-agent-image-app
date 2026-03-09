/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },
  images: {
    domains: ['your-s3-bucket.s3.amazonaws.com'],
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5204/api/:path*', // API URL'iniz
      },
    ];
  },
};

module.exports = nextConfig;

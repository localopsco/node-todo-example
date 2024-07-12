/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://host.docker.internal:3001/api/:path*', // Proxy to Backend
      },
    ];
  },
};

module.exports = nextConfig;

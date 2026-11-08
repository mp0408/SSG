/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [{ source: '/members', destination: '/players', permanent: true }];
  },
};

export default nextConfig;

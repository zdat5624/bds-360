/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['antd', '@ant-design/icons', 'lucide-react', 'zod'],
  },
};

export default nextConfig;

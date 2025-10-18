/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
      };
      // Explicitly mark firebase-admin as external for client-side
      config.externals.push({
        'firebase-admin': 'firebase-admin',
      });
    }
    return config;
  },
};

export default nextConfig;

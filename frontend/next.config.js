/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false, // Deshabilitar minificación SWC
  webpack: (config, { dev, isServer }) => {
    config.cache = false; // Deshabilitar caché de webpack
    return config;
  },
}

module.exports = nextConfig

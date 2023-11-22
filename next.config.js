/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/:path*'
            : 'https://placement-backend-el85.onrender.com/:path*',
      },
    ];
  },
  reactStrictMode: true,
  experimental: {
    appDir: true,
    esmExternals: 'loose', // required to make Konva & react-konva work
  },
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }]; // required to make Konva & react-konva work
    return config;
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/:path*',
        destination:
          process.env.NODE_ENV === 'development'
            ? 'http://127.0.0.1:5328/:path*'
            : '/api/',
      },
    ];
  },
  experimental: {
    outputFileTracingExcludes: {
      '/api/': '{.next,*.cache,node_modules,public,app}/**',
    },
  },
};

module.exports = nextConfig;

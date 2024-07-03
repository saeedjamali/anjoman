/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir: true
  // experimental: {
  //     runtime: 'experimental-edge', // 'node.js' (default) | experimental-edge
  //   },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "peyvand.storage.iran.liara.space",

        // port: "3000",
        // pathname: "/uploads/**",
      },
    ],
  },

  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          { key: "crossOrigin", value: 'anonymous' }
          , {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
          // {
          //   key: 'X-Forwarded-Host',
          //   value: 'localhost:3000',
          // },
          // {
          //   key: 'Origin',
          //   value: 'http://localhost:3000',
          // },
        ],
      },
      // {
      //   source: '/:path*',
      //   headers: [
      //     {
      //       key: 'x-hello',
      //       value: 'there',
      //     },
      //   ],
      // },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
    ];
  },

};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "./src/assets/icons/**/*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              dimensions: false,
              svgoConfig: {
                plugins: [{ name: "convertColors", params: { currentColor: true } }],
              },
            },
          },
        ],
        as: "*.js",
      },
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: { dimensions: false },
          },
        ],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;

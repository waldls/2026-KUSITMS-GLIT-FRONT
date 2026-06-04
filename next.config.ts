import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["192.168.219.50", "*.loca.lt"],
  turbopack: {
    rules: {
      "./src/assets/icons/icon_success.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: { dimensions: false },
          },
        ],
        as: "*.js",
      },
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
      "./src/assets/images/report/**/*.svg": {
        as: "*.asset",
      },
      "./src/assets/images/record/heart-*.svg": {
        as: "*.asset",
      },
      "./src/assets/images/record/record_character.svg": {
        as: "*.asset",
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
  images: {
    qualities: [75, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.groute.app",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "glit-images.s3.ap-northeast-2.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;

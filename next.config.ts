import type { NextConfig } from "next";

type WebpackRule = {
  test?: { test?: (s: string) => boolean };
  issuer?: unknown;
  resourceQuery?: { not?: RegExp[] };
  exclude?: RegExp;
};

const nextConfig: NextConfig = {
  webpack(config) {
    const fileLoaderRule: WebpackRule = config.module.rules.find((rule: WebpackRule) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        include: /src[\\/]assets[\\/]icons/,
        issuer: fileLoaderRule?.issuer,
        resourceQuery: { not: [...(fileLoaderRule?.resourceQuery?.not ?? []), /url/] },
        use: [
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
      },
      {
        test: /\.svg$/i,
        exclude: /src[\\/]assets[\\/]icons/,
        issuer: fileLoaderRule?.issuer,
        resourceQuery: { not: [...(fileLoaderRule?.resourceQuery?.not ?? []), /url/] },
        use: [{ loader: "@svgr/webpack", options: { dimensions: false } }],
      },
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },
};

export default nextConfig;

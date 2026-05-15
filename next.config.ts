// next.config.ts
import type { NextConfig } from "next";
import type { RuleSetRule } from "webpack";
import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
import CompressionPlugin from "compression-webpack-plugin";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Static export tylko dla produkcyjnego buildu. W `next dev` zostawiamy zwykły
// tryb, żeby middleware (src/middleware.ts) z next-intl działał i obsługiwał
// czyste URL-e bez prefiksu /en/ (lokalne odpowiedniki Apache .htaccess i
// scripts/postbuild-i18n.mjs z produkcji).
const isProductionBuild =
  process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-development-server";

const nextConfig: NextConfig = {
  compress: true,
  ...(isProductionBuild ? { output: "export" as const } : {}),
  trailingSlash: true,

  images: {
    unoptimized: true,
  },

  poweredByHeader: false,
  reactStrictMode: true,

  experimental: {
    optimizePackageImports: ["@vidstack/react"],
    optimizeCss: false,
  },

  // ❌ WYŁĄCZONE: reguły turbopack + webpack loader dla SVG (częsty problem)
  // turbopack: {
  //   rules: {
  //     "*.svg": {
  //       loaders: ["@svgr/webpack"],
  //       as: "*.js",
  //     },
  //   },
  // },

  webpack: (config, { dev, isServer }) => {
    const rules = (config.module?.rules ?? []) as RuleSetRule[];
    const assetRule = rules.find(
      (rule) => rule?.test instanceof RegExp && rule.test.test(".svg")
    );

    if (assetRule) {
      assetRule.exclude = /\.svg$/i;
    }

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            icon: true,
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: { removeViewBox: false },
                  },
                },
              ],
            },
          },
        },
      ],
    });

    if (!dev && !isServer) {
      config.plugins?.push(
        new CompressionPlugin({
          filename: "[path][base].gz",
          algorithm: "gzip",
          test: /\.(js|css|html|svg)$/,
          threshold: 10240,
          minRatio: 0.8,
        })
      );
    }

    return config;
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));

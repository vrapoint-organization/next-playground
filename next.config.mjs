import { withSentryConfig } from "@sentry/nextjs";
/** @type {import('next').NextConfig} */
import i18n_pkg from "./next-i18next.config.js";
import _ENV_SERVER from "./_ENV/ENV_SERVER.js";
const ENV_SERVER = _ENV_SERVER.default;

const nextConfig = {
  reactStrictMode: true,
  i18n: i18n_pkg.i18n,
  rewrites: async () => [
    {
      source: "/api/rewrite_cookie_test",
      destination: "http://localhost:8080/rewrite_cookie_test",
    },
    {
      source: "/apis/:path*",
      destination: `${ENV_SERVER.SERVER_URL}/api/:path*`,
    },
  ],
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const IS_DEV = ENV_SERVER.IS_DEV;

export default IS_DEV
  ? nextConfig
  : withSentryConfig(nextConfig, {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options

      org: "next-playground",
      project: "javascript-nextjs",

      // Only print logs for uploading source maps in CI
      silent: !process.env.CI,

      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
      // This can increase your server load as well as your hosting bill.
      // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
      // side errors will fail.
      // tunnelRoute: "/monitoring",

      // Hides source maps from generated client bundles
      hideSourceMaps: true,

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,

      // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
      // See the following for more information:
      // https://docs.sentry.io/product/crons/
      // https://vercel.com/docs/cron-jobs
      automaticVercelMonitors: true,
    });

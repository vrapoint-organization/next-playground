/** @type {import('next').NextConfig} */
import i18n_pkg from "./next-i18next.config.js";

const nextConfig = {
  reactStrictMode: true,
  i18n: i18n_pkg.i18n,
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: 'custom',
    deviceSizes: [400, 500, 600, 650, 700, 768, 820, 1080, 1280, 1366, 1600, 1920, 2560, 3840],
  },
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
};

export default nextConfig;

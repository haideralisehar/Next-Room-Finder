/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  i18n: {
    locales: ["en", "ar"], // available languages
    defaultLocale: "en"    // default language
  }
};

export default nextConfig;

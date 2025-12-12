const config = {
  plugins: ["@tailwindcss/postcss"],
};

module.exports = {
  experimental: {
    serverComponentsExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  },
};


export default config;

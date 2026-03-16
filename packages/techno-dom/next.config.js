/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  turbopack: {
    root: "../../",
  },
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "**" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

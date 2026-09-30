/** @type {import('next').NextConfig} */
const nextConfig = {
  // Every page is generated at build time from /content, so the site can be
  // exported and hosted anywhere.
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;

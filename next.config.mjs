/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.GITHUB_PAGES === "true" ? "export" : undefined,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  trailingSlash: true,
};

export default nextConfig;

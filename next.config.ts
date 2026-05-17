import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] || "Chinaquest";
const resolvedBasePath =
  process.env.NEXT_PUBLIC_BASE_PATH || (process.env.GITHUB_ACTIONS ? `/${repoName}` : "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { 
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: resolvedBasePath,
  },
  turbopack: { root: rootDir },
  compress: true,
  poweredByHeader: false,
  ...(resolvedBasePath
    ? {
        basePath: resolvedBasePath,
        assetPrefix: `${resolvedBasePath}/`,
      }
    : {}),
};

export default nextConfig;

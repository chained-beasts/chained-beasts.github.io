import type { NextConfig } from "next";
import generated from "./content/generated/site.json";

function normalizeBasePath(value?: string) {
  if (!value || value === "/") return "";
  return `/${value.replace(/^\/+|\/+$/g, "")}`;
}

const arcadeSite = generated as { siteType?: string; hosting?: { basePath?: string } };
const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH || (arcadeSite.siteType === "online-game" ? arcadeSite.hosting?.basePath : ""));

const nextConfig: NextConfig = {
  output: "export",
  outputFileTracingRoot: process.cwd(),
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;

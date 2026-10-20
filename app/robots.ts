import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/urls";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: siteConfig.readyForLaunch
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: absoluteUrl("sitemap.xml"),
    host: absoluteUrl(),
  };
}

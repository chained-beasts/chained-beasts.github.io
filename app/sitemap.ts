import type { MetadataRoute } from "next";
import { homePage } from "@/content/home";
import { enabledCorePages } from "@/content/registry";
import { absoluteUrl } from "@/lib/urls";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl(),
      lastModified: homePage.lastReviewed,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...enabledCorePages.map((page) => ({
      url: absoluteUrl(page.slug),
      lastModified: page.lastReviewed,
      changeFrequency: page.pageType === "updates" || page.pageType === "codes" ? "weekly" as const : "monthly" as const,
      priority: 0.8,
    })),
  ];
}

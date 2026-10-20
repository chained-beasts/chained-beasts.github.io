import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { themes } from "@/config/themes";
import { assetPath } from "@/lib/urls";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const theme = themes[siteConfig.theme.preset];
  const logoSrc = assetPath(siteConfig.assets.logo);
  const extension = siteConfig.assets.logo.split(/[?#]/)[0].split(".").pop()?.toLowerCase() || "";
  const imageTypes: Record<string, string> = {
    svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
    webp: "image/webp", gif: "image/gif", ico: "image/x-icon",
  };
  const icon = siteConfig.theme.skin === "arcade-play"
    ? { src: logoSrc, ...(imageTypes[extension] ? { type: imageTypes[extension] } : {}), ...(extension === "svg" ? { sizes: "any" } : {}) }
    : { src: logoSrc, sizes: "any", type: "image/svg+xml" };
  return {
    name: siteConfig.siteName,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: assetPath("/"),
    display: "standalone",
    background_color: `hsl(${theme.tokens.background})`,
    theme_color: `hsl(${theme.tokens.primary})`,
    icons: [icon],
  };
}

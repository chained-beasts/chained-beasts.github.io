import type { SiteConfig, ThemePresetName } from "./types";
import rawSiteConfig from "../content/generated/site.json";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() || (
  (rawSiteConfig as SiteConfig).siteType === "online-game" ? (rawSiteConfig as SiteConfig).hosting.basePath : ""
);
const environmentTheme = process.env.NEXT_PUBLIC_THEME_PRESET as ThemePresetName | undefined;

const generated = rawSiteConfig as SiteConfig;

export const siteConfig: SiteConfig = {
  ...generated,
  theme: { ...generated.theme, preset: environmentTheme || generated.theme.preset },
  hosting: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || generated.hosting.siteUrl,
    basePath,
    customDomain: process.env.NEXT_PUBLIC_CUSTOM_DOMAIN?.trim() || generated.hosting.customDomain,
  },
};

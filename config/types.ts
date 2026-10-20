export type ThemePresetName =
  // Active hardcore / tactical / sci-fi / metal (14)
  | "obsidian-red"
  | "inferno-orange"
  | "carbon-crimson"
  | "bronze-ember"
  | "gunmetal-blue"
  | "cobalt-night"
  | "electric-cyan"
  | "steel-teal"
  | "void-violet"
  | "neon-indigo"
  | "toxic-lime"
  | "military-green"
  | "graphite"
  | "navy-gold"
  // Legacy (hidden from new-site picker, still renderable)
  | "midnight-red"
  | "midnight-purple"
  | "ocean-blue"
  | "ice-cyan"
  | "cyber-lime"
  | "ember-orange"
  | "arcade-pink"
  | "royal-violet"
  | "forest-green"
  | "steel-blue"
  | "parchment-gold"
  | "slate-amber"
  | "crimson-black"
  | "royal-navy"
  | "sand-gold"
  | "soft-mint"
  | "sky-blue"
  | "plum-gold";

export type ThemeSkin = import("../lib/fixed-template/catalog").TemplateSkin;
export type AppearanceColorMode = "scheme" | "custom";
export type ThemeHeaderStyle = "solid" | "glass" | "border";
export type ThemeComponentStyle = "rounded" | "sharp" | "pill";

export type PageType =
  | "home"
  | "database"
  | "guide"
  | "codes"
  | "updates"
  | "article"
  | "list"
  | "legal";

export interface ThemeConfig {
  name: ThemePresetName;
  label: string;
  description: string;
  tokens: Record<string, string>;
}

export interface SiteConfig {
  siteType?: "game-info" | "online-game";
  readyForLaunch: boolean;
  siteName: string;
  shortName: string;
  description: string;
  language: string;
  locale: string;
  authorName: string;
  theme: {
    preset: ThemePresetName;
    overrides?: Record<string, string>;
    /** Defaults to portal when omitted from older site.json. */
    skin?: ThemeSkin;
    /** Defaults to solid when omitted from older site.json. */
    headerStyle?: ThemeHeaderStyle;
    /** Defaults to rounded when omitted from older site.json. */
    componentStyle?: ThemeComponentStyle;
    accentColorId?: string;
    colorMode?: AppearanceColorMode;
    colorSchemeId?: string;
    background?: string;
    accent?: string;
    fontId?: string;
  };
  hosting: {
    siteUrl: string;
    basePath: string;
    customDomain: string | null;
  };
  allowedExternalDomains: string[];
  assets: {
    logo: string;
    cover: string;
    openGraph: string;
    favicon: string;
  };
  game: {
    name: string;
    platform: string;
    developer: string;
    genre: string;
    officialUrl: string | null;
  };
  seo: {
    titleTemplate: string;
  };
}

export interface IntegrationConfig {
  analytics:
    | { provider: "none" }
    | { provider: "google-analytics"; measurementId: string };
  ads:
    | { provider: "none" }
    | {
        provider: "adsterra-native";
        scriptUrl: string;
        containerId: string;
      };
  verification: {
    bing: string | null;
  };
}

export interface InternalLink {
  label: string;
  slug: string;
  description?: string;
}

export interface DataTable {
  caption: string;
  columns: string[];
  rows: string[][];
}

export interface Subsection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  table?: DataTable;
}

export interface PageSection {
  id: string;
  heading: string;
  eyebrow?: string;
  intro?: string;
  paragraphs?: string[];
  subsections?: Subsection[];
  links?: InternalLink[];
  steps?: Array<{ heading: string; description: string }>;
  table?: DataTable;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ScreenshotItem {
  src: string;
  alt: string;
  caption?: string;
}


export interface SeoPageDefinition {
  enabled: boolean;
  slug: string;
  pageType: Exclude<PageType, "home">;
  navLabel: string;
  title: string;
  description: string;
  navVisible: boolean;
  parentSlug?: string | null;
  hero: {
    eyebrow?: string;
    heading: string;
    lead: string;
  };
  sections: PageSection[];
  faq?: FaqItem[];
  screenshots?: ScreenshotItem[];
  relatedSlugs?: string[];
  lastReviewed: string;
}

export interface HomePageDefinition {
  enabled: true;
  slug: "";
  pageType: "home";
  title: string;
  description: string;
  navVisible: true;
  hero: {
    eyebrow: string;
    heading: string;
    lead: string;
    supportingText: string;
    primaryLink?: InternalLink;
    secondaryLink?: { label: string; url: string };
  };
  sections: PageSection[];
  faq: FaqItem[];
  screenshots: ScreenshotItem[];
  lastReviewed: string;
}

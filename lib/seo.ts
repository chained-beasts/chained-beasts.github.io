import type { Metadata } from "next";
import { integrations } from "@/config/integrations";
import { siteConfig } from "@/config/site";
import type { HomePageDefinition, PageType, SeoPageDefinition } from "@/config/types";
import { absoluteUrl, assetPath, siteRootUrl } from "./urls";

type MetadataPage = Pick<
  HomePageDefinition | SeoPageDefinition,
  "slug" | "title" | "description"
> & {
  pageType?: PageType;
};

export function pageMetadata(page: MetadataPage): Metadata {
  const canonical = absoluteUrl(page.slug);
  const isLegal = page.pageType === "legal";
  const shouldIndex = !isLegal && siteConfig.readyForLaunch;
  const shouldFollow = isLegal ? true : shouldIndex;

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical },
    robots: {
      index: shouldIndex,
      follow: shouldFollow,
      googleBot: { index: shouldIndex, follow: shouldFollow },
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      siteName: siteConfig.siteName,
      title: page.title,
      description: page.description,
      url: canonical,
      images: [
        {
          url: absoluteAssetUrl(siteConfig.assets.openGraph),
          alt: `${siteConfig.siteName} preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [absoluteAssetUrl(siteConfig.assets.openGraph)],
    },
  };
}

export function rootMetadata(): Metadata {
  const bing = integrations.verification.bing ?? undefined;

  return {
    metadataBase: new URL(`${siteRootUrl()}/`),
    title: {
      default: siteConfig.siteName,
      template: siteConfig.seo.titleTemplate,
    },
    applicationName: siteConfig.siteName,
    authors: [{ name: siteConfig.authorName }],
    creator: siteConfig.authorName,
    icons: { icon: assetPath(siteConfig.assets.favicon) },
    other: bing ? { "msvalidate.01": bing } : undefined,
  };
}

function absoluteAssetUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.replace(/^\/+/, "");
  return new URL(clean, `${siteRootUrl()}/`).toString();
}

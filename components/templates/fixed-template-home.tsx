import { NativeAdSlot } from "@/components/integrations/native-ad-slot";
import { Faq } from "@/components/site/faq";
import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { HomePageDefinition, InternalLink } from "@/config/types";
import { visibleCorePages } from "@/content/registry";
import { renderFixedDocument } from "@/lib/fixed-template/render";
import { renderSections } from "./fixed-template-content";
import { homeSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";

function supplement(home: HomePageDefinition): string {
  return `<div class="cb-content">${renderSections(home.sections)}<section class="cb-external" id="official-sources"><h2>Official source notes</h2><p>Information was checked against the official Chained Beasts Steam store and Featherweight Games announcements on October 20, 2026. Announced future changes are not described as already released.</p><p><a href="https://store.steampowered.com/app/3569420/Chained_Beasts/" rel="noopener noreferrer">Official Steam game</a> · <a href="https://steamcommunity.com/app/3569420" rel="noopener noreferrer">Official developer news</a> · <a href="https://www.featherweightgames.com/press-releases" rel="noopener noreferrer">Developer release news</a></p><p>Independent fan-made guide. Not affiliated with Featherweight Games or Valve.</p></section></div>`;
}

export function FixedTemplateHome({ home }: { home: HomePageDefinition }) {
  const skin = siteSkin();
  const links: InternalLink[] = visibleCorePages
    .filter((page) => page.slug.replace(/^\/+|\/+$/g, ""))
    .map((page) => ({ slug: page.slug, label: page.navLabel }));
  const entries = links.slice(0, 6).map((link) => ({
    href: routePath(link.slug),
    title: link.label,
    text: link.label,
  }));
  const rendered = renderFixedDocument({
    skin,
    page: "home",
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav: links.map((link) => ({ slug: link.slug, label: link.label, href: routePath(link.slug) })),
    homeHref: "/",
    logoUrl: assetPath(siteConfig.assets.logo),
    bannerUrl: assetPath(siteConfig.assets.cover),
    heading: home.hero.heading,
    lead: home.hero.lead,
    entries,
    supplementHtml: supplement(home),
  });
  return (
    <>
      <JsonLd data={homeSchemas(home)} />
      <div dangerouslySetInnerHTML={{ __html: rendered.rest }} />
      <div className="site-container"><NativeAdSlot /></div>
      {home.faq.length ? (
        <div className="site-container"><Faq items={home.faq} /></div>
      ) : null}
    </>
  );
}

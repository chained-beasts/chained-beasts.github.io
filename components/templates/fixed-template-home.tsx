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
  // Each card offers a brief, distinct answer before sending readers to its focused guide.
  const guideSummaries: Record<string, string> = {
    "patch-notes": "Three confirmed October hotfixes, plus upcoming balance changes and the November–December roadmap.",
    "beginner-guide": "Get started with chain positioning, safer weapon throws, arena hazards, and recovery decisions.",
    "crossplay": "Online crossplay supports 1–4 players. Understand local co-op and what platform pairings remain unconfirmed.",
    "solo-guide": "Yes, you can play solo. Learn practical tactics and check the status of planned difficulty balancing.",
    "afflictions": "Understand 70+ afflictions, the Surgeon, and healing trade-offs without speculative cure rates.",
  };
  const entries = visibleCorePages.slice(0, 6).map((page) => ({
    href: routePath(page.slug),
    title: page.navLabel,
    text: guideSummaries[page.slug] ?? page.description,
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
      {home.faq.length ? (
        <div className="site-container py-12 sm:py-16"><Faq items={home.faq} /></div>
      ) : null}
    </>
  );
}

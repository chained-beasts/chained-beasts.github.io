import { JsonLd } from "@/components/site/json-ld";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { SeoPageDefinition } from "@/config/types";
import { enabledLegalPages, getRelatedPages, visibleCorePages } from "@/content/registry";
import { esc, renderFixedDocument } from "@/lib/fixed-template/render";
import { renderLinks, renderSections } from "./fixed-template-content";
import { pageSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";

function articleInner(page: SeoPageDefinition): string {
  const faq = page.faq?.length ? `<section class="cb-faq" id="faq"><h2>Frequently Asked Questions</h2>${page.faq.map(item=>`<details open><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`).join("")}</section>` : "";
  const related = getRelatedPages(page);
  const relatedHtml = related.length ? `<section id="related"><h2>Related Chained Beasts guides</h2>${renderLinks(related.map(item => ({slug:item.slug,label:item.navLabel,description:item.description})))}</section>` : "";
  return `<p class="lead">${esc(page.hero.lead)}</p><p class="cb-status">Last reviewed: ${esc(page.lastReviewed)}</p><div class="cb-content">${renderSections(page.sections)}${faq}${relatedHtml}<section class="cb-external" id="official-sources"><h2>Official source notes</h2><p>Information was checked against the official Chained Beasts Steam store and Featherweight Games announcements on October 20, 2026. Announced future changes are not described as already released.</p><p><a href="https://store.steampowered.com/app/3569420/Chained_Beasts/" rel="noopener noreferrer">Official Steam game</a> · <a href="https://steamcommunity.com/app/3569420" rel="noopener noreferrer">Official developer news</a> · <a href="https://www.featherweightgames.com/press-releases" rel="noopener noreferrer">Developer release news</a></p><p>Independent fan-made guide. Not affiliated with Featherweight Games or Valve.</p></section></div>`;
}

export function FixedTemplateInner({ page }: { page: SeoPageDefinition }) {
  const skin = siteSkin();
  const nav = visibleCorePages
    .filter((item) => item.slug.replace(/^\/+|\/+$/g, ""))
    .map((item) => ({ slug: item.slug.replace(/^\/+|\/+$/g, ""), label: item.navLabel, href: routePath(item.slug) }));
  const rendered = renderFixedDocument({
    skin,
    page: "inner",
    accentColorId: siteConfig.theme.accentColorId,
    gameName: siteConfig.game.name || siteConfig.shortName,
    nav,
    currentSlug: page.slug,
    homeHref: skin === "arcade-play" ? assetPath("/") : "/",
    logoUrl: skin === "arcade-play" ? assetPath(siteConfig.assets.logo) : null,
    ...(skin === "arcade-play" ? { legalLinks: enabledLegalPages.map((item) => ({ slug: item.slug, label: item.navLabel, href: assetPath(routePath(item.slug)) })) } : {}),
    heading: page.hero.heading,
    lead: page.hero.lead,
    articleHtml: articleInner(page),
  });
  return (
    <>
      <JsonLd data={pageSchemas(page)} />
      <div dangerouslySetInnerHTML={{ __html: rendered.rest }} />
    </>
  );
}

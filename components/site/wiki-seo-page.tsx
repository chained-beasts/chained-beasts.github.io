import { CalendarCheck2 } from "lucide-react";
import Link from "next/link";
import { NativeAdSlot } from "@/components/integrations/native-ad-slot";
import type { SeoPageDefinition } from "@/config/types";
import { getRelatedPages, visibleCorePages } from "@/content/registry";
import { pageSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";
import { Breadcrumbs } from "./breadcrumbs";
import { Faq } from "./faq";
import { JsonLd } from "./json-ld";
import { RelatedPages } from "./related-pages";
import { WikiPageSections } from "./wiki-page-sections";
import { WikiShell } from "./wiki-shell";
import { WikiToc, wikiTocItems } from "./wiki-toc";

export function WikiSeoPage({ page }: { page: SeoPageDefinition }) {
  const related = getRelatedPages(page);
  const quickLinks = visibleCorePages.filter((item) => item.slug !== page.slug);
  const tocItems = wikiTocItems(page.sections, [
    ...(page.screenshots?.length ? [{ id: "screenshots", heading: "Gameplay Screenshots" }] : []),
    ...(page.faq?.length ? [{ id: "faq", heading: "Frequently Asked Questions" }] : []),
  ]);

  return (
    <>
      <JsonLd data={pageSchemas(page)} />
      <main>
        <section className="hero-surface wiki-hero border-b border-border">
          <div className="site-container">
            <Breadcrumbs slug={page.slug} current={page.hero.heading} />
            {page.hero.eyebrow ? <p className="eyebrow">{page.hero.eyebrow}</p> : null}
            <h1>{page.hero.heading}</h1>
            <p className="wiki-hero-lead">{page.hero.lead}</p>
            <p className="wiki-reviewed">
              <CalendarCheck2 size={16} className="text-primary" />
              Last reviewed: <time dateTime={page.lastReviewed}>{page.lastReviewed}</time>
            </p>
          </div>
        </section>

        <div className="site-container"><NativeAdSlot /></div>

        <div className="site-container wiki-page-body">
          <WikiShell
            sidebar={(
              <>
                <WikiToc items={tocItems} />
                {related.length ? (
                  <nav className="wiki-sidebar-links" aria-label="Related pages">
                    <p className="wiki-sidebar-title">Related</p>
                    <ul>
                      {related.map((item) => (
                        <li key={item.slug}>
                          <Link href={routePath(item.slug)}>{item.navLabel}</Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                ) : null}
                {quickLinks.length ? (
                  <nav className="wiki-sidebar-links" aria-label="Quick links">
                    <p className="wiki-sidebar-title">Quick links</p>
                    <ul>
                      {quickLinks.map((item) => (
                        <li key={item.slug}>
                          <Link href={routePath(item.slug)}>{item.navLabel}</Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                ) : null}
              </>
            )}
          >
            <WikiPageSections sections={page.sections} />
            {page.screenshots?.length ? (
              <section id="screenshots" className="scroll-mt-24">
                <h2>Gameplay Screenshots</h2>
                <div className="wiki-gallery">
                  {page.screenshots.map((shot) => (
                    <figure key={shot.src}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assetPath(shot.src)} alt={shot.alt} />
                      {shot.caption ? <figcaption>{shot.caption}</figcaption> : null}
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}
            {page.faq?.length ? <Faq items={page.faq} /> : null}
          </WikiShell>
          <RelatedPages pages={related} />
        </div>
      </main>
    </>
  );
}

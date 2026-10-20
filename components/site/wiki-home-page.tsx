import { BookOpen, ExternalLink, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { NativeAdSlot } from "@/components/integrations/native-ad-slot";
import { Faq } from "@/components/site/faq";
import { JsonLd } from "@/components/site/json-ld";
import { WikiPageSections } from "@/components/site/wiki-page-sections";
import { WikiShell } from "@/components/site/wiki-shell";
import { WikiToc, wikiTocItems } from "@/components/site/wiki-toc";
import { siteConfig } from "@/config/site";
import { homePage } from "@/content/home";
import { visibleCorePages } from "@/content/registry";
import { homeSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";

function quickFacts() {
  return (
    [
      ["Game", siteConfig.game.name],
      ["Platform", siteConfig.game.platform],
      ["Developer", siteConfig.game.developer],
      ["Genre", siteConfig.game.genre],
    ] as const
  ).filter(([, value]) => {
    const trimmed = value.trim();
    return trimmed.length > 0 && !/^needs verification$/i.test(trimmed) && trimmed.toLowerCase() !== "unknown";
  });
}

export function WikiHomePage() {
  const facts = quickFacts();
  const tocItems = wikiTocItems(homePage.sections, [
    ...(homePage.screenshots.length ? [{ id: "screenshots", heading: "Example Game Screenshots" }] : []),
    ...(homePage.faq.length ? [{ id: "faq", heading: "Frequently Asked Questions" }] : []),
  ]);

  return (
    <>
      <JsonLd data={homeSchemas(homePage)} />
      <main>
        <section className="hero-surface wiki-hero border-b border-border">
          <div className="site-container">
            <p className="eyebrow">{homePage.hero.eyebrow}</p>
            <h1>{homePage.hero.heading}</h1>
            <p className="wiki-hero-lead">{homePage.hero.lead}</p>
            <p className="wiki-hero-support">{homePage.hero.supportingText}</p>
            <div className="wiki-hero-actions">
              {homePage.hero.primaryLink ? (
                <Link href={routePath(homePage.hero.primaryLink.slug)} className="button-primary">
                  <BookOpen size={18} />{homePage.hero.primaryLink.label}
                </Link>
              ) : null}
              {siteConfig.game.officialUrl && homePage.hero.secondaryLink ? (
                <a href={siteConfig.game.officialUrl} rel="noopener noreferrer" className="button-secondary">
                  <Gamepad2 size={18} />{homePage.hero.secondaryLink.label}<ExternalLink size={15} />
                </a>
              ) : null}
            </div>
          </div>
        </section>

        <div className="site-container"><NativeAdSlot /></div>

        <div className="site-container wiki-page-body">
          {facts.length ? (
            <section className="wiki-facts" aria-label="Quick facts">
              <dl>
                {facts.map(([term, value]) => (
                  <div key={term}>
                    <dt>{term}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {visibleCorePages.length ? (
            <nav className="wiki-quick-nav" aria-label="Quick navigation">
              <p className="wiki-kicker">Quick navigation</p>
              <ul>
                {visibleCorePages.map((page) => (
                  <li key={page.slug}>
                    <Link href={routePath(page.slug)}>
                      <strong>{page.navLabel}</strong>
                      <span>{page.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <WikiShell
            sidebar={(
              <>
                <WikiToc items={tocItems} />
                <section className="wiki-site-info" aria-label="Site info">
                  <p className="wiki-sidebar-title">Site info</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetPath(siteConfig.assets.cover)} alt={`${siteConfig.game.name} guide cover`} />
                  <dl>
                    {facts.map(([term, value]) => (
                      <div key={term}>
                        <dt>{term}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              </>
            )}
          >
            <WikiPageSections sections={homePage.sections} />
            {homePage.screenshots.length ? (
              <section id="screenshots" className="scroll-mt-24">
                <p className="eyebrow">Visual reference</p>
                <h2>Example Game Screenshots</h2>
                <div className="wiki-gallery">
                  {homePage.screenshots.map((shot) => (
                    <figure key={shot.src}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={assetPath(shot.src)} alt={shot.alt} />
                      {shot.caption ? <figcaption>{shot.caption}</figcaption> : null}
                    </figure>
                  ))}
                </div>
              </section>
            ) : null}
            {homePage.faq.length ? <Faq items={homePage.faq} /> : null}
          </WikiShell>
        </div>
      </main>
    </>
  );
}

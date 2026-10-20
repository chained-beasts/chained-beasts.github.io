import { BookOpen, ExternalLink, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { NativeAdSlot } from "@/components/integrations/native-ad-slot";
import { Faq } from "@/components/site/faq";
import { JsonLd } from "@/components/site/json-ld";
import { PageSections } from "@/components/site/page-sections";
import { SkinHomePage } from "@/components/site/skin-home";
import { FixedTemplateHome } from "@/components/templates/fixed-template-home";
import { isFixedTemplate } from "@/lib/fixed-template/mode";
import { WikiHomePage } from "@/components/site/wiki-home-page";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import { homePage } from "@/content/home";
import { homeSchemas } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { assetPath, routePath } from "@/lib/urls";

export const metadata = pageMetadata(homePage);

export default function HomePage() {
  if (isFixedTemplate()) return <FixedTemplateHome home={homePage} />;
  if (siteSkin() === "wiki") return <WikiHomePage />;
  if (siteSkin() !== "portal") return <SkinHomePage />;

  return (
    <>
      <JsonLd data={homeSchemas(homePage)} />
      <main>
        <section className="hero-surface border-b border-border">
          <div className="site-container grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <p className="eyebrow">{homePage.hero.eyebrow}</p>
              <h1>{homePage.hero.heading}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">{homePage.hero.lead}</p>
              <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">{homePage.hero.supportingText}</p>
              <div className="mt-8 flex flex-wrap gap-3">
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
            <aside className="content-card p-4 sm:p-5" aria-label="Game summary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetPath(siteConfig.assets.cover)} alt={`${siteConfig.game.name} guide cover`} className="aspect-[16/10] w-full rounded-[calc(var(--radius)*.75)] object-cover" />
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Game", siteConfig.game.name],
                  ["Platform", siteConfig.game.platform],
                  ["Developer", siteConfig.game.developer],
                  ["Genre", siteConfig.game.genre],
                ].map(([term, value]) => (
                  <div key={term} className="rounded-[calc(var(--radius)*.65)] bg-secondary p-4">
                    <dt className="text-xs text-muted-foreground">{term}</dt>
                    <dd className="mt-1 font-bold text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </section>

        <div className="site-container"><NativeAdSlot /></div>

        <div className="site-container space-y-20 py-14 sm:py-20">
          <PageSections sections={homePage.sections} />
          {homePage.screenshots.length ? <section>
            <p className="eyebrow">Visual reference</p>
            <h2>Example Game Screenshots</h2>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {homePage.screenshots.map((shot) => (
                <figure key={shot.src} className="content-card">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assetPath(shot.src)} alt={shot.alt} className="w-full rounded-[calc(var(--radius)*.7)]" />
                  {shot.caption ? <figcaption className="mt-3 text-sm text-muted-foreground">{shot.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          </section> : null}
          {homePage.faq.length ? <Faq items={homePage.faq} /> : null}
        </div>
      </main>
    </>
  );
}

import { BookOpen, ExternalLink, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { NativeAdSlot } from "@/components/integrations/native-ad-slot";
import { Faq } from "@/components/site/faq";
import { JsonLd } from "@/components/site/json-ld";
import { PageSections } from "@/components/site/page-sections";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import { homePage } from "@/content/home";
import { visibleCorePages } from "@/content/registry";
import { homeSchemas } from "@/lib/schema";
import { assetPath, routePath } from "@/lib/urls";

function Banner({ className }: { className: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={assetPath(siteConfig.assets.cover)} alt="" className={className} />
  );
}

function Actions() {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
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
  );
}

export function SkinHomePage() {
  const skin = siteSkin();
  const pages = visibleCorePages.slice(0, 8);
  const side = pages.slice(1, 3);
  const entries = pages.slice(0, 4);

  return (
    <>
      <JsonLd data={homeSchemas(homePage)} />
      <main className={`skin-home skin-home-${skin}`}>
        {skin === "resource" ? (
          <section className="skin-resource-hero site-container">
            <p className="eyebrow">{homePage.hero.eyebrow}</p>
            <h1>{homePage.hero.heading}</h1>
            <p className="section-lead">{homePage.hero.lead}</p>
            <Actions />
            <div className="skin-quick-links">
              {pages.map((page) => (
                <Link key={page.slug} href={routePath(page.slug)}>{page.navLabel}</Link>
              ))}
            </div>
          </section>
        ) : null}

        {skin === "editorial" ? (
          <section className="site-container skin-editorial-feature">
            <article>
              <Banner className="skin-editorial-photo" />
              <p className="eyebrow">Featured guide</p>
              <h1>{homePage.hero.heading}</h1>
              <p className="section-lead">{homePage.hero.lead}</p>
              <Actions />
            </article>
            <div>
              {side.map((page) => (
                <Link key={page.slug} href={routePath(page.slug)} className="content-card skin-side-link">
                  <strong>{page.navLabel}</strong>
                  <span>{page.description}</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {skin === "glass" ? (
          <section className="site-container skin-glass-hero">
            <p className="eyebrow">{homePage.hero.eyebrow}</p>
            <h1>{homePage.hero.heading}</h1>
            <p className="section-lead">{homePage.hero.lead}</p>
            <Actions />
            <div className="skin-glass-entries">
              {entries.map((page) => (
                <Link key={page.slug} href={routePath(page.slug)} className="content-card">
                  <h2>{page.navLabel}</h2>
                  <p>{page.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {skin === "pixel" ? (
          <section className="site-container skin-pixel-banner">
            <Banner className="skin-pixel-photo" />
            <div>
              <p className="eyebrow">{homePage.hero.eyebrow}</p>
              <h1>{homePage.hero.heading}</h1>
              <p className="section-lead">{homePage.hero.lead}</p>
              <Actions />
            </div>
          </section>
        ) : null}

        {skin === "horror" ? (
          <section className="site-container skin-horror-hero">
            <p className="eyebrow">{homePage.hero.eyebrow}</p>
            <h1>{homePage.hero.heading}</h1>
            <p className="section-lead">{homePage.hero.lead}</p>
            <Actions />
          </section>
        ) : null}

        <div className="site-container"><NativeAdSlot /></div>
        <div className={`site-container skin-home-body skin-home-body-${skin}`}>
          {skin === "resource" ? (
            <div className="skin-resource-columns">
              <div>
                <h2>Popular guides</h2>
                <PageSections sections={homePage.sections} />
              </div>
              <aside>
                <h2>Most viewed</h2>
                <ul>
                  {pages.map((page) => (
                    <li key={page.slug}><Link href={routePath(page.slug)}>{page.navLabel}</Link></li>
                  ))}
                </ul>
              </aside>
            </div>
          ) : (
            <PageSections sections={homePage.sections} />
          )}
          {homePage.faq.length ? <Faq items={homePage.faq} /> : null}
        </div>
      </main>
    </>
  );
}

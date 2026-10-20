import Link from "next/link";
import { visibleCorePages } from "@/content/registry";
import { siteConfig } from "@/config/site";
import { routePath } from "@/lib/urls";

export function FixedTemplateFooter() {
  return (
    <footer className="cb-footer" aria-label="Site footer">
      <div className="wrap cb-footer-grid">
        <div>
          <p className="cb-footer-title">{siteConfig.siteName}</p>
          <p>Independent fan-made guide. Not affiliated with Featherweight Games or Valve. No game downloads or official support impersonation.</p>
          <p>Reviewed October 20, 2026. Verify later changes against the developer&apos;s announcements.</p>
        </div>
        <div>
          <strong>Explore</strong>
          <nav aria-label="Footer navigation">
            <Link href="/">Home</Link>
            {visibleCorePages.map(page => <Link key={page.slug} href={routePath(page.slug)}>{page.navLabel}</Link>)}
          </nav>
          <strong>Sources</strong>
          <nav aria-label="Official sources">
            <a href="https://store.steampowered.com/app/3569420/Chained_Beasts/" rel="noopener noreferrer">Steam store</a>
            <a href="https://steamcommunity.com/app/3569420" rel="noopener noreferrer">Steam news</a>
            <a href="https://www.featherweightgames.com/press-releases" rel="noopener noreferrer">Developer announcements</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

import type { CSSProperties, ReactNode } from "react";
import { Analytics } from "@/components/integrations/analytics";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import { scopedTemplateCss } from "@/lib/fixed-template/render";
import { isFixedTemplate } from "@/lib/fixed-template/mode";
import { themes } from "@/config/themes";
import { enabledLegalPages, visibleCorePages } from "@/content/registry";
import { fontFaceCss } from "@/lib/fonts";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata = rootMetadata();

const navLinks = visibleCorePages.map((page) => ({ label: page.navLabel, slug: page.slug }));
const legalLinks = enabledLegalPages.map((page) => ({ label: page.navLabel, slug: page.slug }));

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const fixed = isFixedTemplate();
  const fixedSkin = siteSkin();
  const theme = themes[siteConfig.theme.preset] ?? themes["obsidian-red"] ?? themes["midnight-red"] ?? Object.values(themes)[0];
  const headerStyle = siteConfig.theme.headerStyle ?? "solid";
  const componentStyle = siteConfig.theme.componentStyle ?? "rounded";
  const style = Object.fromEntries(
    Object.entries({ ...(theme?.tokens ?? {}), ...(siteConfig.theme.overrides ?? {}) }).map(([key, value]) => [`--${key}`, value]),
  ) as CSSProperties;

  return (
    <html
      lang={siteConfig.language}
      data-theme={theme?.name ?? siteConfig.theme.preset}
      data-skin={siteConfig.theme.skin ?? "portal"}
      data-font={siteConfig.theme.fontId ?? "inter"}
      data-header-style={headerStyle}
      data-component-style={componentStyle}
      data-fixed-template={fixed ? fixedSkin : undefined}
      style={style}
    >
      <head>
        <Analytics />
      </head>
      <body data-fixed-template={fixed ? fixedSkin : undefined}>
        {fixed ? <style dangerouslySetInnerHTML={{ __html: scopedTemplateCss(fixedSkin, siteConfig.theme.accentColorId) }} /> : null}
        <style dangerouslySetInnerHTML={{ __html: fontFaceCss(siteConfig.hosting.basePath) }} />
        <a href="#main-content" className="skip-link">Skip to content</a>
        <SiteHeader links={navLinks} />
        <div id="main-content">{children}</div>
        {fixed ? null : <SiteFooter coreLinks={navLinks} legalLinks={legalLinks} />}
      </body>
    </html>
  );
}

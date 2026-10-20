"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { siteSkin } from "@/config/skin";
import type { InternalLink } from "@/config/types";
import { assetPath, routePath } from "@/lib/urls";
import { FixedTemplateHeader } from "@/components/templates/fixed-template-header";
import { isFixedTemplate } from "@/lib/fixed-template/mode";
import { SkinHeader } from "./skin-header";

function isCurrent(slug: string, pathname: string) {
  const target = routePath(slug).replace(/\/+$/, "") || "/";
  const path = pathname.replace(/\/+$/, "") || "/";
  if (target === "/") return path === "/";
  return path === target || path.endsWith(target);
}

export function SiteHeader({ links }: { links: InternalLink[] }) {
  if (isFixedTemplate()) return <FixedTemplateHeader links={links} />;
  const skin = siteSkin();
  if (skin !== "portal" && skin !== "wiki") return <SkinHeader links={links} skin={skin} />;
  return <PortalHeader links={links} />;
}

function PortalHeader({ links }: { links: InternalLink[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";

  return (
    <header className="site-header relative sticky top-0 z-50">
      <div className="site-container flex h-16 items-center justify-between gap-5">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetPath(siteConfig.assets.logo)} alt="" className="h-9 w-9 rounded-theme" />
          <span className="truncate text-base font-black tracking-tight text-foreground sm:text-lg">
            {siteConfig.shortName}
          </span>
        </Link>

        <button
          type="button"
          className="site-nav-toggle border border-border p-2 text-foreground md:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav
          aria-label="Primary navigation"
          className={`site-nav ${open ? "flex" : "hidden"} absolute inset-x-0 top-16 flex-col gap-1 border-b border-border p-4 shadow-theme md:static md:flex md:flex-row md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
        >
          {links.map((link) => {
            const active = isCurrent(link.slug, pathname);
            return (
              <Link
                key={link.slug}
                href={routePath(link.slug)}
                aria-current={active ? "page" : undefined}
                className={`site-nav-link px-3 py-2 text-sm font-bold text-muted-foreground transition hover:bg-secondary hover:text-foreground ${active ? "is-active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

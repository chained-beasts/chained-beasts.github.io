"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import type { InternalLink, ThemeSkin } from "@/config/types";
import { assetPath, routePath } from "@/lib/urls";

function current(slug: string, pathname: string) {
  const target = routePath(slug).replace(/\/+$/, "") || "/";
  const path = pathname.replace(/\/+$/, "") || "/";
  if (target === "/") return path === "/" || path.split("/").filter(Boolean).length === 0;
  return path === target || path.endsWith(target);
}

export function SkinHeader({ links, skin }: { links: InternalLink[]; skin: ThemeSkin }) {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const brand = (
    <Link href="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={assetPath(siteConfig.assets.logo)} alt="" className="h-9 w-9 rounded-theme object-cover" />
      <span className="truncate text-base font-black tracking-tight">{siteConfig.shortName}</span>
    </Link>
  );
  const nav = (
    <nav aria-label="Primary navigation" className={`skin-nav ${open ? "is-open" : ""}`}>
      {links.map((link) => {
        const active = current(link.slug, pathname);
        return (
          <Link
            key={link.slug || "home"}
            href={routePath(link.slug)}
            aria-current={active ? "page" : undefined}
            className={`site-nav-link ${active ? "is-active" : ""}`}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
  const toggle = (
    <button type="button" className="site-nav-toggle border border-border p-2 md:hidden" aria-expanded={open} aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen((value) => !value)}>
      {open ? <X size={20} /> : <Menu size={20} />}
    </button>
  );

  if (skin === "resource") {
    return (
      <header className="skin-header skin-header-resource">
        <div className="site-container skin-header-top">
          {brand}
          <form className="skin-search" role="search" onSubmit={(event) => event.preventDefault()}>
            <Search size={16} aria-hidden="true" />
            <input type="search" placeholder="Search guides" aria-label="Search guides" />
          </form>
          {toggle}
        </div>
        <div className="site-container">{nav}</div>
      </header>
    );
  }

  if (skin === "editorial") {
    return (
      <header className="skin-header skin-header-editorial">
        <div className="skin-accent-line" />
        <div className="site-container skin-header-top">
          {brand}
          {toggle}
          {nav}
        </div>
      </header>
    );
  }

  if (skin === "glass") {
    return (
      <header className="skin-header skin-header-glass">
        <div className="skin-glass-pill">
          {brand}
          {toggle}
          {nav}
        </div>
      </header>
    );
  }

  if (skin === "horror") {
    return (
      <header className="skin-header skin-header-horror">
        <div className="site-container skin-header-top">
          {brand}
          {toggle}
          {nav}
        </div>
      </header>
    );
  }

  return (
    <header className="skin-header skin-header-pixel">
      <div className="site-container skin-header-top">
        {brand}
        {toggle}
        {nav}
      </div>
    </header>
  );
}

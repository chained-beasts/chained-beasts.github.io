import { siteConfig } from "@/config/site";

export function normalizeBasePath(value: string) {
  if (!value || value === "/") return "";
  return `/${value.replace(/^\/+|\/+$/g, "")}`;
}

export function routePath(slug = "") {
  const clean = slug.replace(/^\/+|\/+$/g, "");
  return clean ? `/${clean}/` : "/";
}

export function siteRootUrl() {
  const configured = siteConfig.hosting.siteUrl.replace(/\/+$/, "");
  const basePath = normalizeBasePath(siteConfig.hosting.basePath);
  const parsed = new URL(configured);
  const currentPath = parsed.pathname.replace(/\/+$/, "");

  if (basePath && currentPath !== basePath && !currentPath.endsWith(basePath)) {
    parsed.pathname = `${currentPath}${basePath}`;
  }

  return parsed.toString().replace(/\/+$/, "");
}

export function absoluteUrl(slug = "") {
  const root = `${siteRootUrl()}/`;
  const clean = slug.replace(/^\/+|\/+$/g, "");
  const target = clean && /\.[a-z0-9]+$/i.test(clean) ? clean : clean ? `${clean}/` : "";
  return new URL(target, root).toString();
}

export function assetPath(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  const basePath = normalizeBasePath(siteConfig.hosting.basePath);
  return `${basePath}/${path.replace(/^\/+/, "")}`;
}

export function isInternalUrl(url: string) {
  return url.startsWith("/") || url.startsWith(siteRootUrl());
}

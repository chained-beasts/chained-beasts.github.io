"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Exact GET CODE supplied for this domain. Execute inside one isolated ad frame
// because the Adsterra banner loader may use document.write.
const desktopGetCode = "<script>\n  atOptions = {\n    'key' : '86170cbce6d0ab83964c5231ab0f2d52',\n    'format' : 'iframe',\n    'height' : 90,\n    'width' : 728,\n    'params' : {}\n  };\n</script>\n<script src=\"https://bauval.org/22/86170cbce6d0ab83964c5231ab0f2d52\"></script>";
const mobileGetCode = "<script>\n  atOptions = {\n    'key' : 'e840a64487e7f06b64f620a74ea2cb92',\n    'format' : 'iframe',\n    'height' : 50,\n    'width' : 320,\n    'params' : {}\n  };\n</script>\n<script src=\"https://bauval.org/22/e840a64487e7f06b64f620a74ea2cb92\"></script>";
const nativeSrc = "https://bauval.org/21/45a476f43739d044399f66b49b0101e4";
const nativeContainerId = "container-45a476f43739d044399f66b49b0101e4";
const socialSrc = "https://bauval.org/14/743c92d8ec9827850a3d2fe87040eac6";

function bannerDocument(code: string): string {
  return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden}</style></head><body>' +
    code + '</body></html>';
}
function initializeBanner(slot: HTMLElement, desktop: boolean) {
  const host = slot.querySelector<HTMLElement>("[data-adsterra-banner-frame]");
  if (!host) return;
  const type = desktop ? "desktop" : "mobile";
  if (host.firstElementChild?.getAttribute("data-banner-variant") === type) return;
  const width = desktop ? 728 : 320;
  const height = desktop ? 90 : 50;
  const iframe = document.createElement("iframe");
  iframe.setAttribute("title", "Advertisement");
  iframe.setAttribute("data-banner-variant", type);
  iframe.setAttribute("scrolling", "no");
  // This ad network's external loader needs a normal iframe origin: an opaque
  // sandbox blocks the external GET CODE request in Chromium.
  iframe.width = String(width);
  iframe.height = String(height);
  iframe.style.display = "block";
  iframe.style.width = "100%";
  iframe.style.maxWidth = width + "px";
  iframe.style.height = height + "px";
  iframe.style.border = "0";
  iframe.style.margin = "0 auto";
  // Only one of the two official GET CODE snippets is ever loaded per slot.
  iframe.srcdoc = bannerDocument(desktop ? desktopGetCode : mobileGetCode);
  host.replaceChildren(iframe);
}
function initializeNative(slot: HTMLElement) {
  const host = slot.querySelector<HTMLElement>("[data-adsterra-native-mount]");
  if (!host || host.querySelector('script[src="' + nativeSrc + '"]')) return;
  // Use the native GET CODE's script and container with their original attributes.
  const script = document.createElement("script");
  script.async = true;
  script.setAttribute("data-cfasync", "false");
  script.src = nativeSrc;
  const container = document.createElement("div");
  container.id = nativeContainerId;
  host.append(script, container);
}

export function AdsterraRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    // Root-layout instance persists across client navigation. Never remove/reinject.
    if (document.querySelector('script[src="' + socialSrc + '"]')) return;
    const script = document.createElement("script");
    script.setAttribute("data-cfasync", "false");
    script.src = socialSrc;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const refresh = () => {
      document.querySelectorAll<HTMLElement>("[data-adsterra-banner-slot]")
        .forEach(slot => initializeBanner(slot, media.matches));
      document.querySelectorAll<HTMLElement>("[data-adsterra-native-slot]")
        .forEach(initializeNative);
    };
    refresh();
    media.addEventListener("change", refresh);
    return () => media.removeEventListener("change", refresh);
  }, [pathname]);

  return null;
}

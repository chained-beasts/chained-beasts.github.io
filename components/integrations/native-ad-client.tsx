"use client";

import { useEffect, useRef } from "react";

export function NativeAdClient({ scriptUrl, containerId }: { scriptUrl: string; containerId: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const container = document.createElement("div");
    container.id = containerId;
    host.appendChild(container);

    const script = document.createElement("script");
    script.async = true;
    script.src = scriptUrl;
    script.dataset.cfasync = "false";
    script.dataset.gameWikiNativeAd = containerId;
    host.insertBefore(script, container);

    return () => {
      host.replaceChildren();
    };
  }, [containerId, scriptUrl]);

  return <div ref={hostRef} data-native-ad-slot />;
}

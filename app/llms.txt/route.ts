import { siteConfig } from "@/config/site";
import { enabledPages } from "@/content/registry";
import { absoluteUrl } from "@/lib/urls";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${siteConfig.siteName}`,
    "",
    siteConfig.description,
    "",
    "## Pages",
    `- [Home](${absoluteUrl()}): Main game overview and topic hub.`,
    ...enabledPages.map((page) => `- [${page.hero.heading}](${absoluteUrl(page.slug)}): ${page.description}`),
    "",
    "This is an independent, fan-made game information resource.",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

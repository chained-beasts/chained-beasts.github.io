import { siteConfig } from "@/config/site";
import { homePage } from "@/content/home";
import { enabledPages } from "@/content/registry";
import { pagePlainText } from "@/lib/content";
import { absoluteUrl } from "@/lib/urls";

export const dynamic = "force-static";

export function GET() {
  const blocks = [
    `# ${siteConfig.siteName}`,
    siteConfig.description,
    `Source: ${absoluteUrl()}`,
    "",
    `## ${homePage.hero.heading}`,
    pagePlainText(homePage),
    ...enabledPages.flatMap((page) => [
      "",
      `## ${page.hero.heading}`,
      `Source: ${absoluteUrl(page.slug)}`,
      pagePlainText(page),
    ]),
  ];
  return new Response(blocks.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

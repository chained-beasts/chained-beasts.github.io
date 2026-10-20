import { integrations } from "@/config/integrations";
import { siteConfig } from "@/config/site";
import type { SeoPageDefinition } from "@/config/types";

const privacyIntegrationParagraphs: string[] = [];

if (integrations.analytics.provider === "google-analytics") {
  privacyIntegrationParagraphs.push(
    "Google Analytics 4 is enabled to understand aggregate page usage. Google may process technical visit information under its own privacy terms.",
  );
}

if (integrations.ads.provider === "adsterra-native") {
  privacyIntegrationParagraphs.push(
    "Adsterra Native advertising is enabled. Adsterra may process technical request information and applies its own privacy policy.",
  );
}

export const legalPages: SeoPageDefinition[] = [
  {
    enabled: true,
    slug: "about",
    pageType: "legal",
    navLabel: "About",
    title: "About",
    description: `Learn how ${siteConfig.siteName} researches, labels and reviews single-game information.`,
    navVisible: false,
    hero: { heading: `About ${siteConfig.siteName}`, lead: "How this independent editorial resource is maintained." },
    sections: [
      { id: "mission", heading: "Our Editorial Mission", paragraphs: ["Help players find focused explanations, practical routes and clearly labeled data for one game."] },
      { id: "standards", heading: "Research and Corrections", paragraphs: ["Important claims should be checked against the current game version. Unconfirmed information stays labeled, and corrections should be made promptly."] },
      { id: "independence", heading: "Independent Status", paragraphs: ["This fan-made resource is not the game developer, publisher or platform owner and does not imply official endorsement."] },
    ],
    relatedSlugs: ["contact", "copyright"],
    lastReviewed: "2026-01-15",
  },
  {
    enabled: true,
    slug: "contact",
    pageType: "legal",
    navLabel: "Contact",
    title: "Contact & Corrections",
    description: `Read correction, attribution, copyright and technical issue guidance for ${siteConfig.siteName}.`,
    navVisible: false,
    hero: { heading: "Contact & Corrections", lead: "Guidance for factual corrections, attribution concerns, copyright questions and technical issues." },
    sections: [
      {
        id: "corrections",
        heading: "Factual Corrections",
        paragraphs: ["A useful correction identifies the affected page, the specific detail, the current game version when relevant, and a reliable supporting source."],
      },
      {
        id: "rights",
        heading: "Rights and Attribution",
        paragraphs: ["Rights or attribution concerns should identify the affected page and the protected work involved so the issue can be reviewed accurately."],
      },
      {
        id: "technical",
        heading: "Technical Issues",
        paragraphs: ["When documenting a technical issue, include the affected page, browser or device context, and a concise description of what happened."],
      },
    ],
    relatedSlugs: ["about", "copyright"],
    lastReviewed: "2026-10-03",
  },
  {
    enabled: true,
    slug: "privacy",
    pageType: "legal",
    navLabel: "Privacy",
    title: "Privacy Policy",
    description: `Read the privacy policy for ${siteConfig.siteName}, including enabled measurement or advertising services.`,
    navVisible: false,
    hero: { heading: "Privacy Policy", lead: "A plain-language summary of the data this static site and its enabled services may process." },
    sections: [
      { id: "site-data", heading: "Data This Site Collects", paragraphs: ["The static site does not provide accounts, comments or a database for storing visitor submissions."] },
      {
        id: "integrations",
        heading: "Optional Third-Party Services",
        paragraphs: privacyIntegrationParagraphs.length
          ? privacyIntegrationParagraphs
          : ["No audience measurement or advertising integration is currently enabled."],
      },
      { id: "external-links", heading: "External Links", paragraphs: ["A link to another website is governed by that website's own terms and privacy practices."] },
      { id: "changes", heading: "Policy Changes", paragraphs: ["Update this page and its review date whenever the site's integrations or data practices change."] },
    ],
    relatedSlugs: ["terms", "contact"],
    lastReviewed: "2026-01-15",
  },
  {
    enabled: true,
    slug: "terms",
    pageType: "legal",
    navLabel: "Terms",
    title: "Terms of Use",
    description: `Read the terms for using the guides and reference information on ${siteConfig.siteName}.`,
    navVisible: false,
    hero: { heading: "Terms of Use", lead: "Conditions for using this independent guide and reference website." },
    sections: [
      { id: "informational", heading: "Informational Use", paragraphs: ["Content is provided for general game information and may change when the game is updated."] },
      { id: "accuracy", heading: "Accuracy and Availability", paragraphs: ["Reasonable care should be taken when publishing, but uninterrupted availability or complete accuracy cannot be guaranteed."] },
      { id: "acceptable-use", heading: "Acceptable Use", paragraphs: ["Do not misuse the site, interfere with access or reproduce substantial original content without permission."] },
    ],
    relatedSlugs: ["privacy", "copyright"],
    lastReviewed: "2026-01-15",
  },
  {
    enabled: true,
    slug: "copyright",
    pageType: "legal",
    navLabel: "Copyright",
    title: "Copyright and Attribution",
    description: `Review copyright, trademark, media ownership and attribution information for the independent ${siteConfig.siteName} resource.`,
    navVisible: false,
    hero: { heading: "Copyright and Attribution", lead: "Ownership and reporting guidance for editorial content, game names and media." },
    sections: [
      { id: "editorial", heading: "Original Editorial Content", paragraphs: ["Original explanations, page organization and site design remain protected unless a separate license says otherwise."] },
      { id: "game-rights", heading: "Game and Platform Rights", paragraphs: ["Game names, trademarks, screenshots and related assets belong to their respective owners. Their use does not imply endorsement."] },
      { id: "report", heading: "Rights Concerns", paragraphs: ["A rights concern should identify the exact page, the protected work involved and reliable ownership context so the issue can be reviewed accurately."] },
    ],
    relatedSlugs: ["contact", "terms"],
    lastReviewed: "2026-01-15",
  },
];

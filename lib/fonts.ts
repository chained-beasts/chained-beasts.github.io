/** Self-hosted OFL families. Files are copied from Fontsource packages. */
const FONT_FILES: Array<{ family: string; weight: number; file: string }> = [
  { family: "Inter", weight: 400, file: "inter-latin-400-normal.woff2" },
  { family: "Inter", weight: 600, file: "inter-latin-600-normal.woff2" },
  { family: "Inter", weight: 700, file: "inter-latin-700-normal.woff2" },
  { family: "Manrope", weight: 600, file: "manrope-latin-600-normal.woff2" },
  { family: "Manrope", weight: 700, file: "manrope-latin-700-normal.woff2" },
  { family: "Barlow", weight: 600, file: "barlow-latin-600-normal.woff2" },
  { family: "Barlow", weight: 700, file: "barlow-latin-700-normal.woff2" },
  { family: "Source Sans 3", weight: 400, file: "source-sans-3-latin-400-normal.woff2" },
  { family: "Source Sans 3", weight: 600, file: "source-sans-3-latin-600-normal.woff2" },
  { family: "Source Sans 3", weight: 700, file: "source-sans-3-latin-700-normal.woff2" },
  { family: "IBM Plex Sans", weight: 400, file: "ibm-plex-sans-latin-400-normal.woff2" },
  { family: "IBM Plex Sans", weight: 600, file: "ibm-plex-sans-latin-600-normal.woff2" },
  { family: "Atkinson Hyperlegible", weight: 400, file: "atkinson-hyperlegible-latin-400-normal.woff2" },
  { family: "Atkinson Hyperlegible", weight: 700, file: "atkinson-hyperlegible-latin-700-normal.woff2" },
  { family: "Oswald", weight: 500, file: "oswald-latin-500-normal.woff2" },
  { family: "Oswald", weight: 600, file: "oswald-latin-600-normal.woff2" },
  { family: "Space Grotesk", weight: 500, file: "space-grotesk-latin-500-normal.woff2" },
  { family: "Space Grotesk", weight: 700, file: "space-grotesk-latin-700-normal.woff2" },
  { family: "Sora", weight: 600, file: "sora-latin-600-normal.woff2" },
  { family: "Sora", weight: 700, file: "sora-latin-700-normal.woff2" },
  { family: "Anonymous Pro", weight: 400, file: "anonymous-pro-latin-400-normal.woff2" },
  { family: "Anonymous Pro", weight: 700, file: "anonymous-pro-latin-700-normal.woff2" },
  { family: "IBM Plex Mono", weight: 500, file: "ibm-plex-mono-latin-500-normal.woff2" },
  { family: "IBM Plex Mono", weight: 600, file: "ibm-plex-mono-latin-600-normal.woff2" },
  { family: "Cormorant Garamond", weight: 500, file: "cormorant-garamond-latin-500-normal.woff2" },
  { family: "Cormorant Garamond", weight: 600, file: "cormorant-garamond-latin-600-normal.woff2" },
  { family: "Barlow Condensed", weight: 600, file: "barlow-condensed-latin-600-normal.woff2" },
  { family: "Barlow Condensed", weight: 700, file: "barlow-condensed-latin-700-normal.woff2" },
  { family: "Source Serif 4", weight: 500, file: "source-serif-4-latin-500-normal.woff2" },
  { family: "Source Serif 4", weight: 600, file: "source-serif-4-latin-600-normal.woff2" },
];

export function fontFaceCss(basePath = "") {
  const prefix = basePath.replace(/\/$/, "");
  return FONT_FILES.map((face) => `@font-face{font-family:"${face.family}";src:url("${prefix}/fonts/${face.file}") format("woff2");font-weight:${face.weight};font-style:normal;font-display:swap;}`).join("");
}

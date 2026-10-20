/** Fixed template catalog and extensible skin registry. */

export const TEMPLATE_VERSION = 2 as const;

export const ACCENT_COLOR_IDS = ["default", "blue", "red", "white", "black", "orange", "cyan", "purple"] as const;
export type AccentColorId = (typeof ACCENT_COLOR_IDS)[number];

export const ACCENT_SWATCHES: ReadonlyArray<{ id: AccentColorId; label: string; hex: string | null }> = [
  { id: "default", label: "默认", hex: null },
  { id: "blue", label: "蓝色", hex: "#3B82F6" },
  { id: "red", label: "红色", hex: "#EF4444" },
  { id: "white", label: "白色", hex: "#F8FAFC" },
  { id: "black", label: "黑色", hex: "#18181B" },
  { id: "orange", label: "橙色", hex: "#F97316" },
  { id: "cyan", label: "青色", hex: "#06B6D4" },
  { id: "purple", label: "紫色", hex: "#8B5CF6" },
];

export type RegistryHeaderStyle = "solid" | "glass" | "border";
export type RegistryComponentStyle = "rounded" | "sharp" | "pill";

interface TemplatePackBase {
  skin: string;
  specId: string;
  defaultAccent: string;
  background: string;
  dark: boolean;
  mixedChrome: boolean;
  fontId: string;
}

const RAW_TEMPLATE_PACKS = [
  {
    skin: "horror",
    specId: "site-template",
    defaultAccent: "#B3131B",
    background: "#070707",
    dark: true,
    mixedChrome: false,
    fontId: "cormorant"
  }
] as const satisfies readonly TemplatePackBase[];

export type TemplateSkin = "portal" | "wiki" | "resource" | "editorial" | "glass" | "pixel" | "horror" | "soft-guide" | "dark-editorial" | "desktop" | "directory" | "modular-wiki" | "cozy-wiki" | "classic-encyclopedia" | "guidebook" | "pastel-wiki" | "technical-wiki" | "block-wiki" | "arcade-play";
export type TemplatePack = Omit<TemplatePackBase, "skin"> & { skin: TemplateSkin };
export const TEMPLATE_PACKS: readonly TemplatePack[] = RAW_TEMPLATE_PACKS;

const PACK_BY_SKIN = new Map(TEMPLATE_PACKS.map((pack) => [pack.skin, pack]));

export function isTemplateSkin(value: unknown): value is TemplateSkin {
  return typeof value === "string" && PACK_BY_SKIN.has(value as TemplateSkin);
}

export function templatePack(skin: string): TemplatePack {
  return PACK_BY_SKIN.get(skin as TemplateSkin) ?? TEMPLATE_PACKS[0];
}

export function isAccentColorId(value: unknown): value is AccentColorId {
  return typeof value === "string" && (ACCENT_COLOR_IDS as readonly string[]).includes(value);
}

export interface AccentPaint {
  id: AccentColorId;
  /** Swatch hex, or the template default when id is "default". */
  accent: string;
  /** Color written to --accent. May differ from `accent` so text stays readable. */
  textAccent: string;
  ctaBg: string;
  ctaFg: string;
  ctaBorder: string;
  /** Hex passed into the legacy token derivation so QA contrast still passes. */
  tokenHex: string;
  /** Page text or CTA fill had to move so black/white accents stay visible. */
  chromeFix: boolean;
}

function hexChannels(hex: string): { r: number; g: number; b: number } {
  const raw = hex.replace("#", "");
  return {
    r: Number.parseInt(raw.slice(0, 2), 16),
    g: Number.parseInt(raw.slice(2, 4), 16),
    b: Number.parseInt(raw.slice(4, 6), 16),
  };
}

function channelLuma(value: number): number {
  const srgb = value / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

function contrast(hexA: string, hexB: string): number {
  const a = hexChannels(hexA);
  const b = hexChannels(hexB);
  const la = 0.2126 * channelLuma(a.r) + 0.7152 * channelLuma(a.g) + 0.0722 * channelLuma(a.b);
  const lb = 0.2126 * channelLuma(b.r) + 0.7152 * channelLuma(b.g) + 0.0722 * channelLuma(b.b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

function bestInk(bg: string): string {
  return contrast("#FFFFFF", bg) >= contrast("#18181B", bg) ? "#FFFFFF" : "#18181B";
}

function isLight(hex: string): boolean {
  const { r, g, b } = hexChannels(hex);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.72;
}

export function accentSwatchHex(id: AccentColorId, skin: string): string {
  if (id === "default") return templatePack(skin).defaultAccent;
  return ACCENT_SWATCHES.find((item) => item.id === id)?.hex ?? templatePack(skin).defaultAccent;
}

export function resolveAccent(skin: string, id: string | null | undefined): AccentPaint {
  const pack = templatePack(skin);
  const accentId = isAccentColorId(id) ? id : "default";
  const accent = accentSwatchHex(accentId, pack.skin);
  const onPage = contrast(accent, pack.background);
  const textAccent = onPage >= 4.5 ? accent : (pack.dark ? "#F8FAFC" : "#18181B");
  let ctaBg = accent;
  let ctaFg = bestInk(accent);
  let ctaBorder = "transparent";
  const fillDisappears = contrast(accent, pack.background) < 2.4;
  const textDisappears = contrast(ctaFg, accent) < 4.5;
  if (fillDisappears || textDisappears) {
    if (pack.dark) {
      ctaBg = "#18181B";
      ctaFg = "#FFFFFF";
      ctaBorder = "#E4E4E7";
    } else {
      ctaBg = "#FFFFFF";
      ctaFg = "#18181B";
      ctaBorder = "#18181B";
    }
  }
  const tokenHex = isLight(pack.background) && isLight(accent) ? "#18181B" : accent;
  // Approved templates paint CTA labels white. Only take over that label when white
  // would disappear, or when the accent itself cannot sit on the page.
  const chromeFix = textAccent !== accent || ctaBorder !== "transparent" || contrast("#FFFFFF", ctaBg) < 2.2;
  return { id: accentId, accent, textAccent, ctaBg, ctaFg, ctaBorder, tokenHex, chromeFix };
}

export function accentOverrideCss(skin: string, paint: AccentPaint): string {
  const pack = templatePack(skin);
  const rules = [
    `:root{--accent:${paint.textAccent};--accent-foreground:${paint.ctaFg};--accent-border:${paint.ctaBorder};--accent-cta:${paint.ctaBg};--accent-soft:${paint.textAccent}1A}`,
  ];
  if (paint.chromeFix) {
    rules.push(`.btn.primary,a.btn.primary{background:var(--accent-cta);color:var(--accent-foreground);border-color:var(--accent-border)}`);
  }
  if (!paint.chromeFix) return rules.join("");
  if (pack.skin === "pixel") {
    rules.push(`.brand span{background:${paint.ctaBg};color:${paint.ctaFg}}`);
  }
  if (pack.skin === "horror") {
    rules.push(`.nav-link.active{background:${paint.ctaBg};color:${paint.ctaFg};box-shadow:inset 0 0 0 1px ${paint.ctaBorder === "transparent" ? paint.ctaFg : paint.ctaBorder}}`);
  }
  if (pack.mixedChrome) {
    const chrome = pack.dark ? paint.textAccent : (isLight(paint.accent) ? "#F8FAFC" : paint.accent);
    rules.push(`.topline{background:${chrome}}`);
    rules.push(`.logo span,.brand span{color:${pack.skin === "pixel" ? paint.ctaFg : chrome}}`);
    rules.push(`.nav-link.active{border-bottom-color:${chrome}}`);
    rules.push(`.kicker{color:${chrome}}`);
  }
  return rules.join("");
}

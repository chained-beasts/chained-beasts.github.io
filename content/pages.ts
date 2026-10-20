import type { SeoPageDefinition } from "@/config/types";
import rawPages from "./generated/pages.json";

export const corePages = rawPages as SeoPageDefinition[];

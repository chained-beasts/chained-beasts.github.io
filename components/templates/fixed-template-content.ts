import type { PageSection, DataTable, InternalLink } from "@/config/types";
import { esc } from "@/lib/fixed-template/render";
import { routePath } from "@/lib/urls";

export function renderLinks(links?: InternalLink[]): string {
  if (!links?.length) return "";
  return `<ul class="cb-links">${links.map(link => `<li><a href="${esc(routePath(link.slug))}"><strong>${esc(link.label)}</strong>${link.description ? `<span>${esc(link.description)}</span>` : ""}</a></li>`).join("")}</ul>`;
}
function renderTable(table?: DataTable): string {
  if (!table) return "";
  return `<div class="cb-table-wrap" role="region" aria-label="${esc(table.caption)}" tabindex="0"><table class="cb-table"><caption>${esc(table.caption)}</caption><thead><tr>${table.columns.map(col => `<th scope="col">${esc(col)}</th>`).join("")}</tr></thead><tbody>${table.rows.map(row => `<tr>${row.map(value => `<td>${esc(value)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
export function renderSections(sections: PageSection[]): string {
  return sections.map(section => {
    const paragraphs = (section.paragraphs ?? []).map(p => `<p>${esc(p)}</p>`).join("");
    const subs = section.subsections?.length
      ? `<div class="cb-subsections">${section.subsections.map(sub => `<div class="cb-subsection"><h3>${esc(sub.heading)}</h3>${sub.paragraphs.map(p=>`<p>${esc(p)}</p>`).join("")}${sub.bullets?.length ? `<ul>${sub.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}${renderTable(sub.table)}</div>`).join("")}</div>`
      : "";
    const steps = section.steps?.length
      ? `<ol class="cb-steps">${section.steps.map(step => `<li><h3>${esc(step.heading)}</h3><p>${esc(step.description)}</p></li>`).join("")}</ol>`
      : "";
    return `<section id="${esc(section.id)}"><h2>${esc(section.heading)}</h2>${section.intro ? `<p>${esc(section.intro)}</p>` : ""}${paragraphs}${subs}${steps}${renderTable(section.table)}${renderLinks(section.links)}</section>`;
  }).join("");
}

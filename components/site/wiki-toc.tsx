import type { PageSection } from "@/config/types";

export interface WikiTocItem {
  id: string;
  heading: string;
}

export function wikiTocItems(sections: PageSection[], extras: WikiTocItem[] = []): WikiTocItem[] {
  return [
    ...sections.map((section) => ({ id: section.id, heading: section.heading })),
    ...extras,
  ];
}

export function WikiToc({ items }: { items: WikiTocItem[] }) {
  if (!items.length) return null;

  return (
    <nav className="wiki-toc" aria-label="On this page">
      <p className="wiki-sidebar-title">On this page</p>
      <ol className="wiki-toc-list">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.heading}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

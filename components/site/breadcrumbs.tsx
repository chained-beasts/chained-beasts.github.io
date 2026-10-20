import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { routePath } from "@/lib/urls";

export function Breadcrumbs({ slug, current }: { slug: string; current: string }) {
  const segments = slug.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="mb-7 text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link href="/" className="hover:text-primary">Home</Link></li>
        {segments.map((segment, index) => {
          const final = index === segments.length - 1;
          const partial = segments.slice(0, index + 1).join("/");
          return (
            <li key={partial} className="flex items-center gap-2">
              <ChevronRight size={14} aria-hidden="true" />
              {final ? <span aria-current="page">{current}</span> : <Link href={routePath(partial)}>{segment.replace(/-/g, " ")}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

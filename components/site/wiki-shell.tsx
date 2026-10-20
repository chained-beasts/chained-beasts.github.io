import type { ReactNode } from "react";

export function WikiShell({ children, sidebar }: { children: ReactNode; sidebar: ReactNode }) {
  return (
    <div className="wiki-shell">
      <div className="wiki-main">{children}</div>
      <aside className="wiki-sidebar">{sidebar}</aside>
    </div>
  );
}

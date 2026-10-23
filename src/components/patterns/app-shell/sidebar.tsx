"use client";

import { Compass } from "lucide-react";
import type { NavItem, NavSection } from "@/lib/nav/nav";
import { NavList } from "./nav-list";

export type SidebarMode = "auto" | "collapsed" | "expanded";

// 240 px wide, 56 px when collapsed (design-system.md section 3.1). "auto" is expanded from the lg
// breakpoint up and collapsed on tablets, until the person chooses.
export function Sidebar({
  sections,
  activeId,
  onSelect,
  mode,
}: {
  sections: NavSection[];
  activeId: string;
  onSelect?: (item: NavItem) => void;
  mode: SidebarMode;
}) {
  return (
    <aside
      data-sidebar={mode}
      className="group/sb hidden shrink-0 flex-col border-r bg-surface-muted transition-[width] duration-150 md:flex md:data-[sidebar=auto]:w-14 md:data-[sidebar=collapsed]:w-14 md:data-[sidebar=expanded]:w-60 lg:data-[sidebar=auto]:w-60"
    >
      <div className="flex h-13 shrink-0 items-center gap-2 px-3">
        <Compass className="size-5 shrink-0 text-primary" aria-hidden="true" />
        <span className="truncate text-md font-semibold group-data-[sidebar=collapsed]/sb:hidden max-lg:group-data-[sidebar=auto]/sb:hidden">
          INV Compass
        </span>
      </div>
      <div className="flex-1 overflow-x-visible overflow-y-auto px-2 pb-4">
        <NavList sections={sections} activeId={activeId} onSelect={onSelect} />
      </div>
    </aside>
  );
}

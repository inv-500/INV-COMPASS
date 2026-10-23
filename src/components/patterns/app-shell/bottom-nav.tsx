"use client";

import { Menu } from "lucide-react";
import * as React from "react";
import { MoreDrawer } from "./more-drawer";
import { NAV_ICONS } from "@/components/patterns/nav-icons";
import type { NavItem, NavSection } from "@/lib/nav/nav";
import { cn } from "@/lib/utils";
import { NavLink } from "./nav-link";

// Phone bottom bar: at most five items (four tabs and More), 44 px targets, below the tablet breakpoint.
// More opens the full menu, which is the same list the desktop sidebar shows.
export function BottomNav({
  tabs,
  sections,
  activeId,
  onSelect,
}: {
  tabs: NavItem[];
  sections: NavSection[];
  activeId: string;
  onSelect?: (item: NavItem) => void;
}) {
  const [moreOpen, setMoreOpen] = React.useState(false);
  const tabClasses =
    "flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-xs text-muted-foreground";

  return (
    <>
      <nav
        aria-label="Main tabs"
        className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        {tabs.map((item) => {
          const Icon = NAV_ICONS[item.icon];
          const active = item.id === activeId;
          return (
            <NavLink
              key={item.id}
              item={item}
              active={active}
              onSelect={onSelect}
              className={cn(tabClasses, active && "font-medium text-primary")}
            >
              <Icon className="size-5" aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={moreOpen}
          className={tabClasses}
          onClick={() => setMoreOpen(true)}
        >
          <Menu className="size-5" aria-hidden="true" />
          <span>More</span>
        </button>
      </nav>
      <MoreDrawer
        open={moreOpen}
        onOpenChange={setMoreOpen}
        sections={sections}
        activeId={activeId}
        onSelect={onSelect}
      />
    </>
  );
}

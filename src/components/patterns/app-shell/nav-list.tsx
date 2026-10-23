"use client";

import { NAV_ICONS } from "@/components/patterns/nav-icons";
import type { NavItem, NavSection } from "@/lib/nav/nav";
import { cn } from "@/lib/utils";
import { NavLink } from "./nav-link";

// The grouped menu used by the sidebar and by the phone "More" sheet.
// In a collapsed sidebar the labels stay in the page for screen readers (sr-only) and show as a tooltip.
export function NavList({
  sections,
  activeId,
  onSelect,
  onNavigate,
}: {
  sections: NavSection[];
  activeId: string;
  onSelect?: (item: NavItem) => void;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Main" className="flex flex-col gap-4">
      {sections.map((section, index) => (
        <div key={section.label ?? index} className="flex flex-col gap-0.5">
          {section.label ? (
            <p className="px-2 pb-1 text-xs font-medium text-muted-foreground group-data-[sidebar=collapsed]/sb:hidden max-lg:group-data-[sidebar=auto]/sb:hidden">
              {section.label}
            </p>
          ) : null}
          {section.items.map((item) => {
            const Icon = NAV_ICONS[item.icon];
            const active = item.id === activeId;
            return (
              <div key={item.id} className="group/item relative">
                <NavLink
                  item={item}
                  active={active}
                  onSelect={
                    onSelect
                      ? (selected) => {
                          onSelect(selected);
                          onNavigate?.();
                        }
                      : undefined
                  }
                  onClick={onSelect ? undefined : onNavigate}
                  className={cn(
                    "flex h-8 w-full items-center gap-3 rounded-md px-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground pointer-coarse:h-11 md:pointer-coarse:h-9",
                    active && "bg-accent font-medium text-foreground",
                  )}
                >
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                  <span className="truncate group-data-[sidebar=collapsed]/sb:sr-only max-lg:group-data-[sidebar=auto]/sb:sr-only">
                    {item.label}
                  </span>
                </NavLink>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-full z-50 ml-2 hidden -translate-y-1/2 rounded-md bg-foreground px-2 py-1 text-xs whitespace-nowrap text-background shadow-sm group-data-[sidebar=collapsed]/sb:group-focus-within/item:block group-data-[sidebar=collapsed]/sb:group-hover/item:block max-lg:group-data-[sidebar=auto]/sb:group-focus-within/item:block max-lg:group-data-[sidebar=auto]/sb:group-hover/item:block"
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

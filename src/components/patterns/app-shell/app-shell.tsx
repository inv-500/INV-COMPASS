"use client";

import * as React from "react";
import type { NavItem, NavSection } from "@/lib/nav/nav";
import { BottomNav } from "./bottom-nav";
import { Sidebar } from "./sidebar";
import { TopBar, type Crumb } from "./top-bar";
import { useSidebarMode } from "./use-sidebar-mode";

/** The app shell (design-system.md section 3): sidebar by role, top bar, content, and a bottom bar on phones. */
export function AppShell({
  sections,
  mobileTabs,
  inboxItem,
  activeId,
  onSelect,
  user,
  breadcrumb,
  unreadCount,
  children,
}: {
  /** Already filtered to what this person may use (see filterSections). */
  sections: NavSection[];
  mobileTabs: NavItem[];
  inboxItem: NavItem;
  activeId: string;
  /** Preview only: stay on the page instead of following the link. */
  onSelect?: (item: NavItem) => void;
  user: { name: string; roleLabel: string };
  breadcrumb: Crumb[];
  unreadCount?: number;
  children: React.ReactNode;
}) {
  const { mode, expanded, toggle: toggleSidebar } = useSidebarMode();

  return (
    <div className="flex h-dvh bg-background text-foreground">
      <Sidebar
        sections={sections}
        activeId={activeId}
        onSelect={onSelect}
        mode={mode}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          breadcrumb={breadcrumb}
          user={user}
          inboxItem={inboxItem}
          unreadCount={unreadCount}
          onSelect={onSelect}
          onToggleSidebar={toggleSidebar}
          sidebarExpanded={expanded}
        />
        <main
          id="main"
          tabIndex={-1}
          className="flex-1 overflow-y-auto p-4 pb-24 outline-none md:p-6 md:pb-6"
        >
          {children}
        </main>
      </div>
      <BottomNav
        tabs={mobileTabs}
        sections={sections}
        activeId={activeId}
        onSelect={onSelect}
      />
    </div>
  );
}

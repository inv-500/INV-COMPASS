"use client";

import * as React from "react";
import { AppShell } from "@/components/patterns/app-shell/app-shell";
import { PageHeader } from "@/components/patterns/page-header";
import { EmptyState, NoAccessState } from "@/components/patterns/states";
import { StatTile } from "@/components/patterns/stat-tile";
import { Button } from "@/components/ui/button";
import type { NavItem, NavSection } from "@/lib/nav/nav";

// The real shell with sample content. The screens are not built yet, so choosing a menu item
// stays on this page and shows what that place will be for.
export function ShellPreview({
  roleLabel,
  userName,
  sections,
  mobileTabs,
  inboxItem,
  stats,
}: {
  roleLabel: string;
  userName: string;
  sections: NavSection[];
  mobileTabs: NavItem[];
  inboxItem?: NavItem;
  stats: { label: string; value: string; hint?: string }[];
}) {
  const homeId = sections[0]?.items[0]?.id ?? "";
  const [activeId, setActiveId] = React.useState(homeId);
  // With no permitted menu items at all there is nothing to show; the hooks above still run first.
  if (sections.length === 0) return <NoAccessState className="m-6" />;
  const everything = [
    ...sections.flatMap((s) => s.items),
    ...(inboxItem ? [inboxItem] : []),
    ...mobileTabs,
  ];
  const active =
    everything.find((item) => item.id === activeId) ?? sections[0].items[0];
  const isHome = active.id === homeId;

  return (
    <AppShell
      sections={sections}
      mobileTabs={mobileTabs}
      inboxItem={inboxItem}
      activeId={activeId}
      onSelect={(item) => setActiveId(item.id)}
      user={{ name: userName, roleLabel }}
      unreadCount={3}
      breadcrumb={[
        { label: "Design system", href: "/design" },
        { label: `${roleLabel} preview` },
        { label: active.label },
      ]}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <PageHeader
          title={active.label}
          meta="Preview with invented sample content. Nothing here is real data."
        />
        {isHome ? (
          <>
            <section
              aria-label="Key numbers"
              className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
            >
              {stats.map((stat) => (
                <StatTile key={stat.label} {...stat} />
              ))}
            </section>
            <EmptyState
              title="Nothing needs you right now"
              description="Your tasks, approvals and anything waiting on you will appear here."
            />
          </>
        ) : (
          <EmptyState
            title={`${active.label} is not built yet`}
            description={active.purpose}
            action={
              <Button onClick={() => setActiveId(homeId)}>Back to home</Button>
            }
          />
        )}
      </div>
    </AppShell>
  );
}

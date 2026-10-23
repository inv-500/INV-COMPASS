"use client";

import { ChevronRight, Inbox, PanelLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import type { NavItem } from "@/lib/nav/nav";
import { cn } from "@/lib/utils";
import { NavLink } from "./nav-link";
import { UserMenu } from "./user-menu";

export type Crumb = { label: string; href?: string };

// Top bar (52 px): breadcrumb, then inbox with its unread count, then the account menu.
// The search and command palette trigger (Cmd+K) arrives with the command palette in the next release.
export function TopBar({
  breadcrumb,
  user,
  inboxItem,
  unreadCount = 0,
  onSelect,
  onToggleSidebar,
  sidebarExpanded,
}: {
  breadcrumb: Crumb[];
  user: { name: string; roleLabel: string };
  inboxItem?: NavItem;
  unreadCount?: number;
  onSelect?: (item: NavItem) => void;
  onToggleSidebar: () => void;
  sidebarExpanded: boolean;
}) {
  return (
    <header className="flex h-13 shrink-0 items-center gap-2 border-b bg-background px-3 md:px-4">
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:inline-flex"
        aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
        onClick={onToggleSidebar}
      >
        <PanelLeft className="size-5" aria-hidden="true" />
      </Button>

      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex items-center gap-1 text-sm text-muted-foreground">
          {breadcrumb.map((crumb, index) => {
            const last = index === breadcrumb.length - 1;
            return (
              <li key={crumb.label} className="flex min-w-0 items-center gap-1">
                {index > 0 ? (
                  <ChevronRight
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  />
                ) : null}
                {crumb.href && !last ? (
                  <Link
                    href={crumb.href}
                    className="truncate hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "truncate",
                      last && "font-medium text-foreground",
                    )}
                    aria-current={last ? "page" : undefined}
                  >
                    {crumb.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="ml-auto flex items-center gap-1">
        {inboxItem ? (
          <NavLink
            item={inboxItem}
            active={false}
            onSelect={onSelect}
            aria-label={
              unreadCount > 0 ? `Inbox, ${unreadCount} unread` : "Inbox"
            }
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "relative",
            )}
          >
            <Inbox className="size-5" aria-hidden="true" />
            {unreadCount > 0 ? (
              <span
                aria-hidden="true"
                className="tnum absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground"
              >
                {unreadCount}
              </span>
            ) : null}
          </NavLink>
        ) : null}
        <UserMenu name={user.name} roleLabel={user.roleLabel} />
      </div>
    </header>
  );
}

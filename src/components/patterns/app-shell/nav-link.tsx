"use client";

import Link from "next/link";
import type { NavItem } from "@/lib/nav/nav";

/**
 * A menu link. In the app it is a normal link. On /design the screens are not built yet,
 * so a preview passes onSelect and the link becomes a button that stays on the page.
 */
export function NavLink({
  item,
  active,
  onSelect,
  className,
  children,
  ...props
}: {
  item: NavItem;
  active: boolean;
  onSelect?: (item: NavItem) => void;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<"a">, "href" | "onSelect">) {
  const shared = {
    className,
    "aria-current": active ? ("page" as const) : undefined,
  };
  if (onSelect) {
    // onClick comes last so a click handler passed in props can never replace the selection.
    return (
      <button
        type="button"
        {...shared}
        {...(props as React.ComponentProps<"button">)}
        onClick={() => onSelect(item)}
      >
        {children}
      </button>
    );
  }
  return (
    <Link href={item.href} {...shared} {...props}>
      {children}
    </Link>
  );
}

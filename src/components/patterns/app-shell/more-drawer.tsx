"use client";

import { X } from "lucide-react";
import * as React from "react";
import type { NavItem, NavSection } from "@/lib/nav/nav";
import { NavList } from "./nav-list";

// The full menu on a phone, built on the browser's own <dialog> element: it traps focus, closes on
// Escape, dims the page and makes the page behind it inert, with no library code.
export function MoreDrawer({
  open,
  onOpenChange,
  sections,
  activeId,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sections: NavSection[];
  activeId: string;
  onSelect?: (item: NavItem) => void;
}) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const titleId = React.useId();

  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // A tap on the dimmed area lands on the dialog element itself. Esc and the Close button also work.
  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClick = (event: MouseEvent) => {
      if (event.target === dialog) onOpenChange(false);
    };
    dialog.addEventListener("click", onClick);
    return () => dialog.removeEventListener("click", onClick);
  }, [onOpenChange]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={() => onOpenChange(false)}
      className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-72 max-w-[85vw] flex-col gap-3 border-r bg-card p-4 text-card-foreground shadow-lg backdrop:bg-black/40 open:flex open:animate-in open:slide-in-from-left-4"
    >
      <div className="flex items-center justify-between">
        <h2 id={titleId} className="text-md font-semibold">
          Menu
        </h2>
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => onOpenChange(false)}
          className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent pointer-coarse:size-11"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <NavList
          sections={sections}
          activeId={activeId}
          onSelect={onSelect}
          onNavigate={() => onOpenChange(false)}
        />
      </div>
    </dialog>
  );
}

"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "Match my device", icon: Monitor },
] as const;

// Account menu: who is signed in, and the theme choice. It is a small panel with native radio buttons
// (keyboard and screen reader friendly) rather than a menu library, to keep the shell light.
// Escape or clicking elsewhere closes it, and Escape returns focus to the button.
export function UserMenu({
  name,
  roleLabel,
}: {
  name: string;
  roleLabel: string;
}) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const panelId = React.useId();
  const { theme, setTheme } = useTheme();
  // False on the server and during hydration, so the saved theme never causes a mismatch.
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const current = mounted ? (theme ?? "system") : "system";

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Account menu for ${name}`}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((value) => !value)}
        className="relative inline-flex size-8 items-center justify-center rounded-full after:absolute after:-inset-1.5 after:content-[''] pointer-coarse:size-11 md:pointer-coarse:size-9"
      >
        <span
          aria-hidden="true"
          className="flex size-7 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-foreground"
        >
          {initials(name)}
        </span>
      </button>
      {open ? (
        <div
          id={panelId}
          role="group"
          aria-label="Account"
          className="absolute top-full right-0 z-50 mt-1.5 flex w-56 flex-col gap-3 rounded-lg border bg-popover p-3 text-popover-foreground shadow-sm"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium">{name}</span>
            <span className="text-xs text-muted-foreground">{roleLabel}</span>
          </div>
          <fieldset className="flex flex-col gap-0.5">
            <legend className="pb-1 text-xs font-medium text-muted-foreground">
              Theme
            </legend>
            {THEMES.map(({ value, label, icon: Icon }) => (
              <label
                key={value}
                className="flex min-h-8 cursor-pointer items-center gap-2 rounded-md px-2 text-sm hover:bg-accent has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring pointer-coarse:min-h-11"
              >
                <input
                  type="radio"
                  name={`${panelId}-theme`}
                  value={value}
                  checked={current === value}
                  onChange={() => setTheme(value)}
                  className="size-4 accent-primary"
                />
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </label>
            ))}
          </fieldset>
        </div>
      ) : null}
    </div>
  );
}

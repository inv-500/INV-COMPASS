"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { Button } from "@/components/ui/button";

// Switches the whole page between light, dark and the device setting. Needed to try the overlay demos in both themes.
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // False while rendering on the server and during hydration, true afterwards, so the saved theme
  // never causes a mismatch.
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const current = mounted ? (theme ?? "system") : "system";

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "Match my device", icon: Monitor },
  ] as const;

  return (
    <div role="group" aria-label="Page theme" className="flex gap-1">
      {options.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant={current === value ? "secondary" : "ghost"}
          size="default"
          aria-pressed={current === value}
          onClick={() => setTheme(value)}
        >
          <Icon className="size-4" aria-hidden="true" />
          {label}
        </Button>
      ))}
    </div>
  );
}

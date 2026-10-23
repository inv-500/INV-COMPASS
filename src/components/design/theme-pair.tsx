import { cn } from "@/lib/utils";

// Shows the same content twice, once in each theme, so the founder can judge both at a glance.
// The .light and .dark wrappers re-apply that theme's tokens (see globals.css).
// Overlays such as dialogs and menus open outside these frames and use the page theme; they are in "Interactive".
export function ThemePair({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {(["light", "dark"] as const).map((theme) => (
        <div
          key={theme}
          className={cn(theme, "flex flex-col gap-4 rounded-lg border p-4")}
        >
          <p className="text-xs font-medium text-muted-foreground uppercase">
            {theme === "light" ? "Light theme" : "Dark theme"}
          </p>
          {children}
        </div>
      ))}
    </div>
  );
}

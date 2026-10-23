"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// Light and dark mode follow the person's system setting unless they choose.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

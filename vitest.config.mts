import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      // "server-only" throws outside the Next.js server build; tests use an empty stub.
      "server-only": path.resolve(
        import.meta.dirname,
        "tests/unit/stubs/server-only.ts",
      ),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["tests/unit/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}"],
  },
});

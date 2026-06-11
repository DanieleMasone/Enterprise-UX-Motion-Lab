import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "/enterprise-ux-motion-lab/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/test/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage",
      exclude: [
        "coverage/**",
        "dist/**",
        "docs/**",
        "src/main.tsx",
        "src/test/**",
        "vite.config.ts"
      ]
    }
  }
});

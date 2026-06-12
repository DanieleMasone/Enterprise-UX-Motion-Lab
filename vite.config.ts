import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  base: "/enterprise-ux-motion-lab/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "e2e/**"
    ],
    fileParallelism: false,
    globals: true,
    maxWorkers: 1,
    pool: "vmThreads",
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
        "e2e/**",
        "playwright.config.ts",
        "src/main.tsx",
        "src/test/**",
        "vite.config.ts"
      ]
    }
  }
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    css: true,
    setupFiles: "./tests/setup.ts",
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html"],
      include: ["src/components/**/*"],
      exclude: [
        "src/components/**/*.stories.{js,jsx,ts,tsx}",
        "src/components/**/*.test.{js,jsx,ts,tsx}",
        "src/components/**/*.spec.{js,jsx,ts,tsx}",
      ],
      reportsDirectory: "./src/coverage",
      reportOnFailure: true,
      html: {
        outputDirectory: "./src/coverage/html",
      },
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: "build",
  },
});

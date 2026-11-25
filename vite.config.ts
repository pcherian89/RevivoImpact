import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile } from "vite-plugin-singlefile";

// One self-contained HTML file (scripts, styles and fonts inlined), like Revivo Pathway's prototype (docs/06 §1).
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  base: "./",
  build: { assetsInlineLimit: 100_000_000, cssCodeSplit: false, outDir: "dist" },
});

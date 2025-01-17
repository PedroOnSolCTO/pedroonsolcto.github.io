import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "rebrand.html",
      output: {
        entryFileNames: "assets/rebrand.[hash].js",
        assetFileNames: "assets/rebrand.[hash].[ext]",
        chunkFileNames: "assets/rebrand.[hash].js",
      },
    },
  },
  base: "./",
});

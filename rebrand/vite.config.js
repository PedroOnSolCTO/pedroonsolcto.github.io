import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../docs",
    emptyOutDir: false,
    rollupOptions: {
      input: "rebrand.html",
      output: {
        dir: "../docs",
        entryFileNames: "assets/rebrand.[hash].js",
        assetFileNames: "assets/rebrand.[hash].[ext]",
        chunkFileNames: "assets/rebrand.[hash].js",
      },
    },
  },
  base: "./",
});

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../docs",
    emptyOutDir: false,
    rollupOptions: {
      output: {
        dir: "../docs",
        entryFileNames: "assets/rebrand.[hash].js",
        assetFileNames: "assets/rebrand.[hash].[ext]",
      },
    },
  },
  base: "./",
});

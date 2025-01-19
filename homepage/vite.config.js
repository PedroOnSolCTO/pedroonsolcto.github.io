import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
  server: {
    open: '/index.html',
  },
});

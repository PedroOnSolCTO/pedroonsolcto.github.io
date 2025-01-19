import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../docs',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        dir: '../docs',
        entryFileNames: 'assets/memes.[hash].js',
        assetFileNames: 'assets/memes.[hash].[ext]',
      },
    },
  },
  base: './',
});

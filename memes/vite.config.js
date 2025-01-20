import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: 'memes.html',
      output: {
        entryFileNames: 'assets/memes.[hash].js',
        assetFileNames: 'assets/memes.[hash].[ext]',
        chunkFileNames: 'assets/memes.[hash].js',
      },
    },
  },
  base: './',
});

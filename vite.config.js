import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/plantcacher/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        details: resolve(__dirname, 'plantdetails.html'),
        plantlist: resolve(__dirname, 'plantlist.html'),
        plantlog: resolve(__dirname, 'plantlog.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  }
});
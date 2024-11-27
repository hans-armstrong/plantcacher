import { defineConfig } from 'vite'
import path from 'path';

export default defineConfig({
  base: '/plantcacher/', 
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html'
    }
  }
  // ,
  // vite config thanks to chatgpt
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, './src'),
  //   },
  // },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://127.0.0.1:3000', // Your Express server
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
})
import { defineConfig } from 'vite'
import path from 'path';
import { plantList } from './src/state.mjs';

//single page config

// export default defineConfig({
//   base: '/plantcacher/', 
//   build: {
//     outDir: 'dist',
//     rollupOptions: {
//         input: {
//             // main: './src/main.js', // Adjust the path to your main.js file
//             index: './index.html',  // Ensure index.html is included

//           },
//     }
//   }
//   // ,
//   // vite config thanks to chatgpt
//   // resolve: {
//   //   alias: {
//   //     '@': path.resolve(__dirname, './src'),
//   //   },
//   // },
//   // server: {
//   //   proxy: {
//   //     '/api': {
//   //       target: 'http://127.0.0.1:3000', // Your Express server
//   //       changeOrigin: true,
//   //       rewrite: (path) => path.replace(/^\/api/, ''),
//   //     },
//   //   },
//   // },
// })

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
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
const timestamp = new Date().getTime();
// https://vitejs.dev/config/
export default defineConfig({
  base: '/demo/',
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "${path.resolve(
          __dirname,
          'src/assets/styles/variables.less'
        )}";`,
      },
    },
  },

  build: {
    rollupOptions: {
      output: {
        // 入口文件名
        entryFileNames: `assets/[name].${timestamp}.js`,
        // 块文件名
        chunkFileNames: `assets/[name]-[hash].${timestamp}.js`,
        // 资源文件名 css 图片等等
        assetFileNames: `assets/[name]-[hash].${timestamp}.[ext]`,
      },
    },
  },
});

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {//前端请求的路径
        target: 'http://localhost:8080',//后台服务器地址
        changeOrigin: true,//允许跨域
        rewrite: (path) => path.replace(/^\/api/, '')//重写路径
      }
    }
  }
})

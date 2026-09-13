import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1:8001',
    //     changeOrigin: false,
    //   },
    //   '/sanctum': {
    //     target: 'http://127.0.0.1:8001',
    //     changeOrigin: false,
    //   },
    //   '/storage': {
    //     target: 'http://127.0.0.1:8001',
    //     changeOrigin: false,
    //   },
    // },
  },
})

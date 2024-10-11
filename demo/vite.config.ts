import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import VueRouter from 'unplugin-vue-router/vite'
import Vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    VueRouter({
      experimental: {
        autoExportsDataLoaders: ['src/loaders/**/*.ts'],
      }
    }),
    Vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

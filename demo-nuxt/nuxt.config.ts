import VueRouter from 'unplugin-vue-router/vite'

export default defineNuxtConfig({
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  vite: {
    plugins: [VueRouter({})],
  },

  modules: ['@pinia/nuxt'],
})

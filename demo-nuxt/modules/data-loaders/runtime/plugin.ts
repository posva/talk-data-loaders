import { DataLoaderPlugin } from 'unplugin-vue-router/runtime'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(DataLoaderPlugin, {
    router: nuxtApp.vueApp.config.globalProperties.$router,
    isSSR: import.meta.env.SSR,
  })
})

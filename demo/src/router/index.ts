import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { routes } from 'vue-router/auto-routes'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

if (typeof document !== 'undefined') {
  NProgress.configure({
    showSpinner: false,
  })
  let timeout: ReturnType<typeof setTimeout> | undefined
  router.beforeEach((to) => {
    // delay only with loaders
    const delay = to.meta.loaders?.length ? 200 : 0
    // display the loader bar only after 200ms
    timeout = setTimeout(() => {
      if (router.currentRoute.value !== to) {
        NProgress.start()
      }
    }, delay)
  })

  router.afterEach(() => {
    clearTimeout(timeout)
    NProgress.done(false)
  })

  router.onError(() => {
    clearTimeout(timeout)
    NProgress.done(false)
  })
}

import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
})

if (typeof document !== 'undefined') {
  NProgress.configure({
    showSpinner: false,
  })
  router.beforeEach((to) => {
    setTimeout(() => {
      if (router.currentRoute.value !== to) {
        NProgress.start()
      }
    }, 200)
  })

  router.afterEach((_fail, to) => {
    NProgress.done(false)
  })

  router.onError((_err, to) => {
    NProgress.done(false)
  })
}

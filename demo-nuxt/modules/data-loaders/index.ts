import {
  defineNuxtModule,
  createResolver,
  addVitePlugin,
  addPlugin,
} from 'nuxt/kit'
import { join } from 'node:path'
import VueRouter from 'unplugin-vue-router/vite'

export default defineNuxtModule({
  meta: {
    name: 'Data Loaders',
  },

  setup(_, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    addVitePlugin(
      VueRouter({
        routesFolder: [
          {
            src: join(nuxt.options.srcDir, 'pages'),
          },
        ],
        dts: join(nuxt.options.buildDir, 'types/uvr-routes.d.ts'),
      }),
      {
        prepend: true,
      },
    )

    addPlugin(resolve('./runtime/plugin'))
  },
})

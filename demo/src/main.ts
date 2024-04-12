import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './router'
import { DataLoaderPlugin } from 'vue-router/auto'
import { QueryPlugin } from '@pinia/colada'

const app = createApp(App)

app.use(createPinia())
app.use(QueryPlugin, {
  // ...
})
app.use(DataLoaderPlugin, { router })
app.use(router)

app.mount('#app')

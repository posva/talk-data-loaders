import { defineBasicLoader } from 'unplugin-vue-router/data-loaders/basic'

export const useFakeDate = defineBasicLoader(async (to) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    data: 'Hello',
    url: to.fullPath,
    time: new Date().toLocaleTimeString(),
  }
})

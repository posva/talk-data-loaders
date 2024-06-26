<script lang="ts">
import { defineBasicLoader } from 'unplugin-vue-router/data-loaders/basic'

export const useFakeDate = defineBasicLoader(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {
    data: 'Hello',
    time: new Date().toLocaleTimeString(),
  }
})
</script>

<script lang="ts" setup>
const { data, reload, isLoading, error } = useFakeDate()
</script>

<template>
  <div>
    <h1>Hello</h1>

    <button @click="reload">Reload</button>
    <p v-if="isLoading">Loading...</p>
    <pre v-if="error">{{ error }}</pre>
    <pre>{{ data }}</pre>
  </div>
</template>

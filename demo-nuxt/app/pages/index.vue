<script lang="ts" setup>
import { useFakeDate } from '@/loaders/fake'
const { data, reload, isLoading, error } = useFakeDate()
definePageMeta({
  loaders: [useFakeDate],
})
</script>

<template>
  <div>
    <h1>Hello</h1>

    <button @click="reload()">Reload</button>
    <p v-if="isLoading">Loading...</p>
    <pre v-if="error">{{ error }}</pre>
    <pre>{{ data }}</pre>
  </div>
</template>

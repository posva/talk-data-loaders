<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  url: string
}>()

const url = computed(
  () =>
    (process.env.NODE_ENV === 'development'
      ? 'http://localhost:5173'
      : 'https://data-loaders-demo.netlify.app') + props.url,
)
</script>

<template>
  <iframe id="frame" class="w-full h-full" :src="url"> </iframe>
</template>

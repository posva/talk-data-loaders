<script lang="ts" setup>
import { computed, defineComponent } from 'vue'

const currentPage = defineModel('currentPage', {
  type: Number,
  required: true,
})

const props = withDefaults(
  defineProps<{
    perPage?: number
    total: number
  }>(),
  {
    perPage: 25,
  },
)

const totalPages = computed(() => {
  return Math.ceil(props.total / props.perPage) || 1
})

function previousPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
</script>

<template>
  <div class="flex items-center justify-center">
    <button :disabled="currentPage < 2" @click="previousPage">Previous</button>
    <span class="mx-3">{{ currentPage }} / {{ totalPages }}</span>
    <button :disabled="currentPage >= totalPages" @click="nextPage">
      Next
    </button>
  </div>
</template>

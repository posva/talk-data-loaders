<script lang="ts" setup>
import { getFollowerCount } from '@/api/fake-profile'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute('/inconsistent-state/profile.[id].client-side')

const followerCount = ref<string>()
watch(
  () => route.params.id,
  async (id) => {
    followerCount.value = await getFollowerCount(id)
  },
  { immediate: true },
)
</script>

<template>
  <p v-if="followerCount != null">{{ followerCount }} followers</p>
  <p v-else>Loading...</p>
</template>

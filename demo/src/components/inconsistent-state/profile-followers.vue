<script lang="ts" setup>
import { getFollowerCount, getProfileInfo } from '@/api/fake-profile'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute('/inconsistent-state/profile.[id].client-side')

const followerCount = ref<number>()
watch(
  () => route.params.id,
  async (id) => {
    followerCount.value = await getFollowerCount(id)
  },
  { immediate: true },
)
</script>

<template>
  <p v-if="followerCount != null">Followers: {{ followerCount }}</p>
  <p v-else>Loading...</p>
</template>

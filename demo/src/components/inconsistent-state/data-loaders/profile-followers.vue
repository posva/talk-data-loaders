<script lang="ts" setup>
import { useFollowerCount } from '@/pages/inconsistent-state/profile.[id].data-loader.vue'

const { data: followerCount } = useFollowerCount()
</script>

<template>
  <p v-if="followerCount != null">{{ followerCount }} followers</p>
  <p v-else>Loading...</p>
</template>

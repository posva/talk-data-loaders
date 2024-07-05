<script lang="ts" setup>
import { getProfileInfo } from '@/api/fake-profile'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProfileFollowers from '@/components/inconsistent-state/profile-followers.vue';

const route = useRoute('/inconsistent-state/profile.[id].client-side')

const profileInfo = ref<{ name: string; imageURL: string }>()
const isLoading = ref(false)
watch(
  () => route.params.id,
  async (id) => {
    isLoading.value = true
    profileInfo.value = await getProfileInfo(id)
    isLoading.value = false
  },
  { immediate: true },
)
</script>

<template>
  <main>
    <RouterLink v-if="route.params.id !== 'posva'" :to="{ params: {id: 'posva' } }">My profile</RouterLink>
    <br>

    <template v-if="isLoading">
      <p>Loading profile...</p>
    </template>
    <template v-if="profileInfo">
      <img :src="profileInfo.imageURL">
      <p>Name: {{ profileInfo.name }}</p>

      <ProfileFollowers />
    </template>
  </main>
</template>

<script lang="ts" setup>
import { getProfileInfo } from '@/api/fake-profile'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProfileFollowers from '@/components/inconsistent-state/client-side/profile-followers.vue'

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
    <RouterLink
      :to="{
        params: { id: route.params.id === 'posva' ? 'yyx990803' : 'posva' },
      }"
      >My profile</RouterLink
    >
    <br />

    <template v-if="isLoading">
      <p>Loading profile...</p>
    </template>
    <template v-if="profileInfo">
      <img :src="profileInfo.imageURL" class="w-48 rounded-full" />
      <p class="text-lg font-bold">{{ profileInfo.name }}</p>
      <p class="text-sm font-thin">
        <img
          src="/github.svg"
          class="h-[1.5em] inline-block mr-2 translate-y-1"
        />{{ route.params.id }}
      </p>

      <ProfileFollowers />
    </template>
  </main>
</template>

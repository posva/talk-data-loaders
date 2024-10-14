<script lang="ts">
import { defineBasicLoader } from 'unplugin-vue-router/data-loaders/basic'
import { getFollowerCount, getProfileInfo } from '@/api/fake-profile'
import { ref } from 'vue'

const isLazyProfileInfo = ref(false)
const isLazyFollowerCount = ref(false)

export const useProfileInfo = defineBasicLoader(
  '/inconsistent-state/profile.[id].data-loader',
  (to) => getProfileInfo(to.params.id),
  { lazy: () => isLazyProfileInfo.value }
)

export const useFollowerCount = defineBasicLoader(
  '/inconsistent-state/profile.[id].data-loader',
  (to) => getFollowerCount(to.params.id),
  { lazy: () => isLazyFollowerCount.value }
)
</script>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import ProfileFollowers from '@/components/inconsistent-state/data-loaders/profile-followers.vue'

const route = useRoute('/inconsistent-state/profile.[id].client-side')

const { data: profileInfo, isLoading } = useProfileInfo()
</script>

<template>
  <p>
    <label>
      <input type="checkbox" v-model="isLazyProfileInfo"> lazy load profile info
    </label>
    <br>
    <label>
      <input type="checkbox" v-model="isLazyFollowerCount"> lazy load follower count
    </label>
  </p>

  <main>
    <RouterLink
      :to="{
        params: { id: route.params.id === 'posva' ? 'yyx990803' : 'posva' },
      }"
    >
      → Go to {{ route.params.id === 'posva' ? 'yyx990803' : 'posva' }}'s profile
    </RouterLink>

    <br />
    <br />

    <template v-if="isLoading && !profileInfo">
      <p>Loading profile...</p>
    </template>
    <template v-else-if="profileInfo">
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

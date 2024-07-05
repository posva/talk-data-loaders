<script lang="ts" setup></script>

<template>
  <nav>
    <RouterLink
      :to="{
        name: '/inconsistent-state/profile.[id].client-side',
        params: { id: 'yyx' },
      }"
      >Client Side</RouterLink
    >
  </nav>
</template>

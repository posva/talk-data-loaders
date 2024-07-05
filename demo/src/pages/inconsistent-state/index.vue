<script lang="ts" setup></script>

<template>
  <nav>
    <RouterLink
      :to="{
        name: '/inconsistent-state/profile.[id].client-side',
        params: { id: 'yyx990803' },
      }"
      >Client Side</RouterLink
    >
    |
    <RouterLink
      :to="{
        name: '/inconsistent-state/profile.[id].data-loader',
        params: { id: 'yyx990803' },
      }"
      >Data Loaders</RouterLink
    >
  </nav>
</template>

<script lang="ts" setup>

</script>

<template>

  <ul class="list-disc">
    <li>
      <RouterLink
        :to="{
          name: '/inconsistent-state/profile.[id].client-side',
          params: { id: 'yyx990803' },
        }"
        >Client Side fetching</RouterLink
      >
    </li>
    <li>
      <RouterLink
        :to="{
          name: '/inconsistent-state/profile.[id].data-loader',
          params: { id: 'yyx990803' },
        }"
        >Data Loaders</RouterLink
      >
    </li>
  </ul>

  <hr>

  <RouterView />
</template>

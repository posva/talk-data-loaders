<script lang="ts" setup>
import { successRate } from '../api/aic'
</script>

<template>
  <h1>Art Gallery</h1>

  <nav>
    <RouterLink to="/art-gallery/">Home</RouterLink>
    |
    <RouterLink to="/art-gallery/search">Search</RouterLink>
  </nav>

  <p>
    Artwork API by
    <a href="https://api.artic.edu/docs/#quick-start"
      >Art Institute of Chicago</a
    >.
  </p>

  <div>
    <label class="flex space-x-2">
      <span>Success Rate</span>
      <input
        v-model.number="successRate"
        type="range"
        min="0"
        max="1"
        step="0.05"
      />
      <span>{{ (successRate * 100).toFixed(0) }}%</span>
    </label>
    <p class="text-xs">Lower this to make requests fail.</p>
  </div>

  <hr />

  <RouterView />
</template>

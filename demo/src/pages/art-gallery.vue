<script lang="ts" setup>
import { useNow, useTimeAgo } from '@vueuse/core'
import { successRate, delay, existingDelays } from '../api/aic'

const now = useNow({ interval: 50 })
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

  <details open>
    <summary>Connection settings</summary>

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

      <label class="flex space-x-2">
        <span>Response delay</span>
        <input
          v-model.number="delay"
          type="range"
          min="0"
          max="5000"
          step="250"
        />
        <span>{{ delay }}ms</span>
      </label>

      <p>Pending delays: {{ existingDelays.size }}</p>
      <progress
        v-for="when of existingDelays.values()"
        :max="delay"
        :value="now.getTime() - when.getTime()"
      ></progress>
    </div>
  </details>

  <hr />

  <RouterView />
</template>

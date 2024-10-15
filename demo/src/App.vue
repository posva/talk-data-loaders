<script lang="ts" setup>
import { useLocalStorage, useNow } from '@vueuse/core'
import { successRate, delay, existingDelays } from './api/aic'
import NavBar from '@/NavBar.vue'

const now = useNow({ interval: 50 })
const areSettingsOpen = useLocalStorage('settings-open', true)
</script>

<template>
  <header>
    <h1>Data Loaders demos</h1>
    <NavBar />
  </header>

  <details
    :open="areSettingsOpen"
    @toggle="areSettingsOpen = ($event.target as HTMLDetailsElement).open"
  >
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

  <RouterView />
</template>

<style>
:root {
  --npbar-color: var(--nc-lk-1);
}

#nprogress .bar {
  background: var(--npbar-color);
}
#nprogress .peg {
  box-shadow:
    0 0 10px var(--npbar-color),
    0 0 5px var(--npbar-color);
}
</style>

---
theme: '@posva/slidev-theme'
title: Data Loaders | Elevating Data Fetching in Vue
info: |
  ## Data Loaders
  Elevating Data Fetching in Vue

  Copyright 2024-present Eduardo San Martin Morote
class: text-center
---

<div class="flex flex-col items-start h-full pt-16" >

<img class="w-32 h-32 mb-4 rounded-full" src="https://avatars.githubusercontent.com/u/664177?v=4" alt="eduardo avatar">

<p class="text-left">

<span class="font-bold font-serif my-0 text-4xl">Eduardo San Martin Morote</span>
<br>
<span class="font-light font-serif my-0 text-xl">Frontend Nerd</span>
<br>
<span>🍍 Pinia & <logos-vue /> Router Author</span>
</p>

<span><carbon-logo-github /> <carbon-logo-x /> as `@posva`</span>

</div>

<!--
freelance, vuejs core team and the author of pinia and vue router. online as posva. I've also developed other libraries and I spend a lot of time thinking about apis
-->

---
layout: cover
class: text-center
---

# Data Loaders

###### Elevating Data Fetching in Vue

<!--
-->

---
layout: iframe
url: https://uvr.esm.is/rfcs/data-loaders/
---

---
layout: cover
class: text-center
---

# Data Fetching is **Hard**

---

# Client-only Data Fetching

````md magic-move
```vue{*|4}
<script setup lang="ts">
import { ref } from 'vue'

const data = ref()
</script>

<template>
  <div v-if="data">
    <h1>{{ data.title }}</h1>
    <p>{{ data.body }}</p>
  </div>
</template>
```
```vue{*|2,6}
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const data = ref()
onMounted(async () => {
  data.value = await fetchSomeData()
})
</script>

<template>
  <div v-if="data">
    <h1>{{ data.title }}</h1>
    <p>{{ data.body }}</p>
  </div>
</template>
```
````


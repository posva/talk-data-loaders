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

```vue{2,6}
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

```vue{6-9}
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const data = ref()
const route = useRoute()
watch(() => route.params.id, async (id) => {
  data.value = await fetchSomeData(id)
}, { immediate: true })
</script>

<template>
  <div v-if="data">
    <h1>{{ data.title }}</h1>
    <p>{{ data.body }}</p>
  </div>
</template>
```

```vue{6,9,11}
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const data = ref()
const isLoading = ref(false)
const route = useRoute()
watch(() => route.params.id, async (id) => {
  isLoading.value = true
  data.value = await fetchSomeData(id)
  isLoading.value = false
}, { immediate: true })
</script>

<template>
  <div v-if="data">
    <h1>{{ data.title }}</h1>
    <p>{{ data.body }}</p>
  </div>
</template>
```

```vue{7,11-18}
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const data = ref()
const isLoading = ref(false)
const error = ref()
const route = useRoute()
watch(() => route.params.id, async (id) => {
  isLoading.value = true
  try {
    data.value = await fetchSomeData(id)
    error.value = null
  } catch (e) {
    error.value = e
  } finally {
    isLoading.value = false
  }
}, { immediate: true })
</script>

<template>
  <div v-if="data">
    <h1>{{ data.title }}</h1>
    <p>{{ data.body }}</p>
  </div>
</template>
```
````

---

# Using a composable

```vue{*|4-7}
<script setup>
import { useQuery } from '@tanstack/vue-query'

const { status, data, error } = useQuery({
  queryKey: ['some-key'],
  queryFn: fetchSomeData,
})
</script>

<template>
  <div v-if="status === 'loading'">Loading...</div>
  <div v-if="data">
    <h1>{{ data.title }}</h1>
    <p>{{ data.body }}</p>
  </div>
</template>
```
<!-- 
But not related to navigation. We have to handle the loading state, error, etc
 -->

---

# Data Loaders

Goals:

- Integrated with the navigation cycle
  - Blocks (or not) navigation until data is ready
  - Can change or abort the navigation
- Deduplicate requests and data access
  - Parallel requests
  - Semantic sequential fetching on need
- Delay data updates until **all data loaders resolve**
  - Rollback if any fails
  - Avoid displaying an old page with new data

---
layout: cover
---

# Demo Time

<v-clicks>

- [<logos-vue /> unplugin-vue-router](https://github.com/posva/unplugin-vue-router)
- [🍹 Pinia Colada](https://github.com/posva/pinia-colada)
- [👨‍💻 Let's work together](https://cal.com/posva)

</v-clicks>


<style>
  ul {
    list-style-type: none;
    padding: 0;
  }
</style>


---
layout: cover
---

# Thanks!

---
theme: '@posva/slidev-theme'
title: Data Loaders | Elevating Data Fetching in Vue
info: |
  ## Data Loaders
  Elevating Data Fetching in Vue

  Copyright 2024-present Eduardo San Martin Morote
class: text-center
transition: view-transition
transition-duration: 1000ms
mdc: true
---

<div class="flex flex-col items-start h-full pt-16" >

<img class="w-32 h-32 mb-4 rounded-full" src="https://avatars.githubusercontent.com/u/664177?v=4" alt="eduardo avatar">

<p class="text-left">

<span class="my-0 font-serif text-4xl font-bold">Eduardo San Martin Morote</span>
<br>
<span class="my-0 font-serif text-xl font-light">Frontend Nerd</span>
<br>
<span><logos-pinia />, <logos-vue /> Router, <img class="inline-block -translate-y-[5px]" style="height: 1.5em;" src="/vuefire.svg"> Author</span>

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

<div class="font-serif text-3xl text-center">

#### Client-only Data Fetching {.inline-block.view-transition-title}
#### Using a composable
#### Suspense
#### etc

</div>

---

# Client-only Data Fetching {.inline-block.view-transition-title}

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

```vue{2,5-7}
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
 
<!-- 
Show how to support how it works with SSR
-->

---
layout: two-cols
---

# Using Suspense

```vue
<script setup>
const route = useRoute()
const data = await fetchSomeData(route.params.id)
</script>

<template>
  <div>
    <h1>{{ data.title }}</h1>
    <p>{{ data.body }}</p>

    <NestedComponentThatAlsoFetches />
  </div>
</template>
```

::right::

<v-clicks>

- No local loading state
- No local error handling
- Cascading loading states
- Everything depends on _rendering_ the component
  - No preloading
  - No update if params change

</v-clicks>


---

# Data Loaders

Goals:

- Local
  - Write it next to you
- Integrated within the navigation cycle
  - Blocks (or not) navigation until data is ready
  - Can change or abort the navigation
- Deduplicate requests and data access
  - Parallel requests
  - Semantic sequential fetching on need
- Delay data updates until **all data loaders resolve**
  - Rollback if any fails
  - Avoid displaying an old page with new data

---

# Data Loaders

```vue{*|1,12|4-9|13}
<script lang="ts">
import { getUserById } from '../api'

export const useUserData = defineLoader(async (route) => {
  const user = await getUserById(route.params.id)
  // ...
  // return anything you want to expose
  return user
})
</script>

<script lang="ts" setup>
const { data: user, isLoading, error, reload } = useUserData()
</script>
```

---
layout: cover
---

# Demo Time

<v-clicks>

- [<logos-vue /> unplugin-vue-router](https://github.com/posva/unplugin-vue-router)
- [🍹 Pinia Colada](https://github.com/posva/pinia-colada)
- [🌁 Slides <span class="font-mono">https://data-loaders-frontend-nation.netlify.app</span>](https://data-loaders-frontend-nation.netlify.app)
- [<carbon-logo-github /> <span class="font-mono">posva/data-loaders-frontend-nation</span>](https://github.com/posva/data-loaders-frontend-nation)
- [❤️ Sponsor me](https://esm.dev/open-source)

</v-clicks>

<!--
- Show project index, it shows artwork
- Install uvr
- add to vite config (for pages and types but not needed for data loading itself)
- add plugins to main.ts
- index.vue
  - migrate to defineBasicLoader
  - add script
  - set the page to 1
  - export and explain what it does
  - refactor setup to use it
  - pass the page from params
- search.vue
  - not fully working
  - add basic loader that search artworks
  - parse query page and text
  - explain that if invalid we can throw a navigation result or return to control the navigation
  - show redirect to page 1
  - Add full res images
    - extra fetch that depends on the first one
    - add new loader
    - await the first loader
    - explain this is different from below
    - data is consistent
    - await getArtworkImagesURLs (needs to map the data to their ids)
    - use a map to host the artworks based on their id
    - return it
  - How not to wait for the full res images
    - set the loader to lazy
    - show the network panel
    - this is sequential loading
    - show server: false
  - Alright but pretty slow when coming back to a visited page. cache data?
  - pinia colada: fetching layer
  - integrate well with data loaders
  - migrate index loader to pinia colada
  - show how good it is
  - explain staleTime and show
  - do the same for search
  - explain the data loader is implemented by using pinia colada, outside of pinia colada
    - this is the big advantage of loaders, they are mainly a spec to be followed
    - any library could implement their own loader
    - the colada loader has much more like only triggering if used params and query change
 -->


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
